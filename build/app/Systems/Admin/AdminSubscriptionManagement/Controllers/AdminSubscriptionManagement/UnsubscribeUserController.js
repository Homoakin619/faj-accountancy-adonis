"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const HttpStatusCodeEnum_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Common/Helpers/HttpStatusCodeEnum"));
const ResponseStatement_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Common/Helpers/ResponseStatement"));
const SubscriptionActions_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Systems/Client/Subscription/Actions/SubscriptionActions"));
class UnsubscribeUserController {
    constructor() {
        this.status = HttpStatusCodeEnum_1.default;
    }
    async handle({ response, params }) {
        try {
            const { user_id: userId, id: subscriptionId } = params;
            const subscription = await SubscriptionActions_1.default.unsubscribeUser(userId, subscriptionId);
            return (0, ResponseStatement_1.default)({
                response, body: [subscription],
                message: "Subscription made successfully",
                status: this.status.SUCCESS
            });
        }
        catch (UnsubscribeUserControllerError) {
            console.log('🚀 ~ UnsubscribeUserControllerError.handle UnsubscribeUserControllerError ->', UnsubscribeUserControllerError);
            return (0, ResponseStatement_1.default)({
                response,
                status: this.status.INTERNAL_SERVER_ERROR,
                message: JSON.stringify(UnsubscribeUserControllerError)
            });
        }
    }
}
exports.default = UnsubscribeUserController;
//# sourceMappingURL=UnsubscribeUserController.js.map