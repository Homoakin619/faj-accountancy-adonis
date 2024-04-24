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
const BaseCmmaAbstractArtifactCommand_1 = require("../../../../cmma/BaseCommands/BaseCmmaAbstractArtifactCommand");
const standalone_1 = require("@adonisjs/core/build/standalone");
const CmmaConfigurationActions_1 = __importDefault(require("../../../../cmma/Actions/CmmaConfigurationActions"));
const Helpers_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Helpers");
class ModelOptions extends BaseCmmaAbstractArtifactCommand_1.BaseCmmaAbstractArtifactCommand {
    constructor() {
        super(...arguments);
        this.PROJECT_CONFIG = this.projectConfigurationFromFile;
        this.commandShortCode = 'mk|dbm';
        this.abstractArtifactType = 'db-model';
        this.targetEntity = 'Db Model';
        this.abstractArtifactConstituents = ['model', 'migration'];
    }
    async run() {
        await this.ensureConfigFileExistsCommandStep();
        this.artifactLabel = this.name;
        await this.selectContextCommandStep();
        await this.selectSystemCommandStep();
        await this.addArtifactsToProjectMapCommandStep();
        this.setArtifactsTransformationsCommandStep();
        this.setArtifactDestinationPathCommandStep();
        for (let artifactType of this.abstractArtifactConstituents) {
            if (artifactType === 'migration') {
                const tableName = CmmaConfigurationActions_1.default.transformLabel({
                    label: this.name,
                    transformations: {
                        pattern: 'camelcase',
                        form: 'plural',
                    },
                });
                this.setArtifactTemplateData({
                    artifactType,
                    templateData: {
                        toClassName() {
                            return function () {
                                const migrationClassName = Helpers_1.string.camelCase(tableName);
                                return `${migrationClassName.charAt(0).toUpperCase()}${migrationClassName.slice(1)}`;
                            };
                        },
                        toTableName() {
                            return function () {
                                return Helpers_1.string.snakeCase(tableName);
                            };
                        },
                    },
                });
                continue;
            }
            this.setArtifactTemplateData({
                artifactType,
                templateData: {},
            });
        }
        await this.generate();
        this.finishCmmaCommand();
    }
}
ModelOptions.commandName = 'cmma:make-db-model';
ModelOptions.description = 'Create a new CMMA Model Options';
ModelOptions.settings = {
    loadApp: false,
    stayAlive: false,
};
__decorate([
    standalone_1.args.string({ description: 'Name of the Model to be Created' }),
    __metadata("design:type", String)
], ModelOptions.prototype, "name", void 0);
exports.default = ModelOptions;
//# sourceMappingURL=DbModel.js.map