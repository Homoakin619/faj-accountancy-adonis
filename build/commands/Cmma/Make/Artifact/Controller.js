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
const BaseCmmaArtifactCommand_1 = require("../../../../cmma/BaseCommands/BaseCmmaArtifactCommand");
const standalone_1 = require("@adonisjs/core/build/standalone");
const CmmaModuleActions_1 = __importDefault(require("../../../../cmma/Actions/CmmaModuleActions"));
const CmmaConfigurationActions_1 = __importDefault(require("../../../../cmma/Actions/CmmaConfigurationActions"));
const CmmaNodePath_1 = __importDefault(require("../../../../cmma/Models/CmmaNodePath"));
const SystemMessages_1 = require("../../../../cmma/Helpers/SystemMessages/SystemMessages");
const CmmaProjectMapActions_1 = __importDefault(require("../../../../cmma/Actions/CmmaProjectMapActions"));
const CmmaContextActions_1 = __importDefault(require("../../../../cmma/Actions/CmmaContextActions"));
const CmmaSystemActions_1 = __importDefault(require("../../../../cmma/Actions/CmmaSystemActions"));
class Controller extends BaseCmmaArtifactCommand_1.BaseCmmaArtifactCommand {
    constructor() {
        super(...arguments);
        this.PROJECT_CONFIG = this.projectConfigurationFromFile;
        this.commandShortCode = 'mk|ctr';
        this.targetEntity = 'Controller';
        this.artifactGroupDir = 'controllers';
        this.artifactType = 'controller';
    }
    getArtifactDestinationNodePath() {
        const nodePath = new CmmaNodePath_1.default(this.PROJECT_CONFIG).buildPath();
        nodePath
            .toContext(this.contextLabel)
            .toSystem(this.systemLabel)
            .toArtifactsDir(this.artifactGroupDir)
            .toModule(this.moduleLabel);
        return nodePath;
    }
    async run() {
        await this.ensureConfigFileExistsCommandStep();
        await this.selectContextCommandStep();
        await this.selectSystemCommandStep();
        await this.selectModuleCommandStep();
        this.artifactLabel = this.name;
        const controllerTransformations = CmmaConfigurationActions_1.default.getArtifactTypeTransformationWithoutExtension({
            artifactType: 'controller',
            configObject: this.PROJECT_CONFIG,
        });
        this.artifactLabel = CmmaConfigurationActions_1.default.transformLabel({
            transformations: controllerTransformations,
            label: this.artifactLabel,
        });
        if (CmmaModuleActions_1.default.isControllerInModule({
            moduleMap: this.moduleMap,
            controllerLabel: this.artifactLabel,
        })) {
            this.logger.warning(`${SystemMessages_1.YOU_HAVE_ALREADY_REGISTERED_CONTROLLER_IN_MODULE}. ${SystemMessages_1.EXITING}`);
            await this.exit();
        }
        this.logger.info(`Creating ${this.colors.underline(this.artifactLabel)} Artifact in ${this.colors.underline(this.moduleLabel)} Module in ${this.colors.underline(this.systemLabel)} System in ${this.colors.underline(this.contextLabel)} Context.`);
        CmmaModuleActions_1.default.addModuleControllerToModule({
            controller: this.artifactLabel,
            moduleMap: this.moduleMap,
        });
        await this.generate();
        this.commandArgs = [
            CmmaProjectMapActions_1.default.getContextIndexByLabel({
                projectMap: this.projectMap,
                contextLabel: this.contextLabel,
            }),
            CmmaContextActions_1.default.getSystemIndexByLabel({
                contextMap: this.contextMap,
                systemLabel: this.systemLabel,
            }),
            CmmaSystemActions_1.default.getModuleIndexByLabel({
                systemMap: this.systemMap,
                moduleLabel: this.moduleLabel,
            }),
            CmmaModuleActions_1.default.listModuleControllers(this.moduleMap).length - 1,
        ];
        this.finishCmmaCommand();
    }
}
Controller.commandName = 'cmma:make-controller';
Controller.description = 'Create a new CMMA Context';
Controller.settings = {
    loadApp: false,
    stayAlive: false,
};
__decorate([
    standalone_1.args.string({ description: 'Name of the Context to be Created' }),
    __metadata("design:type", String)
], Controller.prototype, "name", void 0);
exports.default = Controller;
//# sourceMappingURL=Controller.js.map