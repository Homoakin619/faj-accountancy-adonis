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
Object.defineProperty(exports, "__esModule", { value: true });
const BaseCmmaMigrationCommand_1 = require("../../../cmma/BaseCommands/BaseCmmaMigrationCommand");
const standalone_1 = require("@adonisjs/core/build/standalone");
const CmmaMigratorContract_1 = require("../../../cmma/Helpers/Migration/CmmaMigratorContract");
class Run extends BaseCmmaMigrationCommand_1.BaseCmmaMigrationCommand {
    constructor() {
        super(...arguments);
        this.commandShortCode = 'mig|run';
        this.targetEntity = '';
        this.compactOutput = false;
    }
    instantiateMigrator() {
        const db = this.application.container.use('Adonis/Lucid/Database');
        this.application.container.resolveBinding('Adonis/Lucid/Migrator');
        this.migrator = new CmmaMigratorContract_1.CmmaMigratorContract(db, this.application, {
            direction: 'up',
            connectionName: this.connection,
            dryRun: this.dryRun,
            disableLocks: this.disableLocks,
        }, this.PROJECT_CONFIG);
    }
    async runAsSubCommand() {
        const db = this.application.container.use('Adonis/Lucid/Database');
        this.connection = this.connection || db.primaryConnectionName;
        let continueMigrations = !this.application.inProduction || this.force;
        if (!continueMigrations) {
            continueMigrations = await this.takeProductionConstent();
        }
        if (!continueMigrations) {
            return;
        }
        if (!db.manager.has(this.connection)) {
            this.printNotAValidConnection(this.connection);
            this.exitCode = 1;
            return;
        }
        this.instantiateMigrator();
        console.log('To Run Migrations');
        await this.runMigrations(this.migrator, this.connection);
    }
    async runAsMain() {
        await this.runAsSubCommand();
    }
    async run() {
        await this.ensureConfigFileExistsCommandStep();
        if (this.isMain) {
            await this.runAsMain();
        }
        else {
            await this.runAsSubCommand();
        }
        await this.finishCmmaCommand();
    }
    async completed() {
        if (this.migrator && this.isMain) {
            await this.migrator.close();
        }
    }
}
Run.commandName = 'cmma:migration-run';
Run.description = 'Migrate database by running pending CMMA Migrations';
Run.settings = {
    loadApp: true,
};
__decorate([
    standalone_1.flags.string({ description: 'Define a custom database connection', alias: 'c' }),
    __metadata("design:type", String)
], Run.prototype, "connection", void 0);
__decorate([
    standalone_1.flags.boolean({ description: 'Explicitly force to run migrations in production' }),
    __metadata("design:type", Boolean)
], Run.prototype, "force", void 0);
__decorate([
    standalone_1.flags.boolean({ description: 'Do not run actual queries. Instead view the SQL output' }),
    __metadata("design:type", Boolean)
], Run.prototype, "dryRun", void 0);
__decorate([
    standalone_1.flags.boolean({ description: 'A compact single-line output' }),
    __metadata("design:type", Boolean)
], Run.prototype, "compactOutput", void 0);
__decorate([
    standalone_1.flags.boolean({ description: 'Disable locks acquired to run migrations safely' }),
    __metadata("design:type", Boolean)
], Run.prototype, "disableLocks", void 0);
exports.default = Run;
//# sourceMappingURL=Run.js.map