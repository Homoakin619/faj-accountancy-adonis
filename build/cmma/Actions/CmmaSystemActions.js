"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CmmaConfigurationActions_1 = __importDefault(require("./CmmaConfigurationActions"));
class CmmaSystemActions {
    static addModuleToSystem(addModuleToSystemOptions) {
        const { moduleLabel, module, systemMap } = addModuleToSystemOptions;
        Object.assign(systemMap.modules, {
            [moduleLabel]: module,
        });
    }
    static getModuleIndexByLabel(getModuleIndexByLabelOptions) {
        const { systemMap, moduleLabel } = getModuleIndexByLabelOptions;
        return this.listModulesInSystem(systemMap).indexOf(moduleLabel);
    }
    static listModulesInSystem(system) {
        return Object.keys(system.modules);
    }
    static listSystemArtifactGroups(system) {
        return Object.keys(system.systemArtifacts);
    }
    static listSystemAbstractArtifactGroups(system) {
        return Object.keys(system.abstractArtifacts);
    }
    static listSystemArtifactsByGroupLabel(listSystemArtifactsByGroupLabelOptions) {
        const { systemMap, artifactsDir } = listSystemArtifactsByGroupLabelOptions;
        return systemMap.systemArtifacts[artifactsDir];
    }
    static listSystemAbstractArtifactsByGroupLabel(listSystemAbstractArtifactsByGroupLabelOptions) {
        const { systemMap, abstractArtifactGroupLabel } = listSystemAbstractArtifactsByGroupLabelOptions;
        return systemMap.abstractArtifacts[abstractArtifactGroupLabel];
    }
    static addArtifactToArtifactGroup(addArtifactToArtifactGroupOptions) {
        const { artifact, artifactsDir, systemMap } = addArtifactToArtifactGroupOptions;
        const artifactGroup = this.listSystemArtifactsByGroupLabel({
            artifactsDir,
            systemMap,
        });
        artifactGroup.push(artifact);
    }
    static addAbstractArtifactToAbstractArtifactGroup(addAbstractArtifactToAbstractArtifactGroupOptions) {
        const { abstractArtifact, abstractArtifactGroupLabel, systemMap } = addAbstractArtifactToAbstractArtifactGroupOptions;
        const abstractArtifactGroup = this.listSystemAbstractArtifactsByGroupLabel({
            abstractArtifactGroupLabel,
            systemMap,
        });
        abstractArtifactGroup.push(abstractArtifact);
    }
    static getArtifactObjectFromArtifactGroupByLabel(getArtifactObjectFromArtifactGroupOptions) {
        const { artifactLabel, artifactGroupLabel, system } = getArtifactObjectFromArtifactGroupOptions;
        const artifactGroup = this.listSystemArtifactsByGroupLabel({
            artifactsDir: artifactGroupLabel,
            systemMap: system,
        });
        const buffer = artifactGroup.filter((artifact) => artifact === artifactLabel);
        return buffer[0];
    }
    static getAbstractArtifactFromAbstractArtifactGroupByLabel(getAbstractArtifactFromAbstractArtifactGroupByLabelOptions) {
        const { abstractArtifact, abstractArtifactGroupLabel, systemMap } = getAbstractArtifactFromAbstractArtifactGroupByLabelOptions;
        const abstractArtifactsGroup = this.listSystemAbstractArtifactsByGroupLabel({
            abstractArtifactGroupLabel,
            systemMap,
        });
        return abstractArtifactsGroup[abstractArtifactsGroup.indexOf(abstractArtifact)];
    }
    static getArtifactObjectFromArtifactGroupByIndex(getArtifactObjectFromArtifactGroupByIndexOptions) {
        const { artifactIndex, artifactGroupLabel, system } = getArtifactObjectFromArtifactGroupByIndexOptions;
        const artifactGroup = this.listSystemArtifactsByGroupLabel({
            artifactsDir: artifactGroupLabel,
            systemMap: system,
        });
        return artifactGroup[artifactIndex];
    }
    static getAbstractArtifactFromAbstractArtifactGroupByIndex(getAbstractArtifactFromAbstractArtifactGroupByLabelOptions) {
        const { abstractArtifactIndex, abstractArtifactGroupLabel, systemMap } = getAbstractArtifactFromAbstractArtifactGroupByLabelOptions;
        const abstractArtifactsGroup = this.listSystemAbstractArtifactsByGroupLabel({
            abstractArtifactGroupLabel,
            systemMap,
        });
        return abstractArtifactsGroup[abstractArtifactIndex];
    }
    static deleteArtifactObjectFromArtifactGroupByLabel(deleteArtifactObjectFromArtifactGroupOptions) {
        const { artifactLabel, artifactDir, systemMap } = deleteArtifactObjectFromArtifactGroupOptions;
        const artifactGroup = this.listSystemArtifactsByGroupLabel({
            artifactsDir: artifactDir,
            systemMap: systemMap,
        });
        const artifactIndex = artifactGroup.indexOf(artifactLabel);
        artifactGroup.splice(artifactIndex, 1);
    }
    static deleteAbstractArtifactFromAbstractArtifactGroupByLabel(deleteAbstractArtifactFromAbstractArtifactGroupByLabelOptions) {
        const { abstractArtifactLabel, abstractArtifactGroupLabel, systemMap } = deleteAbstractArtifactFromAbstractArtifactGroupByLabelOptions;
        const abstractArtifactGroup = this.listSystemAbstractArtifactsByGroupLabel({
            abstractArtifactGroupLabel,
            systemMap,
        });
        const artifactIndex = abstractArtifactGroup.indexOf(abstractArtifactLabel);
        abstractArtifactGroup.splice(artifactIndex, 1);
    }
    static deleteArtifactObjectFromArtifactGroupByIndex(deleteArtifactObjectFromArtifactGroupByIndexOptions) {
        const { artifactIndex, artifactGroupLabel, system } = deleteArtifactObjectFromArtifactGroupByIndexOptions;
        const artifactGroup = this.listSystemArtifactsByGroupLabel({
            artifactsDir: artifactGroupLabel,
            systemMap: system,
        });
        artifactGroup.splice(artifactIndex, 1);
    }
    static deleteAbstractArtifactFromAbstractArtifactGroupByIndex(deleteAbstractArtifactFromAbstractArtifactGroupByLabelOptions) {
        const { abstractArtifactIndex, abstractArtifactGroupLabel, systemMap } = deleteAbstractArtifactFromAbstractArtifactGroupByLabelOptions;
        const abstractArtifactGroup = this.listSystemAbstractArtifactsByGroupLabel({
            abstractArtifactGroupLabel,
            systemMap,
        });
        abstractArtifactGroup.splice(abstractArtifactIndex, 1);
    }
    static getModuleMapByLabel(getModuleByLabelOptions) {
        const { moduleLabel, systemMap } = getModuleByLabelOptions;
        return systemMap.modules[moduleLabel];
    }
    static getSystemArtifactByLabel(getSystemArtifactByLabelOptions) {
        const { system, systemArtifactLabel } = getSystemArtifactByLabelOptions;
        return system.systemArtifacts[systemArtifactLabel];
    }
    static getModuleByIndex(getModuleByIndexOptions) {
        const { moduleIndex, system } = getModuleByIndexOptions;
        const moduleLabels = this.listModulesInSystem(system);
        return this.getModuleMapByLabel({
            moduleLabel: moduleLabels[moduleIndex],
            systemMap: system,
        });
    }
    static getSystemArtifactByIndex(getSystemArtifactByIndexOptions) {
        const { system, systemArtifactIndex, systemArtifactLabel } = getSystemArtifactByIndexOptions;
        const systemArtifactLabels = this.getSystemArtifactByLabel({
            systemArtifactLabel,
            system,
        });
        return this.getSystemArtifactByLabel({
            systemArtifactLabel: systemArtifactLabels[systemArtifactIndex],
            system,
        });
    }
    static deleteModuleByLabel(deleteModuleByLabelOptions) {
        const { moduleLabel, systemMap } = deleteModuleByLabelOptions;
        delete systemMap.modules[moduleLabel];
    }
    static deleteSystemArtifactByLabel(deleteSystemArtifactByLabelOptions) {
        const { systemArtifactLabel, system } = deleteSystemArtifactByLabelOptions;
        delete system.systemArtifacts[systemArtifactLabel];
    }
    static deleteModuleByIndex(deleteModuleByIndexOptions) {
        const { moduleIndex, system } = deleteModuleByIndexOptions;
        const moduleLabels = Object.keys(system.modules);
        return this.deleteModuleByLabel({
            moduleLabel: moduleLabels[moduleIndex],
            systemMap: system,
        });
    }
    static isModuleInSystem(isModuleInSystemOptions) {
        const { moduleLabel, systemMap } = isModuleInSystemOptions;
        return this.listModulesInSystem(systemMap).includes(moduleLabel);
    }
    static isArtifactInSystemArtifactGroup(isSystemArtifactInSystemOptions) {
        const { systemMap, artifactLabel, artifactsDir } = isSystemArtifactInSystemOptions;
        return this.listSystemArtifactsByGroupLabel({
            artifactsDir: artifactsDir,
            systemMap,
        }).includes(artifactLabel);
    }
    static isAbstractArtifactInArtifactGroup(isAbstractArtifactInArtifactGroupOptions) {
        const { abstractArtifactLabel, abstractArtifactGroupLabel, systemMap } = isAbstractArtifactInArtifactGroupOptions;
        return this.listSystemAbstractArtifactsByGroupLabel({
            abstractArtifactGroupLabel,
            systemMap,
        }).includes(abstractArtifactLabel);
    }
    static listSystemAppwriteSeeders(listSystemAppwriteSeedersOptions) {
        const { systemMap, configObject } = listSystemAppwriteSeedersOptions;
        const seeders = this.listSystemArtifactsByGroupLabel({
            systemMap,
            artifactsDir: 'seeders',
        });
        const appwriteLabel = CmmaConfigurationActions_1.default.normalizeProjectIdentifier({
            identifier: 'Appwrite',
            configObject,
        });
        return seeders.filter((seeder) => seeder.includes(appwriteLabel));
    }
    static get blankSystemMap() {
        return {
            systemArtifacts: {
                actions: [],
                helpers: [],
                migrations: [],
                models: [],
                routes: [],
                seeders: [],
                views: [],
                typeChecking: [],
            },
            abstractArtifacts: {},
            modules: {},
            systemLabel: '',
        };
    }
}
exports.default = CmmaSystemActions;
//# sourceMappingURL=CmmaSystemActions.js.map