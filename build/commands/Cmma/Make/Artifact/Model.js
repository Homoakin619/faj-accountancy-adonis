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
const CmmaSystemActions_1 = __importDefault(require("../../../../cmma/Actions/CmmaSystemActions"));
const CmmaConfigurationActions_1 = __importDefault(require("../../../../cmma/Actions/CmmaConfigurationActions"));
const SystemMessages_1 = require("../../../../cmma/Helpers/SystemMessages/SystemMessages");
const CmmaProjectMapActions_1 = __importDefault(require("../../../../cmma/Actions/CmmaProjectMapActions"));
const CmmaContextActions_1 = __importDefault(require("../../../../cmma/Actions/CmmaContextActions"));
class Model extends BaseCmmaArtifactCommand_1.BaseCmmaArtifactCommand {
    constructor() {
        super(...arguments);
        this.PROJECT_CONFIG = this.projectConfigurationFromFile;
        this.commandShortCode = 'mk|act';
        this.targetEntity = 'Model';
        this.artifactGroupDir = 'models';
        this.artifactType = 'model';
    }
    async run() {
        await this.ensureConfigFileExistsCommandStep();
        await this.selectContextCommandStep();
        await this.selectSystemCommandStep();
        this.artifactLabel = this.name;
        const modelTransformations = CmmaConfigurationActions_1.default.getArtifactTypeTransformationWithoutExtension({
            artifactType: 'model',
            configObject: this.PROJECT_CONFIG,
        });
        this.artifactLabel = CmmaConfigurationActions_1.default.transformLabel({
            transformations: modelTransformations,
            label: this.artifactLabel,
        });
        if (CmmaSystemActions_1.default.isArtifactInSystemArtifactGroup({
            systemMap: this.systemMap,
            artifactsDir: 'models',
            artifactLabel: this.artifactLabel,
        })) {
            this.logger.warning(SystemMessages_1.YOU_HAVE_ALREADY_REGISTERED_ARTIFACT_IN_SYSTEM);
            await this.exit();
        }
        this.logger.info(`Creating ${this.colors.underline(this.artifactLabel)} ${this.artifactLabel} Artifact in ${this.colors.underline(this.systemLabel)} System in ${this.colors.underline(this.contextLabel)} Context.`);
        CmmaSystemActions_1.default.addArtifactToArtifactGroup({
            artifact: this.artifactLabel,
            artifactsDir: 'models',
            systemMap: this.systemMap,
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
            CmmaSystemActions_1.default.listSystemArtifactsByGroupLabel({
                systemMap: this.systemMap,
                artifactsDir: this.artifactGroupDir,
            }).length - 1,
        ];
        this.finishCmmaCommand();
    }
}
Model.commandName = 'cmma:make-model';
Model.description = 'Create a new CMMA Model';
Model.settings = {
    loadApp: false,
    stayAlive: false,
};
__decorate([
    standalone_1.args.string({ description: 'Name of the Model to be Created' }),
    __metadata("design:type", String)
], Model.prototype, "name", void 0);
exports.default = Model;
//# sourceMappingURL=Model.js.map