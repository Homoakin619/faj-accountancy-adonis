"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ArtifactGroupActions {
    static addArtifactToArtifactsGroup(addArtifactToArtifactsGroupOptions) {
        const { artifact, ArtifactsGroup } = addArtifactToArtifactsGroupOptions;
        ArtifactsGroup.push(artifact);
    }
    static getArtifactByLabel(getArtifactByLabelOptions) {
        const { artifactLabel, ArtifactsGroup } = getArtifactByLabelOptions;
        return ArtifactsGroup.filter((artifacts) => artifacts === artifactLabel);
    }
    static getArtifactByIndex(getArtifactByIndexOptions) {
        const { artifactIndex, ArtifactsGroup } = getArtifactByIndexOptions;
        return ArtifactsGroup[artifactIndex];
    }
    static deleteArtifactFromArtifactsGroupByLabel(deleteArtifactFromArtifactsGroupByLabelOptions) {
        const { artifactLabel, ArtifactsGroup } = deleteArtifactFromArtifactsGroupByLabelOptions;
        const buffer = ArtifactsGroup.filter((artifact) => artifact !== artifactLabel);
        Object.assign(ArtifactsGroup, buffer);
    }
    static deleteArtifactFromArtifactGroupByIndex(deleteArtifactFromArtifactGroupByIndexOptions) {
        const { artifactIndex, ArtifactsGroup } = deleteArtifactFromArtifactGroupByIndexOptions;
        const artifactLabel = ArtifactsGroup[artifactIndex];
        return this.deleteArtifactFromArtifactsGroupByLabel({
            artifactLabel,
            ArtifactsGroup,
        });
    }
    static isArtifactInArtifactsGroup(isArtifactInArtifactsGroupOptions) {
        const { artifactLabel, ArtifactsGroup } = isArtifactInArtifactsGroupOptions;
        return ArtifactsGroup.includes(artifactLabel);
    }
    static blankArtifactsGroup() {
        return [];
    }
}
exports.default = ArtifactGroupActions;
//# sourceMappingURL=CmmaArtifactsGroupActions.js.map