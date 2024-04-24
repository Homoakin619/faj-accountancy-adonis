"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prettyPrint = void 0;
const util_1 = require("util");
const igniculus_1 = __importDefault(require("igniculus"));
const illuminate = (0, igniculus_1.default)({
    comments: { fg: 'gray' },
    constants: { fg: 'red' },
    delimitedIdentifiers: { fg: 'yellow' },
    variables: { fg: 'cyan' },
    dataTypes: { fg: 'green', casing: 'uppercase' },
    standardKeywords: { fg: 'green', casing: 'uppercase' },
    lesserKeywords: { mode: 'bold', fg: 'cyan', casing: 'uppercase' },
    prefix: { replace: /.*?: / },
    output: (line) => line,
});
function colorizeQuery(sql) {
    return illuminate(sql);
}
function prettyPrint(queryLog) {
    const color = require('kleur');
    const prettyHrtime = require('pretty-hrtime');
    let output = '';
    if (!queryLog.ddl) {
        output += color.gray(`"${queryLog.connection}" `);
    }
    if (queryLog.model) {
        output += `${queryLog.model} `;
    }
    if (queryLog.duration) {
        output += `(${prettyHrtime(queryLog.duration)}) `;
    }
    output += colorizeQuery(queryLog.sql);
    if (!queryLog.ddl) {
        output += color.gray(` ${(0, util_1.inspect)(queryLog.bindings)}`);
    }
    console.log(output);
}
exports.prettyPrint = prettyPrint;
//# sourceMappingURL=PrettyPrint.js.map