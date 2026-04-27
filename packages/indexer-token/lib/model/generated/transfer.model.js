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
exports.Transfer = void 0;
const typeorm_store_1 = require("@subsquid/typeorm-store");
const _transferType_1 = require("./_transferType");
const account_model_1 = require("./account.model");
let Transfer = class Transfer {
    constructor(props) {
        Object.assign(this, props);
    }
};
exports.Transfer = Transfer;
__decorate([
    (0, typeorm_store_1.PrimaryColumn)(),
    __metadata("design:type", String)
], Transfer.prototype, "id", void 0);
__decorate([
    (0, typeorm_store_1.IntColumn)({ nullable: false }),
    __metadata("design:type", Number)
], Transfer.prototype, "blockNumber", void 0);
__decorate([
    (0, typeorm_store_1.Index)(),
    (0, typeorm_store_1.DateTimeColumn)({ nullable: false }),
    __metadata("design:type", Date)
], Transfer.prototype, "timestamp", void 0);
__decorate([
    (0, typeorm_store_1.Index)(),
    (0, typeorm_store_1.StringColumn)({ nullable: false }),
    __metadata("design:type", String)
], Transfer.prototype, "txHash", void 0);
__decorate([
    (0, typeorm_store_1.Column)("varchar", { length: 8, nullable: false }),
    __metadata("design:type", String)
], Transfer.prototype, "type", void 0);
__decorate([
    (0, typeorm_store_1.Index)(),
    (0, typeorm_store_1.ManyToOne)(() => account_model_1.Account, { nullable: true }),
    __metadata("design:type", account_model_1.Account)
], Transfer.prototype, "from", void 0);
__decorate([
    (0, typeorm_store_1.Index)(),
    (0, typeorm_store_1.ManyToOne)(() => account_model_1.Account, { nullable: true }),
    __metadata("design:type", account_model_1.Account)
], Transfer.prototype, "to", void 0);
__decorate([
    (0, typeorm_store_1.BigIntColumn)({ nullable: false }),
    __metadata("design:type", BigInt)
], Transfer.prototype, "amount", void 0);
__decorate([
    (0, typeorm_store_1.StringColumn)({ nullable: true }),
    __metadata("design:type", Object)
], Transfer.prototype, "delegationId", void 0);
__decorate([
    (0, typeorm_store_1.StringColumn)({ nullable: true }),
    __metadata("design:type", Object)
], Transfer.prototype, "workerId", void 0);
__decorate([
    (0, typeorm_store_1.StringColumn)({ nullable: true }),
    __metadata("design:type", Object)
], Transfer.prototype, "gatewayStakeId", void 0);
__decorate([
    (0, typeorm_store_1.StringColumn)({ nullable: true }),
    __metadata("design:type", Object)
], Transfer.prototype, "vestingId", void 0);
__decorate([
    (0, typeorm_store_1.StringColumn)({ nullable: true }),
    __metadata("design:type", Object)
], Transfer.prototype, "portalPoolId", void 0);
exports.Transfer = Transfer = __decorate([
    (0, typeorm_store_1.Index)(["type", "timestamp"], { unique: false }),
    (0, typeorm_store_1.Entity)(),
    __metadata("design:paramtypes", [Object])
], Transfer);
//# sourceMappingURL=transfer.model.js.map