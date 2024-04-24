"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const HttpStatusCodeEnum_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Common/Helpers/HttpStatusCodeEnum"));
const ResponseStatement_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Common/Helpers/ResponseStatement"));
const SubscriptionActions_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Systems/Client/Subscription/Actions/SubscriptionActions"));
class GetSubscriptionController {
    constructor() {
        this.status = HttpStatusCodeEnum_1.default;
    }
    async handle({ response, params }) {
        try {
            const id = params.id;
            const subscription = await SubscriptionActions_1.default.getSubscriptionRecordById(id);
            return (0, ResponseStatement_1.default)({
                response, body: [subscription],
                message: "Subscription fetched successfully",
                status: this.status.SUCCESS
            });
        }
        catch (GetSubscriptionControllerError) {
            console.log('🚀 ~ GetSubscriptionControllerError.handle GetSubscriptionControllerError ->', GetSubscriptionControllerError);
            return (0, ResponseStatement_1.default)({
                response,
                status: this.status.INTERNAL_SERVER_ERROR,
                message: JSON.stringify(GetSubscriptionControllerError)
            });
        }
    }
}
exports.default = GetSubscriptionController;
//# sourceMappingURL=GetSubscriptionController.js.map