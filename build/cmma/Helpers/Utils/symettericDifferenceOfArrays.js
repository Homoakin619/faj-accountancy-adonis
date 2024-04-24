"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function differenceOfArrays(greaterArray, lesserArray) {
    return greaterArray.filter((member) => !lesserArray.includes(member));
}
exports.default = differenceOfArrays;
//# sourceMappingURL=symettericDifferenceOfArrays.js.map