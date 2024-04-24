"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CmmaMigratorSource = void 0;
const LucidCommandsUtils_1 = require("../LucidCommandsUtils");
const CmmaNodePathActions_1 = __importDefault(require("../../Actions/CmmaNodePathActions"));
class CmmaMigratorSource {
    constructor(config, app, cmmaConfigObject) {
        this.config = config;
        this.app = app;
        this.cmmaConfigObject = cmmaConfigObject;
    }
    async getDirectoryFiles(directoryPath) {
        const { files } = await (0, LucidCommandsUtils_1.sourceFiles)(this.app.appRoot, directoryPath, this.config.migrations?.naturalSort || false);
        return files;
    }
    getMigrationsPath() {
        const migrationDirectoriesNodePaths = CmmaNodePathActions_1.default.listProjectMigrationsDirectoriesNodePaths(this.cmmaConfigObject);
        const directories = migrationDirectoriesNodePaths.map((nodePath) => nodePath.getMigrationTypePath());
        const defaultDirectory = this.app.directoriesMap.get('migrations') || 'database/migrations';
        return directories && directories.length ? directories : [`./${defaultDirectory}`];
    }
    async getMigrations() {
        const migrationPaths = this.getMigrationsPath();
        const directories = await Promise.all(migrationPaths.map((directoryPath) => {
            return this.getDirectoryFiles(directoryPath);
        }));
        return directories.reduce((result, directory) => {
            result = result.concat(directory);
            return result;
        }, []);
    }
}
exports.CmmaMigratorSource = CmmaMigratorSource;
//# sourceMappingURL=CmmaMigratorSource.js.map