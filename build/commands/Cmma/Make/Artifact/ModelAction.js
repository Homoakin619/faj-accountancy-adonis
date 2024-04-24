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
const CmmaFileActions_1 = __importDefault(require("../../../../cmma/Actions/CmmaFileActions"));
const CmmaNodePath_1 = __importDefault(require("../../../../cmma/Models/CmmaNodePath"));
class ModelAction extends BaseCmmaArtifactCommand_1.BaseCmmaArtifactCommand {
    constructor() {
        super(...arguments);
        this.PROJECT_CONFIG = this.projectConfigurationFromFile;
        this.commandShortCode = 'mk|mac';
        this.targetEntity = 'Action';
        this.artifactGroupDir = 'actions';
        this.artifactType = 'action';
    }
    getTemplateFilePath() {
        const templatesDir = CmmaFileActions_1.default.getCmmaTemplatesDir(this.application.appRoot);
        const artifactTemplateFileName = `model-action.txt`;
        templatesDir.push(artifactTemplateFileName);
        return CmmaFileActions_1.default.joinPath(templatesDir);
    }
    getTemplateData() {
        const modelVariableName = CmmaConfigurationActions_1.default.transformLabel({
            label: this.artifactLabel,
            transformations: { pattern: 'camelcase' },
        });
        const typeCheckingArtifactDirLabel = CmmaConfigurationActions_1.default.normalizeProjectIdentifier({
            identifier: 'typeChecking',
            configObject: this.PROJECT_CONFIG,
        });
        const modelNameInCaps = CmmaConfigurationActions_1.default.transformLabel({
            label: this.artifactLabel,
            transformations: {
                pattern: 'snakecase',
            },
        }).toUpperCase();
        return {
            modelName: this.artifactLabel,
            projectRootDir: CmmaConfigurationActions_1.default.whatIsDefaultProjectRootInApp(this.PROJECT_CONFIG),
            contextLabel: this.contextLabel,
            systemLabel: this.systemLabel,
            typeCheckingArtifactDirLabel,
            modelVariableName,
            modelNameInCaps,
        };
    }
    async run() {
        await this.ensureConfigFileExistsCommandStep();
        const modelTransformations = CmmaConfigurationActions_1.default.getArtifactGroupTransformation({
            artifactGroup: 'models',
            configObject: this.PROJECT_CONFIG,
        });
        this.artifactLabel = CmmaConfigurationActions_1.default.transformLabel({
            label: this.name,
            transformations: modelTransformations,
            noExt: true,
        });
        const modelSystemPath = new CmmaNodePath_1.default(this.PROJECT_CONFIG).findArtifactInProject({
            artifactType: 'model',
            artifactLabel: this.artifactLabel,
        });
        if (modelSystemPath.length === 0) {
            this.logger.error(`Model ${this.artifactLabel} is not available in project`);
            await this.exit();
        }
        this.systemLabel = modelSystemPath.systemLabel;
        this.contextLabel = modelSystemPath.contextLabel;
        this.logger.info(`Found ${this.colors.underline(this.artifactLabel)} Model in ${this.colors.underline(modelSystemPath.systemLabel)} System of ${this.colors.underline(modelSystemPath.contextLabel)} Context`);
        const modelActionTransformation = CmmaConfigurationActions_1.default.getArtifactTypeTransformationWithoutExtension({
            artifactType: 'action',
            configObject: this.PROJECT_CONFIG,
        });
        const modelActionLabel = CmmaConfigurationActions_1.default.transformLabel({
            transformations: modelActionTransformation,
            label: this.artifactLabel,
        });
        const confirm = await this.prompt.confirm(`Make ${this.colors.underline(modelActionLabel)} in ${this.colors.underline(modelSystemPath.systemLabel)} System?`);
        if (!confirm) {
            this.logger.info(SystemMessages_1.NOT_CONFIRMED_EXITING);
            await this.exit();
        }
        this.contextMap = CmmaProjectMapActions_1.default.getContextMapByLabel({
            contextLabel: this.contextLabel,
            projectMap: this.projectMap,
        });
        this.systemMap = CmmaContextActions_1.default.getContextSystemMapByLabel({
            systemLabel: this.systemLabel,
            contextMap: this.contextMap,
        });
        CmmaSystemActions_1.default.addArtifactToArtifactGroup({
            artifact: modelActionLabel,
            artifactsDir: 'actions',
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
ModelAction.commandName = 'cmma:make-model-action';
ModelAction.description = 'Create a new CMMA Model Action';
ModelAction.settings = {
    loadApp: false,
    stayAlive: false,
};
__decorate([
    standalone_1.args.string({ description: 'Name of the Model this Action is for' }),
    __metadata("design:type", String)
], ModelAction.prototype, "name", void 0);
exports.default = ModelAction;
//# sourceMappingURL=ModelAction.js.map