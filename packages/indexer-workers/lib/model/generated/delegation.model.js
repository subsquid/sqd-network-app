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
exports.Delegation = void 0;
const typeorm_store_1 = require("@subsquid/typeorm-store");
const worker_model_1 = require("./worker.model");
const _delegationStatus_1 = require("./_delegationStatus");
const delegationStatusChange_model_1 = require("./delegationStatusChange.model");
const delegationReward_model_1 = require("./delegationReward.model");
let Delegation = class Delegation {
    constructor(props) {
        Object.assign(this, props);
    }
};
exports.Delegation = Delegation;
__decorate([
    (0, typeorm_store_1.PrimaryColumn)(),
    __metadata("design:type", String)
], Delegation.prototype, "id", void 0);
__decorate([
    (0, typeorm_store_1.Index)(),
    (0, typeorm_store_1.StringColumn)({ nullable: false }),
    __metadata("design:type", String)
], Delegation.prototype, "ownerId", void 0);
__decorate([
    (0, typeorm_store_1.Index)(),
    (0, typeorm_store_1.ManyToOne)(() => worker_model_1.Worker, { nullable: true }),
    __metadata("design:type", Object)
], Delegation.prototype, "worker", void 0);
__decorate([
    (0, typeorm_store_1.Column)("varchar", { length: 9, nullable: false }),
    __metadata("design:type", String)
], Delegation.prototype, "status", void 0);
__decorate([
    (0, typeorm_store_1.OneToMany)(() => delegationStatusChange_model_1.DelegationStatusChange, e => e.delegation),
    __metadata("design:type", Object)
], Delegation.prototype, "statusHistory", void 0);
__decorate([
    (0, typeorm_store_1.BigIntColumn)({ nullable: false }),
    __metadata("design:type", BigInt)
], Delegation.prototype, "deposit", void 0);
__decorate([
    (0, typeorm_store_1.BooleanColumn)({ nullable: true }),
    __metadata("design:type", Object)
], Delegation.prototype, "locked", void 0);
__decorate([
    (0, typeorm_store_1.IntColumn)({ nullable: true }),
    __metadata("design:type", Object)
], Delegation.prototype, "lockStart", void 0);
__decorate([
    (0, typeorm_store_1.IntColumn)({ nullable: true }),
    __metadata("design:type", Object)
], Delegation.prototype, "lockEnd", void 0);
__decorate([
    (0, typeorm_store_1.BigIntColumn)({ nullable: false }),
    __metadata("design:type", BigInt)
], Delegation.prototype, "claimableReward", void 0);
__decorate([
    (0, typeorm_store_1.OneToMany)(() => delegationReward_model_1.DelegationReward, e => e.delegation),
    __metadata("design:type", Object)
], Delegation.prototype, "rewards", void 0);
__decorate([
    (0, typeorm_store_1.BigIntColumn)({ nullable: false }),
    __metadata("design:type", BigInt)
], Delegation.prototype, "claimedReward", void 0);
exports.Delegation = Delegation = __decorate([
    (0, typeorm_store_1.Entity)(),
    __metadata("design:paramtypes", [Object])
], Delegation);
//# sourceMappingURL=delegation.model.js.map