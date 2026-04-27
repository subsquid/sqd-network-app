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
exports.GatewayStake = void 0;
const typeorm_store_1 = require("@subsquid/typeorm-store");
const gateway_model_1 = require("./gateway.model");
let GatewayStake = class GatewayStake {
    constructor(props) {
        Object.assign(this, props);
    }
};
exports.GatewayStake = GatewayStake;
__decorate([
    (0, typeorm_store_1.PrimaryColumn)(),
    __metadata("design:type", String)
], GatewayStake.prototype, "id", void 0);
__decorate([
    (0, typeorm_store_1.Index)(),
    (0, typeorm_store_1.StringColumn)({ nullable: false }),
    __metadata("design:type", String)
], GatewayStake.prototype, "ownerId", void 0);
__decorate([
    (0, typeorm_store_1.BooleanColumn)({ nullable: false }),
    __metadata("design:type", Boolean)
], GatewayStake.prototype, "autoExtension", void 0);
__decorate([
    (0, typeorm_store_1.OneToMany)(() => gateway_model_1.Gateway, e => e.stake),
    __metadata("design:type", Array)
], GatewayStake.prototype, "gateways", void 0);
__decorate([
    (0, typeorm_store_1.BigIntColumn)({ nullable: false }),
    __metadata("design:type", BigInt)
], GatewayStake.prototype, "amount", void 0);
__decorate([
    (0, typeorm_store_1.BigIntColumn)({ nullable: false }),
    __metadata("design:type", BigInt)
], GatewayStake.prototype, "computationUnits", void 0);
__decorate([
    (0, typeorm_store_1.BigIntColumn)({ nullable: true }),
    __metadata("design:type", Object)
], GatewayStake.prototype, "computationUnitsPending", void 0);
__decorate([
    (0, typeorm_store_1.BooleanColumn)({ nullable: false }),
    __metadata("design:type", Boolean)
], GatewayStake.prototype, "locked", void 0);
__decorate([
    (0, typeorm_store_1.IntColumn)({ nullable: true }),
    __metadata("design:type", Object)
], GatewayStake.prototype, "lockStart", void 0);
__decorate([
    (0, typeorm_store_1.IntColumn)({ nullable: true }),
    __metadata("design:type", Object)
], GatewayStake.prototype, "lockEnd", void 0);
exports.GatewayStake = GatewayStake = __decorate([
    (0, typeorm_store_1.Entity)(),
    __metadata("design:paramtypes", [Object])
], GatewayStake);
//# sourceMappingURL=gatewayStake.model.js.map