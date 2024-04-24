"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Validator_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Validator");
class UserRequestValidator {
    constructor(ctx) {
        this.ctx = ctx;
        this.schema = Validator_1.schema.create({
            email: Validator_1.schema.string([
                Validator_1.rules.email(),
                Validator_1.rules.required(),
                Validator_1.rules.trim(),
                Validator_1.rules.unique({
                    table: "users",
                    column: "email"
                })
            ]),
            firstname: Validator_1.schema.string([
                Validator_1.rules.required(),
                Validator_1.rules.trim(),
                Validator_1.rules.escape()
            ]),
            lastname: Validator_1.schema.string([
                Validator_1.rules.required(),
                Validator_1.rules.trim(),
                Validator_1.rules.escape()
            ]),
            password: Validator_1.schema.string([
                Validator_1.rules.required(),
                Validator_1.rules.trim(),
                Validator_1.rules.escape(),
                Validator_1.rules.minLength(8)
            ])
        });
        this.messages = {
            "email.required": "Email Field is required",
            "email.unique": "Email address taken, did you forget your password? try recovering your account",
            "firstname.required": "Firstname field is required",
            "lastname.required": "Lastname field is required",
            "password.required": "Password field is required",
            "password.minLength": "Password should contain a minimum of 8 characters"
        };
    }
}
exports.default = UserRequestValidator;
//# sourceMappingURL=UserRequestValidator.js.map