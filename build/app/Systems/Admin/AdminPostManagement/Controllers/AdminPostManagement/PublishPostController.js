"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const HttpStatusCodeEnum_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Common/Helpers/HttpStatusCodeEnum"));
const PostActions_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Systems/Client/PostsManagement/Actions/PostActions"));
const ResponseStatement_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Common/Helpers/ResponseStatement"));
class PublishPostController {
    constructor() {
        this.status = HttpStatusCodeEnum_1.default;
    }
    async handle({ response, params }) {
        try {
            const id = params.id;
            const content = await PostActions_1.default.publishContent(id);
            return (0, ResponseStatement_1.default)({
                response, body: [{ content: content.id, title: content?.title }],
                message: "Content published successfully",
                status: this.status.SUCCESS
            });
        }
        catch (PublishPostControllerError) {
            console.log('🚀 ~ PublishPostControllerError.handle PublishPostControllerError ->', PublishPostControllerError);
            return (0, ResponseStatement_1.default)({
                response, message: JSON.stringify(PublishPostControllerError),
                status: this.status.INTERNAL_SERVER_ERROR
            });
        }
    }
}
exports.default = PublishPostController;
//# sourceMappingURL=PublishPostController.js.map