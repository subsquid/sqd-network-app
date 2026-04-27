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
exports.DelegationStatusChange = void 0;
const typeorm_store_1 = require("@subsquid/typeorm-store");
const delegation_model_1 = require("./delegation.model");
const _delegationStatus_1 = require("./_delegationStatus");
let DelegationStatusChange = class DelegationStatusChange {
    constructor(props) {
        Object.assign(this, props);
    }
};
exports.DelegationStatusChange = DelegationStatusChange;
__decorate([
    (0, typeorm_store_1.PrimaryColumn)(),
    __metadata("design:type", String)
], DelegationStatusChange.prototype, "id", void 0);
__decorate([
    (0, typeorm_store_1.ManyToOne)(() => delegation_model_1.Delegation, { nullable: true }),
    __metadata("design:type", Object)
], DelegationStatusChange.prototype, "delegation", void 0);
__decorate([
    (0, typeorm_store_1.Column)("varchar", { length: 9, nullable: false }),
    __metadata("design:type", String)
], DelegationStatusChange.prototype, "status", void 0);
__decorate([
    (0, typeorm_store_1.DateTimeColumn)({ nullable: true }),
    __metadata("design:type", Object)
], DelegationStatusChange.prototype, "timestamp", void 0);
__decorate([
    (0, typeorm_store_1.IntColumn)({ nullable: false }),
    __metadata("design:type", Number)
], DelegationStatusChange.prototype, "blockNumber", void 0);
__decorate([
    (0, typeorm_store_1.BooleanColumn)({ nullable: false }),
    __metadata("design:type", Boolean)
], DelegationStatusChange.prototype, "pending", void 0);
exports.DelegationStatusChange = DelegationStatusChange = __decorate([
    (0, typeorm_store_1.Index)(["pending", "timestamp"], { unique: false }),
    (0, typeorm_store_1.Index)(["status", "timestamp"], { unique: false }),
    (0, typeorm_store_1.Index)(["delegation", "blockNumber"], { unique: false }),
    (0, typeorm_store_1.Entity)(),
    __metadata("design:paramtypes", [Object])
], DelegationStatusChange);
//# sourceMappingURL=delegationStatusChange.model.js.map