"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const HttpStatusCodeEnum_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Common/Helpers/HttpStatusCodeEnum"));
const ResponseStatement_1 = __importStar(global[Symbol.for('ioc.use')]("App/Common/Helpers/ResponseStatement"));
const SubscriptionRequestValidator_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Systems/Client/Subscription/Validators/Subscription/SubscriptionRequestValidator"));
const SubscriptionActions_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Systems/Client/Subscription/Actions/SubscriptionActions"));
const Database_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Database"));
class CreateSubscriptionController {
    constructor() {
        this.status = HttpStatusCodeEnum_1.default;
    }
    async handle({ request, response }) {
        const dbTransaction = await Database_1.default.transaction();
        try {
            try {
                await request.validate(SubscriptionRequestValidator_1.default);
            }
            catch (validationError) {
                return response.status(this.status.ERROR).send((0, ResponseStatement_1.ResponseBody)({
                    message: validationError.messages,
                    status: this.status.ERROR
                }));
            }
            const payload = request.body();
            const Options = {
                createPayload: payload,
                dbTransactionOptions: {
                    dbTransaction: dbTransaction,
                    useTransaction: true
                }
            };
            const subscription = await SubscriptionActions_1.default.createSubscriptionRecord(Options);
            await dbTransaction.commit();
            return (0, ResponseStatement_1.default)({
                response, body: [subscription],
                status: this.status.CREATED,
                message: "Subscription created successfully"
            });
        }
        catch (CreateSubscriptionControllerError) {
            await dbTransaction.rollback();
            console.log('🚀 ~ CreateSubscriptionControllerError.handle CreateSubscriptionControllerError ->', CreateSubscriptionControllerError);
            return (0, ResponseStatement_1.default)({
                response,
                status: this.status.INTERNAL_SERVER_ERROR,
                message: JSON.stringify(CreateSubscriptionControllerError)
            });
        }
    }
}
exports.default = CreateSubscriptionController;
//# sourceMappingURL=CreateSubscriptionController.js.map