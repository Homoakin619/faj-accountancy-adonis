"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CmmaArtifactActions {
    static get blankArtifact() {
        return '';
    }
    static whatIsNodePathFromMe(whatIsNodeMapFromMeOptions) {
        const { artifactLabel } = whatIsNodeMapFromMeOptions;
        const nodeMap = [];
        if (artifactLabel) {
            nodeMap.push(artifactLabel);
        }
        return nodeMap;
    }
}
exports.default = CmmaArtifactActions;
//# sourceMappingURL=CmmaArtifactActions.js.map