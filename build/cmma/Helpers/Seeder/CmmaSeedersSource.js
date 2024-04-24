"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CmmaSeedersSource = void 0;
const LucidCommandsUtils_1 = require("../LucidCommandsUtils");
const CmmaNodePathActions_1 = __importDefault(require("../../Actions/CmmaNodePathActions"));
class CmmaSeedersSource {
    constructor(app, cmmaConfigObject) {
        this.app = app;
        this.cmmaConfigObject = cmmaConfigObject;
    }
    async getDirectoryFiles(directoryPath) {
        const { files } = await (0, LucidCommandsUtils_1.sourceFiles)(this.app.appRoot, directoryPath, false);
        return files;
    }
    getSeedersPaths() {
        const seedersDirectoriesNodePath = CmmaNodePathActions_1.default.listProjectSeedersDirectoriesNodePaths(this.cmmaConfigObject);
        const directories = seedersDirectoriesNodePath.map((nodePath) => nodePath.getSeedersTypePath());
        const defaultDirectory = this.app.directoriesMap.get('seeds') || 'database/seeders';
        return directories && directories.length ? directories : [`./${defaultDirectory}`];
    }
    async getSeeders() {
        const seedersPaths = this.getSeedersPaths();
        const directories = await Promise.all(seedersPaths.map((directoryPath) => {
            return this.getDirectoryFiles(directoryPath);
        }));
        return directories.reduce((result, directory) => {
            result = result.concat(directory);
            return result;
        }, []);
    }
}
exports.CmmaSeedersSource = CmmaSeedersSource;
//# sourceMappingURL=CmmaSeedersSource.js.map