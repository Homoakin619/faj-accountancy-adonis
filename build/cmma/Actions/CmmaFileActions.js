"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = require("fs-extra");
const prettier_1 = __importDefault(require("prettier"));
const path_1 = require("path");
class CmmaFileActions {
    static appendToFile(appendToFileOptions) {
        const { filePath, text } = appendToFileOptions;
        (0, fs_extra_1.outputFileSync)(filePath, text + '\n', { flag: 'a' });
    }
    static ensureAFileExists(filePath) {
        (0, fs_extra_1.ensureFileSync)(filePath);
    }
    static ensureADirectoryExits(dirPath) {
        (0, fs_extra_1.ensureDirSync)(dirPath);
    }
    static async formatFile(formatFileOptions) {
        const { filePath, parser } = formatFileOptions;
        const fileContents = (0, fs_extra_1.readFileSync)(filePath, 'utf8');
        const formattedCode = prettier_1.default.format(fileContents, {
            parser,
        });
        this.writeToFile({
            filePath,
            text: await formattedCode,
        });
    }
    static writeToFile(writeToFileOptions) {
        const { filePath, text } = writeToFileOptions;
        (0, fs_extra_1.writeFileSync)(filePath, text);
    }
    static createRelativeFilePathFromNodePath(createRelativeFilePathFromNodePathOptions) {
        const { nodePath, noExt } = createRelativeFilePathFromNodePathOptions;
        if (noExt) {
            const lastItem = nodePath.path[nodePath.path.length - 1];
            const splitItem = lastItem.split('.');
            splitItem.pop();
            nodePath[nodePath.path.length - 1] = splitItem[0];
        }
        return nodePath.path.join('/');
    }
    static createAbsolutePathFromNodePath(createAbsolutePathFromNodePathOptions) {
        const { nodePath, projectRootDirInApp, applicationRoot } = createAbsolutePathFromNodePathOptions;
        return CmmaFileActions.joinPath([applicationRoot, 'app', projectRootDirInApp, ...nodePath.path]);
    }
    static joinPath(paths) {
        return (0, path_1.join)(...paths);
    }
    static doesPathExist(path) {
        return (0, fs_extra_1.pathExistsSync)(path);
    }
    static getConfigurationObjectFromFilePath(filePath) {
        return JSON.parse((0, fs_extra_1.readFileSync)(filePath).toString());
    }
    static getCmmaTemplatesDir(appRoot) {
        return [appRoot, 'cmma', 'Templates'];
    }
    static writeConfigObjectToConfigFile(writeConfigObjectToConfigFileOptions) {
        const { configFilePath, configObject } = writeConfigObjectToConfigFileOptions;
        (0, fs_extra_1.writeFileSync)(configFilePath, JSON.stringify(configObject));
        this.formatFile({
            filePath: configFilePath,
            parser: 'json',
        });
    }
    static listFilesInDir(dirPath) {
        const files = (0, fs_extra_1.readdirSync)(dirPath);
        return files.filter((file) => {
            const stat = (0, fs_extra_1.statSync)(dirPath + '/' + file);
            return stat.isFile();
        });
    }
    static listAllFilesInADirIncludingSubDirectories(dirPath, filesArray = []) {
        const files = (0, fs_extra_1.readdirSync)(dirPath);
        files.forEach((file) => {
            const filePath = this.joinPath([dirPath, file]);
            const stat = (0, fs_extra_1.statSync)(filePath);
            if (stat.isDirectory()) {
                this.listAllFilesInADirIncludingSubDirectories(filePath, filesArray);
            }
            else {
                filesArray.push((0, path_1.basename)(filePath));
            }
        });
        return filesArray;
    }
    static listFilesInDirWithoutTheirExtensions(dirPath) {
        const files = (0, fs_extra_1.readdirSync)(dirPath);
        const filesWithExtensions = files.filter((file) => {
            const stat = (0, fs_extra_1.statSync)(dirPath + '/' + file);
            return stat.isFile();
        });
        return filesWithExtensions.map((file) => {
            return file.split('.')[0];
        });
    }
    static listFilesInDirWithExtension(listFilesInDirWithExtensionOptions) {
        const { dirPath, extension } = listFilesInDirWithExtensionOptions;
        const files = (0, fs_extra_1.readdirSync)(dirPath);
        return files.filter((file) => {
            const fileExtension = (0, path_1.extname)(file);
            return fileExtension === extension;
        });
    }
    static listSubDirsInDir(dirPath) {
        const files = (0, fs_extra_1.readdirSync)(dirPath);
        return files.filter((file) => {
            const stat = (0, fs_extra_1.statSync)(dirPath + '/' + file);
            return stat.isDirectory();
        });
    }
    static listContextsOnDisk(projectRootDir) {
        return this.listSubDirsInDir(projectRootDir);
    }
    static listRoutesInSystemRoutesDir(dirPath) {
        const filesInRoutesDir = this.listFilesInDirWithoutTheirExtensions(dirPath);
        return filesInRoutesDir.filter((file) => file !== 'index');
    }
}
exports.default = CmmaFileActions;
//# sourceMappingURL=CmmaFileActions.js.map