"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Orm_1 = global[Symbol.for('ioc.use')]("Adonis/Lucid/Orm");
const AbstractBaseModel_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Common/Models/AbstractBaseModel"));
const luxon_1 = require("luxon");
const Subscription_1 = __importDefault(require("../../Subscription/Models/Subscription"));
const Hash_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Hash"));
class User extends AbstractBaseModel_1.default {
    static async hashPassword(user) {
        if (user.$dirty.password) {
            user.password = await Hash_1.default.make(user.password);
        }
    }
}
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], User.prototype, "firstname", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], User.prototype, "lastname", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, Orm_1.column)({ serializeAs: null }),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Boolean)
], User.prototype, "isAdmin", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Boolean)
], User.prototype, "isActive", void 0);
__decorate([
    Orm_1.column.dateTime(),
    __metadata("design:type", luxon_1.DateTime)
], User.prototype, "lastLogin", void 0);
__decorate([
    (0, Orm_1.manyToMany)(() => Subscription_1.default, {
        pivotTable: "user_subscriptions",
        pivotTimestamps: true
    }),
    __metadata("design:type", Object)
], User.prototype, "subscriptions", void 0);
__decorate([
    (0, Orm_1.beforeSave)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [User]),
    __metadata("design:returntype", Promise)
], User, "hashPassword", null);
exports.default = User;
//# sourceMappingURL=User.js.map