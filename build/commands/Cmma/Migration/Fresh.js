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
class Refresh extends standalone_1.BaseCommand {
    getArgs() {
        const args = [];
        if (this.force) {
            args.push('--force');
        }
        if (this.connection) {
            args.push(`--connection="${this.connection}"`);
        }
        if (this.disableLocks) {
            args.push('--disable-locks');
        }
        return args;
    }
    getWipeArgs() {
        const args = this.getArgs();
        if (this.dropTypes) {
            args.push('--drop-types');
        }
        if (this.dropViews) {
            args.push('--drop-views');
        }
        return args;
    }
    async runDbWipe() {
        const dbWipe = await this.kernel.exec('db:wipe', this.getWipeArgs());
        this.exitCode = dbWipe.exitCode;
        this.error = dbWipe.error;
    }
    async runMigrations() {
        const migrate = await this.kernel.exec('cmma:migration-run', this.getArgs());
        this.exitCode = migrate.exitCode;
        this.error = migrate.error;
    }
    async runDbSeed() {
        const args = [];
        if (this.connection) {
            args.push(`--connection="${this.connection}"`);
        }
        const dbSeed = await this.kernel.exec('cmma:db-seed', args);
        this.exitCode = dbSeed.exitCode;
        this.error = dbSeed.error;
    }
    async run() {
        await this.runDbWipe();
        if (this.exitCode) {
            return;
        }
        await this.runMigrations();
        if (this.exitCode) {
            return;
        }
        if (this.seed) {
            await this.runDbSeed();
        }
    }
}
Refresh.commandName = 'cmma:migration-fresh';
Refresh.description = 'Drop all tables and re-migrate the database';
Refresh.settings = {
    loadApp: true,
};
__decorate([
    standalone_1.flags.string({ description: 'Define a custom database connection', alias: 'c' }),
    __metadata("design:type", String)
], Refresh.prototype, "connection", void 0);
__decorate([
    standalone_1.flags.boolean({ description: 'Explicitly force command to run in production' }),
    __metadata("design:type", Boolean)
], Refresh.prototype, "force", void 0);
__decorate([
    standalone_1.flags.boolean({ description: 'Run seeders' }),
    __metadata("design:type", Boolean)
], Refresh.prototype, "seed", void 0);
__decorate([
    standalone_1.flags.boolean({ description: 'Drop all views' }),
    __metadata("design:type", Boolean)
], Refresh.prototype, "dropViews", void 0);
__decorate([
    standalone_1.flags.boolean({ description: 'Drop all custom types (Postgres only)' }),
    __metadata("design:type", Boolean)
], Refresh.prototype, "dropTypes", void 0);
__decorate([
    standalone_1.flags.boolean({ description: 'Disable locks acquired to run migrations safely' }),
    __metadata("design:type", Boolean)
], Refresh.prototype, "disableLocks", void 0);
exports.default = Refresh;
//# sourceMappingURL=Fresh.js.map