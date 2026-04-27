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
exports.PortalPool = void 0;
const typeorm_store_1 = require("@subsquid/typeorm-store");
const poolProvider_model_1 = require("./poolProvider.model");
const poolEvent_model_1 = require("./poolEvent.model");
const poolDistributionRateChange_model_1 = require("./poolDistributionRateChange.model");
const poolCapacityChange_model_1 = require("./poolCapacityChange.model");
let PortalPool = class PortalPool {
    constructor(props) {
        Object.assign(this, props);
    }
};
exports.PortalPool = PortalPool;
__decorate([
    (0, typeorm_store_1.PrimaryColumn)(),
    __metadata("design:type", String)
], PortalPool.prototype, "id", void 0);
__decorate([
    (0, typeorm_store_1.Index)(),
    (0, typeorm_store_1.DateTimeColumn)({ nullable: false }),
    __metadata("design:type", Date)
], PortalPool.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_store_1.IntColumn)({ nullable: false }),
    __metadata("design:type", Number)
], PortalPool.prototype, "createdAtBlock", void 0);
__decorate([
    (0, typeorm_store_1.DateTimeColumn)({ nullable: true }),
    __metadata("design:type", Object)
], PortalPool.prototype, "closedAt", void 0);
__decorate([
    (0, typeorm_store_1.IntColumn)({ nullable: true }),
    __metadata("design:type", Object)
], PortalPool.prototype, "closedAtBlock", void 0);
__decorate([
    (0, typeorm_store_1.Index)(),
    (0, typeorm_store_1.StringColumn)({ nullable: false }),
    __metadata("design:type", String)
], PortalPool.prototype, "operator", void 0);
__decorate([
    (0, typeorm_store_1.StringColumn)({ nullable: false }),
    __metadata("design:type", String)
], PortalPool.prototype, "rewardToken", void 0);
__decorate([
    (0, typeorm_store_1.StringColumn)({ nullable: false }),
    __metadata("design:type", String)
], PortalPool.prototype, "tokenSuffix", void 0);
__decorate([
    (0, typeorm_store_1.StringColumn)({ nullable: true }),
    __metadata("design:type", Object)
], PortalPool.prototype, "metadata", void 0);
__decorate([
    (0, typeorm_store_1.BigIntColumn)({ nullable: false }),
    __metadata("design:type", BigInt)
], PortalPool.prototype, "capacity", void 0);
__decorate([
    (0, typeorm_store_1.BigIntColumn)({ nullable: false }),
    __metadata("design:type", BigInt)
], PortalPool.prototype, "rewardRate", void 0);
__decorate([
    (0, typeorm_store_1.BigIntColumn)({ nullable: false }),
    __metadata("design:type", BigInt)
], PortalPool.prototype, "totalRewardsToppedUp", void 0);
__decorate([
    (0, typeorm_store_1.Index)(),
    (0, typeorm_store_1.BigIntColumn)({ nullable: false }),
    __metadata("design:type", BigInt)
], PortalPool.prototype, "tvlTotal", void 0);
__decorate([
    (0, typeorm_store_1.Index)(),
    (0, typeorm_store_1.BigIntColumn)({ nullable: false }),
    __metadata("design:type", BigInt)
], PortalPool.prototype, "tvlStable", void 0);
__decorate([
    (0, typeorm_store_1.OneToMany)(() => poolProvider_model_1.PoolProvider, e => e.pool),
    __metadata("design:type", Array)
], PortalPool.prototype, "providers", void 0);
__decorate([
    (0, typeorm_store_1.OneToMany)(() => poolEvent_model_1.PoolEvent, e => e.pool),
    __metadata("design:type", Array)
], PortalPool.prototype, "events", void 0);
__decorate([
    (0, typeorm_store_1.OneToMany)(() => poolDistributionRateChange_model_1.PoolDistributionRateChange, e => e.pool),
    __metadata("design:type", Array)
], PortalPool.prototype, "distributionRateHistory", void 0);
__decorate([
    (0, typeorm_store_1.OneToMany)(() => poolCapacityChange_model_1.PoolCapacityChange, e => e.pool),
    __metadata("design:type", Array)
], PortalPool.prototype, "capacityHistory", void 0);
exports.PortalPool = PortalPool = __decorate([
    (0, typeorm_store_1.Entity)(),
    __metadata("design:paramtypes", [Object])
], PortalPool);
//# sourceMappingURL=portalPool.model.js.map