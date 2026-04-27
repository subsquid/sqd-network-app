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
exports.PoolEvent = void 0;
const typeorm_store_1 = require("@subsquid/typeorm-store");
const portalPool_model_1 = require("./portalPool.model");
const _poolEventType_1 = require("./_poolEventType");
let PoolEvent = class PoolEvent {
    constructor(props) {
        Object.assign(this, props);
    }
};
exports.PoolEvent = PoolEvent;
__decorate([
    (0, typeorm_store_1.PrimaryColumn)(),
    __metadata("design:type", String)
], PoolEvent.prototype, "id", void 0);
__decorate([
    (0, typeorm_store_1.Index)(),
    (0, typeorm_store_1.IntColumn)({ nullable: false }),
    __metadata("design:type", Number)
], PoolEvent.prototype, "blockNumber", void 0);
__decorate([
    (0, typeorm_store_1.Index)(),
    (0, typeorm_store_1.DateTimeColumn)({ nullable: false }),
    __metadata("design:type", Date)
], PoolEvent.prototype, "timestamp", void 0);
__decorate([
    (0, typeorm_store_1.Index)(),
    (0, typeorm_store_1.StringColumn)({ nullable: false }),
    __metadata("design:type", String)
], PoolEvent.prototype, "txHash", void 0);
__decorate([
    (0, typeorm_store_1.ManyToOne)(() => portalPool_model_1.PortalPool, { nullable: true }),
    __metadata("design:type", portalPool_model_1.PortalPool)
], PoolEvent.prototype, "pool", void 0);
__decorate([
    (0, typeorm_store_1.Column)("varchar", { length: 10, nullable: false }),
    __metadata("design:type", String)
], PoolEvent.prototype, "eventType", void 0);
__decorate([
    (0, typeorm_store_1.BigIntColumn)({ nullable: false }),
    __metadata("design:type", BigInt)
], PoolEvent.prototype, "amount", void 0);
__decorate([
    (0, typeorm_store_1.StringColumn)({ nullable: true }),
    __metadata("design:type", Object)
], PoolEvent.prototype, "providerId", void 0);
exports.PoolEvent = PoolEvent = __decorate([
    (0, typeorm_store_1.Index)(["pool", "timestamp"], { unique: false }),
    (0, typeorm_store_1.Index)(["pool", "eventType", "timestamp"], { unique: false }),
    (0, typeorm_store_1.Entity)(),
    __metadata("design:paramtypes", [Object])
], PoolEvent);
//# sourceMappingURL=poolEvent.model.js.map