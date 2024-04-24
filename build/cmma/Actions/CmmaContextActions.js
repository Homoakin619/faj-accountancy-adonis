"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CmmaContextActions {
    static addSystemToContext(addSystemToContextOptions) {
        const { systemLabel, system, contextMap } = addSystemToContextOptions;
        Object.assign(contextMap.systems, {
            [systemLabel]: system,
        });
    }
    static getSystemIndexByLabel(getSystemIndexByLabelOptions) {
        const { systemLabel, contextMap } = getSystemIndexByLabelOptions;
        return this.listSystemsInContext(contextMap).indexOf(systemLabel);
    }
    static getContextSystemByIndex(getSystemByIndexOptions) {
        const { systemIndex, context } = getSystemByIndexOptions;
        const systems = Object.keys(context.systems);
        const systemLabel = systems[systemIndex];
        return context.systems[systemLabel];
    }
    static getContextSystemMapByLabel(getContextSystemByLabel) {
        const { systemLabel, contextMap } = getContextSystemByLabel;
        return contextMap.systems[systemLabel];
    }
    static listSystemsInContext(contextMap) {
        return Object.keys(contextMap.systems);
    }
    static deleteContextSystemByIndex(getSystemByIndexOptions) {
        const { systemIndex, context } = getSystemByIndexOptions;
        const systems = Object.keys(context.systems);
        const systemLabel = systems[systemIndex];
        delete context.systems[systemLabel];
    }
    static deleteContextSystemByLabel(getContextSystemByLabel) {
        const { systemLabel, contextMap } = getContextSystemByLabel;
        delete contextMap.systems[systemLabel];
    }
    static isSystemInContext(isSystemInContextOptions) {
        const { systemLabel, contextMap } = isSystemInContextOptions;
        return this.listSystemsInContext(contextMap).includes(systemLabel);
    }
    static whatIsContextLabel(context) {
        return context.contextLabel;
    }
    static get blankContext() {
        return {
            contextLabel: '',
            systems: {},
        };
    }
}
exports.default = CmmaContextActions;
//# sourceMappingURL=CmmaContextActions.js.map