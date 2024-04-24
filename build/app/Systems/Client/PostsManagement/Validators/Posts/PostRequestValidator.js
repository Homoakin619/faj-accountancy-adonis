"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Validator_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Validator");
class PostRequestValidator {
    constructor(ctx) {
        this.ctx = ctx;
        this.schema = Validator_1.schema.create({
            title: Validator_1.schema.string([
                Validator_1.rules.required(),
                Validator_1.rules.unique({
                    table: "posts",
                    column: "title"
                }),
                Validator_1.rules.minLength(3),
                Validator_1.rules.escape(),
            ]),
            description: Validator_1.schema.string([
                Validator_1.rules.nullable(),
                Validator_1.rules.escape(),
            ]),
            body: Validator_1.schema.string([
                Validator_1.rules.escape(),
                Validator_1.rules.nullable(),
            ]),
            isPublished: Validator_1.schema.boolean([
                Validator_1.rules.nullable()
            ]),
            images: Validator_1.schema.string([
                Validator_1.rules.nullable(),
                Validator_1.rules.escape(),
            ]),
            video: Validator_1.schema.string([
                Validator_1.rules.nullable(),
                Validator_1.rules.escape()
            ]),
            subscriptionId: Validator_1.schema.number()
        });
        this.messages = {
            "title.required": "Enter a valid title for this subscription",
            "subscription": "Enter a valid Subscription ID"
        };
    }
}
exports.default = PostRequestValidator;
//# sourceMappingURL=PostRequestValidator.js.map