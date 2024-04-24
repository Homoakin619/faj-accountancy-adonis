"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const HttpStatusCodeEnum_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Common/Helpers/HttpStatusCodeEnum"));
const UserRequestValidator_1 = __importDefault(require("../../Validators/UserModule/UserRequestValidator"));
const ResponseStatement_1 = global[Symbol.for('ioc.use')]("App/Common/Helpers/ResponseStatement");
const UserActions_1 = __importDefault(require("../../Actions/UserActions"));
const Database_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Database"));
class CreateUserController {
    constructor() {
        this.status = HttpStatusCodeEnum_1.default;
    }
    async handle({ request, response }) {
        const dbTransaction = await Database_1.default.transaction();
        try {
            try {
                await request.validate(UserRequestValidator_1.default);
            }
            catch (validationError) {
                return response.status(this.status.ERROR).send((0, ResponseStatement_1.ResponseBody)({
                    body: [],
                    status: this.status.ERROR,
                    message: validationError.messages
                }));
            }
            const payload = request.body();
            const Options = {
                createPayload: payload,
                dbTransactionOptions: {
                    dbTransaction, useTransaction: true
                }
            };
            const user = await UserActions_1.default.createUserRecord(Options, true);
            await dbTransaction.commit();
            return response.status(this.status.CREATED).send((0, ResponseStatement_1.ResponseBody)({
                body: [user],
                message: "User created successfully",
                status: this.status.CREATED
            }));
        }
        catch (CreateUserControllerError) {
            await dbTransaction.rollback();
            console.log('🚀 ~ CreateUserControllerError.handle CreateUserControllerError ->', CreateUserControllerError);
            return response.status(this.status.INTERNAL_SERVER_ERROR).send((0, ResponseStatement_1.ResponseBody)({
                status: this.status.INTERNAL_SERVER_ERROR,
                message: JSON.stringify(CreateUserControllerError)
            }));
        }
    }
}
exports.default = CreateUserController;
//# sourceMappingURL=CreateAdminUserController.js.map