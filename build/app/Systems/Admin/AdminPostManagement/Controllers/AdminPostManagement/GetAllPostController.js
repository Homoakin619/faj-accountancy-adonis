"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const HttpStatusCodeEnum_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Common/Helpers/HttpStatusCodeEnum"));
const PostActions_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Systems/Client/PostsManagement/Actions/PostActions"));
const ResponseStatement_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Common/Helpers/ResponseStatement"));
class GetAllPostController {
    constructor() {
        this.status = HttpStatusCodeEnum_1.default;
    }
    async handle({ response }) {
        try {
            const contents = await PostActions_1.default.fetchAllContents();
            return (0, ResponseStatement_1.default)({
                response, body: [contents],
                message: "Contents fetched successfully",
                status: this.status.SUCCESS
            });
        }
        catch (GetAllPostControllerError) {
            console.log('🚀 ~ GetAllPostControllerError.handle GetAllPostControllerError ->', GetAllPostControllerError);
            return (0, ResponseStatement_1.default)({
                response, message: JSON.stringify(GetAllPostControllerError),
                status: this.status.INTERNAL_SERVER_ERROR
            });
        }
    }
}
exports.default = GetAllPostController;
//# sourceMappingURL=GetAllPostController.js.map