"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseBody = void 0;
const ResponseBody = ({ body, message, status }) => {
    return {
        body: body || [],
        message: message || "",
        status: status
    };
};
exports.ResponseBody = ResponseBody;
function returnStatement({ response, body, message, status }) {
    return response.status(status).send((0, exports.ResponseBody)({
        body, message, status
    }));
}
exports.default = returnStatement;
//# sourceMappingURL=ResponseStatement.js.map