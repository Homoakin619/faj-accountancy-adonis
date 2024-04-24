"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Route_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Route"));
Route_1.default.group(() => {
    Route_1.default.post("/subscription", "CreateSubscriptionController");
    Route_1.default.get("/subscription", "GetAllSubscriptionController");
    Route_1.default.get("/subscription/:id", "GetSubscriptionController");
    Route_1.default.delete('/subscription/:id', "DeleteSubscriptionController");
    Route_1.default.post("/subscription/:id/user/:user_id", "SubscribeUserController");
    Route_1.default.post("/subscription/unsubscribe/:id/user/:user_id", "UnsubscribeUserController");
})
    .prefix('/api/admin')
    .middleware(['auth:api', 'admin'])
    .namespace('App/Systems/Admin/AdminSubscriptionManagement/Controllers/AdminSubscriptionManagement');
//# sourceMappingURL=AdminSubscriptionManagementRoutes.js.map