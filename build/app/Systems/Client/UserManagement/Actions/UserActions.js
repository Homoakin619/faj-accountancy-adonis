"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Systems/Client/UserManagement/Models/User"));
class UserActions {
    static async createUserRecord(createUserRecordOptions, isAdmin = false) {
        const { createPayload, dbTransactionOptions } = createUserRecordOptions;
        const user = new User_1.default();
        await user.fill(createPayload);
        if (dbTransactionOptions.useTransaction) {
            user.useTransaction(dbTransactionOptions.dbTransaction);
        }
        if (isAdmin)
            user.isAdmin = true;
        await user.save();
        return user;
    }
    static async getUserRecordById(userId) {
        return User_1.default.find(userId);
    }
    static async getUserRecordByEmail(email) {
        return User_1.default.query().where("email", email).first();
    }
    static async getUserRecordByIdentifier(identifier) {
        return User_1.default.query().where('identifier', identifier).first();
    }
    static async getUserRecord(getUserOptions) {
        const { identifier, identifierType } = getUserOptions;
        const GetUser = {
            id: async () => await this.getUserRecordById(Number(identifier)),
            identifier: async () => await this.getUserRecordByIdentifier(String(identifier)),
        };
        return await GetUser[identifierType]();
    }
}
exports.default = UserActions;
//# sourceMappingURL=UserActions.js.map