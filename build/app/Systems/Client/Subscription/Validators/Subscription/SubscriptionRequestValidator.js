"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Validator_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Validator");
class SubscriptionRequestValidator {
    constructor(ctx) {
        this.ctx = ctx;
        this.schema = Validator_1.schema.create({
            title: Validator_1.schema.string([
                Validator_1.rules.required(),
                Validator_1.rules.unique({
                    table: "subscriptions",
                    column: "title"
                })
            ])
        });
        this.messages = {
            "title.required": "Enter a valid title for this subscription",
            "title.unique": "Subscription exists"
        };
    }
}
exports.default = SubscriptionRequestValidator;
//# sourceMappingURL=SubscriptionRequestValidator.js.map