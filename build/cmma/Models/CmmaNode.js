"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CmmaNode {
    constructor(nodeLabel) {
        this.nodeLabel = nodeLabel;
    }
    get label() {
        return this.nodeLabel;
    }
    set label(text) {
        this.nodeLabel = text;
    }
}
exports.default = CmmaNode;
//# sourceMappingURL=CmmaNode.js.map