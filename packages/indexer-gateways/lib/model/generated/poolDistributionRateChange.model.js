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
exports.PoolDistributionRateChange = void 0;
const typeorm_store_1 = require("@subsquid/typeorm-store");
const portalPool_model_1 = require("./portalPool.model");
let PoolDistributionRateChange = class PoolDistributionRateChange {
    constructor(props) {
        Object.assign(this, props);
    }
};
exports.PoolDistributionRateChange = PoolDistributionRateChange;
__decorate([
    (0, typeorm_store_1.PrimaryColumn)(),
    __metadata("design:type", String)
], PoolDistributionRateChange.prototype, "id", void 0);
__decorate([
    (0, typeorm_store_1.Index)(),
    (0, typeorm_store_1.IntColumn)({ nullable: false }),
    __metadata("design:type", Number)
], PoolDistributionRateChange.prototype, "blockNumber", void 0);
__decorate([
    (0, typeorm_store_1.Index)(),
    (0, typeorm_store_1.DateTimeColumn)({ nullable: false }),
    __metadata("design:type", Date)
], PoolDistributionRateChange.prototype, "timestamp", void 0);
__decorate([
    (0, typeorm_store_1.Index)(),
    (0, typeorm_store_1.StringColumn)({ nullable: false }),
    __metadata("design:type", String)
], PoolDistributionRateChange.prototype, "txHash", void 0);
__decorate([
    (0, typeorm_store_1.ManyToOne)(() => portalPool_model_1.PortalPool, { nullable: true }),
    __metadata("design:type", portalPool_model_1.PortalPool)
], PoolDistributionRateChange.prototype, "pool", void 0);
__decorate([
    (0, typeorm_store_1.BigIntColumn)({ nullable: false }),
    __metadata("design:type", BigInt)
], PoolDistributionRateChange.prototype, "oldRate", void 0);
__decorate([
    (0, typeorm_store_1.BigIntColumn)({ nullable: false }),
    __metadata("design:type", BigInt)
], PoolDistributionRateChange.prototype, "newRate", void 0);
exports.PoolDistributionRateChange = PoolDistributionRateChange = __decorate([
    (0, typeorm_store_1.Index)(["pool", "timestamp"], { unique: false }),
    (0, typeorm_store_1.Entity)(),
    __metadata("design:paramtypes", [Object])
], PoolDistributionRateChange);
//# sourceMappingURL=poolDistributionRateChange.model.js.map