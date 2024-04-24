"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CmmaProjectMapActions {
    static addContextToProject(addContextToProjectOptions) {
        const { contextLabel, context, projectMap } = addContextToProjectOptions;
        Object.assign(projectMap.contexts, {
            [contextLabel]: context,
        });
    }
    static getContextIndexByLabel(getContextIndexByLabelOptions) {
        const { contextLabel, projectMap } = getContextIndexByLabelOptions;
        return this.listContextsInProject(projectMap).indexOf(contextLabel);
    }
    static getContextByIndex(getContextObjectByIndexOptions) {
        const { contextIndex, projectMap } = getContextObjectByIndexOptions;
        const contextLabels = Object.keys(projectMap.contexts);
        return projectMap.contexts[contextLabels[contextIndex]];
    }
    static getContextMapByLabel(getContextFromProjectMapOptions) {
        const { projectMap, contextLabel } = getContextFromProjectMapOptions;
        return projectMap.contexts[contextLabel];
    }
    static listContextsInProject(projectMap) {
        return Object.keys(projectMap.contexts);
    }
    static deleteContextByIndex(deleteContextByIndexOptions) {
        const { contextIndex, projectMap } = deleteContextByIndexOptions;
        const contextLabels = Object.keys(projectMap.contexts);
        const contextLabel = contextLabels[contextIndex];
        delete projectMap.contexts[contextLabel];
    }
    static deleteContextByLabel(deleteContextByLabelOptions) {
        const { projectMap, contextLabel } = deleteContextByLabelOptions;
        delete projectMap.contexts[contextLabel];
    }
    static isContextInProject(isContextInProjectOptions) {
        const { contextLabel, projectMap } = isContextInProjectOptions;
        return this.listContextsInProject(projectMap).includes(contextLabel);
    }
    static addArtifactToProject(addArtifactToProjectOptions) {
        const { artifact, projectMap } = addArtifactToProjectOptions;
        projectMap.artifacts.push(artifact);
    }
    static get blankProjectMap() {
        return {
            contexts: {},
            artifacts: [],
        };
    }
}
exports.default = CmmaProjectMapActions;
//# sourceMappingURL=CmmaProjectMapActions.js.map