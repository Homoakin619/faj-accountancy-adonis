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
const CmmaFileActions_1 = __importDefault(require("../../../../cmma/Actions/CmmaFileActions"));
const standalone_1 = require("@adonisjs/core/build/standalone");
const CmmaConfigurationActions_1 = __importDefault(require("../../../../cmma/Actions/CmmaConfigurationActions"));
const CmmaProjectMapActions_1 = __importDefault(require("../../../../cmma/Actions/CmmaProjectMapActions"));
const CmmaContextActions_1 = __importDefault(require("../../../../cmma/Actions/CmmaContextActions"));
const CmmaNodePath_1 = __importDefault(require("../../../../cmma/Models/CmmaNodePath"));
const SystemMessages_1 = require("../../../../cmma/Helpers/SystemMessages/SystemMessages");
class Context extends BaseCmmaBoundaryCommand_1.BaseCmmaBoundaryCommand {
    constructor() {
        super(...arguments);
        this.PROJECT_CONFIG = this.projectConfigurationFromFile;
        this.commandShortCode = 'mk|con';
        this.targetEntity = 'Context';
    }
    async run() {
        await this.ensureConfigFileExistsCommandStep();
        this.contextLabel = CmmaConfigurationActions_1.default.normalizeProjectIdentifier({
            identifier: this.name,
            configObject: this.PROJECT_CONFIG,
        });
        if (CmmaProjectMapActions_1.default.isContextInProject({
            projectMap: this.projectMap,
            contextLabel: this.contextLabel,
        })) {
            this.logger.warning(`${SystemMessages_1.YOU_HAVE_ALREADY_REGISTERED_CONTEXT_IN_PROJECT} ${SystemMessages_1.EXITING}`);
            await this.exit();
        }
        const defaultContextObject = CmmaContextActions_1.default.blankContext;
        defaultContextObject.contextLabel = this.contextLabel;
        CmmaProjectMapActions_1.default.addContextToProject({
            projectMap: this.projectMap,
            contextLabel: this.contextLabel,
            context: defaultContextObject,
        });
        const contextDir = new CmmaNodePath_1.default(this.PROJECT_CONFIG)
            .buildPath()
            .toContext(this.contextLabel)
            .getAbsoluteOsPath(this.application.appRoot);
        this.generator
            .addFile(this.contextLabel, CmmaConfigurationActions_1.default.getArtifactTypeTransformationWithExtension({
            artifactType: 'route',
            configObject: this.PROJECT_CONFIG,
        }))
            .destinationDir(contextDir);
        await this.generator.run();
        const projectRoutesFile = new CmmaNodePath_1.default(this.PROJECT_CONFIG)
            .buildPath()
            .toArtifactWithExtension({
            artifactLabel: 'Project',
            artifactType: 'route',
        })
            .getAbsoluteOsPath(this.application.appRoot);
        const contextRoutesFileName = CmmaConfigurationActions_1.default.transformLabel({
            label: this.contextLabel,
            transformations: CmmaConfigurationActions_1.default.getArtifactTypeTransformationWithoutExtension({
                artifactType: 'route',
                configObject: this.PROJECT_CONFIG,
            }),
        });
        const importContextString = `import './${this.contextLabel}/${contextRoutesFileName}'`;
        CmmaFileActions_1.default.appendToFile({
            filePath: projectRoutesFile,
            text: importContextString,
        });
        this.logger.action('update').succeeded(projectRoutesFile);
        this.commandArgs = [CmmaProjectMapActions_1.default.listContextsInProject(this.projectMap).length - 1];
        this.finishCmmaCommand();
    }
}
Context.commandName = 'cmma:make-context';
Context.description = 'Create a new CMMA Context';
Context.settings = {
    loadApp: false,
    stayAlive: false,
};
__decorate([
    standalone_1.args.string({ description: 'Name of the Context to be Created' }),
    __metadata("design:type", String)
], Context.prototype, "name", void 0);
exports.default = Context;
//# sourceMappingURL=Context.js.map