"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CmmaNode_1 = __importDefault(require("./CmmaNode"));
const CmmaConfigurationActions_1 = __importDefault(require("../Actions/CmmaConfigurationActions"));
const CmmaFileActions_1 = __importDefault(require("../Actions/CmmaFileActions"));
const CmmaSystemActions_1 = __importDefault(require("../Actions/CmmaSystemActions"));
const CmmaProjectMapActions_1 = __importDefault(require("../Actions/CmmaProjectMapActions"));
const CmmaContextActions_1 = __importDefault(require("../Actions/CmmaContextActions"));
class CmmaNodePath {
    constructor(cmmaConfiguration) {
        this.cmmaConfiguration = cmmaConfiguration;
        this.nodes = {
            context: undefined,
            system: undefined,
            module: undefined,
            systemArtifactsDir: undefined,
            modelDir: undefined,
            artifact: undefined,
        };
    }
    buildPath() {
        return this;
    }
    toContext(label) {
        const nodeLabel = CmmaConfigurationActions_1.default.resolveIdentifierToCasePattern({
            identifier: label,
            casePattern: this.cmmaConfiguration.defaultCasePattern,
        });
        this.nodes.context = new CmmaNode_1.default(nodeLabel);
        return this;
    }
    toSystem(label) {
        const nodeLabel = CmmaConfigurationActions_1.default.resolveIdentifierToCasePattern({
            identifier: label,
            casePattern: this.cmmaConfiguration.defaultCasePattern,
        });
        this.nodes.system = new CmmaNode_1.default(nodeLabel);
        return this;
    }
    toArtifactsDir(label) {
        const nodeLabel = CmmaConfigurationActions_1.default.resolveIdentifierToCasePattern({
            identifier: label,
            casePattern: this.cmmaConfiguration.defaultCasePattern,
        });
        this.nodes.systemArtifactsDir = new CmmaNode_1.default(nodeLabel);
        return this;
    }
    toModelDir(label) {
        const nodeLabel = CmmaConfigurationActions_1.default.resolveIdentifierToCasePattern({
            identifier: label,
            casePattern: this.cmmaConfiguration.defaultCasePattern,
        });
        this.nodes.modelDir = new CmmaNode_1.default(nodeLabel);
        return this;
    }
    toModule(label) {
        const nodeLabel = CmmaConfigurationActions_1.default.resolveIdentifierToCasePattern({
            identifier: label,
            casePattern: this.cmmaConfiguration.defaultCasePattern,
        });
        this.nodes.module = new CmmaNode_1.default(nodeLabel);
        return this;
    }
    toArtifactWithExtension(toArtifactWithExtensionOptions) {
        const { artifactLabel, artifactType } = toArtifactWithExtensionOptions;
        const artifactTransformation = CmmaConfigurationActions_1.default.getArtifactTypeTransformationWithExtension({
            artifactType,
            configObject: this.cmmaConfiguration,
        });
        const transformedArtifactLabel = CmmaConfigurationActions_1.default.transformLabel({
            label: artifactLabel,
            transformations: artifactTransformation,
        });
        this.nodes.artifact = new CmmaNode_1.default(transformedArtifactLabel);
        return this;
    }
    toArtifactWithoutExtension(toArtifactWithoutExtensionOptions) {
        const { artifactLabel, artifactType } = toArtifactWithoutExtensionOptions;
        const artifactTransformation = CmmaConfigurationActions_1.default.getArtifactTypeTransformationWithoutExtension({
            artifactType,
            configObject: this.cmmaConfiguration,
        });
        const transformedArtifactLabel = CmmaConfigurationActions_1.default.transformLabel({
            label: artifactLabel,
            transformations: artifactTransformation,
        });
        this.nodes.artifact = new CmmaNode_1.default(transformedArtifactLabel);
        return this;
    }
    get path() {
        const nodePath = [];
        if (this.nodes.context) {
            nodePath.push(this.nodes.context.label);
        }
        if (this.nodes.system) {
            nodePath.push(this.nodes.system.label);
        }
        if (this.nodes.systemArtifactsDir) {
            nodePath.push(this.nodes.systemArtifactsDir.label);
        }
        if (this.nodes.module) {
            nodePath.push(this.nodes.module.label);
        }
        if (this.nodes.modelDir) {
            nodePath.push(this.nodes.modelDir.label);
        }
        if (this.nodes.artifact) {
            nodePath.push(this.nodes.artifact.label);
        }
        return nodePath;
    }
    getRelativePath() {
        return this.path.join('/');
    }
    getAbsoluteOsPath(appRoot) {
        return CmmaFileActions_1.default.joinPath([
            appRoot,
            'app',
            this.cmmaConfiguration.defaultProjectRootDirInApp,
            ...this.path,
        ]);
    }
    getMigrationTypePath() {
        return ('./app/' + this.cmmaConfiguration.defaultProjectRootDirInApp + '/' + this.getRelativePath());
    }
    getSeedersTypePath() {
        return ('./app/' + this.cmmaConfiguration.defaultProjectRootDirInApp + '/' + this.getRelativePath());
    }
    getArtifactImportTypePath() {
        return 'App/' + this.cmmaConfiguration.defaultProjectRootDirInApp + '/' + this.getRelativePath();
    }
    findArtifactInContext(findArtifactInContextOptions) {
        const { contextMap, artifactObject } = findArtifactInContextOptions;
        const systemLabels = CmmaContextActions_1.default.listSystemsInContext(contextMap);
        for (let systemLabel of systemLabels) {
            const systemMap = CmmaContextActions_1.default.getContextSystemMapByLabel({
                systemLabel,
                contextMap,
            });
            if (CmmaSystemActions_1.default.isArtifactInSystemArtifactGroup({
                systemMap,
                artifactLabel: artifactObject.artifactLabel,
                artifactsDir: CmmaConfigurationActions_1.default.getDefaultArtifactTypeDir(artifactObject.artifactType),
            })) {
                this.toSystem(systemLabel);
                return this.toContext(contextMap.contextLabel);
            }
        }
        return this;
    }
    findArtifactInProject(artifactObject) {
        const projectMap = this.cmmaConfiguration.projectMap;
        const contextLabels = CmmaProjectMapActions_1.default.listContextsInProject(projectMap);
        contextLabels.forEach((contextLabel) => {
            const contextMap = CmmaProjectMapActions_1.default.getContextMapByLabel({
                contextLabel,
                projectMap,
            });
            this.findArtifactInContext({
                contextMap,
                artifactObject,
            });
            if (this.length)
                return this;
        });
        return this;
    }
    findModuleInProject(moduleLabel) {
        const projectMap = this.cmmaConfiguration.projectMap;
        const contextLabels = CmmaProjectMapActions_1.default.listContextsInProject(projectMap);
        contextLabels.forEach((contextLabel) => {
            const contextMap = CmmaProjectMapActions_1.default.getContextMapByLabel({
                projectMap,
                contextLabel,
            });
            this.findModuleInContext({
                contextMap,
                moduleLabel,
            });
            if (this.length)
                return this;
        });
        return this;
    }
    findModuleInContext(findModuleInContextOptions) {
        const { contextMap, moduleLabel } = findModuleInContextOptions;
        const systemLabels = CmmaContextActions_1.default.listSystemsInContext(contextMap);
        systemLabels.forEach((systemLabel) => {
            const systemMap = CmmaContextActions_1.default.getContextSystemMapByLabel({
                systemLabel,
                contextMap,
            });
            if (CmmaSystemActions_1.default.isModuleInSystem({
                systemMap,
                moduleLabel,
            })) {
                this.toContext(contextMap.contextLabel);
                this.toSystem(systemMap.systemLabel);
                this.toModule(moduleLabel);
                return this;
            }
        });
        return this;
    }
    get systemLabel() {
        return this.nodes.system?.label || undefined;
    }
    get moduleLabel() {
        return this.nodes.module?.label || undefined;
    }
    get artifactLabel() {
        return this.nodes.artifact?.label || undefined;
    }
    get contextLabel() {
        return this.nodes.context?.label || undefined;
    }
    get artifactDirLabel() {
        return this.nodes.systemArtifactsDir?.label || undefined;
    }
    get length() {
        return this.path.length;
    }
}
exports.default = CmmaNodePath;
//# sourceMappingURL=CmmaNodePath.js.map