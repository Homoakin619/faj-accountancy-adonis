"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sourceFiles = exports.normalizeCherryPickObject = exports.getDDLMethod = exports.managedTransaction = exports.syncDiff = exports.unique = exports.isObject = exports.getValue = exports.ensureRelationIsBooted = exports.collectValues = exports.ensureValue = exports.ensureRelation = void 0;
const slash_1 = __importDefault(require("slash"));
const path_1 = require("path");
const utils_1 = require("@poppinss/utils");
const helpers_1 = require("@poppinss/utils/build/helpers");
function ensureRelation(name, relation) {
    if (!relation) {
        throw new utils_1.Exception(`Cannot process unregistered relationship ${name}`, 500);
    }
    return true;
}
exports.ensureRelation = ensureRelation;
function ensureValue(collection, key, missingCallback) {
    const value = collection[key];
    if (value === undefined || value === null) {
        missingCallback();
        return;
    }
    return value;
}
exports.ensureValue = ensureValue;
function collectValues(payload, key, missingCallback) {
    return payload.map((row) => {
        return ensureValue(row, key, missingCallback);
    });
}
exports.collectValues = collectValues;
function ensureRelationIsBooted(relation) {
    if (!relation.booted) {
        throw new utils_1.Exception('Relationship is not booted. Make sure to call boot first', 500, 'E_RUNTIME_EXCEPTION');
    }
}
exports.ensureRelationIsBooted = ensureRelationIsBooted;
function getValue(model, key, relation, action = 'preload') {
    return ensureValue(model, key, () => {
        throw new utils_1.Exception(`Cannot ${action} "${relation.relationName}", value of "${relation.model.name}.${key}" is undefined`, 500);
    });
}
exports.getValue = getValue;
function isObject(value) {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
}
exports.isObject = isObject;
function unique(value) {
    if (!Array.isArray(value)) {
        return [];
    }
    return [...new Set(value)];
}
exports.unique = unique;
function syncDiff(original, incoming) {
    const diff = Object.keys(incoming).reduce((result, incomingRowId) => {
        const originalRow = original[incomingRowId];
        const incomingRow = incoming[incomingRowId];
        if (!originalRow) {
            result.added[incomingRowId] = incomingRow;
        }
        else if (Object.keys(incomingRow).find((key) => incomingRow[key] !== originalRow[key])) {
            result.updated[incomingRowId] = incomingRow;
        }
        return result;
    }, { added: {}, updated: {} });
    return diff;
}
exports.syncDiff = syncDiff;
async function managedTransaction(client, callback) {
    const isManagedTransaction = !client.isTransaction;
    const trx = client.isTransaction
        ? client
        : await client.transaction();
    if (!isManagedTransaction) {
        return callback(trx);
    }
    try {
        const response = await callback(trx);
        await trx.commit();
        return response;
    }
    catch (error) {
        await trx.rollback();
        throw error;
    }
}
exports.managedTransaction = managedTransaction;
function getDDLMethod(sql) {
    sql = sql.toLowerCase();
    if (sql.startsWith('create')) {
        return 'create';
    }
    if (sql.startsWith('alter')) {
        return 'alter';
    }
    if (sql.startsWith('drop')) {
        return 'drop';
    }
    return 'unknown';
}
exports.getDDLMethod = getDDLMethod;
function normalizeCherryPickObject(fields) {
    if (Array.isArray(fields)) {
        return {
            pick: fields,
            omit: [],
        };
    }
    return {
        pick: fields.pick,
        omit: fields.omit,
    };
}
exports.normalizeCherryPickObject = normalizeCherryPickObject;
function sourceFiles(fromLocation, directory, naturalSort) {
    return new Promise((resolve, reject) => {
        const absDirectoryPath = (0, helpers_1.resolveDir)(fromLocation, directory);
        let files = (0, helpers_1.fsReadAll)(absDirectoryPath);
        if (naturalSort) {
            files = files.sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));
        }
        else {
            files = files.sort();
        }
        try {
            resolve({
                directory,
                files: files.map((file) => {
                    const name = (0, path_1.join)(directory, file.replace(RegExp(`${(0, path_1.extname)(file)}$`), ''));
                    return {
                        absPath: (0, path_1.join)(absDirectoryPath, file),
                        name: (0, slash_1.default)(name),
                        getSource() {
                            return (0, utils_1.esmRequire)(this.absPath);
                        },
                    };
                }),
            });
        }
        catch (error) {
            reject(error);
        }
    });
}
exports.sourceFiles = sourceFiles;
//# sourceMappingURL=LucidCommandsUtils.js.map