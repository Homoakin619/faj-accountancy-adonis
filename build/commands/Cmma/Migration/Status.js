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
const standalone_1 = require("@adonisjs/core/build/standalone");
const CmmaMigratorContract_1 = require("../../../cmma/Helpers/Migration/CmmaMigratorContract");
const BaseCmmaCommand_1 = require("../../../cmma/BaseCommands/BaseCmmaCommand");
class Status extends BaseCmmaCommand_1.BaseCmmaCommand {
    constructor() {
        super(...arguments);
        this.PROJECT_CONFIG = this.projectConfigurationFromFile;
        this.commandShortCode = 'mig|sta';
    }
    printNotAValidConnection(connection) {
        this.logger.error(`"${connection}" is not a valid connection name. Double check "config/database" file`);
    }
    colorizeStatus(status) {
        switch (status) {
            case 'pending':
                return this.colors.yellow('pending');
            case 'migrated':
                return this.colors.green('completed');
            case 'corrupt':
                return this.colors.red('corrupt');
        }
    }
    instantiateMigrator() {
        const db = this.application.container.use('Adonis/Lucid/Database');
        this.application.container.resolveBinding('Adonis/Lucid/Migrator');
        this.migrator = new CmmaMigratorContract_1.CmmaMigratorContract(db, this.application, {
            direction: 'up',
            connectionName: this.connection,
        }, this.PROJECT_CONFIG);
    }
    renderList(list) {
        const table = this.ui.table();
        table.head(['Name', 'Status', 'Batch', 'Message']);
        list.forEach((node) => {
            table.row([
                node.name,
                this.colorizeStatus(node.status),
                node.batch ? String(node.batch) : 'NA',
                node.status === 'corrupt' ? 'The migration file is missing on filesystem' : '',
            ]);
        });
        table.render();
    }
    async runAsSubCommand() {
        const db = this.application.container.use('Adonis/Lucid/Database');
        this.connection = this.connection || db.primaryConnectionName;
        if (!db.manager.has(this.connection)) {
            this.printNotAValidConnection(this.connection);
            this.exitCode = 1;
            return;
        }
        this.instantiateMigrator();
        this.renderList(await this.migrator.getList());
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
    }
    async completed() {
        if (this.migrator && this.isMain) {
            await this.migrator.close();
        }
    }
}
Status.commandName = 'cmma:migration-status';
Status.description = 'View migrations status';
Status.settings = {
    loadApp: true,
};
__decorate([
    standalone_1.flags.string({ description: 'Define a custom database connection', alias: 'c' }),
    __metadata("design:type", String)
], Status.prototype, "connection", void 0);
exports.default = Status;
//# sourceMappingURL=Status.js.map