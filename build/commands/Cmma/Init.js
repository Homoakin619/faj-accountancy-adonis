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
const BaseCmmaBoundaryCommand_1 = require("../../cmma/BaseCommands/BaseCmmaBoundaryCommand");
const standalone_1 = require("@adonisjs/core/build/standalone");
const CmmaConfigurationActions_1 = __importDefault(require("../../cmma/Actions/CmmaConfigurationActions"));
const CmmaProjectMapActions_1 = __importDefault(require("../../cmma/Actions/CmmaProjectMapActions"));
const CmmaFileActions_1 = __importDefault(require("../../cmma/Actions/CmmaFileActions"));
const CmmaContextActions_1 = __importDefault(require("../../cmma/Actions/CmmaContextActions"));
const CmmaNodePath_1 = __importDefault(require("../../cmma/Models/CmmaNodePath"));
const SystemMessages_1 = require("../../cmma/Helpers/SystemMessages/SystemMessages");
class Init extends BaseCmmaBoundaryCommand_1.BaseCmmaBoundaryCommand {
    constructor() {
        super(...arguments);
        this.PROJECT_CONFIG = this.projectConfigurationFromFile;
        this.projectMap = this.PROJECT_CONFIG.projectMap;
        this.commandShortCode = 'in';
        this.targetEntity = 'Context';
    }
    displayProjectDefaultsCommandStep() {
        this.ui
            .sticker()
            .heading(SystemMessages_1.INITIALIZING_ADONIS_PROJECT_FOR_CMMA)
            .add('Project Defaults')
            .add('')
            .add(`Contexts' Location:                   ./app/${this.PROJECT_CONFIG.defaultProjectRootDirInApp}`)
            .add(`System Internal API Suffix:           ${this.PROJECT_CONFIG.defaultSystemInternalApiSuffix}`)
            .add(`Case Pattern for Generated Files:     ${this.PROJECT_CONFIG.defaultCasePattern}`)
            .add(`Create Module Directory In:           ${this.PROJECT_CONFIG.defaultModuleDirIn}`)
            .add(`Default System Directories:           ${this.PROJECT_CONFIG.defaultSystemArtifactDirs}`)
            .render();
    }
    async run() {
        await this.ensureConfigFileExistsCommandStep();
        this.displayProjectDefaultsCommandStep();
        const projectRoutesFile = new CmmaNodePath_1.default(this.PROJECT_CONFIG)
            .buildPath()
            .toArtifactWithExtension({
            artifactLabel: 'Project',
            artifactType: 'route',
        })
            .getAbsoluteOsPath(this.application.appRoot);
        CmmaFileActions_1.default.ensureAFileExists(projectRoutesFile);
        this.logger.action('create').succeeded(projectRoutesFile);
        const PROJECT_ROUTES_FILENAME = new CmmaNodePath_1.default(this.PROJECT_CONFIG)
            .buildPath()
            .toArtifactWithoutExtension({
            artifactLabel: 'Project',
            artifactType: 'route',
        }).artifactLabel;
        CmmaProjectMapActions_1.default.addArtifactToProject({
            artifact: PROJECT_ROUTES_FILENAME,
            projectMap: this.projectMap,
        });
        const adonisRoutesPath = CmmaFileActions_1.default.joinPath([
            this.application.appRoot,
            'start',
            'routes.ts',
        ]);
        const projectImportString = `import 'App/${this.PROJECT_CONFIG.defaultProjectRootDirInApp}/${PROJECT_ROUTES_FILENAME}'`;
        CmmaFileActions_1.default.appendToFile({
            filePath: adonisRoutesPath,
            text: projectImportString,
        });
        this.logger.action('update').succeeded(adonisRoutesPath);
        const SHOULD_INITIALIZE_PROJECT_CONTEXTS = !this.empty;
        if (SHOULD_INITIALIZE_PROJECT_CONTEXTS) {
            let contextLabel = 'context';
            while (contextLabel) {
                contextLabel = await this.prompt.ask('Enter the name of a Context. Or enter leave empty to lock your entries');
                contextLabel = CmmaConfigurationActions_1.default.normalizeProjectIdentifier({
                    identifier: contextLabel,
                    configObject: this.PROJECT_CONFIG,
                });
                if (!contextLabel)
                    break;
                this.logger.info(`Registering Project Context: ${contextLabel}`);
                if (CmmaProjectMapActions_1.default.isContextInProject({
                    contextLabel,
                    projectMap: this.projectMap,
                })) {
                    this.logger.warning(SystemMessages_1.YOU_HAVE_ALREADY_REGISTERED_CONTEXT_IN_PROJECT);
                    continue;
                }
                const defaultContextObject = CmmaContextActions_1.default.blankContext;
                defaultContextObject.contextLabel = contextLabel;
                CmmaProjectMapActions_1.default.addContextToProject({
                    contextLabel,
                    context: defaultContextObject,
                    projectMap: this.projectMap,
                });
                this.logger.success(`Registered Project Context: ${contextLabel}`);
            }
        }
        for (let contextLabel of CmmaProjectMapActions_1.default.listContextsInProject(this.projectMap)) {
            const contextDir = new CmmaNodePath_1.default(this.PROJECT_CONFIG)
                .buildPath()
                .toContext(contextLabel)
                .getAbsoluteOsPath(this.application.appRoot);
            const generatedContextRoutesFile = this.generator
                .addFile(contextLabel, CmmaConfigurationActions_1.default.getArtifactGroupTransformation({
                artifactGroup: 'routes',
                configObject: this.PROJECT_CONFIG,
            }))
                .destinationDir(contextDir);
            const contextImportString = `import './${contextLabel}/${generatedContextRoutesFile.toJSON().filename}'`;
            CmmaFileActions_1.default.appendToFile({
                filePath: projectRoutesFile,
                text: contextImportString,
            });
        }
        await this.generator.run();
        const projectContexts = CmmaProjectMapActions_1.default.listContextsInProject(this.projectMap);
        for (let i = 0; i < projectContexts.length; i++)
            this.commandArgs.push(i);
        this.finishCmmaCommand();
    }
}
Init.commandName = 'cmma:init';
Init.description = "Initialize Project for Crenet's Modular Monolith Architecture(CMMA)";
Init.settings = {
    loadApp: false,
    stayAlive: false,
};
__decorate([
    standalone_1.flags.boolean({ description: 'Initialize Empty CMMA Project', alias: 'e' }),
    __metadata("design:type", Boolean)
], Init.prototype, "empty", void 0);
exports.default = Init;
//# sourceMappingURL=Init.js.map