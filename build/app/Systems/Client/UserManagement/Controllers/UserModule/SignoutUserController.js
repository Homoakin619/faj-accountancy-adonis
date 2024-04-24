"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const HttpStatusCodeEnum_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Common/Helpers/HttpStatusCodeEnum"));
const ResponseStatement_1 = global[Symbol.for('ioc.use')]("App/Common/Helpers/ResponseStatement");
class SignoutUserController {
    constructor() {
        this.status = HttpStatusCodeEnum_1.default;
    }
    async handle({ response, auth }) {
        try {
            auth.user.isActive = false;
            await auth.user.save();
            auth.use("api").revoke();
            return response.status(this.status.SUCCESS).send((0, ResponseStatement_1.ResponseBody)({
                status: this.status.SUCCESS,
                message: "Logout Successfully"
            }));
        }
        catch (SignoutUserControllerError) {
            console.log('🚀 ~ SignoutUserControllerError.handle SignoutUserControllerError ->', SignoutUserControllerError);
            return response.status(this.status.INTERNAL_SERVER_ERROR).send((0, ResponseStatement_1.ResponseBody)({
                status: this.status.INTERNAL_SERVER_ERROR,
                message: JSON.stringify(SignoutUserControllerError)
            }));
        }
    }
}
exports.default = SignoutUserController;
//# sourceMappingURL=SignoutUserController.js.map