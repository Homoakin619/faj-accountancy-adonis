"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseCmmaCommand = void 0;
const standalone_1 = require("@adonisjs/core/build/standalone");
const CmmaFileActions_1 = __importDefault(require("../Actions/CmmaFileActions"));
const CmmaProjectMapActions_1 = __importDefault(require("../Actions/CmmaProjectMapActions"));
const SystemMessages_1 = require("../Helpers/SystemMessages/SystemMessages");
const CmmaContextActions_1 = __importDefault(require("../Actions/CmmaContextActions"));
const CmmaSystemActions_1 = __importDefault(require("../Actions/CmmaSystemActions"));
class BaseCmmaCommand extends standalone_1.BaseCommand {
    constructor() {
        super(...arguments);
        this.CONFIG_FILE_NAME = 'cmma-config.json';
        this.CONFIG_FILE_PATH = CmmaFileActions_1.default.joinPath([
            this.application.appRoot,
            this.CONFIG_FILE_NAME,
        ]);
        this.commandArgs = [];
    }
    logCompleteSuccessMessage(message) {
        this.logger.success(`${message}. Happy Coding 🚀 -- ${this.colors.dim(this.author)}`);
    }
    get projectConfigFileExists() {
        return CmmaFileActions_1.default.doesPathExist(this.CONFIG_FILE_PATH);
    }
    async startCmmaCommand() {
        if (!this.projectConfigFileExists) {
            this.logger.error(`Config file: ${this.colors.cyan(this.CONFIG_FILE_NAME)} does not exist. Run ${this.colors.cyan('node ace cmma:init')} first. Exiting...`);
            await this.exit();
        }
    }
    finishCmmaCommand() {
        this.logCommand();
        CmmaFileActions_1.default.writeConfigObjectToConfigFile({
            configObject: this.PROJECT_CONFIG,
            configFilePath: this.CONFIG_FILE_PATH,
        });
        this.logCompleteSuccessMessage(this.PROJECT_CONFIG.logs[this.PROJECT_CONFIG.logs.length - 1]);
    }
    logCommand() {
        const commandArgs = this.commandArgs.join('|');
        this.PROJECT_CONFIG.logs.push(`${this.commandShortCode}|${commandArgs}`);
    }
    get projectConfigurationFromFile() {
        return this.projectConfigFileExists
            ? CmmaFileActions_1.default.getConfigurationObjectFromFilePath(this.CONFIG_FILE_PATH)
            : null;
    }
    async ensureConfigFileExistsCommandStep() {
        if (!this.projectConfigFileExists) {
            this.logger.error(`Config file: ${this.colors.cyan(this.CONFIG_FILE_NAME)} does not exist. Run ${SystemMessages_1.CREATE_CONFIG_COMMAND} first. ${SystemMessages_1.EXITING}`);
            await this.exit();
        }
        this.projectMap = this.PROJECT_CONFIG.projectMap;
    }
    async selectContextCommandStep() {
        const projectContextLabels = CmmaProjectMapActions_1.default.listContextsInProject(this.projectMap);
        if (!projectContextLabels.length) {
            this.logger.error(`${SystemMessages_1.NO_DEFINED_CONTEXTS_IN_PROJECT}. Run ${this.colors.cyan(SystemMessages_1.INIT_PROJECT_COMMAND)} or ${this.colors.cyan(SystemMessages_1.MAKE_CONTEXT_COMMAND)} first. ${SystemMessages_1.EXITING}`);
            await this.exit();
        }
        this.contextLabel = await this.prompt.choice(`What Context does this ${this.targetEntity} belong to?`, projectContextLabels);
        this.contextMap = CmmaProjectMapActions_1.default.getContextMapByLabel({
            contextLabel: this.contextLabel,
            projectMap: this.projectMap,
        });
    }
    async selectSystemCommandStep() {
        const contextSystemLabels = CmmaContextActions_1.default.listSystemsInContext(this.contextMap);
        if (!contextSystemLabels.length) {
            this.logger.error(`${SystemMessages_1.NO_DEFINED_SYSTEMS_IN_CONTEXT}. Run ${this.colors.cyan(SystemMessages_1.MAKE_SYSTEM_COMMAND)} first. ${SystemMessages_1.EXITING}`);
            await this.exit();
        }
        this.systemLabel = await this.prompt.choice(`What System does this  ${this.targetEntity} belong to?`, contextSystemLabels);
        this.systemMap = CmmaContextActions_1.default.getContextSystemMapByLabel({
            systemLabel: this.systemLabel,
            contextMap: this.contextMap,
        });
    }
    async selectModuleCommandStep() {
        const systemModules = CmmaSystemActions_1.default.listModulesInSystem(this.systemMap);
        if (!systemModules.length) {
            this.logger.error(`${SystemMessages_1.NO_DEFINED_MODULES_IN_SYSTEM}. Run ${this.colors.cyan(SystemMessages_1.MAKE_MODULE_COMMAND)} first. ${SystemMessages_1.EXITING}`);
            await this.exit();
        }
        this.moduleLabel = await this.prompt.choice(`What Module does this ${this.targetEntity} belong to`, systemModules);
        this.moduleMap = CmmaSystemActions_1.default.getModuleMapByLabel({
            moduleLabel: this.moduleLabel,
            systemMap: this.systemMap,
        });
    }
    get author() {
        return 'ƒa†3.';
    }
}
exports.BaseCmmaCommand = BaseCmmaCommand;
//# sourceMappingURL=BaseCmmaCommand.js.map