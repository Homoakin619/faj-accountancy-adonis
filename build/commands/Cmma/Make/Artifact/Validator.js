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
const CmmaModuleActions_1 = __importDefault(require("../../../../cmma/Actions/CmmaModuleActions"));
const CmmaConfigurationActions_1 = __importDefault(require("../../../../cmma/Actions/CmmaConfigurationActions"));
const CmmaNodePath_1 = __importDefault(require("../../../../cmma/Models/CmmaNodePath"));
const CmmaProjectMapActions_1 = __importDefault(require("../../../../cmma/Actions/CmmaProjectMapActions"));
const CmmaContextActions_1 = __importDefault(require("../../../../cmma/Actions/CmmaContextActions"));
const CmmaSystemActions_1 = __importDefault(require("../../../../cmma/Actions/CmmaSystemActions"));
class Validator extends BaseCmmaArtifactCommand_1.BaseCmmaArtifactCommand {
    constructor() {
        super(...arguments);
        this.PROJECT_CONFIG = this.projectConfigurationFromFile;
        this.commandShortCode = 'mk|val';
        this.targetEntity = 'Validator';
        this.artifactGroupDir = 'validators';
        this.artifactType = 'validator';
    }
    getArtifactDestinationNodePath() {
        const nodePath = new CmmaNodePath_1.default(this.PROJECT_CONFIG);
        nodePath
            .buildPath()
            .toContext(this.contextLabel)
            .toSystem(this.systemLabel)
            .toArtifactsDir(this.artifactGroupDir)
            .toModule(this.moduleLabel);
        return nodePath;
    }
    async run() {
        await this.ensureConfigFileExistsCommandStep();
        await this.selectContextCommandStep();
        await this.selectSystemCommandStep();
        await this.selectModuleCommandStep();
        this.artifactLabel = this.name;
        const precomputedName = CmmaConfigurationActions_1.default.normalizeProjectIdentifier({
            configObject: this.PROJECT_CONFIG,
            identifier: this.name,
        });
        this.computedNameWithoutSuffix = precomputedName.includes(this.defaultCmmaArtifactSuffix)
            ? precomputedName.replace(this.defaultCmmaArtifactSuffix, '')
            : precomputedName;
        this.computedNameWithSuffix = CmmaConfigurationActions_1.default.normalizeProjectIdentifier({
            configObject: this.PROJECT_CONFIG,
            identifier: this.computedNameWithoutSuffix + this.defaultCmmaArtifactSuffix,
        });
        if (CmmaModuleActions_1.default.isValidatorInModule({
            moduleMap: this.moduleMap,
            validatorLabel: this.computedNameWithSuffix,
        })) {
            this.logger.warning(`You have already registered Validator in this Module in System. Ignoring...`);
            await this.exit();
        }
        this.logger.info(`Creating ${this.colors.underline(this.computedNameWithSuffix)} ${this.artifactLabel} Artifact in ${this.colors.underline(this.moduleLabel)} Module in ${this.colors.underline(this.systemLabel)} System in ${this.colors.underline(this.contextLabel)} Context.`);
        CmmaModuleActions_1.default.addModuleValidatorToModule({
            validator: this.computedNameWithSuffix,
            moduleMap: this.moduleMap,
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
            CmmaSystemActions_1.default.getModuleIndexByLabel({
                systemMap: this.systemMap,
                moduleLabel: this.moduleLabel,
            }),
            CmmaModuleActions_1.default.listModuleValidators(this.moduleMap).length - 1,
        ];
        this.finishCmmaCommand();
    }
}
Validator.commandName = 'cmma:make-validator';
Validator.description = 'Create a new CMMA Validator';
Validator.settings = {
    loadApp: false,
    stayAlive: false,
};
__decorate([
    standalone_1.args.string({ description: 'Name of the Validator to be Created' }),
    __metadata("design:type", String)
], Validator.prototype, "name", void 0);
exports.default = Validator;
//# sourceMappingURL=Validator.js.map