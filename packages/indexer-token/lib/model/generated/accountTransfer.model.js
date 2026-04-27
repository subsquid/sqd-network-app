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
exports.AccountTransfer = void 0;
const typeorm_store_1 = require("@subsquid/typeorm-store");
const _transferDirection_1 = require("./_transferDirection");
const account_model_1 = require("./account.model");
const transfer_model_1 = require("./transfer.model");
let AccountTransfer = class AccountTransfer {
    constructor(props) {
        Object.assign(this, props);
    }
};
exports.AccountTransfer = AccountTransfer;
__decorate([
    (0, typeorm_store_1.PrimaryColumn)(),
    __metadata("design:type", String)
], AccountTransfer.prototype, "id", void 0);
__decorate([
    (0, typeorm_store_1.Column)("varchar", { length: 4, nullable: false }),
    __metadata("design:type", String)
], AccountTransfer.prototype, "direction", void 0);
__decorate([
    (0, typeorm_store_1.ManyToOne)(() => account_model_1.Account, { nullable: true }),
    __metadata("design:type", account_model_1.Account)
], AccountTransfer.prototype, "account", void 0);
__decorate([
    (0, typeorm_store_1.Index)(),
    (0, typeorm_store_1.ManyToOne)(() => transfer_model_1.Transfer, { nullable: true }),
    __metadata("design:type", transfer_model_1.Transfer)
], AccountTransfer.prototype, "transfer", void 0);
__decorate([
    (0, typeorm_store_1.BigIntColumn)({ nullable: false }),
    __metadata("design:type", BigInt)
], AccountTransfer.prototype, "balance", void 0);
exports.AccountTransfer = AccountTransfer = __decorate([
    (0, typeorm_store_1.Index)(["account", "transfer"], { unique: false }),
    (0, typeorm_store_1.Entity)(),
    __metadata("design:paramtypes", [Object])
], AccountTransfer);
//# sourceMappingURL=accountTransfer.model.js.map