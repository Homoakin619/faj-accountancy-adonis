"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Route_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Route"));
Route_1.default.group(() => {
    Route_1.default.post("/signup", "CreateUserController");
    Route_1.default.post("/admin/signup", "CreateAdminUserController");
    Route_1.default.post("/login", "SigninUserController");
    Route_1.default.post("/logout", "SignoutUserController").middleware('auth:api');
})
    .prefix('/api')
    .namespace('App/Systems/Client/UserManagement/Controllers/UserModule');
//# sourceMappingURL=UserModuleRoutes.js.map