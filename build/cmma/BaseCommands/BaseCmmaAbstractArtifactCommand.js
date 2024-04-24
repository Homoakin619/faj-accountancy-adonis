"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseCmmaAbstractArtifactCommand = void 0;
const BaseCmmaArtifactCommand_1 = require("./BaseCmmaArtifactCommand");
const CmmaFileActions_1 = __importDefault(require("../Actions/CmmaFileActions"));
const CmmaConfigurationActions_1 = __importDefault(require("../Actions/CmmaConfigurationActions"));
const CmmaSystemActions_1 = __importDefault(require("../Actions/CmmaSystemActions"));
const SystemMessages_1 = require("../Helpers/SystemMessages/SystemMessages");
const CmmaNodePath_1 = __importDefault(require("../Models/CmmaNodePath"));
class BaseCmmaAbstractArtifactCommand extends BaseCmmaArtifactCommand_1.BaseCmmaArtifactCommand {
    constructor() {
        super(...arguments);
        this.artifactType = 'file';
        this.artifactGroupDir = 'actions';
        this.artifactTemplates = {
            'operation': {
                controller: 'operation/controller.txt',
                validator: 'operation/validator.txt',
            },
            'model-options': {
                'create-options': 'model-options/create-options.txt',
                'update-options': 'model-options/update-options.txt',
                'identifier-options': 'model-options/identifier-options.txt',
                'model-interface': 'model-options/model-interface.txt',
            },
            'db-model': {
                model: 'db-model/model.txt',
                migration: 'db-model/migration-make.txt',
            },
            'resource': {
                'model': 'resource-model.txt',
                'action': 'resource-action.txt',
                'model-options': '',
                'migration': '',
            },
        };
        this.templateData = {
            'operation': {
                controller: {},
                validator: {},
            },
            'model-options': {
                'create-options': {},
                'update-options': {},
                'identifier-options': {},
                'model-interface': {},
            },
            'db-model': {
                model: {},
                migration: {},
            },
            'resource': {
                'db-model': {},
                'model-options': {},
                'action': {},
            },
        };
        this.destinationDirs = {
            'operation': {
                controller: '',
                validator: '',
            },
            'model-options': {
                'create-options': '',
                'update-options': '',
                'identifier-options': '',
                'model-interface': '',
            },
            'db-model': {
                model: '',
                migration: '',
            },
            'resource': {
                'model': '',
                'action': '',
                'model-options': '',
                'migration': '',
            },
        };
        this.abstractArtifactTransformations = {
            'operation': {
                controller: {},
                validator: {},
            },
            'model-options': {
                'create-options': {},
                'update-options': {},
                'identifier-options': {},
                'model-interface': {},
            },
            'db-model': {
                model: {},
                migration: {},
            },
            'resource': {
                'db-model': {},
                'model-options': {},
                'action': {},
            },
        };
    }
    getArtifactTemplateFileDir(artifactType) {
        const artifactTemplateFilename = this.artifactTemplates[this.abstractArtifactType][artifactType];
        const templateDir = CmmaFileActions_1.default.getCmmaTemplatesDir(this.application.appRoot);
        templateDir.push(artifactTemplateFilename);
        return CmmaFileActions_1.default.joinPath(templateDir);
    }
    setArtifactTemplateData(setAbstractArtifactTemplateDataOptions) {
        const { artifactType, templateData } = setAbstractArtifactTemplateDataOptions;
        this.templateData[this.abstractArtifactType][artifactType] = templateData;
    }
    getArtifactTemplateData(artifactType) {
        return this.templateData[this.abstractArtifactType][artifactType];
    }
    setArtifactDestinationDir(setArtifactDestinationDirOptions) {
        const { artifactType, artifactDestinationDir } = setArtifactDestinationDirOptions;
        this.destinationDirs[this.abstractArtifactType][artifactType] = artifactDestinationDir;
    }
    getArtifactDestinationDir(artifactType) {
        return this.destinationDirs[this.abstractArtifactType][artifactType];
    }
    setAbstractArtifactTransformation(setArtifactDestinationDirOptions) {
        const { artifactType, transformation } = setArtifactDestinationDirOptions;
        this.abstractArtifactTransformations[this.abstractArtifactType][artifactType] = transformation;
    }
    getAbstractArtifactTransformation(artifactType) {
        return this.abstractArtifactTransformations[this.abstractArtifactType][artifactType];
    }
    async addArtifactsToProjectMapCommandStep() {
        for (let artifactType of this.abstractArtifactConstituents) {
            const artifactTranformationsWithoutExtension = CmmaConfigurationActions_1.default.getArtifactTypeTransformationWithoutExtension({
                artifactType,
                configObject: this.PROJECT_CONFIG,
            });
            const artifactLabel = CmmaConfigurationActions_1.default.transformLabel({
                label: this.artifactLabel,
                transformations: artifactTranformationsWithoutExtension,
            });
            const artifactsDir = CmmaConfigurationActions_1.default.getDefaultArtifactTypeDir(artifactType);
            if (CmmaSystemActions_1.default.isArtifactInSystemArtifactGroup({
                artifactLabel: artifactLabel,
                artifactsDir,
                systemMap: this.systemMap,
            })) {
                this.logger.error(`${artifactLabel} already exists in ${this.systemLabel}. ${SystemMessages_1.EXITING}`);
                await this.exit();
            }
            CmmaSystemActions_1.default.addArtifactToArtifactGroup({
                artifactsDir: CmmaConfigurationActions_1.default.getDefaultArtifactTypeDir(artifactType),
                artifact: artifactLabel,
                systemMap: this.systemMap,
            });
        }
    }
    setArtifactsTransformationsCommandStep() {
        for (let artifact of this.abstractArtifactConstituents) {
            const artifactTransformations = CmmaConfigurationActions_1.default.getArtifactTypeTransformationWithoutExtension({
                artifactType: artifact,
                configObject: this.PROJECT_CONFIG,
            });
            if (artifact === 'migration') {
                artifactTransformations.prefix = `${new Date().getTime()}_`;
            }
            this.setAbstractArtifactTransformation({
                artifactType: artifact,
                transformation: artifactTransformations,
            });
        }
    }
    setArtifactDestinationPathCommandStep() {
        for (let artifactType of this.abstractArtifactConstituents) {
            const artifactDestinationPath = new CmmaNodePath_1.default(this.PROJECT_CONFIG)
                .buildPath()
                .toContext(this.contextLabel)
                .toSystem(this.systemLabel)
                .toArtifactsDir(CmmaConfigurationActions_1.default.getDefaultArtifactTypeDir(artifactType))
                .getAbsoluteOsPath(this.application.appRoot);
            this.setArtifactDestinationDir({
                artifactType,
                artifactDestinationDir: artifactDestinationPath,
            });
        }
    }
    async generate() {
        const hasRcFile = await this.hasRcFile(this.application.appRoot);
        if (!hasRcFile) {
            this.logger.error('Make sure your project root has ".adonisrc.json" file');
            return;
        }
        this.abstractArtifactConstituents.forEach((artifact) => {
            const artifactTransformation = this.getAbstractArtifactTransformation(artifact);
            const templateFile = this.getArtifactTemplateFileDir(artifact);
            const destinationDir = this.getArtifactDestinationDir(artifact);
            this.generator
                .addFile(this.artifactLabel, artifactTransformation)
                .stub(templateFile)
                .useMustache()
                .destinationDir(destinationDir)
                .appRoot(this.application.appRoot)
                .apply(this.getArtifactTemplateData(artifact));
        });
        await this.generator.run();
    }
}
exports.BaseCmmaAbstractArtifactCommand = BaseCmmaAbstractArtifactCommand;
//# sourceMappingURL=BaseCmmaAbstractArtifactCommand.js.map