"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const HttpStatusCodeEnum_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Common/Helpers/HttpStatusCodeEnum"));
const ResponseStatement_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Common/Helpers/ResponseStatement"));
const PostActions_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Systems/Client/PostsManagement/Actions/PostActions"));
class UnpublishPostController {
    constructor() {
        this.status = HttpStatusCodeEnum_1.default;
    }
    async handle({ response, params }) {
        try {
            const id = params.id;
            const content = await PostActions_1.default.unpublishContent(id);
            return (0, ResponseStatement_1.default)({
                response, body: [{ content: content.id, title: content?.title }],
                message: "Content unpublished successfully",
                status: this.status.SUCCESS
            });
        }
        catch (UnpublishPostControllerError) {
            console.log('🚀 ~ UnpublishPostControllerError.handle UnpublishPostControllerError ->', UnpublishPostControllerError);
            return (0, ResponseStatement_1.default)({
                response, message: JSON.stringify(UnpublishPostControllerError),
                status: this.status.INTERNAL_SERVER_ERROR
            });
        }
    }
}
exports.default = UnpublishPostController;
//# sourceMappingURL=UnpublishPostController.js.map