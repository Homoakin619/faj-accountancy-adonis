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
const standalone_1 = require("@adonisjs/core/build/standalone");
const CmmaConfigurationActions_1 = __importDefault(require("../../../cmma/Actions/CmmaConfigurationActions"));
const SystemMessages_1 = require("../../../cmma/Helpers/SystemMessages/SystemMessages");
const CmmaFileActions_1 = __importDefault(require("../../../cmma/Actions/CmmaFileActions"));
const BaseCmmaCommand_1 = require("../../../cmma/BaseCommands/BaseCmmaCommand");
class ConfigCreate extends BaseCmmaCommand_1.BaseCmmaCommand {
    constructor() {
        super(...arguments);
        this.PROJECT_CONFIG = CmmaConfigurationActions_1.default.defaultCmmaConfiguration;
        this.commandShortCode = 'cr';
    }
    async run() {
        if (this.projectConfigFileExists) {
            this.logger.warning(SystemMessages_1.CONFIGURATION_FILE_EXISTS);
            const confirmProceed = await this.prompt.confirm(SystemMessages_1.PROCEEDING_WILL_OVERWRITE_CONFIG_FILE_CONTINUE);
            if (!confirmProceed) {
                this.logger.info(SystemMessages_1.EXITING);
                await this.exit();
            }
        }
        if (this.empty) {
            this.PROJECT_CONFIG = CmmaConfigurationActions_1.default.blankCmmaConfiguration;
        }
        CmmaFileActions_1.default.ensureAFileExists(this.CONFIG_FILE_PATH);
        this.finishCmmaCommand();
    }
}
ConfigCreate.commandName = 'cmma:config-create';
ConfigCreate.description = 'Create a CMMA Configuration file';
ConfigCreate.settings = {
    loadApp: false,
    stayAlive: false,
};
__decorate([
    standalone_1.flags.boolean({ description: 'Create Empty CMMA Config file', alias: 'e' }),
    __metadata("design:type", Boolean)
], ConfigCreate.prototype, "empty", void 0);
exports.default = ConfigCreate;
//# sourceMappingURL=Create.js.map