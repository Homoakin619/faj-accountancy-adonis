"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseCmmaMigrationCommand = void 0;
const pretty_hrtime_1 = __importDefault(require("pretty-hrtime"));
const LucidCommandsUtils_1 = require("../Helpers/LucidCommandsUtils");
const PrettyPrint_1 = require("../Helpers/PrettyPrint");
const BaseCmmaCommand_1 = require("./BaseCmmaCommand");
class BaseCmmaMigrationCommand extends BaseCmmaCommand_1.BaseCmmaCommand {
    constructor() {
        super(...arguments);
        this.PROJECT_CONFIG = this.projectConfigurationFromFile;
        this.compactOutput = false;
    }
    printNotAValidConnection(connection) {
        this.logger.error(`"${connection}" is not a valid connection name. Double check "config/database" file`);
    }
    async takeProductionConstent() {
        if (!this.isInteractive) {
            return false;
        }
        const question = 'You are in production environment. Want to continue running migrations?';
        try {
            return await this.prompt.confirm(question);
        }
        catch (error) {
            return false;
        }
    }
    printLogMessage(file, direction) {
        const color = file.status === 'pending' ? 'gray' : file.status === 'completed' ? 'green' : 'red';
        const arrow = this.colors[color]('❯');
        const message = file.status === 'pending'
            ? direction === 'up'
                ? 'migrating'
                : 'reverting'
            : file.status === 'completed'
                ? direction === 'up'
                    ? 'migrated'
                    : 'reverted'
                : 'error';
        this.logger.logUpdate(`${arrow} ${this.colors[color](message)} ${file.file.name}`);
    }
    prettyPrintSql(file, connectionName) {
        console.log(this.logger.colors.gray(`------------- ${file.file.name} -------------`));
        console.log();
        file.queries.map((sql) => {
            (0, PrettyPrint_1.prettyPrint)({
                connection: connectionName,
                sql: sql,
                ddl: true,
                method: (0, LucidCommandsUtils_1.getDDLMethod)(sql),
                bindings: [],
            });
            console.log();
        });
        console.log(this.logger.colors.gray('------------- END -------------'));
    }
    logVerboseFinalStatus(migrator, duration) {
        switch (migrator.status) {
            case 'completed':
                const completionMessage = migrator.direction === 'up' ? 'Migrated in' : 'Reverted in';
                console.log(`\n${completionMessage} ${this.colors.cyan((0, pretty_hrtime_1.default)(duration))}`);
                break;
            case 'skipped':
                const message = migrator.direction === 'up' ? 'Already up to date' : 'Already at latest batch';
                console.log(this.colors.cyan(message));
                break;
            case 'error':
                this.logger.fatal(migrator.error);
                this.exitCode = 1;
                break;
        }
    }
    logCompactFinalStatus(processedFiles, migrator, duration) {
        let output = '';
        let message = '';
        let isUp = migrator.direction === 'up';
        switch (migrator.status) {
            case 'completed':
                message = `❯ ${isUp ? 'Executed' : 'Reverted'} ${processedFiles.size} migrations`;
                output = this.colors.grey(message + ` (${(0, pretty_hrtime_1.default)(duration)})`);
                break;
            case 'skipped':
                message = `❯ ${isUp ? 'Already up to date' : 'Already at latest batch'}`;
                output = this.colors.grey(message);
                break;
            case 'error':
                const skippedMigrations = Object.values(migrator.migratedFiles).filter((file) => file.status === 'pending').length;
                message = `❯ Executed ${processedFiles.size} migrations, 1 error, ${skippedMigrations} skipped`;
                console.log(this.colors.red(message));
                console.log('\n' + this.colors.red(migrator.error.message));
                this.exitCode = 1;
                break;
        }
        this.logger.log(output);
    }
    async runMigrations(migrator, connectionName) {
        if (migrator.dryRun) {
            await migrator.run();
            Object.keys(migrator.migratedFiles).forEach((file) => {
                this.prettyPrintSql(migrator.migratedFiles[file], connectionName);
            });
            return;
        }
        const processedFiles = new Set();
        let start;
        let duration;
        migrator.on('migration:start', (file) => {
            processedFiles.add(file.file.name);
            if (!this.compactOutput) {
                this.printLogMessage(file, migrator.direction);
            }
        });
        migrator.on('migration:completed', (file) => {
            if (!this.compactOutput) {
                this.printLogMessage(file, migrator.direction);
                this.logger.logUpdatePersist();
            }
        });
        migrator.on('migration:error', (file) => {
            if (!this.compactOutput) {
                this.printLogMessage(file, migrator.direction);
                this.logger.logUpdatePersist();
            }
        });
        migrator.on('upgrade:version', ({ from, to }) => {
            this.logger.info(`Upgrading migrations version from "${from}" to "${to}"`);
        });
        migrator.on('start', () => (start = process.hrtime()));
        migrator.on('end', () => (duration = process.hrtime(start)));
        await migrator.run();
        Object.keys(migrator.migratedFiles).forEach((file) => {
            if (!processedFiles.has(file) && !this.compactOutput) {
                this.printLogMessage(migrator.migratedFiles[file], migrator.direction);
            }
        });
        if (this.compactOutput) {
            this.logCompactFinalStatus(processedFiles, migrator, duration);
        }
        else {
            this.logVerboseFinalStatus(migrator, duration);
        }
    }
    get author() {
        return 'ƒa†3.';
    }
}
exports.BaseCmmaMigrationCommand = BaseCmmaMigrationCommand;
//# sourceMappingURL=BaseCmmaMigrationCommand.js.map