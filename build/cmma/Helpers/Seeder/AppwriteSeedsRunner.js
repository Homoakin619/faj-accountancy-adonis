"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CmmaNodePath_1 = __importDefault(require("../../Models/CmmaNodePath"));
const CmmaProjectMapActions_1 = __importDefault(require("../../Actions/CmmaProjectMapActions"));
const CmmaContextActions_1 = __importDefault(require("../../Actions/CmmaContextActions"));
const CmmaSystemActions_1 = __importDefault(require("../../Actions/CmmaSystemActions"));
class AppwriteSeedsRunner {
    constructor(cmmaConfiguration, appRoot) {
        this.cmmaConfiguration = cmmaConfiguration;
        this.appRoot = appRoot;
    }
    getSeedsList() {
        const projectAppwriteSeeders = [];
        const projectContexts = CmmaProjectMapActions_1.default.listContextsInProject(this.cmmaConfiguration.projectMap);
        projectContexts.map((contextLabel) => {
            const contextMap = CmmaProjectMapActions_1.default.getContextMapByLabel({
                projectMap: this.cmmaConfiguration.projectMap,
                contextLabel,
            });
            const contextSystems = CmmaContextActions_1.default.listSystemsInContext(contextMap);
            contextSystems.forEach((systemLabel) => {
                const systemMap = CmmaContextActions_1.default.getContextSystemMapByLabel({
                    contextMap,
                    systemLabel,
                });
                const systemAppwriteSeeders = CmmaSystemActions_1.default.listSystemAppwriteSeeders({
                    systemMap,
                    configObject: this.cmmaConfiguration,
                });
                systemAppwriteSeeders.forEach((appwriteSeeder) => {
                    const seederNodePath = new CmmaNodePath_1.default(this.cmmaConfiguration)
                        .buildPath()
                        .toContext(contextLabel)
                        .toSystem(systemLabel)
                        .toArtifactsDir('seeders')
                        .toArtifactWithoutExtension({
                        artifactType: 'file',
                        artifactLabel: appwriteSeeder,
                    });
                    projectAppwriteSeeders.push(seederNodePath);
                });
            });
        });
        return projectAppwriteSeeders.map((seederPath) => seederPath.getAbsoluteOsPath(this.appRoot));
    }
    async run() {
    }
}
exports.default = AppwriteSeedsRunner;
//# sourceMappingURL=AppwriteSeedsRunner.js.map