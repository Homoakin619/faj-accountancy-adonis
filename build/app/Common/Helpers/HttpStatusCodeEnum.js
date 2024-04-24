"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var HttpStatusCodeEnum;
(function (HttpStatusCodeEnum) {
    HttpStatusCodeEnum[HttpStatusCodeEnum["UNAUTHORIZED_REQUEST"] = 401] = "UNAUTHORIZED_REQUEST";
    HttpStatusCodeEnum[HttpStatusCodeEnum["SUCCESS"] = 200] = "SUCCESS";
    HttpStatusCodeEnum[HttpStatusCodeEnum["CREATED"] = 201] = "CREATED";
    HttpStatusCodeEnum[HttpStatusCodeEnum["NOT_FOUND"] = 404] = "NOT_FOUND";
    HttpStatusCodeEnum[HttpStatusCodeEnum["ERROR"] = 400] = "ERROR";
    HttpStatusCodeEnum[HttpStatusCodeEnum["INTERNAL_SERVER_ERROR"] = 500] = "INTERNAL_SERVER_ERROR";
    HttpStatusCodeEnum[HttpStatusCodeEnum["NO_CONTENT"] = 20] = "NO_CONTENT";
})(HttpStatusCodeEnum || (HttpStatusCodeEnum = {}));
exports.default = HttpStatusCodeEnum;
//# sourceMappingURL=HttpStatusCodeEnum.js.map