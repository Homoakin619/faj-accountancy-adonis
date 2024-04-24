"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const slash_1 = __importDefault(require("slash"));
const path_1 = require("path");
const standalone_1 = require("@adonisjs/core/build/standalone");
const BaseCmmaCommand_1 = require("../../../cmma/BaseCommands/BaseCmmaCommand");
class DbSeed extends BaseCmmaCommand_1.BaseCmmaCommand {
    constructor() {
        super(...arguments);
        this.commandShortCode = 'db|seed';
        this.targetEntity = '';
        this.hasError = false;
        this.files = [];
        this.compactOutput = false;
        this.PROJECT_CONFIG = this.projectConfigurationFromFile;
    }
    printLogMessage(file) {
        const colors = this['colors'];
        let color = 'gray';
        let message = '';
        let prefix = '';
        switch (file.status) {
            case 'pending':
                message = 'pending  ';
                color = 'gray';
                break;
            case 'failed':
                message = 'error    ';
                prefix = file.error.message;
                color = 'red';
                break;
            case 'ignored':
                message = 'ignored  ';
                prefix = 'Enabled only in development environment';
                color = 'dim';
                break;
            case 'completed':
                message = 'completed';
                color = 'green';
                break;
        }
        console.log(`${colors[color]('❯')} ${colors[color](message)} ${file.file.name}`);
        if (prefix) {
            console.log(`  ${colors[color](prefix)}`);
        }
    }
    printNotAValidConnection(connection) {
        this.logger.error(`"${connection}" is not a valid connection name. Double check "config/database" file`);
    }
    printNotAValidFile(fileName) {
        this.printLogMessage({
            file: {
                name: fileName,
                absPath: fileName,
                getSource: () => { },
            },
            status: 'failed',
            error: new Error('Invalid file path. Pass relative path from the application root'),
        });
    }
    async getCherryPickedFiles(seedersFiles) {
        if (this.files.length) {
            return this.files.map((file) => {
                const fileExt = (0, path_1.extname)(file);
                return (fileExt ? file.replace(fileExt, '') : file).replace(/^\.\/|^\.\\\\/, '');
            });
        }
        else if (this.interactive) {
            return await this.prompt.multiple('Select files to run', seedersFiles.map((file) => {
                return { name: file.name };
            }));
        }
        const filesToSeed = [];
        for (let file of seedersFiles) {
            if (file.name.includes('Appwrite'))
                continue;
            filesToSeed.push(file.name);
        }
        return filesToSeed;
    }
    async instantiateSeeder() {
        const db = this.application.container.use('Adonis/Lucid/Database');
        const { CmmaSeedsRunner } = await Promise.resolve().then(() => __importStar(require('../../../cmma/Helpers/Seeder/CmmaSeedsRunner')));
        this.seeder = new CmmaSeedsRunner(db, this.application, this.PROJECT_CONFIG, this.connection);
    }
    async executedSeeders(selectedSeederFiles, files) {
        const seedersResults = [];
        for (let fileName of selectedSeederFiles) {
            const sourceFile = files.find(({ name }) => (0, slash_1.default)(fileName) === (0, slash_1.default)(name));
            if (!sourceFile) {
                this.printNotAValidFile(fileName);
                this.hasError = true;
                return;
            }
            const response = await this.seeder.run(sourceFile);
            if (response.status === 'failed') {
                this.hasError = true;
            }
            if (!this.compactOutput) {
                this.printLogMessage(response);
            }
            seedersResults.push(response);
        }
        return seedersResults;
    }
    logCompactFinalStatus(seedersResults) {
        const countByStatus = seedersResults.reduce((acc, value) => {
            acc[value.status] = acc[value.status] + 1;
            return acc;
        }, { completed: 0, failed: 0, ignored: 0, pending: 0 });
        let message = `❯ Executed ${countByStatus.completed} seeders`;
        if (countByStatus.failed) {
            message += `, ${countByStatus.failed} failed`;
        }
        if (countByStatus.ignored) {
            message += `, ${countByStatus.ignored} ignored`;
        }
        const color = countByStatus.failed ? 'red' : 'grey';
        this.logger.log(this.colors[color](message));
        if (countByStatus.failed > 0) {
            const erroredSeeder = seedersResults.find((seeder) => seeder.status === 'failed');
            const seederName = this.colors.grey(erroredSeeder.file.name + ':');
            const error = this.colors.red(erroredSeeder.error.message);
            this.logger.log(`${seederName} ${error}\n`);
        }
    }
    async runAsSubCommand() {
        const db = this.application.container.use('Adonis/Lucid/Database');
        this.connection = this.connection || db.primaryConnectionName;
        if (!db.manager.has(this.connection)) {
            this.printNotAValidConnection(this.connection);
            this.exitCode = 1;
            return;
        }
        if (this.files && this.interactive) {
            this.logger.warning('Cannot use "--interactive" and "--files" together. Ignoring "--interactive"');
        }
        await this.instantiateSeeder();
        const files = await this.seeder.getList();
        const cherryPickedFiles = await this.getCherryPickedFiles(files);
        const result = await this.executedSeeders(cherryPickedFiles, files);
        if (this.compactOutput && result) {
            this.logCompactFinalStatus(result);
        }
        this.exitCode = this.hasError ? 1 : 0;
    }
    async runAsMain() {
        await this.runAsSubCommand();
    }
    async run() {
        if (this.isMain) {
            await this.runAsMain();
        }
        else {
            await this.runAsSubCommand();
        }
    }
    async completed() {
        if (this.seeder && this.isMain) {
            await this.seeder.close();
        }
    }
}
DbSeed.commandName = 'cmma:db-seed';
DbSeed.description = 'Execute database seeders';
DbSeed.settings = {
    loadApp: true,
};
__decorate([
    standalone_1.flags.string({ description: 'Define a custom database connection for the seeders', alias: 'c' }),
    __metadata("design:type", String)
], DbSeed.prototype, "connection", void 0);
__decorate([
    standalone_1.flags.boolean({ description: 'Run seeders in interactive mode', alias: 'i' }),
    __metadata("design:type", Boolean)
], DbSeed.prototype, "interactive", void 0);
__decorate([
    standalone_1.flags.array({ description: 'Define a custom set of seeders files names to run', alias: 'f' }),
    __metadata("design:type", Array)
], DbSeed.prototype, "files", void 0);
__decorate([
    standalone_1.flags.boolean({ description: 'A compact single-line output' }),
    __metadata("design:type", Boolean)
], DbSeed.prototype, "compactOutput", void 0);
exports.default = DbSeed;
//# sourceMappingURL=DbSeed.js.map