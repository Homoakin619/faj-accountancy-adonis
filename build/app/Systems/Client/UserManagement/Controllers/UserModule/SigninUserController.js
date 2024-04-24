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
const UserSignInValidator_1 = __importDefault(require("../../Validators/UserModule/UserSignInValidator"));
const ResponseStatement_1 = __importStar(global[Symbol.for('ioc.use')]("App/Common/Helpers/ResponseStatement"));
const Hash_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Hash"));
const UserActions_1 = __importDefault(require("../../Actions/UserActions"));
const luxon_1 = require("luxon");
class SigninUserController {
    constructor() {
        this.status = HttpStatusCodeEnum_1.default;
    }
    async handle({ request, response, auth }) {
        try {
            try {
                await request.validate(UserSignInValidator_1.default);
            }
            catch (validationError) {
                return response.status(this.status.ERROR).send((0, ResponseStatement_1.ResponseBody)({
                    body: [],
                    status: this.status.ERROR,
                    message: validationError.messages
                }));
            }
            const { email, password } = request.body();
            const user = await UserActions_1.default.getUserRecordByEmail(email);
            if (!user) {
                return response.status(this.status.NOT_FOUND).send((0, ResponseStatement_1.ResponseBody)({
                    message: "Invalid Credentials",
                    status: this.status.NOT_FOUND
                }));
            }
            const passwordMatch = await Hash_1.default.verify(user.password, password);
            if (!passwordMatch) {
                return response.status(this.status.UNAUTHORIZED_REQUEST).send((0, ResponseStatement_1.ResponseBody)({
                    message: "Invalid Credentials",
                    status: this.status.UNAUTHORIZED_REQUEST
                }));
            }
            user.isActive = true;
            user.lastLogin = luxon_1.DateTime.now();
            await user.save();
            const token = await auth.use('api').generate(user);
            return (0, ResponseStatement_1.default)({
                response, body: [{
                        id: user.id,
                        token
                    }],
                status: this.status.SUCCESS,
                message: "user login successful",
            });
        }
        catch (SigninUserControllerError) {
            console.log('🚀 ~ SigninUserControllerError.handle SigninUserControllerError ->', SigninUserControllerError);
            return response.status(this.status.INTERNAL_SERVER_ERROR).send({
                body: [],
                message: JSON.stringify(SigninUserControllerError),
                status: this.status.INTERNAL_SERVER_ERROR
            });
        }
    }
}
exports.default = SigninUserController;
//# sourceMappingURL=SigninUserController.js.map