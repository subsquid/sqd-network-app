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
exports.GatewayStatusChange = void 0;
const typeorm_store_1 = require("@subsquid/typeorm-store");
const gateway_model_1 = require("./gateway.model");
const _gatewayStatus_1 = require("./_gatewayStatus");
let GatewayStatusChange = class GatewayStatusChange {
    constructor(props) {
        Object.assign(this, props);
    }
};
exports.GatewayStatusChange = GatewayStatusChange;
__decorate([
    (0, typeorm_store_1.PrimaryColumn)(),
    __metadata("design:type", String)
], GatewayStatusChange.prototype, "id", void 0);
__decorate([
    (0, typeorm_store_1.Index)(),
    (0, typeorm_store_1.ManyToOne)(() => gateway_model_1.Gateway, { nullable: true }),
    __metadata("design:type", gateway_model_1.Gateway)
], GatewayStatusChange.prototype, "gateway", void 0);
__decorate([
    (0, typeorm_store_1.Column)("varchar", { length: 12, nullable: false }),
    __metadata("design:type", String)
], GatewayStatusChange.prototype, "status", void 0);
__decorate([
    (0, typeorm_store_1.DateTimeColumn)({ nullable: true }),
    __metadata("design:type", Object)
], GatewayStatusChange.prototype, "timestamp", void 0);
__decorate([
    (0, typeorm_store_1.IntColumn)({ nullable: false }),
    __metadata("design:type", Number)
], GatewayStatusChange.prototype, "blockNumber", void 0);
exports.GatewayStatusChange = GatewayStatusChange = __decorate([
    (0, typeorm_store_1.Entity)(),
    __metadata("design:paramtypes", [Object])
], GatewayStatusChange);
//# sourceMappingURL=gatewayStatusChange.model.js.map