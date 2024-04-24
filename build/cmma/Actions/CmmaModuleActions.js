"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CmmaModuleActions {
    static addModuleControllerToModule(addModuleControllerToModuleOptions) {
        const { controller, moduleMap } = addModuleControllerToModuleOptions;
        moduleMap.controllers.push(controller);
    }
    static addModuleValidatorToModule(addModuleValidatorToModuleOptions) {
        const { validator, moduleMap } = addModuleValidatorToModuleOptions;
        moduleMap.validators.push(validator);
    }
    static addArtifactToModule(addArtifactToModuleOptions) {
        const { artifact, artifactsDir, moduleMap } = addArtifactToModuleOptions;
        moduleMap[artifactsDir].push(artifact);
    }
    static listModuleControllers(module) {
        return module.controllers;
    }
    static listModuleValidators(module) {
        return module.validators;
    }
    static listModuleArtifactsByDirLabel(listModuleArtifactsByTypeOptions) {
        const { moduleMap, artifactsDir } = listModuleArtifactsByTypeOptions;
        return moduleMap[artifactsDir];
    }
    static isControllerInModule(isControllerInModuleOptions) {
        const { controllerLabel, moduleMap } = isControllerInModuleOptions;
        return this.listModuleControllers(moduleMap).includes(controllerLabel);
    }
    static isValidatorInModule(isValidatorInModuleOptions) {
        const { validatorLabel, moduleMap } = isValidatorInModuleOptions;
        return this.listModuleValidators(moduleMap).includes(validatorLabel);
    }
    static isModuleArtifactInArtifactDir(isModuleArtifactInArtifactDirOptions) {
        const { artifactsDir, artifactLabel, moduleMap } = isModuleArtifactInArtifactDirOptions;
        return this.listModuleArtifactsByDirLabel({ artifactsDir, moduleMap }).includes(artifactLabel);
    }
    static deleteModuleArtifactFromArtifactDir(deleteModuleArtifactFromArtifactDirOptions) {
        const { artifactDir, artifactLabel, moduleMap } = deleteModuleArtifactFromArtifactDirOptions;
        const artifactsInDir = this.listModuleArtifactsByDirLabel({
            moduleMap,
            artifactsDir: artifactDir,
        });
        const artifactIndex = artifactsInDir.indexOf(artifactLabel);
        artifactsInDir.splice(artifactIndex, 1);
    }
    static get blankModuleMap() {
        return { controllers: [], validators: [], moduleLabel: '' };
    }
    static whatIsNodePathFromMe(whatIsNodeMapFromMeOptions) {
        const { moduleLabel, artifactLabel } = whatIsNodeMapFromMeOptions;
        const nodeMap = [];
        if (moduleLabel) {
            nodeMap.push(moduleLabel);
        }
        if (artifactLabel) {
            nodeMap.push(artifactLabel);
        }
        return nodeMap;
    }
}
exports.default = CmmaModuleActions;
//# sourceMappingURL=CmmaModuleActions.js.map