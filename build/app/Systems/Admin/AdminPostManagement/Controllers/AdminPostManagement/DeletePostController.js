"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const HttpStatusCodeEnum_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Common/Helpers/HttpStatusCodeEnum"));
const PostActions_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Systems/Client/PostsManagement/Actions/PostActions"));
const ResponseStatement_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Common/Helpers/ResponseStatement"));
class DeletePostController {
    constructor() {
        this.status = HttpStatusCodeEnum_1.default;
    }
    async handle({ response, params }) {
        try {
            const id = params.id;
            await PostActions_1.default.deleteContent(id);
            return (0, ResponseStatement_1.default)({
                response, body: [],
                message: "Content deleted successfully",
                status: this.status.NO_CONTENT
            });
        }
        catch (DeletePostControllerError) {
            console.log('🚀 ~ DeletePostControllerError.handle DeletePostControllerError ->', DeletePostControllerError);
            return (0, ResponseStatement_1.default)({
                response, message: JSON.stringify(DeletePostController),
                status: this.status.INTERNAL_SERVER_ERROR
            });
        }
    }
}
exports.default = DeletePostController;
//# sourceMappingURL=DeletePostController.js.map