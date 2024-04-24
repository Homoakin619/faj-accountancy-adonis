"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CmmaNodePath_1 = __importDefault(require("../Models/CmmaNodePath"));
const CmmaContextActions_1 = __importDefault(require("./CmmaContextActions"));
const CmmaProjectMapActions_1 = __importDefault(require("./CmmaProjectMapActions"));
class CmmaNodePathActions {
    static getSystemMigrationsNodePath(getSystemMigrationsNodePathOptions) {
        const { systemLabel, configObject, contextLabel } = getSystemMigrationsNodePathOptions;
        return new CmmaNodePath_1.default(configObject)
            .buildPath()
            .toContext(contextLabel)
            .toSystem(systemLabel)
            .toArtifactsDir('migrations');
    }
    static getSystemSeedersNodePath(getSystemSeedersNodePathOptions) {
        const { systemLabel, configObject, contextLabel } = getSystemSeedersNodePathOptions;
        return new CmmaNodePath_1.default(configObject)
            .buildPath()
            .toContext(contextLabel)
            .toSystem(systemLabel)
            .toArtifactsDir('seeders');
    }
    static listContextMigrationsNodePaths(listContextMigrationDirectoriesNodePathsOptions) {
        const { contextLabel, configObject } = listContextMigrationDirectoriesNodePathsOptions;
        const contextMap = CmmaProjectMapActions_1.default.getContextMapByLabel({
            contextLabel,
            projectMap: configObject.projectMap,
        });
        const systemContextLabels = CmmaContextActions_1.default.listSystemsInContext(contextMap);
        return systemContextLabels.map((systemLabel) => this.getSystemMigrationsNodePath({
            systemLabel,
            contextLabel,
            configObject,
        }));
    }
    static listContextSeedersNodePath(listContextSeedersNodePathOptions) {
        const { contextLabel, configObject } = listContextSeedersNodePathOptions;
        const contextMap = CmmaProjectMapActions_1.default.getContextMapByLabel({
            contextLabel,
            projectMap: configObject.projectMap,
        });
        const systemContextLabels = CmmaContextActions_1.default.listSystemsInContext(contextMap);
        return systemContextLabels.map((systemLabel) => this.getSystemSeedersNodePath({
            systemLabel,
            contextLabel,
            configObject,
        }));
    }
    static listProjectMigrationsDirectoriesNodePaths(configObject) {
        const projectContexts = CmmaProjectMapActions_1.default.listContextsInProject(configObject.projectMap);
        return projectContexts
            .map((contextLabel) => this.listContextMigrationsNodePaths({
            contextLabel,
            configObject,
        }))
            .flat();
    }
    static listProjectSeedersDirectoriesNodePaths(configObject) {
        const projectContexts = CmmaProjectMapActions_1.default.listContextsInProject(configObject.projectMap);
        return projectContexts
            .map((contextLabel) => this.listContextSeedersNodePath({
            contextLabel,
            configObject,
        }))
            .flat();
    }
}
exports.default = CmmaNodePathActions;
//# sourceMappingURL=CmmaNodePathActions.js.map