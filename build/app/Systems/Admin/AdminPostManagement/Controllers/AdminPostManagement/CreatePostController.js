"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const HttpStatusCodeEnum_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Common/Helpers/HttpStatusCodeEnum"));
const ResponseStatement_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Common/Helpers/ResponseStatement"));
const PostRequestValidator_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Systems/Client/PostsManagement/Validators/Posts/PostRequestValidator"));
const PostActions_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Systems/Client/PostsManagement/Actions/PostActions"));
const Database_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Database"));
class CreatePostController {
    constructor() {
        this.status = HttpStatusCodeEnum_1.default;
    }
    async handle({ response, request }) {
        const dbTransaction = await Database_1.default.transaction();
        try {
            try {
                await request.validate(PostRequestValidator_1.default);
            }
            catch (validationError) {
                return (0, ResponseStatement_1.default)({
                    response, message: validationError.messages,
                    status: this.status.ERROR
                });
            }
            const payload = request.body();
            const Options = {
                createPayload: payload,
                dbTransactionOptions: {
                    dbTransaction: dbTransaction,
                    useTransaction: true
                }
            };
            const content = await PostActions_1.default.createPostRecord(Options);
            return (0, ResponseStatement_1.default)({
                response, body: [content],
                message: "Content created successfully",
                status: this.status.SUCCESS
            });
        }
        catch (PostControllerError) {
            console.log('🚀 ~ PostControllerError.handle PostControllerError ->', PostControllerError);
            return (0, ResponseStatement_1.default)({
                response, message: JSON.stringify(PostControllerError),
                status: this.status.INTERNAL_SERVER_ERROR
            });
        }
    }
}
exports.default = CreatePostController;
//# sourceMappingURL=CreatePostController.js.map