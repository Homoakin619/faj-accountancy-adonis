"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Route_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Route"));
Route_1.default.group(() => {
    Route_1.default.get('/content/:id', "GetAllUserPostController");
    Route_1.default.get('/content/', "GetUserPostController");
})
    .prefix('/api')
    .namespace('App/Systems/Client/PostsManagement/Controllers/Posts');
//# sourceMappingURL=PostsRoutes.js.map