"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseCmmaCommand_1 = require("../../../cmma/BaseCommands/BaseCmmaCommand");
const CmmaProjectMapActions_1 = __importDefault(require("../../../cmma/Actions/CmmaProjectMapActions"));
const CmmaFileActions_1 = __importDefault(require("../../../cmma/Actions/CmmaFileActions"));
const CmmaNodePath_1 = __importDefault(require("../../../cmma/Models/CmmaNodePath"));
const symettericDifferenceOfArrays_1 = __importDefault(require("../../../cmma/Helpers/Utils/symettericDifferenceOfArrays"));
const SystemMessages_1 = require("../../../cmma/Helpers/SystemMessages/SystemMessages");
const CmmaConfigurationActions_1 = __importDefault(require("../../../cmma/Actions/CmmaConfigurationActions"));
const CmmaContextActions_1 = __importDefault(require("../../../cmma/Actions/CmmaContextActions"));
const CmmaSystemActions_1 = __importDefault(require("../../../cmma/Actions/CmmaSystemActions"));
const SystemMessageFunction_1 = require("../../../cmma/Helpers/SystemMessages/SystemMessageFunction");
const CmmaModuleActions_1 = __importDefault(require("../../../cmma/Actions/CmmaModuleActions"));
class ConfigUpdate extends BaseCmmaCommand_1.BaseCmmaCommand {
    constructor() {
        super(...arguments);
        this.PROJECT_CONFIG = this.projectConfigurationFromFile;
        this.commandShortCode = 'up';
    }
    updateProjectContexts() {
        this.addProjectContextsOnDiskToProjectMap();
        this.pruneLooseProjectContextsFromProjectMap();
    }
    addProjectContextsOnDiskToProjectMap() {
        if (!CmmaFileActions_1.default.doesPathExist(this.projectRootPath)) {
            return;
        }
        const contextsOnDisk = CmmaFileActions_1.default.listContextsOnDisk(this.projectRootPath);
        let contextsOnProjectMap = CmmaProjectMapActions_1.default.listContextsInProject(this.projectMap);
        if (!contextsOnDisk || !contextsOnProjectMap)
            return;
        const contextsOnDiskButNotOnMap = (0, symettericDifferenceOfArrays_1.default)(contextsOnDisk, contextsOnProjectMap);
        if (contextsOnDiskButNotOnMap.length) {
            this.logger.info(`${(0, SystemMessageFunction_1.FOUND_NUMBER_OF_ENTITIES_ON_DISK_BUT_NOT_ON_MAP)({
                entityLabel: SystemMessages_1.CONTEXT,
                entityCount: contextsOnDiskButNotOnMap.length,
            })}`);
        }
        contextsOnDiskButNotOnMap.forEach((contextLabel) => {
            const defaultContext = CmmaContextActions_1.default.blankContext;
            defaultContext.contextLabel = contextLabel;
            CmmaProjectMapActions_1.default.addContextToProject({
                context: defaultContext,
                contextLabel: contextLabel,
                projectMap: this.projectMap,
            });
        });
        if (contextsOnDiskButNotOnMap.length) {
            this.logger.info(this.colors.cyan(`${(0, SystemMessageFunction_1.ENTITY_ADDED_TO_PROJECT_MAP)({
                entityCount: contextsOnDiskButNotOnMap.length,
                entityLabel: SystemMessages_1.CONTEXT,
            })}`));
        }
    }
    pruneLooseProjectContextsFromProjectMap() {
        if (!CmmaFileActions_1.default.doesPathExist(this.projectRootPath)) {
            return;
        }
        const contextsOnProjectMap = CmmaProjectMapActions_1.default.listContextsInProject(this.projectMap);
        const contextsOnDisk = CmmaFileActions_1.default.listContextsOnDisk(this.projectRootPath);
        if (!contextsOnProjectMap || !contextsOnDisk)
            return;
        const contextsOnMapNotOnDisk = (0, symettericDifferenceOfArrays_1.default)(contextsOnProjectMap, contextsOnDisk);
        if (contextsOnMapNotOnDisk.length) {
            this.logger.info(`${(0, SystemMessageFunction_1.FOUND_NUMBER_OF_ENTITY_ON_MAP_BUT_NOT_ON_DISK)({
                entityLabel: SystemMessages_1.CONTEXT,
                entityCount: contextsOnMapNotOnDisk.length,
            })}`);
        }
        contextsOnMapNotOnDisk.forEach((contextLabel) => {
            CmmaProjectMapActions_1.default.deleteContextByLabel({
                contextLabel,
                projectMap: this.projectMap,
            });
        });
        if (contextsOnMapNotOnDisk.length) {
            this.logger.info(this.colors.cyan(`${(0, SystemMessageFunction_1.ENTITY_PRUNED_FROM_PROJECT_MAP)({
                entityLabel: SystemMessages_1.CONTEXT,
                entityCount: contextsOnMapNotOnDisk.length,
            })}`));
        }
    }
    updateProjectSystems() {
        const contextLabelsOnDisk = CmmaFileActions_1.default.listContextsOnDisk(this.projectRootPath);
        contextLabelsOnDisk.forEach((contextLabel) => {
            const contextMap = CmmaProjectMapActions_1.default.getContextMapByLabel({
                contextLabel,
                projectMap: this.projectMap,
            });
            this.addContextSystemsOnDiskToProjectMap({
                contextMap,
                diskContextDirLabel: contextLabel,
            });
        });
        const projectContexts = CmmaProjectMapActions_1.default.listContextsInProject(this.projectMap);
        projectContexts.forEach((contextLabel) => {
            const contextMap = CmmaProjectMapActions_1.default.getContextMapByLabel({
                contextLabel,
                projectMap: this.projectMap,
            });
            this.pruneLooseContextSystemsFromProjectMap({
                contextLabel,
                contextMap,
            });
        });
    }
    addContextSystemsOnDiskToProjectMap(addContextSystemsOnDiskToProjectMapOptions) {
        const { diskContextDirLabel, contextMap } = addContextSystemsOnDiskToProjectMapOptions;
        const diskContextDir = new CmmaNodePath_1.default(this.PROJECT_CONFIG)
            .buildPath()
            .toContext(diskContextDirLabel)
            .getAbsoluteOsPath(this.application.appRoot);
        if (!CmmaFileActions_1.default.doesPathExist(diskContextDir)) {
            this.logger.error('Context Dir Does not exist');
            return;
        }
        const systemsOnDisk = CmmaFileActions_1.default.listSubDirsInDir(diskContextDir);
        const systemsOnProjectMap = CmmaContextActions_1.default.listSystemsInContext(contextMap);
        if (!systemsOnDisk || !systemsOnProjectMap)
            return;
        const systemsOnDiskButNotOnProjectMap = (0, symettericDifferenceOfArrays_1.default)(systemsOnDisk, systemsOnProjectMap);
        if (systemsOnDiskButNotOnProjectMap.length) {
            this.logger.info(`${(0, SystemMessageFunction_1.FOUND_NUMBER_OF_ENTITIES_ON_DISK_BUT_NOT_ON_MAP)({
                entityLabel: SystemMessages_1.SYSTEM,
                entityCount: systemsOnDiskButNotOnProjectMap.length,
            })}`);
        }
        systemsOnDiskButNotOnProjectMap.forEach((systemLabel) => {
            const system = CmmaSystemActions_1.default.blankSystemMap;
            system.systemLabel = systemLabel;
            CmmaContextActions_1.default.addSystemToContext({
                system,
                systemLabel,
                contextMap,
            });
        });
        if (systemsOnDiskButNotOnProjectMap.length) {
            this.logger.info(`${this.colors.cyan((0, SystemMessageFunction_1.ENTITY_ADDED_TO_PROJECT_MAP)({
                entityLabel: SystemMessages_1.SYSTEM,
                entityCount: systemsOnDiskButNotOnProjectMap.length,
            }))}`);
        }
    }
    pruneLooseContextSystemsFromProjectMap(pruneLooseContextSystemsFromProjectMapOptions) {
        const { contextLabel, contextMap } = pruneLooseContextSystemsFromProjectMapOptions;
        const diskContextDir = new CmmaNodePath_1.default(this.PROJECT_CONFIG)
            .buildPath()
            .toContext(contextLabel)
            .getAbsoluteOsPath(this.application.appRoot);
        if (!CmmaFileActions_1.default.doesPathExist(diskContextDir)) {
            return;
        }
        const systemsOnProjectMap = CmmaContextActions_1.default.listSystemsInContext(contextMap);
        const systemsOnDisk = CmmaFileActions_1.default.listSubDirsInDir(diskContextDir);
        if (!systemsOnProjectMap || !systemsOnDisk)
            return;
        const systemsOnProjectMapButNotOnDisk = (0, symettericDifferenceOfArrays_1.default)(systemsOnProjectMap, systemsOnDisk);
        if (systemsOnProjectMapButNotOnDisk.length) {
            this.logger.info(`${(0, SystemMessageFunction_1.FOUND_NUMBER_OF_ENTITY_ON_MAP_BUT_NOT_ON_DISK)({
                entityLabel: SystemMessages_1.SYSTEM,
                entityCount: systemsOnProjectMapButNotOnDisk.length,
            })}`);
        }
        systemsOnProjectMapButNotOnDisk.forEach((systemLabel) => {
            CmmaContextActions_1.default.deleteContextSystemByLabel({
                systemLabel,
                contextMap,
            });
        });
        if (systemsOnProjectMapButNotOnDisk.length) {
            this.logger.info(`${this.colors.cyan((0, SystemMessageFunction_1.ENTITY_PRUNED_FROM_PROJECT_MAP)({
                entityLabel: SystemMessages_1.SYSTEM,
                entityCount: systemsOnProjectMapButNotOnDisk.length,
            }))}`);
        }
    }
    updateProjectModules() {
        if (!CmmaFileActions_1.default.doesPathExist(this.projectRootPath)) {
            return;
        }
        const diskContextsLabel = CmmaFileActions_1.default.listSubDirsInDir(this.projectRootPath);
        diskContextsLabel.forEach((diskContextLabel) => {
            return this.updateContextModules(diskContextLabel);
        });
    }
    updateContextModules(diskContextLabel) {
        const contextDir = new CmmaNodePath_1.default(this.PROJECT_CONFIG)
            .buildPath()
            .toContext(diskContextLabel)
            .getAbsoluteOsPath(this.application.appRoot);
        if (!CmmaFileActions_1.default.doesPathExist(contextDir)) {
            return;
        }
        const contextMap = CmmaProjectMapActions_1.default.getContextMapByLabel({
            contextLabel: diskContextLabel,
            projectMap: this.projectMap,
        });
        const diskSystemLabels = CmmaFileActions_1.default.listSubDirsInDir(contextDir);
        diskSystemLabels.forEach((diskSystemLabel) => {
            const systemMap = CmmaContextActions_1.default.getContextSystemMapByLabel({
                contextMap,
                systemLabel: diskSystemLabel,
            });
            this.addSystemModulesOnDiskToProjectMap({
                diskContextLabel,
                diskSystemLabel,
                systemMap,
            });
            this.pruneLooseSystemModulesFromProjectMap({
                diskContextLabel,
                diskSystemLabel,
                systemMap,
            });
        });
    }
    addSystemModulesOnDiskToProjectMap(addSystemModulesOnDiskToProjectMapOptions) {
        const { diskSystemLabel, systemMap, diskContextLabel } = addSystemModulesOnDiskToProjectMapOptions;
        const diskSystemRoutesDir = new CmmaNodePath_1.default(this.PROJECT_CONFIG)
            .buildPath()
            .toContext(diskContextLabel)
            .toSystem(diskSystemLabel)
            .toArtifactsDir('routes')
            .getAbsoluteOsPath(this.application.appRoot);
        if (!CmmaFileActions_1.default.doesPathExist(diskSystemRoutesDir))
            return;
        const routesOnDisk = CmmaFileActions_1.default.listRoutesInSystemRoutesDir(diskSystemRoutesDir);
        const projectRoutesSuffix = CmmaConfigurationActions_1.default.getArtifactTypeTransformationWithoutExtension({
            artifactType: 'route',
            configObject: this.PROJECT_CONFIG,
        });
        const modulesOnDisk = routesOnDisk.map((routeLabel) => {
            return routeLabel.replace(projectRoutesSuffix.suffix, '');
        });
        const modulesOnMap = CmmaSystemActions_1.default.listModulesInSystem(systemMap);
        if (!modulesOnDisk || !modulesOnMap)
            return;
        const routesOnDiskButNotOnMap = (0, symettericDifferenceOfArrays_1.default)(modulesOnDisk, modulesOnMap);
        if (routesOnDiskButNotOnMap.length) {
            if (routesOnDiskButNotOnMap.length) {
                this.logger.info(`${(0, SystemMessageFunction_1.FOUND_NUMBER_OF_ENTITIES_ON_DISK_BUT_NOT_ON_MAP)({
                    entityLabel: SystemMessages_1.MODULE,
                    entityCount: routesOnDiskButNotOnMap.length,
                })}`);
            }
        }
        routesOnDiskButNotOnMap.forEach((moduleLabel) => {
            const module = CmmaModuleActions_1.default.blankModuleMap;
            module.moduleLabel = moduleLabel;
            CmmaSystemActions_1.default.addModuleToSystem({
                systemMap,
                module,
                moduleLabel,
            });
        });
        if (routesOnDiskButNotOnMap.length) {
            this.logger.info(`${this.colors.cyan((0, SystemMessageFunction_1.ENTITY_ADDED_TO_PROJECT_MAP)({
                entityLabel: SystemMessages_1.MODULE,
                entityCount: routesOnDiskButNotOnMap.length,
            }))}`);
        }
    }
    pruneLooseSystemModulesFromProjectMap(pruneLooseContextModulesFromProjectMapOptions) {
        const { diskSystemLabel, systemMap, diskContextLabel } = pruneLooseContextModulesFromProjectMapOptions;
        const modulesOnMap = CmmaSystemActions_1.default.listModulesInSystem(systemMap);
        const diskSystemRoutesDir = new CmmaNodePath_1.default(this.PROJECT_CONFIG)
            .buildPath()
            .toContext(diskContextLabel)
            .toSystem(diskSystemLabel)
            .toArtifactsDir('routes')
            .getAbsoluteOsPath(this.application.appRoot);
        if (!CmmaFileActions_1.default.doesPathExist(diskSystemRoutesDir))
            return;
        const routesOnDisk = CmmaFileActions_1.default.listRoutesInSystemRoutesDir(diskSystemRoutesDir);
        const projectRoutesSuffix = CmmaConfigurationActions_1.default.getArtifactTypeTransformationWithoutExtension({
            artifactType: 'route',
            configObject: this.PROJECT_CONFIG,
        });
        const modulesOnDisk = routesOnDisk.map((routeLabel) => {
            return routeLabel.replace(projectRoutesSuffix.suffix, '');
        });
        if (!modulesOnMap || !modulesOnDisk)
            return;
        const routesOnMapButNotOnDisk = (0, symettericDifferenceOfArrays_1.default)(modulesOnMap, modulesOnDisk);
        if (routesOnMapButNotOnDisk.length) {
            if (routesOnMapButNotOnDisk.length) {
                this.logger.info(`${(0, SystemMessageFunction_1.FOUND_NUMBER_OF_ENTITY_ON_MAP_BUT_NOT_ON_DISK)({
                    entityLabel: SystemMessages_1.MODULE,
                    entityCount: routesOnMapButNotOnDisk.length,
                })}`);
            }
        }
        routesOnMapButNotOnDisk.forEach((moduleLabel) => {
            const module = CmmaModuleActions_1.default.blankModuleMap;
            module.moduleLabel = moduleLabel;
            CmmaSystemActions_1.default.deleteModuleByLabel({
                systemMap,
                moduleLabel,
            });
        });
        if (routesOnMapButNotOnDisk.length) {
            this.logger.info(`${this.colors.cyan((0, SystemMessageFunction_1.ENTITY_PRUNED_FROM_PROJECT_MAP)({
                entityLabel: SystemMessages_1.MODULE,
                entityCount: routesOnMapButNotOnDisk.length,
            }))}`);
        }
    }
    updateProjectModuleArtifacts() {
        if (!CmmaFileActions_1.default.doesPathExist(this.projectRootPath)) {
            return;
        }
        const diskContextsLabel = CmmaFileActions_1.default.listSubDirsInDir(this.projectRootPath);
        diskContextsLabel.forEach((diskContextLabel) => {
            const contextMap = CmmaProjectMapActions_1.default.getContextMapByLabel({
                projectMap: this.projectMap,
                contextLabel: diskContextLabel,
            });
            return this.updateContextModuleArtifacts({
                diskContextLabel,
                contextMap,
            });
        });
    }
    updateContextModuleArtifacts(updateContextModuleArtifactsOptions) {
        const { diskContextLabel, contextMap } = updateContextModuleArtifactsOptions;
        const contextDir = new CmmaNodePath_1.default(this.PROJECT_CONFIG)
            .buildPath()
            .toContext(diskContextLabel)
            .getAbsoluteOsPath(this.application.appRoot);
        if (!CmmaFileActions_1.default.doesPathExist(contextDir))
            return;
        const diskSystemLabels = CmmaFileActions_1.default.listSubDirsInDir(contextDir);
        diskSystemLabels.forEach((diskSystemLabel) => {
            const systemMap = CmmaContextActions_1.default.getContextSystemMapByLabel({
                contextMap,
                systemLabel: diskSystemLabel,
            });
            this.updateSystemModuleArtifacts({
                systemMap,
                diskSystemLabel,
                diskContextLabel,
            });
        });
    }
    updateSystemModuleArtifacts(updateSystemModuleArtifactsOptions) {
        const { systemMap, diskSystemLabel, diskContextLabel } = updateSystemModuleArtifactsOptions;
        const diskSystemRoutesDir = new CmmaNodePath_1.default(this.PROJECT_CONFIG)
            .buildPath()
            .toContext(diskContextLabel)
            .toSystem(diskSystemLabel)
            .toArtifactsDir('routes')
            .getAbsoluteOsPath(this.application.appRoot);
        if (!CmmaFileActions_1.default.doesPathExist(diskSystemRoutesDir))
            return;
        const routesOnDisk = CmmaFileActions_1.default.listRoutesInSystemRoutesDir(diskSystemRoutesDir);
        const projectRoutesSuffix = CmmaConfigurationActions_1.default.getArtifactTypeTransformationWithoutExtension({
            artifactType: 'route',
            configObject: this.PROJECT_CONFIG,
        });
        const modulesOnDisk = routesOnDisk.map((routeLabel) => {
            return routeLabel.replace(projectRoutesSuffix.suffix, '');
        });
        modulesOnDisk.forEach((diskModuleLabel) => {
            const moduleMap = CmmaSystemActions_1.default.getModuleMapByLabel({
                moduleLabel: diskModuleLabel,
                systemMap,
            });
            this.addModuleArtifactOnDiskToProjectMap({
                moduleMap,
                diskContextLabel,
                diskModuleLabel,
                diskSystemLabel,
            });
            this.pruneLooseModuleArtifactFromProjectMap({
                moduleMap,
                diskContextLabel,
                diskModuleLabel,
                diskSystemLabel,
            });
        });
    }
    addModuleArtifactOnDiskToProjectMap(addModuleArtifactOnDiskToProjectMapOptions) {
        const { diskModuleLabel, diskSystemLabel, moduleMap, diskContextLabel } = addModuleArtifactOnDiskToProjectMapOptions;
        for (let moduleInDir of CmmaConfigurationActions_1.default.whatIsDefaultCreateModuleDirIn(this.PROJECT_CONFIG)) {
            const moduleArtifactsDirOnDiskDir = new CmmaNodePath_1.default(this.PROJECT_CONFIG)
                .buildPath()
                .toContext(diskContextLabel)
                .toSystem(diskSystemLabel)
                .toArtifactsDir(moduleInDir)
                .toModule(diskModuleLabel)
                .getAbsoluteOsPath(this.application.appRoot);
            if (!CmmaFileActions_1.default.doesPathExist(moduleArtifactsDirOnDiskDir))
                return;
            const filesInArtifactDir = CmmaFileActions_1.default.listAllFilesInADirIncludingSubDirectories(moduleArtifactsDirOnDiskDir);
            const moduleArtifactsOnDisk = filesInArtifactDir
                .map((file) => file.split('.')[0])
                .filter((filename) => filename !== 'index');
            const moduleArtifactsOnMap = CmmaModuleActions_1.default.listModuleArtifactsByDirLabel({
                artifactsDir: moduleInDir,
                moduleMap,
            });
            if (!moduleArtifactsOnDisk || !moduleArtifactsOnMap)
                return;
            const artifactsOnDiskButNotOnMap = (0, symettericDifferenceOfArrays_1.default)(moduleArtifactsOnDisk, moduleArtifactsOnMap);
            if (artifactsOnDiskButNotOnMap.length) {
                this.logger.info((0, SystemMessageFunction_1.FOUND_NUMBER_OF_ENTITIES_ON_DISK_BUT_NOT_ON_MAP)({
                    entityLabel: SystemMessages_1.ARTIFACT,
                    entityCount: artifactsOnDiskButNotOnMap.length,
                }));
            }
            artifactsOnDiskButNotOnMap.forEach((artifactLabel) => {
                let artifact;
                artifact = artifactLabel;
                CmmaModuleActions_1.default.addArtifactToModule({
                    artifact,
                    artifactsDir: moduleInDir,
                    moduleMap,
                });
            });
            if (artifactsOnDiskButNotOnMap.length) {
                this.logger.info(this.colors.cyan((0, SystemMessageFunction_1.ENTITY_ADDED_TO_PROJECT_MAP)({
                    entityLabel: SystemMessages_1.ARTIFACT,
                    entityCount: artifactsOnDiskButNotOnMap.length,
                })));
            }
        }
    }
    pruneLooseModuleArtifactFromProjectMap(pruneLooseModuleArtifactFromProjectMap) {
        const { diskModuleLabel, diskSystemLabel, moduleMap, diskContextLabel } = pruneLooseModuleArtifactFromProjectMap;
        for (let moduleInDir of CmmaConfigurationActions_1.default.whatIsDefaultCreateModuleDirIn(this.PROJECT_CONFIG)) {
            const moduleArtifactsDirOnDiskDir = new CmmaNodePath_1.default(this.PROJECT_CONFIG)
                .buildPath()
                .toContext(diskContextLabel)
                .toSystem(diskSystemLabel)
                .toArtifactsDir(moduleInDir)
                .toModule(diskModuleLabel)
                .getAbsoluteOsPath(this.application.appRoot);
            if (!CmmaFileActions_1.default.doesPathExist(moduleArtifactsDirOnDiskDir))
                return;
            const moduleArtifactsOnMap = CmmaModuleActions_1.default.listModuleArtifactsByDirLabel({
                artifactsDir: moduleInDir,
                moduleMap,
            });
            const filesInArtifactDir = CmmaFileActions_1.default.listAllFilesInADirIncludingSubDirectories(moduleArtifactsDirOnDiskDir);
            const moduleArtifactsOnDisk = filesInArtifactDir
                .map((file) => file.split('.')[0])
                .filter((filename) => filename !== 'index');
            if (!moduleArtifactsOnMap || !moduleArtifactsOnDisk)
                return;
            const artifactsOnMapButNotOnDisk = (0, symettericDifferenceOfArrays_1.default)(moduleArtifactsOnMap, moduleArtifactsOnDisk);
            if (artifactsOnMapButNotOnDisk.length) {
                this.logger.info((0, SystemMessageFunction_1.FOUND_NUMBER_OF_ENTITY_ON_MAP_BUT_NOT_ON_DISK)({
                    entityLabel: SystemMessages_1.ARTIFACT,
                    entityCount: artifactsOnMapButNotOnDisk.length,
                }));
            }
            artifactsOnMapButNotOnDisk.forEach((artifactLabel) => {
                CmmaModuleActions_1.default.deleteModuleArtifactFromArtifactDir({
                    artifactDir: moduleInDir,
                    moduleMap,
                    artifactLabel,
                });
            });
            if (artifactsOnMapButNotOnDisk.length) {
                this.logger.info(this.colors.cyan((0, SystemMessageFunction_1.ENTITY_PRUNED_FROM_PROJECT_MAP)({
                    entityLabel: SystemMessages_1.ARTIFACT,
                    entityCount: artifactsOnMapButNotOnDisk.length,
                })));
            }
        }
    }
    updateProjectArtifacts() {
        if (!this.projectRootPath)
            return;
        const diskContexts = CmmaFileActions_1.default.listSubDirsInDir(this.projectRootPath);
        diskContexts.forEach((diskContextLabel) => {
            const contextMap = CmmaProjectMapActions_1.default.getContextMapByLabel({
                contextLabel: diskContextLabel,
                projectMap: this.projectMap,
            });
            this.updateContextArtifacts({
                contextMap,
                diskContextLabel,
            });
        });
    }
    updateContextArtifacts(updateContextArtifactsOptions) {
        const { contextMap, diskContextLabel } = updateContextArtifactsOptions;
        const contextDirOnDisk = new CmmaNodePath_1.default(this.PROJECT_CONFIG)
            .buildPath()
            .toContext(diskContextLabel)
            .getAbsoluteOsPath(this.application.appRoot);
        if (!CmmaFileActions_1.default.doesPathExist(contextDirOnDisk))
            return;
        const diskSystems = CmmaFileActions_1.default.listSubDirsInDir(contextDirOnDisk);
        diskSystems.forEach((diskSystemLabel) => {
            const systemMap = CmmaContextActions_1.default.getContextSystemMapByLabel({
                systemLabel: diskSystemLabel,
                contextMap,
            });
            this.updateSystemArtifacts({
                systemMap,
                diskSystemLabel,
                diskContextLabel,
            });
        });
    }
    updateSystemArtifacts(updateSystemArtifactsOptions) {
        const { systemMap, diskSystemLabel, diskContextLabel } = updateSystemArtifactsOptions;
        const diskSystemDir = new CmmaNodePath_1.default(this.PROJECT_CONFIG)
            .buildPath()
            .toContext(diskContextLabel)
            .toSystem(diskSystemLabel)
            .getAbsoluteOsPath(this.application.appRoot);
        if (!CmmaFileActions_1.default.doesPathExist(diskSystemDir))
            return;
        const excludedDirs = ['routes', 'controllers', 'validators'].map((dirLabel) => {
            return CmmaConfigurationActions_1.default.transformLabel({
                label: dirLabel,
                transformations: {
                    pattern: 'camelcase',
                },
            });
        });
        const artifactsDirs = CmmaFileActions_1.default.listSubDirsInDir(diskSystemDir)
            .map((dirLabel) => {
            return CmmaConfigurationActions_1.default.transformLabel({
                label: dirLabel,
                transformations: {
                    pattern: 'camelcase',
                },
            });
        })
            .filter((subDir) => excludedDirs.indexOf(subDir) < 0);
        artifactsDirs.forEach((artifactDir) => {
            this.addSystemArtifactsOnDiskToProjectMap({
                diskArtifactDir: artifactDir,
                systemMap,
                diskSystemLabel,
                diskContextLabel,
            });
        });
        const artifactDirsOnMap = CmmaSystemActions_1.default.listSystemArtifactGroups(systemMap);
        artifactDirsOnMap.forEach((artifactDir) => {
            this.pruneLooseSystemArtifactsFromProjectMap({
                diskArtifactDir: artifactDir,
                systemMap,
                diskContextLabel,
                diskSystemLabel,
            });
        });
    }
    addSystemArtifactsOnDiskToProjectMap(addSystemArtifactsOnDiskToProjectMapOptions) {
        const { diskArtifactDir, systemMap, diskSystemLabel, diskContextLabel } = addSystemArtifactsOnDiskToProjectMapOptions;
        const artifactDir = new CmmaNodePath_1.default(this.PROJECT_CONFIG)
            .buildPath()
            .toContext(diskContextLabel)
            .toSystem(diskSystemLabel)
            .toArtifactsDir(diskArtifactDir)
            .getAbsoluteOsPath(this.application.appRoot);
        if (!CmmaFileActions_1.default.doesPathExist(artifactDir))
            return;
        const filesInArtifactDir = CmmaFileActions_1.default.listAllFilesInADirIncludingSubDirectories(artifactDir);
        const artifactsOnDisk = filesInArtifactDir
            .map((file) => file.split('.')[0])
            .filter((filename) => filename !== 'index');
        const artifactGroup = CmmaSystemActions_1.default.listSystemArtifactsByGroupLabel({
            artifactsDir: diskArtifactDir,
            systemMap,
        });
        if (!artifactsOnDisk || !artifactGroup)
            return;
        const artifactsOnDiskButNotOnMap = (0, symettericDifferenceOfArrays_1.default)(artifactsOnDisk, artifactGroup);
        if (artifactsOnDiskButNotOnMap.length) {
            this.logger.info((0, SystemMessageFunction_1.FOUND_NUMBER_OF_ENTITIES_ON_DISK_BUT_NOT_ON_MAP)({
                entityLabel: SystemMessages_1.ARTIFACT,
                entityCount: artifactsOnDiskButNotOnMap.length,
            }));
        }
        artifactsOnDiskButNotOnMap.forEach((artifactLabel) => {
            let artifact;
            artifact = artifactLabel;
            CmmaSystemActions_1.default.addArtifactToArtifactGroup({
                artifact,
                systemMap,
                artifactsDir: diskArtifactDir,
            });
        });
        if (artifactsOnDiskButNotOnMap.length) {
            this.logger.info(this.colors.cyan((0, SystemMessageFunction_1.ENTITY_ADDED_TO_PROJECT_MAP)({
                entityLabel: SystemMessages_1.ARTIFACT,
                entityCount: artifactsOnDiskButNotOnMap.length,
            })));
        }
    }
    pruneLooseSystemArtifactsFromProjectMap(pruneLooseSystemArtifactsFromProjectMapOptions) {
        const { diskArtifactDir, systemMap, diskSystemLabel, diskContextLabel } = pruneLooseSystemArtifactsFromProjectMapOptions;
        const artifactGroup = CmmaSystemActions_1.default.listSystemArtifactsByGroupLabel({
            artifactsDir: diskArtifactDir,
            systemMap,
        });
        const artifactDir = new CmmaNodePath_1.default(this.PROJECT_CONFIG)
            .buildPath()
            .toContext(diskContextLabel)
            .toSystem(diskSystemLabel)
            .toArtifactsDir(diskArtifactDir)
            .getAbsoluteOsPath(this.application.appRoot);
        if (!CmmaFileActions_1.default.doesPathExist(artifactDir))
            return;
        const filesInArtifactDir = CmmaFileActions_1.default.listAllFilesInADirIncludingSubDirectories(artifactDir);
        const artifactsOnDisk = filesInArtifactDir
            .map((file) => file.split('.')[0])
            .filter((filename) => filename !== 'index');
        if (!artifactGroup || !artifactsOnDisk)
            return;
        const artifactsOnMapButNotOnDisk = (0, symettericDifferenceOfArrays_1.default)(artifactGroup, artifactsOnDisk);
        if (artifactsOnMapButNotOnDisk.length) {
            this.logger.info((0, SystemMessageFunction_1.FOUND_NUMBER_OF_ENTITY_ON_MAP_BUT_NOT_ON_DISK)({
                entityLabel: SystemMessages_1.ARTIFACT,
                entityCount: artifactsOnMapButNotOnDisk.length,
            }));
        }
        artifactsOnMapButNotOnDisk.forEach((artifactLabel) => {
            CmmaSystemActions_1.default.deleteArtifactObjectFromArtifactGroupByLabel({
                artifactLabel,
                systemMap,
                artifactDir: diskArtifactDir,
            });
        });
        if (artifactsOnMapButNotOnDisk.length) {
            this.logger.info(this.colors.cyan((0, SystemMessageFunction_1.ENTITY_PRUNED_FROM_PROJECT_MAP)({
                entityLabel: SystemMessages_1.ARTIFACT,
                entityCount: artifactsOnMapButNotOnDisk.length,
            })));
        }
    }
    async run() {
        await this.ensureConfigFileExistsCommandStep();
        this.projectRootPath = new CmmaNodePath_1.default(this.PROJECT_CONFIG)
            .buildPath()
            .getAbsoluteOsPath(this.application.appRoot);
        if (!CmmaFileActions_1.default.doesPathExist(this.projectRootPath)) {
            await this.logger.error(`Project Path does not exist: ${this.projectRootPath}`);
            await this.exit();
        }
        this.updateProjectContexts();
        this.updateProjectSystems();
        this.updateProjectModules();
        this.updateProjectModuleArtifacts();
        this.updateProjectArtifacts();
        await this.finishCmmaCommand();
    }
}
exports.default = ConfigUpdate;
ConfigUpdate.commandName = 'cmma:config-update';
ConfigUpdate.description = 'Update CMMA Configuration file with the current Folder Structure';
ConfigUpdate.settings = {
    loadApp: false,
    stayAlive: false,
};
//# sourceMappingURL=Update.js.map