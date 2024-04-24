"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Validator_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Validator");
class UserSignInValidator {
    constructor(ctx) {
        this.ctx = ctx;
        this.schema = Validator_1.schema.create({
            email: Validator_1.schema.string([
                Validator_1.rules.email(),
                Validator_1.rules.required(),
                Validator_1.rules.trim(),
                Validator_1.rules.exists({
                    table: "users",
                    column: "email"
                })
            ]),
            password: Validator_1.schema.string([
                Validator_1.rules.required(),
                Validator_1.rules.trim(),
                Validator_1.rules.escape()
            ])
        });
        this.messages = {
            "email.required": "Email Field is required",
            "email.exists": "Invalid Credentials",
            "password.required": "Password field is required"
        };
    }
}
exports.default = UserSignInValidator;
//# sourceMappingURL=UserSignInValidator.js.map