"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AdminMiddleware {
    async handle({ response, auth }, next) {
        if (!auth.user.isAdmin) {
            return response.redirect('/unauthorized');
        }
        await next();
    }
}
exports.default = AdminMiddleware;
//# sourceMappingURL=Admin.js.map