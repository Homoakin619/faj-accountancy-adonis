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
const CmmaConfigurationActions_1 = __importDefault(require("../../../../cmma/Actions/CmmaConfigurationActions"));
const standalone_1 = require("@adonisjs/core/build/standalone");
const CmmaSystemActions_1 = __importDefault(require("../../../../cmma/Actions/CmmaSystemActions"));
const CmmaModuleActions_1 = __importDefault(require("../../../../cmma/Actions/CmmaModuleActions"));
const CmmaNodePath_1 = __importDefault(require("../../../../cmma/Models/CmmaNodePath"));
const CmmaProjectMapActions_1 = __importDefault(require("../../../../cmma/Actions/CmmaProjectMapActions"));
const CmmaContextActions_1 = __importDefault(require("../../../../cmma/Actions/CmmaContextActions"));
class Module extends BaseCmmaBoundaryCommand_1.BaseCmmaBoundaryCommand {
    constructor() {
        super(...arguments);
        this.PROJECT_CONFIG = this.projectConfigurationFromFile;
        this.commandShortCode = 'mk|mod';
        this.targetEntity = 'Module';
    }
    get moduleRouteNamespaceString() {
        return `import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {

  })
.prefix('/Interface')
.namespace('App/${CmmaConfigurationActions_1.default.whatIsDefaultProjectRootInApp(this.PROJECT_CONFIG)}/${this.contextLabel}/${this.systemLabel}/Controllers/${this.moduleLabel}')`;
    }
    async run() {
        await this.ensureConfigFileExistsCommandStep();
        await this.selectContextCommandStep();
        await this.selectSystemCommandStep();
        this.moduleLabel = CmmaConfigurationActions_1.default.normalizeProjectIdentifier({
            identifier: this.name,
            configObject: this.PROJECT_CONFIG,
        });
        const defaultModule = CmmaModuleActions_1.default.blankModuleMap;
        defaultModule.moduleLabel = this.moduleLabel;
        CmmaSystemActions_1.default.addModuleToSystem({
            module: defaultModule,
            moduleLabel: this.moduleLabel,
            systemMap: this.systemMap,
        });
        for (let moduleDestinationDir of CmmaConfigurationActions_1.default.whatIsDefaultCreateModuleDirIn(this.PROJECT_CONFIG)) {
            const moduleDirectory = new CmmaNodePath_1.default(this.PROJECT_CONFIG)
                .buildPath()
                .toContext(this.contextLabel)
                .toSystem(this.systemLabel)
                .toArtifactsDir(moduleDestinationDir)
                .toModule(this.moduleLabel)
                .getAbsoluteOsPath(this.application.appRoot);
            CmmaFileActions_1.default.ensureADirectoryExits(moduleDirectory);
            this.logger.action('create').succeeded(moduleDirectory);
        }
        const moduleRoutesFile = new CmmaNodePath_1.default(this.PROJECT_CONFIG)
            .buildPath()
            .toContext(this.contextLabel)
            .toSystem(this.systemLabel)
            .toArtifactsDir('routes')
            .toArtifactWithExtension({
            artifactLabel: this.moduleLabel,
            artifactType: 'route',
        })
            .getAbsoluteOsPath(this.application.appRoot);
        CmmaFileActions_1.default.ensureAFileExists(moduleRoutesFile);
        CmmaFileActions_1.default.writeToFile({
            filePath: moduleRoutesFile,
            text: this.moduleRouteNamespaceString,
        });
        this.logger.action('create').succeeded(moduleRoutesFile);
        const moduleRoutesPath = new CmmaNodePath_1.default(this.PROJECT_CONFIG)
            .buildPath()
            .toArtifactWithoutExtension({
            artifactLabel: this.moduleLabel,
            artifactType: 'route',
        })
            .getRelativePath();
        const IMPORT_MODULE_ROUTES_STRING = `import './${moduleRoutesPath}'`;
        const systemRoutesFile = new CmmaNodePath_1.default(this.PROJECT_CONFIG)
            .buildPath()
            .toContext(this.contextLabel)
            .toSystem(this.systemLabel)
            .toArtifactsDir('routes')
            .toArtifactWithExtension({
            artifactLabel: 'index',
            artifactType: 'file',
        })
            .getAbsoluteOsPath(this.application.appRoot);
        CmmaFileActions_1.default.appendToFile({
            filePath: systemRoutesFile,
            text: IMPORT_MODULE_ROUTES_STRING,
        });
        this.logger.action('update').succeeded(systemRoutesFile);
        this.commandArgs = [
            CmmaProjectMapActions_1.default.getContextIndexByLabel({
                contextLabel: this.contextLabel,
                projectMap: this.projectMap,
            }),
            CmmaContextActions_1.default.getSystemIndexByLabel({
                contextMap: this.contextMap,
                systemLabel: this.systemLabel,
            }),
            CmmaSystemActions_1.default.listModulesInSystem(this.systemMap).length - 1,
        ];
        this.finishCmmaCommand();
    }
}
Module.commandName = 'cmma:make-module';
Module.description = 'Make a new CMMA CmmaModule';
Module.settings = {
    loadApp: false,
    stayAlive: false,
};
__decorate([
    standalone_1.args.string({ description: 'Name of the Module to be Created' }),
    __metadata("design:type", String)
], Module.prototype, "name", void 0);
exports.default = Module;
//# sourceMappingURL=Module.js.map