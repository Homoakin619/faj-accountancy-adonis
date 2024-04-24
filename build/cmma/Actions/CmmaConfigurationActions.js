"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Helpers_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Helpers");
class CmmaConfigurationActions {
    static resolveIdentifierToCasePattern(resolveIdentifierOptions) {
        const { identifier, casePattern } = resolveIdentifierOptions;
        const Resolve = {
            pascalcase: Helpers_1.string.pascalCase,
            camelcase: Helpers_1.string.camelCase,
            snakecase: Helpers_1.string.snakeCase,
            dashcase: Helpers_1.string.dashCase,
        };
        return Resolve[casePattern](identifier);
    }
    static transformLabel(transformLabelOptions) {
        const { label, transformations, noExt } = transformLabelOptions;
        const { form, extname, pattern, suffix, prefix } = transformations;
        let outputString = label;
        if (form) {
            outputString =
                form === 'singular' ? Helpers_1.string.singularize(outputString) : Helpers_1.string.pluralize(outputString);
        }
        if (prefix) {
            outputString = prefix + '_' + outputString;
        }
        if (suffix) {
            outputString = outputString + '_' + suffix;
        }
        if (pattern) {
            outputString =
                label === 'index'
                    ? outputString
                    : this.identifierNormalizer({
                        identifier: outputString,
                        pattern,
                    });
        }
        if (extname) {
            outputString = noExt ? outputString : outputString + extname;
        }
        return outputString;
    }
    static getArtifactTypeTransformationWithExtension(getArtifactGroupTransformationOptions) {
        const { artifactType, configObject } = getArtifactGroupTransformationOptions;
        const transformations = {
            'index': {
                extname: '.ts',
                pattern: 'snakecase',
            },
            'action': {
                extname: '.ts',
                suffix: 'Actions',
                form: 'singular',
                pattern: configObject.defaultCasePattern,
            },
            'controller': {
                extname: '.ts',
                suffix: 'Controller',
                form: 'singular',
                pattern: configObject.defaultCasePattern,
            },
            'file': {
                extname: '.ts',
                pattern: configObject.defaultCasePattern,
            },
            'seeder': {
                suffix: 'Seeder',
                form: 'singular',
                pattern: configObject.defaultCasePattern,
                extname: '.ts',
            },
            'appwrite-seeder': {
                prefix: 'Appwrite',
                suffix: 'Seeder',
                form: 'singular',
                pattern: configObject.defaultCasePattern,
                extname: '.ts',
            },
            'migration': {
                extname: '.ts',
                pattern: 'snakecase',
                form: 'plural',
            },
            'model': {
                extname: '.ts',
                form: 'singular',
                pattern: configObject.defaultCasePattern,
            },
            'route': {
                extname: '.ts',
                suffix: 'Routes',
                pattern: configObject.defaultCasePattern,
            },
            'helper': {
                extname: '.ts',
                pattern: configObject.defaultCasePattern,
            },
            'create-options': {
                extname: '.ts',
                prefix: 'Create',
                suffix: 'RecordOptions',
                form: 'singular',
                pattern: configObject.defaultCasePattern,
            },
            'update-options': {
                extname: '.ts',
                prefix: 'Update',
                suffix: 'RecordOptions',
                form: 'singular',
                pattern: configObject.defaultCasePattern,
            },
            'model-interface': {
                extname: '.ts',
                suffix: 'Interface',
                form: 'singular',
                pattern: configObject.defaultCasePattern,
            },
            'identifier-options': {
                extname: '.ts',
                suffix: 'IdentifierOptions',
                form: 'singular',
                pattern: configObject.defaultCasePattern,
            },
            'validator': {
                extname: '.ts',
                suffix: 'RequestValidator',
                form: 'singular',
                pattern: configObject.defaultCasePattern,
            },
            'view': {
                extname: '.edge',
                pattern: 'dashcase',
            },
        };
        return transformations[artifactType];
    }
    static getArtifactTypeTransformationWithoutExtension(getArtifactGroupTransformationOptions) {
        const { artifactType, configObject } = getArtifactGroupTransformationOptions;
        const transformations = {
            'index': {
                pattern: 'snakecase',
            },
            'action': {
                suffix: 'Actions',
                form: 'singular',
                pattern: configObject.defaultCasePattern,
            },
            'controller': {
                suffix: 'Controller',
                form: 'singular',
                pattern: configObject.defaultCasePattern,
            },
            'helper': {
                pattern: configObject.defaultCasePattern,
            },
            'file': {
                pattern: configObject.defaultCasePattern,
            },
            'migration': {
                pattern: 'snakecase',
                form: 'plural',
            },
            'seeder': {
                suffix: 'Seeder',
                form: 'singular',
                pattern: configObject.defaultCasePattern,
            },
            'appwrite-seeder': {
                suffix: 'Seeder',
                prefix: 'Appwrite',
                pattern: configObject.defaultCasePattern,
            },
            'model': {
                form: 'singular',
                pattern: configObject.defaultCasePattern,
            },
            'route': {
                suffix: 'Routes',
                pattern: configObject.defaultCasePattern,
            },
            'create-options': {
                prefix: 'Create',
                suffix: 'RecordOptions',
                form: 'singular',
                pattern: configObject.defaultCasePattern,
            },
            'update-options': {
                prefix: 'Update',
                suffix: 'RecordOptions',
                form: 'singular',
                pattern: configObject.defaultCasePattern,
            },
            'model-interface': {
                suffix: 'Interface',
                form: 'singular',
                pattern: configObject.defaultCasePattern,
            },
            'identifier-options': {
                suffix: 'IdentifierOptions',
                form: 'singular',
                pattern: configObject.defaultCasePattern,
            },
            'validator': {
                suffix: 'RequestValidator',
                form: 'singular',
                pattern: configObject.defaultCasePattern,
            },
            'view': {
                pattern: 'dashcase',
            },
        };
        return transformations[artifactType];
    }
    static getDefaultArtifactTypeDir(artifactType) {
        const defaultDir = {
            'create-options': 'typeChecking',
            'identifier-options': 'typeChecking',
            'model-interface': 'typeChecking',
            'update-options': 'typeChecking',
            'action': 'actions',
            'controller': 'controllers',
            'file': 'actions',
            'index': 'actions',
            'seeder': 'seeders',
            'appwrite-seeder': 'seeders',
            'migration': 'migrations',
            'model': 'models',
            'route': 'routes',
            'validator': 'validators',
            'view': 'views',
            'helper': 'helpers',
        };
        return defaultDir[artifactType];
    }
    static getArtifactGroupTransformation(getArtifactGroupTransformationOptions) {
        const { artifactGroup, configObject } = getArtifactGroupTransformationOptions;
        const transformations = {
            actions: {
                extname: '.ts',
                suffix: 'Actions',
                form: 'singular',
                pattern: configObject.defaultCasePattern,
            },
            controllers: {
                extname: '.ts',
                suffix: 'Controller',
                form: 'singular',
                pattern: configObject.defaultCasePattern,
            },
            seeders: {
                extname: '.ts',
                pattern: configObject.defaultCasePattern,
                suffix: 'seeder',
                form: 'singular',
            },
            migrations: {
                extname: '.ts',
                pattern: 'snakecase',
            },
            models: {
                extname: '.ts',
                form: 'singular',
                pattern: configObject.defaultCasePattern,
            },
            routes: {
                extname: '.ts',
                suffix: 'Routes',
                pattern: configObject.defaultCasePattern,
            },
            helpers: {
                extname: '.ts',
                pattern: configObject.defaultCasePattern,
            },
            typeChecking: {
                extname: '.ts',
                pattern: configObject.defaultCasePattern,
            },
            validators: {
                extname: '.ts',
                suffix: 'RequestValidator',
                form: 'singular',
                pattern: configObject.defaultCasePattern,
            },
            views: {
                extname: '.edge',
                pattern: 'dashcase',
            },
        };
        return transformations[artifactGroup];
    }
    static normalizeProjectIdentifier(normalizeProjectIdentifierOptions) {
        const { identifier, configObject } = normalizeProjectIdentifierOptions;
        return this.identifierNormalizer({
            identifier,
            pattern: configObject.defaultCasePattern,
        });
    }
    static identifierNormalizer(identifierNormalizerOptions) {
        const { identifier, pattern } = identifierNormalizerOptions;
        const Normalize = {
            pascalcase: Helpers_1.string.pascalCase,
            camelcase: Helpers_1.string.camelCase,
            snakecase: Helpers_1.string.snakeCase,
            dashcase: Helpers_1.string.dashCase,
        };
        return Normalize[pattern](identifier);
    }
    static whatIsDefaultSystemArtifactDirs(configObject) {
        return configObject.defaultSystemArtifactDirs;
    }
    static whatIsDefaultProjectRootInApp(configObject) {
        return configObject.defaultProjectRootDirInApp;
    }
    static whatIsDefaultSystemSuffix(configObject) {
        return configObject.defaultSystemInternalApiSuffix;
    }
    static whatIsDefaultCasePattern(configObject) {
        return configObject.defaultCasePattern;
    }
    static whatIsDefaultCreateModuleDirIn(configObject) {
        return configObject.defaultModuleDirIn;
    }
    static get blankCmmaConfiguration() {
        return {
            defaultProjectRootDirInApp: '',
            defaultSystemInternalApiSuffix: '',
            defaultCasePattern: 'pascalcase',
            defaultSystemArtifactDirs: [],
            defaultModuleDirIn: [],
            logs: [],
            projectMap: {
                contexts: {},
                artifacts: [],
            },
        };
    }
    static get defaultCmmaConfiguration() {
        return {
            defaultProjectRootDirInApp: 'Systems',
            defaultSystemInternalApiSuffix: 'System',
            defaultCasePattern: 'pascalcase',
            defaultSystemArtifactDirs: [
                'actions',
                'helpers',
                'migrations',
                'models',
                'routes',
                'seeders',
                'typeChecking',
                'views',
            ],
            defaultModuleDirIn: ['controllers', 'validators'],
            logs: [],
            projectMap: {
                contexts: {},
                artifacts: [],
            },
        };
    }
}
exports.default = CmmaConfigurationActions;
//# sourceMappingURL=CmmaConfigurationActions.js.map