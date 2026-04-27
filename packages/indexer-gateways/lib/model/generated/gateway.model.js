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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Gateway = void 0;
const typeorm_store_1 = require("@subsquid/typeorm-store");
const gatewayStake_model_1 = require("./gatewayStake.model");
const _gatewayStatus_1 = require("./_gatewayStatus");
const gatewayStatusChange_model_1 = require("./gatewayStatusChange.model");
let Gateway = class Gateway {
    constructor(props) {
        Object.assign(this, props);
    }
};
exports.Gateway = Gateway;
__decorate([
    (0, typeorm_store_1.PrimaryColumn)(),
    __metadata("design:type", String)
], Gateway.prototype, "id", void 0);
__decorate([
    (0, typeorm_store_1.DateTimeColumn)({ nullable: false }),
    __metadata("design:type", Date)
], Gateway.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_store_1.Index)(),
    (0, typeorm_store_1.StringColumn)({ nullable: false }),
    __metadata("design:type", String)
], Gateway.prototype, "ownerId", void 0);
__decorate([
    (0, typeorm_store_1.Index)(),
    (0, typeorm_store_1.ManyToOne)(() => gatewayStake_model_1.GatewayStake, { nullable: true }),
    __metadata("design:type", gatewayStake_model_1.GatewayStake)
], Gateway.prototype, "stake", void 0);
__decorate([
    (0, typeorm_store_1.Column)("varchar", { length: 12, nullable: false }),
    __metadata("design:type", String)
], Gateway.prototype, "status", void 0);
__decorate([
    (0, typeorm_store_1.OneToMany)(() => gatewayStatusChange_model_1.GatewayStatusChange, e => e.gateway),
    __metadata("design:type", Array)
], Gateway.prototype, "statusHistory", void 0);
__decorate([
    (0, typeorm_store_1.StringColumn)({ nullable: true }),
    __metadata("design:type", Object)
], Gateway.prototype, "name", void 0);
__decorate([
    (0, typeorm_store_1.StringColumn)({ nullable: true }),
    __metadata("design:type", Object)
], Gateway.prototype, "website", void 0);
__decorate([
    (0, typeorm_store_1.StringColumn)({ nullable: true }),
    __metadata("design:type", Object)
], Gateway.prototype, "email", void 0);
__decorate([
    (0, typeorm_store_1.StringColumn)({ nullable: true }),
    __metadata("design:type", Object)
], Gateway.prototype, "description", void 0);
__decorate([
    (0, typeorm_store_1.StringColumn)({ nullable: true }),
    __metadata("design:type", Object)
], Gateway.prototype, "endpointUrl", void 0);
exports.Gateway = Gateway = __decorate([
    (0, typeorm_store_1.Entity)(),
    __metadata("design:paramtypes", [Object])
], Gateway);
//# sourceMappingURL=gateway.model.js.map