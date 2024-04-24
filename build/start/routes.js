"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Route_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Route"));
const HttpStatusCodeEnum_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Common/Helpers/HttpStatusCodeEnum"));
Route_1.default.get('/', async ({ view }) => {
    return view.render('welcome');
});
Route_1.default.get("/unauthorized", ({ response }) => {
    return response.status(HttpStatusCodeEnum_1.default.UNAUTHORIZED_REQUEST).send({
        body: [],
        message: "Unauthorized Request",
        status: HttpStatusCodeEnum_1.default.UNAUTHORIZED_REQUEST
    });
});
global[Symbol.for('ioc.use')]("App/Systems/ProjectRoutes");
//# sourceMappingURL=routes.js.map