"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Subscription_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Systems/Client/Subscription/Models/Subscription"));
const User_1 = __importDefault(require("../../UserManagement/Models/User"));
class SubscriptionActions {
    static async createSubscriptionRecord(createSubscriptionRecordOptions) {
        const { createPayload, dbTransactionOptions } = createSubscriptionRecordOptions;
        const subscription = new Subscription_1.default();
        await subscription.fill(createPayload);
        if (dbTransactionOptions.useTransaction) {
            subscription.useTransaction(dbTransactionOptions.dbTransaction);
        }
        await subscription.save();
        return subscription;
    }
    static async deleteSubscription(subscription_id) {
        const subscription = await this.getSubscriptionRecordById(subscription_id);
        await subscription.delete();
        return null;
    }
    static async getAllSubscriptions() {
        const subscriptions = await Subscription_1.default.query();
        return subscriptions;
    }
    static async subscribeUser(userId, subscriptionId) {
        const user = await User_1.default.find(userId);
        const subscriptionExists = await user?.related('subscriptions')
            .query()
            .where('subscription_id', subscriptionId)
            .first();
        if (!subscriptionExists)
            user.related('subscriptions').attach([subscriptionId]);
        return user;
    }
    static async unsubscribeUser(userId, subscriptionId) {
        const user = await User_1.default.find(userId);
        const subscriptionExists = await user?.related('subscriptions')
            .query()
            .where('subscription_id', subscriptionId)
            .first();
        if (subscriptionExists)
            user.related('subscriptions').detach([subscriptionId]);
        return user;
    }
    static async getSubscriptionRecordById(subscriptionId) {
        return Subscription_1.default.find(subscriptionId);
    }
    static async getSubscriptionRecordByIdentifier(identifier) {
        return Subscription_1.default.query().where('identifier', identifier).first();
    }
    static async getSubscriptionRecord(getSubscriptionOptions) {
        const { identifier, identifierType } = getSubscriptionOptions;
        const GetSubscription = {
            id: async () => await this.getSubscriptionRecordById(Number(identifier)),
            identifier: async () => await this.getSubscriptionRecordByIdentifier(String(identifier)),
        };
        return await GetSubscription[identifierType]();
    }
}
exports.default = SubscriptionActions;
//# sourceMappingURL=SubscriptionActions.js.map