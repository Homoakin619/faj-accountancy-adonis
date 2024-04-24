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
const CmmaConfigurationActions_1 = __importDefault(require("../../../../cmma/Actions/CmmaConfigurationActions"));
const CmmaNodePath_1 = __importDefault(require("../../../../cmma/Models/CmmaNodePath"));
const SystemMessages_1 = require("../../../../cmma/Helpers/SystemMessages/SystemMessages");
const CmmaProjectMapActions_1 = __importDefault(require("../../../../cmma/Actions/CmmaProjectMapActions"));
const CmmaContextActions_1 = __importDefault(require("../../../../cmma/Actions/CmmaContextActions"));
class ModelOptions extends BaseCmmaAbstractArtifactCommand_1.BaseCmmaAbstractArtifactCommand {
    constructor() {
        super(...arguments);
        this.PROJECT_CONFIG = this.projectConfigurationFromFile;
        this.commandShortCode = 'mk|mop';
        this.abstractArtifactType = 'model-options';
        this.targetEntity = 'Model Options';
        this.abstractArtifactConstituents = [
            'create-options',
            'update-options',
            'model-interface',
            'identifier-options',
        ];
    }
    setArtifactDestinationPathCommandStep() {
        for (let artifactType of this.abstractArtifactConstituents) {
            const artifactDestinationDir = new CmmaNodePath_1.default(this.PROJECT_CONFIG)
                .buildPath()
                .toContext(this.contextLabel)
                .toSystem(this.systemLabel)
                .toArtifactsDir('typeChecking')
                .toModelDir(this.artifactLabel)
                .getAbsoluteOsPath(this.application.appRoot);
            this.setArtifactDestinationDir({
                artifactType,
                artifactDestinationDir,
            });
        }
    }
    async run() {
        await this.ensureConfigFileExistsCommandStep();
        const projectMap = this.PROJECT_CONFIG.projectMap;
        this.artifactLabel = CmmaConfigurationActions_1.default.normalizeProjectIdentifier({
            identifier: this.name,
            configObject: this.PROJECT_CONFIG,
        });
        const modelNodePath = new CmmaNodePath_1.default(this.PROJECT_CONFIG).findArtifactInProject({
            artifactLabel: this.artifactLabel,
            artifactType: 'model',
        });
        if (!modelNodePath.length) {
            this.logger.error(`${this.artifactLabel} Model Not Found in Project ${SystemMessages_1.EXITING}`);
            await this.exit();
        }
        const confirmation = await this.prompt.confirm(`${this.colors.underline(this.artifactLabel)} Model found in ${this.colors.underline(modelNodePath.systemLabel)} System in ${this.colors.underline(modelNodePath.contextLabel)} Context. Create ${this.name} Model Options in System?`);
        if (!confirmation) {
            this.logger.info(SystemMessages_1.EXITING);
            await this.exit();
        }
        this.contextLabel = modelNodePath.contextLabel;
        this.systemLabel = modelNodePath.systemLabel;
        this.contextMap = CmmaProjectMapActions_1.default.getContextMapByLabel({
            contextLabel: this.contextLabel,
            projectMap,
        });
        this.systemMap = CmmaContextActions_1.default.getContextSystemMapByLabel({
            systemLabel: this.systemLabel,
            contextMap: this.contextMap,
        });
        await this.addArtifactsToProjectMapCommandStep();
        this.setArtifactsTransformationsCommandStep();
        this.setArtifactDestinationPathCommandStep();
        const typecheckingDestinationNodePath = new CmmaNodePath_1.default(this.PROJECT_CONFIG)
            .buildPath()
            .toContext(this.contextLabel)
            .toSystem(this.systemLabel)
            .toArtifactsDir('typeChecking')
            .toModelDir(this.artifactLabel);
        for (let artifactType of this.abstractArtifactConstituents) {
            const identifierOptionsTransformation = CmmaConfigurationActions_1.default.getArtifactTypeTransformationWithoutExtension({
                artifactType: 'identifier-options',
                configObject: this.PROJECT_CONFIG,
            });
            const identifierOptionsLabel = CmmaConfigurationActions_1.default.transformLabel({
                label: this.artifactLabel,
                transformations: identifierOptionsTransformation,
            });
            const modelInterfaceTransformations = CmmaConfigurationActions_1.default.getArtifactTypeTransformationWithoutExtension({
                artifactType: 'model-interface',
                configObject: this.PROJECT_CONFIG,
            });
            const modelInterfaceLabel = CmmaConfigurationActions_1.default.transformLabel({
                label: this.artifactLabel,
                transformations: modelInterfaceTransformations,
            });
            const templateData = {
                identifierOptionsLabel,
                modelInterfaceLabel,
                defaultProjectDir: this.PROJECT_CONFIG.defaultProjectRootDirInApp,
                contextLabel: this.contextLabel,
                systemLabel: this.systemLabel,
                artifactDirLabel: typecheckingDestinationNodePath.artifactDirLabel,
                artifactLabel: this.artifactLabel,
            };
            this.setArtifactTemplateData({
                artifactType,
                templateData,
            });
        }
        await this.generate();
        this.finishCmmaCommand();
    }
}
ModelOptions.commandName = 'cmma:make-model-options';
ModelOptions.description = 'Create a new CMMA Model Options';
ModelOptions.settings = {
    loadApp: false,
    stayAlive: false,
};
__decorate([
    standalone_1.args.string({ description: 'Name of the Model the Model Options to be Created belongs to' }),
    __metadata("design:type", String)
], ModelOptions.prototype, "name", void 0);
exports.default = ModelOptions;
//# sourceMappingURL=ModelOptions.js.map