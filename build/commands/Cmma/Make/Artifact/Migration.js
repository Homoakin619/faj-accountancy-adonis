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
const CmmaConfigurationActions_1 = __importDefault(require("../../../../cmma/Actions/CmmaConfigurationActions"));
const CmmaSystemActions_1 = __importDefault(require("../../../../cmma/Actions/CmmaSystemActions"));
const Helpers_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Helpers");
const CmmaFileActions_1 = __importDefault(require("../../../../cmma/Actions/CmmaFileActions"));
const CmmaProjectMapActions_1 = __importDefault(require("../../../../cmma/Actions/CmmaProjectMapActions"));
const CmmaContextActions_1 = __importDefault(require("../../../../cmma/Actions/CmmaContextActions"));
class Migration extends BaseCmmaArtifactCommand_1.BaseCmmaArtifactCommand {
    constructor() {
        super(...arguments);
        this.PROJECT_CONFIG = this.projectConfigurationFromFile;
        this.commandShortCode = 'mk|mig';
        this.targetEntity = 'Migration';
        this.artifactType = 'migration';
        this.artifactGroupDir = 'migrations';
    }
    printNotAValidConnection(connection) {
        this.logger.error(`"${connection}" is not a valid connection name. Double check "config/database" file`);
    }
    getTemplateFilePath() {
        const migrationTemplate = this.table ? 'migration-alter.txt' : 'migration-make.txt';
        const templateDir = CmmaFileActions_1.default.getCmmaTemplatesDir(this.application.appRoot);
        templateDir.push(migrationTemplate);
        return CmmaFileActions_1.default.joinPath(templateDir);
    }
    getArtifactTransformations() {
        const transformations = super.getArtifactTransformations();
        transformations.prefix = this.prefix;
        return transformations;
    }
    getTemplateData() {
        const tableName = this.tableName;
        return {
            computedNameWithSuffix: this.computedNameWithSuffix,
            computedNameWithoutSuffix: this.computedNameWithoutSuffix,
            toClassName() {
                return function (filename, render) {
                    const migrationClassName = Helpers_1.string.camelCase(tableName || render(filename).replace(this.prefix, ''));
                    return `${migrationClassName.charAt(0).toUpperCase()}${migrationClassName.slice(1)}`;
                };
            },
            toTableName() {
                return function (filename, render) {
                    return tableName || Helpers_1.string.snakeCase(render(filename).replace(this.prefix, ''));
                };
            },
        };
    }
    async run() {
        await this.ensureConfigFileExistsCommandStep();
        await this.selectContextCommandStep();
        await this.selectSystemCommandStep();
        this.artifactLabel = this.name;
        const migrationLabelTransformation = CmmaConfigurationActions_1.default.getArtifactTypeTransformationWithoutExtension({
            artifactType: 'migration',
            configObject: this.PROJECT_CONFIG,
        });
        let migrationName = CmmaConfigurationActions_1.default.transformLabel({
            label: this.artifactLabel,
            transformations: migrationLabelTransformation,
        });
        if (CmmaSystemActions_1.default.isArtifactInSystemArtifactGroup({
            artifactLabel: migrationName,
            systemMap: this.systemMap,
            artifactsDir: 'migrations',
        })) {
            migrationName = migrationName + '+';
        }
        this.computedNameWithSuffix = migrationName;
        this.computedNameWithoutSuffix = migrationName;
        CmmaSystemActions_1.default.addArtifactToArtifactGroup({
            artifact: migrationName,
            artifactsDir: 'migrations',
            systemMap: this.systemMap,
        });
        const db = this.application.container.use('Adonis/Lucid/Database');
        this.connection = this.connection || db.primaryConnectionName;
        const connection = db.getRawConnection(this.connection || db.primaryConnectionName);
        if (!connection) {
            this.printNotAValidConnection(this.connection);
            this.exitCode = 1;
            return;
        }
        if (this.table && this.create) {
            this.logger.warning('--table and --create cannot be used together. Ignoring --create');
        }
        this.tableName = this.table || this.create || Helpers_1.string.snakeCase(Helpers_1.string.pluralize(this.name));
        this.prefix = `${new Date().getTime()}_`;
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
            CmmaSystemActions_1.default.listSystemArtifactsByGroupLabel({
                systemMap: this.systemMap,
                artifactsDir: this.artifactGroupDir,
            }).length - 1,
        ];
        this.finishCmmaCommand();
    }
}
Migration.commandName = 'cmma:make-migration';
Migration.description = 'Create a new CMMA Migration';
Migration.settings = {
    loadApp: true,
    stayAlive: false,
};
__decorate([
    standalone_1.args.string({ description: 'Name of the Migration to be Created' }),
    __metadata("design:type", String)
], Migration.prototype, "name", void 0);
__decorate([
    standalone_1.flags.string({
        description: 'The connection flag is used to lookup the directory for the migration file',
    }),
    __metadata("design:type", String)
], Migration.prototype, "connection", void 0);
__decorate([
    standalone_1.flags.string({ description: 'Define the table name for creating a new table' }),
    __metadata("design:type", String)
], Migration.prototype, "create", void 0);
__decorate([
    standalone_1.flags.string({ description: 'Define the table name for altering an existing table' }),
    __metadata("design:type", String)
], Migration.prototype, "table", void 0);
exports.default = Migration;
//# sourceMappingURL=Migration.js.map