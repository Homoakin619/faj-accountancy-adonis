"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ENTITY_ADDED_TO_PROJECT_MAP = exports.ENTITY_PRUNED_FROM_PROJECT_MAP = exports.FOUND_NUMBER_OF_ENTITIES_ON_DISK_BUT_NOT_ON_MAP = exports.FOUND_NUMBER_OF_ENTITY_ON_MAP_BUT_NOT_ON_DISK = void 0;
function FOUND_NUMBER_OF_ENTITY_ON_MAP_BUT_NOT_ON_DISK(foundNumberOfEntityXInEntityYOptions) {
    const { entityLabel, entityCount } = foundNumberOfEntityXInEntityYOptions;
    return `Found ${entityCount} ${entityLabel}${entityCount === 1 ? '' : 's'} on Project Map but not on Disk`;
}
exports.FOUND_NUMBER_OF_ENTITY_ON_MAP_BUT_NOT_ON_DISK = FOUND_NUMBER_OF_ENTITY_ON_MAP_BUT_NOT_ON_DISK;
function FOUND_NUMBER_OF_ENTITIES_ON_DISK_BUT_NOT_ON_MAP(foundNumberOfEntityXInEntityYOptions) {
    const { entityLabel, entityCount } = foundNumberOfEntityXInEntityYOptions;
    return `Found ${entityCount} ${entityLabel}${entityCount === 1 ? '' : 's'} on Disk but not on Project Map.`;
}
exports.FOUND_NUMBER_OF_ENTITIES_ON_DISK_BUT_NOT_ON_MAP = FOUND_NUMBER_OF_ENTITIES_ON_DISK_BUT_NOT_ON_MAP;
function ENTITY_PRUNED_FROM_PROJECT_MAP(entityPrunedFromProjectMapOptions) {
    const { entityLabel, entityCount } = entityPrunedFromProjectMapOptions;
    return `${entityCount} ${entityLabel}${entityCount === 1 ? '' : 's'} pruned from Project Map. ✂️`;
}
exports.ENTITY_PRUNED_FROM_PROJECT_MAP = ENTITY_PRUNED_FROM_PROJECT_MAP;
function ENTITY_ADDED_TO_PROJECT_MAP(entityPrunedFromProjectMapOptions) {
    const { entityLabel, entityCount } = entityPrunedFromProjectMapOptions;
    return `${entityCount} ${entityLabel}${entityCount === 1 ? '' : 's'} added to Project Map. 📌`;
}
exports.ENTITY_ADDED_TO_PROJECT_MAP = ENTITY_ADDED_TO_PROJECT_MAP;
//# sourceMappingURL=SystemMessageFunction.js.map