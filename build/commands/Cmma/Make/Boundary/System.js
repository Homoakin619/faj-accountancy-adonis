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
const BaseCmmaBoundaryCommand_1 = require("../../../../cmma/BaseCommands/BaseCmmaBoundaryCommand");
const standalone_1 = require("@adonisjs/core/build/standalone");
const CmmaFileActions_1 = __importDefault(require("../../../../cmma/Actions/CmmaFileActions"));
const CmmaConfigurationActions_1 = __importDefault(require("../../../../cmma/Actions/CmmaConfigurationActions"));
const CmmaContextActions_1 = __importDefault(require("../../../../cmma/Actions/CmmaContextActions"));
const CmmaSystemActions_1 = __importDefault(require("../../../../cmma/Actions/CmmaSystemActions"));
const CmmaNodePath_1 = __importDefault(require("../../../../cmma/Models/CmmaNodePath"));
const CmmaProjectMapActions_1 = __importDefault(require("../../../../cmma/Actions/CmmaProjectMapActions"));
class System extends BaseCmmaBoundaryCommand_1.BaseCmmaBoundaryCommand {
    constructor() {
        super(...arguments);
        this.PROJECT_CONFIG = this.projectConfigurationFromFile;
        this.commandShortCode = 'mk|sys';
        this.targetEntity = 'System';
    }
    getInternalApiStub() {
        const templatesDir = CmmaFileActions_1.default.getCmmaTemplatesDir(this.application.appRoot);
        templatesDir.push('api.txt');
        return CmmaFileActions_1.default.joinPath(templatesDir);
    }
    getTemplateData() {
        return {
            systemLabel: this.systemLabel,
        };
    }
    async run() {
        await this.ensureConfigFileExistsCommandStep();
        await this.selectContextCommandStep();
        this.systemLabel = CmmaConfigurationActions_1.default.normalizeProjectIdentifier({
            identifier: this.name,
            configObject: this.PROJECT_CONFIG,
        });
        if (CmmaContextActions_1.default.isSystemInContext({
            systemLabel: this.systemLabel,
            contextMap: this.contextMap,
        })) {
            this.logger.warning(`You have already registered '${this.systemLabel}' System in '${this.contextLabel}' Context. Ignoring...`);
            await this.exit();
        }
        const defaultSystem = CmmaSystemActions_1.default.blankSystemMap;
        defaultSystem.systemLabel = this.systemLabel;
        CmmaContextActions_1.default.addSystemToContext({
            systemLabel: this.systemLabel,
            contextMap: this.contextMap,
            system: defaultSystem,
        });
        for (let systemArtifactDirectoryLabel of CmmaConfigurationActions_1.default.whatIsDefaultSystemArtifactDirs(this.PROJECT_CONFIG)) {
            const artifactDirectoryFilePath = new CmmaNodePath_1.default(this.PROJECT_CONFIG)
                .buildPath()
                .toContext(this.contextLabel)
                .toSystem(this.systemLabel)
                .toArtifactsDir(systemArtifactDirectoryLabel)
                .getAbsoluteOsPath(this.application.appRoot);
            CmmaFileActions_1.default.ensureADirectoryExits(artifactDirectoryFilePath);
        }
        const systemRoutesFilePath = new CmmaNodePath_1.default(this.PROJECT_CONFIG)
            .buildPath()
            .toContext(this.contextLabel)
            .toSystem(this.systemLabel)
            .toArtifactsDir('routes')
            .toArtifactWithExtension({
            artifactLabel: 'index',
            artifactType: 'file',
        })
            .getAbsoluteOsPath(this.application.appRoot);
        CmmaFileActions_1.default.ensureAFileExists(systemRoutesFilePath);
        this.logger.action('create').succeeded(systemRoutesFilePath);
        const systemToSystemRoutesRelativePath = new CmmaNodePath_1.default(this.PROJECT_CONFIG)
            .buildPath()
            .toSystem(this.systemLabel)
            .toArtifactsDir('routes')
            .toArtifactWithoutExtension({
            artifactLabel: 'index',
            artifactType: 'file',
        })
            .getRelativePath();
        const IMPORT_SYSTEM_ROUTE_STRING = `import './${systemToSystemRoutesRelativePath}'`;
        const contextRoutesFilePath = new CmmaNodePath_1.default(this.PROJECT_CONFIG)
            .buildPath()
            .toContext(this.contextLabel)
            .toArtifactWithExtension({
            artifactLabel: this.contextLabel,
            artifactType: 'route',
        })
            .getAbsoluteOsPath(this.application.appRoot);
        CmmaFileActions_1.default.appendToFile({
            filePath: contextRoutesFilePath,
            text: IMPORT_SYSTEM_ROUTE_STRING,
        });
        this.logger.action('update').succeeded(contextRoutesFilePath);
        const internalApiDestinationPath = new CmmaNodePath_1.default(this.PROJECT_CONFIG)
            .buildPath()
            .toContext(this.contextLabel)
            .toSystem(this.systemLabel)
            .getAbsoluteOsPath(this.application.appRoot);
        this.generator
            .addFile(this.systemLabel, {
            pattern: CmmaConfigurationActions_1.default.whatIsDefaultCasePattern(this.PROJECT_CONFIG),
            extname: '.ts',
            suffix: CmmaConfigurationActions_1.default.whatIsDefaultSystemSuffix(this.PROJECT_CONFIG),
        })
            .destinationDir(internalApiDestinationPath)
            .stub(this.getInternalApiStub())
            .useMustache()
            .apply(this.getTemplateData());
        await this.generator.run();
        this.commandArgs = [
            CmmaProjectMapActions_1.default.getContextIndexByLabel({
                projectMap: this.projectMap,
                contextLabel: this.contextLabel,
            }),
            CmmaContextActions_1.default.listSystemsInContext(this.contextMap).length - 1,
        ];
        this.finishCmmaCommand();
    }
}
System.commandName = 'cmma:make-system';
System.description = 'Make a new CMMA System';
System.settings = {
    loadApp: false,
    stayAlive: false,
};
__decorate([
    standalone_1.args.string({ description: 'Name of the System to be Created' }),
    __metadata("design:type", String)
], System.prototype, "name", void 0);
exports.default = System;
//# sourceMappingURL=System.js.map