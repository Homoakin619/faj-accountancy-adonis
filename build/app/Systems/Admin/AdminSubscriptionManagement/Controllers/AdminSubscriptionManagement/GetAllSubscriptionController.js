"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const HttpStatusCodeEnum_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Common/Helpers/HttpStatusCodeEnum"));
const ResponseStatement_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Common/Helpers/ResponseStatement"));
const SubscriptionActions_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Systems/Client/Subscription/Actions/SubscriptionActions"));
class GetAllSubscriptionController {
    constructor() {
        this.status = HttpStatusCodeEnum_1.default;
    }
    async handle({ response }) {
        try {
            const subscriptions = await SubscriptionActions_1.default.getAllSubscriptions();
            return (0, ResponseStatement_1.default)({
                response, body: [subscriptions],
                message: "Subscription fetched successfully",
                status: this.status.SUCCESS
            });
        }
        catch (GetAllSubscriptionControllerError) {
            console.log('🚀 ~ GetAllSubscriptionControllerError.handle GetAllSubscriptionControllerError ->', GetAllSubscriptionControllerError);
            return (0, ResponseStatement_1.default)({
                response,
                status: this.status.INTERNAL_SERVER_ERROR,
                message: JSON.stringify(GetAllSubscriptionControllerError)
            });
        }
    }
}
exports.default = GetAllSubscriptionController;
//# sourceMappingURL=GetAllSubscriptionController.js.map