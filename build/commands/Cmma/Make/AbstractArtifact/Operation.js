"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseCmmaAbstractArtifactCommand_1 = require("../../../../cmma/BaseCommands/BaseCmmaAbstractArtifactCommand");
const standalone_1 = require("@adonisjs/core/build/standalone");
const CmmaProjectMapActions_1 = __importDefault(require("../../../../cmma/Actions/CmmaProjectMapActions"));
const CmmaContextActions_1 = __importDefault(require("../../../../cmma/Actions/CmmaContextActions"));
const CmmaSystemActions_1 = __importDefault(require("../../../../cmma/Actions/CmmaSystemActions"));
const CmmaNodePath_1 = __importDefault(require("../../../../cmma/Models/CmmaNodePath"));
const CmmaConfigurationActions_1 = __importDefault(require("../../../../cmma/Actions/CmmaConfigurationActions"));
const SystemMessages_1 = require("../../../../cmma/Helpers/SystemMessages/SystemMessages");
const CmmaModuleActions_1 = __importDefault(require("../../../../cmma/Actions/CmmaModuleActions"));
class Operation extends BaseCmmaAbstractArtifactCommand_1.BaseCmmaAbstractArtifactCommand {
    constructor() {
        super(...arguments);
        this.PROJECT_CONFIG = this.projectConfigurationFromFile;
        this.commandShortCode = 'mk|op';
        this.abstractArtifactType = 'operation';
        this.targetEntity = 'Operation';
        this.abstractArtifactConstituents = ['controller', 'validator'];
    }
    setArtifactDestinationPathCommandStep() {
        for (let artifactType of this.abstractArtifactConstituents) {
            const artifactDestinationDir = new CmmaNodePath_1.default(this.PROJECT_CONFIG)
                .buildPath()
                .toContext(this.contextLabel)
                .toSystem(this.systemLabel)
                .toArtifactsDir(CmmaConfigurationActions_1.default.getDefaultArtifactTypeDir(artifactType))
                .toModule(this.moduleLabel)
                .getAbsoluteOsPath(this.application.appRoot);
            this.setArtifactDestinationDir({
                artifactType,
                artifactDestinationDir: artifactDestinationDir,
            });
        }
    }
    async addArtifactsToProjectMapCommandStep() {
        for (let artifact of this.abstractArtifactConstituents) {
            const artifactTransformationsWithoutExtension = CmmaConfigurationActions_1.default.getArtifactTypeTransformationWithoutExtension({
                artifactType: artifact,
                configObject: this.PROJECT_CONFIG,
            });
            const artifactLabel = CmmaConfigurationActions_1.default.transformLabel({
                label: this.artifactLabel,
                transformations: artifactTransformationsWithoutExtension,
            });
            const artifactsDir = CmmaConfigurationActions_1.default.getDefaultArtifactTypeDir(artifact);
            if (CmmaModuleActions_1.default.isModuleArtifactInArtifactDir({
                artifactLabel: artifactLabel,
                artifactsDir,
                moduleMap: this.moduleMap,
            })) {
                this.logger.error(`${artifactLabel} already exists in ${this.moduleLabel}. ${SystemMessages_1.EXITING}`);
                await this.exit();
            }
            CmmaModuleActions_1.default.addArtifactToModule({
                artifact: artifactLabel,
                artifactsDir,
                moduleMap: this.moduleMap,
            });
        }
    }
    async run() {
        await this.ensureConfigFileExistsCommandStep();
        this.artifactLabel = this.name;
        if (this.module) {
            this.module = CmmaConfigurationActions_1.default.normalizeProjectIdentifier({
                identifier: this.module,
                configObject: this.PROJECT_CONFIG,
            });
            const moduleNodePath = new CmmaNodePath_1.default(this.PROJECT_CONFIG).findModuleInProject(this.module);
            if (!moduleNodePath.length) {
                this.logger.error(`${this.module} ${SystemMessages_1.MODULE_NOT_FOUND_IN_PROJECT} ${SystemMessages_1.EXITING}`);
                await this.exit();
            }
            const confirmation = await this.prompt.confirm(`${this.colors.underline(this.module)} Module found in ${this.colors.underline(moduleNodePath.systemLabel)} System in ${this.colors.underline(moduleNodePath.contextLabel)} Context. Create ${this.name} Operation in Module?`);
            if (!confirmation) {
                this.logger.info(SystemMessages_1.EXITING);
                await this.exit();
            }
            this.contextLabel = moduleNodePath.contextLabel;
            this.systemLabel = moduleNodePath.systemLabel;
            this.moduleLabel = moduleNodePath.moduleLabel;
            this.contextMap = CmmaProjectMapActions_1.default.getContextMapByLabel({
                contextLabel: this.contextLabel,
                projectMap: this.projectMap,
            });
            this.systemMap = CmmaContextActions_1.default.getContextSystemMapByLabel({
                systemLabel: this.systemLabel,
                contextMap: this.contextMap,
            });
            this.moduleMap = CmmaSystemActions_1.default.getModuleMapByLabel({
                moduleLabel: this.moduleLabel,
                systemMap: this.systemMap,
            });
        }
        else {
            await this.selectContextCommandStep();
            await this.selectSystemCommandStep();
            await this.selectModuleCommandStep();
        }
        await this.addArtifactsToProjectMapCommandStep();
        this.setArtifactsTransformationsCommandStep();
        this.setArtifactDestinationPathCommandStep();
        const validationDestinationNodePath = new CmmaNodePath_1.default(this.PROJECT_CONFIG)
            .buildPath()
            .toContext(this.contextLabel)
            .toSystem(this.systemLabel)
            .toArtifactsDir('validators')
            .toModule(this.moduleLabel);
        const validatorFileNodePath = validationDestinationNodePath
            .toArtifactsDir('validators')
            .toArtifactWithoutExtension({
            artifactLabel: this.artifactLabel,
            artifactType: 'validator',
        });
        const controllerTemplateData = {
            defaultDir: this.PROJECT_CONFIG.defaultProjectRootDirInApp,
            contextLabel: this.contextLabel,
            systemLabel: this.systemLabel,
            moduleLabel: this.moduleLabel,
            artifactGroupDir: validatorFileNodePath.artifactDirLabel,
            validatorLabel: validatorFileNodePath.artifactLabel,
        };
        this.setArtifactTemplateData({
            artifactType: 'controller',
            templateData: controllerTemplateData,
        });
        await this.generate();
        this.finishCmmaCommand();
    }
}
Operation.commandName = 'cmma:make-operation';
Operation.description = 'Create a new CMMA Operation';
Operation.settings = {
    loadApp: false,
    stayAlive: false,
};
__decorate([
    standalone_1.args.string({ description: 'Name of the Operation to be Created' }),
    __metadata("design:type", String)
], Operation.prototype, "name", void 0);
__decorate([
    standalone_1.flags.string({ description: 'The name of the Module this operation belongs to', alias: 'm' }),
    __metadata("design:type", String)
], Operation.prototype, "module", void 0);
exports.default = Operation;
//# sourceMappingURL=Operation.js.map