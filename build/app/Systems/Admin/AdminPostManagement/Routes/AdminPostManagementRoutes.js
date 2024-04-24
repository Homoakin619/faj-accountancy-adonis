"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Route_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Route"));
Route_1.default.group(() => {
    Route_1.default.post("/post/create", "CreatePostController");
    Route_1.default.get("/post", "GetAllPostController");
    Route_1.default.delete('/post/:id', "DeletePostController");
    Route_1.default.post('/post/:id/publish', 'PublishPostController');
    Route_1.default.post('/post/:id/unpublish', 'UnpublishPostController');
})
    .prefix('/api/admin')
    .middleware(['auth:api', 'admin'])
    .namespace('App/Systems/Admin/AdminPostManagement/Controllers/AdminPostManagement');
//# sourceMappingURL=AdminPostManagementRoutes.js.map