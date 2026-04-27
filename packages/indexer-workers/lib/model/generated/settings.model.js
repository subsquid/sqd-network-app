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
exports.Settings = void 0;
const typeorm_store_1 = require("@subsquid/typeorm-store");
const _contracts_1 = require("./_contracts");
let Settings = class Settings {
    constructor(props) {
        Object.assign(this, props);
    }
};
exports.Settings = Settings;
__decorate([
    (0, typeorm_store_1.PrimaryColumn)(),
    __metadata("design:type", String)
], Settings.prototype, "id", void 0);
__decorate([
    (0, typeorm_store_1.BigIntColumn)({ nullable: true }),
    __metadata("design:type", Object)
], Settings.prototype, "bondAmount", void 0);
__decorate([
    (0, typeorm_store_1.FloatColumn)({ nullable: false }),
    __metadata("design:type", Number)
], Settings.prototype, "delegationLimitCoefficient", void 0);
__decorate([
    (0, typeorm_store_1.IntColumn)({ nullable: true }),
    __metadata("design:type", Object)
], Settings.prototype, "epochLength", void 0);
__decorate([
    (0, typeorm_store_1.StringColumn)({ nullable: true }),
    __metadata("design:type", Object)
], Settings.prototype, "minimalWorkerVersion", void 0);
__decorate([
    (0, typeorm_store_1.StringColumn)({ nullable: true }),
    __metadata("design:type", Object)
], Settings.prototype, "recommendedWorkerVersion", void 0);
__decorate([
    (0, typeorm_store_1.IntColumn)({ nullable: true }),
    __metadata("design:type", Object)
], Settings.prototype, "lockPeriod", void 0);
__decorate([
    (0, typeorm_store_1.Column)("jsonb", { transformer: { to: obj => obj.toJSON(), from: obj => obj == null ? undefined : new _contracts_1.Contracts(undefined, obj) }, nullable: false }),
    __metadata("design:type", _contracts_1.Contracts)
], Settings.prototype, "contracts", void 0);
__decorate([
    (0, typeorm_store_1.IntColumn)({ nullable: true }),
    __metadata("design:type", Object)
], Settings.prototype, "currentEpoch", void 0);
__decorate([
    (0, typeorm_store_1.BigIntColumn)({ nullable: false }),
    __metadata("design:type", BigInt)
], Settings.prototype, "utilizedStake", void 0);
__decorate([
    (0, typeorm_store_1.FloatColumn)({ nullable: false }),
    __metadata("design:type", Number)
], Settings.prototype, "baseApr", void 0);
__decorate([
    (0, typeorm_store_1.DateTimeColumn)({ nullable: true }),
    __metadata("design:type", Object)
], Settings.prototype, "statsChunkCursor", void 0);
exports.Settings = Settings = __decorate([
    (0, typeorm_store_1.Entity)(),
    __metadata("design:paramtypes", [Object])
], Settings);
//# sourceMappingURL=settings.model.js.map