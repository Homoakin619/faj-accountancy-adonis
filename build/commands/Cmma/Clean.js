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
const fs_extra_1 = require("fs-extra");
const standalone_1 = require("@adonisjs/core/build/standalone");
const CmmaConfigurationActions_1 = __importDefault(require("../../cmma/Actions/CmmaConfigurationActions"));
const BaseCmmaCommand_1 = require("../../cmma/BaseCommands/BaseCmmaCommand");
const CmmaNodePath_1 = __importDefault(require("../../cmma/Models/CmmaNodePath"));
const CmmaFileActions_1 = __importDefault(require("../../cmma/Actions/CmmaFileActions"));
const SystemMessages_1 = require("../../cmma/Helpers/SystemMessages/SystemMessages");
class Clean extends BaseCmmaCommand_1.BaseCmmaCommand {
    constructor() {
        super(...arguments);
        this.PROJECT_CONFIG = this.projectConfigurationFromFile;
        this.commandShortCode = 'mk|act';
        this.targetEntity = 'Project';
        this.excludeConfig = false;
        this.yes = false;
    }
    async run() {
        if (!this.projectConfigFileExists) {
            this.logger.error(`Config file: ${this.colors.cyan(this.CONFIG_FILE_NAME)} does not exist. Cannot Clean. Exiting...`);
            await this.exit();
        }
        const cleaningHasBeenConfirmed = this.yes;
        if (!cleaningHasBeenConfirmed) {
            const verifyClean = await this.prompt.confirm('Are you sure you want to Clean CMMA?');
            if (!verifyClean) {
                this.logger.info(SystemMessages_1.EXITING);
                await this.exit();
            }
        }
        console.log(this.PROJECT_CONFIG);
        const nodePath = new CmmaNodePath_1.default(this.PROJECT_CONFIG).buildPath();
        const projectRootPath = CmmaFileActions_1.default.createAbsolutePathFromNodePath({
            applicationRoot: this.application.appRoot,
            projectRootDirInApp: CmmaConfigurationActions_1.default.whatIsDefaultProjectRootInApp(this.PROJECT_CONFIG),
            nodePath,
        });
        (0, fs_extra_1.removeSync)(projectRootPath);
        this.logger.action('delete').succeeded(projectRootPath);
        const adonisRoute = CmmaFileActions_1.default.joinPath([this.application.appRoot, 'start', 'routes.ts']);
        (0, fs_extra_1.removeSync)(adonisRoute);
        CmmaFileActions_1.default.ensureAFileExists(adonisRoute);
        this.logger.action('update').succeeded(adonisRoute);
        if (!this.excludeConfig) {
            (0, fs_extra_1.removeSync)(this.CONFIG_FILE_PATH);
            this.logger.action('delete').succeeded(this.CONFIG_FILE_PATH);
        }
    }
}
Clean.commandName = 'cmma:clean';
Clean.description = 'Delete Default Context Directory and config file. This is a debug command, use with caution.';
Clean.settings = {
    loadApp: false,
    stayAlive: false,
};
__decorate([
    standalone_1.flags.boolean({
        alias: 'e',
        description: 'Exclude CMMA config in clean',
    }),
    __metadata("design:type", Boolean)
], Clean.prototype, "excludeConfig", void 0);
__decorate([
    standalone_1.flags.boolean({
        alias: 'y',
        description: 'Response yes to confirmation',
    }),
    __metadata("design:type", Boolean)
], Clean.prototype, "yes", void 0);
exports.default = Clean;
//# sourceMappingURL=Clean.js.map