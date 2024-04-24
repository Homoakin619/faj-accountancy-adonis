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
const BaseCmmaCommand_1 = require("../../cmma/BaseCommands/BaseCmmaCommand");
const CmmaFileActions_1 = __importDefault(require("../../cmma/Actions/CmmaFileActions"));
class Dummy extends BaseCmmaCommand_1.BaseCmmaCommand {
    constructor() {
        super(...arguments);
        this.PROJECT_CONFIG = this.projectConfigurationFromFile;
    }
    async run() {
        const jsonFiles = CmmaFileActions_1.default.listFilesInDir(CmmaFileActions_1.default.joinPath(CmmaFileActions_1.default.getCmmaTemplatesDir(this.application.appRoot)));
        console.log(jsonFiles);
        this.logger.info(`${this.name} success`);
    }
}
Dummy.commandName = 'cmma:dummy';
Dummy.description = 'Dummy CMMA for testing purposes';
Dummy.settings = {
    loadApp: false,
    stayAlive: false,
};
__decorate([
    standalone_1.args.string({ description: 'Name of the Dummy to be Dummied' }),
    __metadata("design:type", String)
], Dummy.prototype, "name", void 0);
exports.default = Dummy;
//# sourceMappingURL=Dummy.js.map