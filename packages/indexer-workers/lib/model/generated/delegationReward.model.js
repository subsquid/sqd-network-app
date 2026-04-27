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
exports.DelegationReward = void 0;
const typeorm_store_1 = require("@subsquid/typeorm-store");
const delegation_model_1 = require("./delegation.model");
let DelegationReward = class DelegationReward {
    constructor(props) {
        Object.assign(this, props);
    }
};
exports.DelegationReward = DelegationReward;
__decorate([
    (0, typeorm_store_1.PrimaryColumn)(),
    __metadata("design:type", String)
], DelegationReward.prototype, "id", void 0);
__decorate([
    (0, typeorm_store_1.IntColumn)({ nullable: false }),
    __metadata("design:type", Number)
], DelegationReward.prototype, "blockNumber", void 0);
__decorate([
    (0, typeorm_store_1.Index)(),
    (0, typeorm_store_1.DateTimeColumn)({ nullable: false }),
    __metadata("design:type", Date)
], DelegationReward.prototype, "timestamp", void 0);
__decorate([
    (0, typeorm_store_1.Index)(),
    (0, typeorm_store_1.ManyToOne)(() => delegation_model_1.Delegation, { nullable: true }),
    __metadata("design:type", Object)
], DelegationReward.prototype, "delegation", void 0);
__decorate([
    (0, typeorm_store_1.BigIntColumn)({ nullable: false }),
    __metadata("design:type", BigInt)
], DelegationReward.prototype, "amount", void 0);
__decorate([
    (0, typeorm_store_1.FloatColumn)({ nullable: false }),
    __metadata("design:type", Number)
], DelegationReward.prototype, "apr", void 0);
exports.DelegationReward = DelegationReward = __decorate([
    (0, typeorm_store_1.Entity)(),
    __metadata("design:paramtypes", [Object])
], DelegationReward);
//# sourceMappingURL=delegationReward.model.js.map