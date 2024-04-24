"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ResponseStatement_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Common/Helpers/ResponseStatement"));
const PostActions_1 = __importDefault(require("../../Actions/PostActions"));
const HttpStatusCodeEnum_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Common/Helpers/HttpStatusCodeEnum"));
class GetUserPostController {
    constructor() {
        this.status = HttpStatusCodeEnum_1.default;
    }
    async handle({ response, params, auth }) {
        try {
            const user = auth.user;
            const content = await PostActions_1.default.fetchUserContent(params.id, user);
            if (!content) {
                return (0, ResponseStatement_1.default)({
                    response, body: [],
                    message: "Content not available for user, kindly subscribe to gain access",
                    status: this.status.NOT_FOUND
                });
            }
            return (0, ResponseStatement_1.default)({
                response, body: [content],
                message: "Content fetched successfully",
                status: this.status.SUCCESS
            });
        }
        catch (GetUserPostControllerError) {
            console.log('🚀 ~ GetUserPostControllerError.handle GetUserPostControllerError ->', GetUserPostControllerError);
            return (0, ResponseStatement_1.default)({
                response, message: JSON.stringify(GetUserPostControllerError),
                status: this.status.INTERNAL_SERVER_ERROR
            });
        }
    }
}
exports.default = GetUserPostController;
//# sourceMappingURL=GetUserPostController.js.map