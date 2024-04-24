"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseCmmaArtifactCommand = void 0;
const BaseCmmaCommand_1 = require("./BaseCmmaCommand");
const CmmaConfigurationActions_1 = __importDefault(require("../Actions/CmmaConfigurationActions"));
const CmmaFileActions_1 = __importDefault(require("../Actions/CmmaFileActions"));
const CmmaNodePath_1 = __importDefault(require("../Models/CmmaNodePath"));
class BaseCmmaArtifactCommand extends BaseCmmaCommand_1.BaseCmmaCommand {
    async generate() {
        const hasRcFile = await this.hasRcFile(this.application.appRoot);
        if (!hasRcFile) {
            this.logger.error('Make sure your project root has ".adonisrc.json" file');
            return;
        }
        this.generator
            .addFile(this.artifactLabel, this.getArtifactTransformations())
            .stub(this.getTemplateFilePath())
            .useMustache()
            .destinationDir(this.getArtifactDestinationFilePath())
            .appRoot(this.application.appRoot)
            .apply(this.getTemplateData());
        await this.generator.run();
    }
    getArtifactTransformations() {
        return CmmaConfigurationActions_1.default.getArtifactTypeTransformationWithExtension({
            artifactType: this.artifactType,
            configObject: this.PROJECT_CONFIG,
        });
    }
    getTemplateFilePath() {
        const templatesDir = CmmaFileActions_1.default.getCmmaTemplatesDir(this.application.appRoot);
        const artifactGroupTemplateFileName = `${this.artifactType}.txt`;
        templatesDir.push(artifactGroupTemplateFileName);
        return CmmaFileActions_1.default.joinPath(templatesDir);
    }
    getTemplateData() {
        return {
            artifactLabel: this.artifactLabel,
        };
    }
    getArtifactDestinationNodePath() {
        return new CmmaNodePath_1.default(this.PROJECT_CONFIG)
            .buildPath()
            .toContext(this.contextLabel)
            .toSystem(this.systemLabel)
            .toArtifactsDir(this.artifactGroupDir);
    }
    getArtifactDestinationFilePath() {
        return this.getArtifactDestinationNodePath().getAbsoluteOsPath(this.application.appRoot);
    }
    get defaultCmmaArtifactSuffix() {
        return (CmmaConfigurationActions_1.default.getArtifactTypeTransformationWithExtension({
            configObject: this.PROJECT_CONFIG,
            artifactType: this.artifactType,
        }).suffix || '');
    }
    async hasRcFile(cwd) {
        const filePath = CmmaFileActions_1.default.joinPath([cwd, '.adonisrc.json']);
        return CmmaFileActions_1.default.doesPathExist(filePath);
    }
}
exports.BaseCmmaArtifactCommand = BaseCmmaArtifactCommand;
//# sourceMappingURL=BaseCmmaArtifactCommand.js.map