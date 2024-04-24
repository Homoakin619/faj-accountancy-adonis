"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const HttpStatusCodeEnum_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Common/Helpers/HttpStatusCodeEnum"));
const ResponseStatement_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Common/Helpers/ResponseStatement"));
const SubscriptionActions_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Systems/Client/Subscription/Actions/SubscriptionActions"));
class DeleteSubscriptionController {
    constructor() {
        this.status = HttpStatusCodeEnum_1.default;
    }
    async handle({ response, params }) {
        try {
            const id = params.id;
            await SubscriptionActions_1.default.deleteSubscription(id);
            return (0, ResponseStatement_1.default)({
                response,
                status: this.status.NO_CONTENT
            });
        }
        catch (DeleteSubscriptionControllerError) {
            console.log('🚀 ~ DeleteSubscriptionControllerError.handle DeleteSubscriptionControllerError ->', DeleteSubscriptionControllerError);
            return (0, ResponseStatement_1.default)({
                response,
                status: this.status.INTERNAL_SERVER_ERROR,
                message: JSON.stringify(DeleteSubscriptionControllerError)
            });
        }
    }
}
exports.default = DeleteSubscriptionController;
//# sourceMappingURL=DeleteSubscriptionController.js.map