"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const HttpStatusCodeEnum_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Common/Helpers/HttpStatusCodeEnum"));
const ResponseStatement_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Common/Helpers/ResponseStatement"));
const PostActions_1 = __importDefault(require("../../Actions/PostActions"));
class GetAllUserPostController {
    constructor() {
        this.status = HttpStatusCodeEnum_1.default;
    }
    async handle({ response, auth }) {
        try {
            const user = auth.user;
            const subscriptions = await user.related('subscriptions').query();
            const contents = await PostActions_1.default.fetchUserContents(subscriptions);
            return (0, ResponseStatement_1.default)({
                response, body: [contents],
                status: this.status.SUCCESS,
                message: "Contents fetched successfully",
            });
        }
        catch (GetAllUserPostControllerError) {
            console.log('🚀 ~ GetAllUserPostControllerError.handle GetAllUserPostControllerError ->', GetAllUserPostControllerError);
            return (0, ResponseStatement_1.default)({
                response, message: JSON.stringify(GetAllUserPostControllerError),
                status: this.status.INTERNAL_SERVER_ERROR
            });
        }
    }
}
exports.default = GetAllUserPostController;
//# sourceMappingURL=GetAllUserPostController.js.map