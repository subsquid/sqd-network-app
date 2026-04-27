"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Worker = void 0;
const typeorm_store_1 = require("@subsquid/typeorm-store");
const marshal = __importStar(require("./marshal"));
const _workerStatus_1 = require("./_workerStatus");
const workerStatusChange_model_1 = require("./workerStatusChange.model");
const workerReward_model_1 = require("./workerReward.model");
const delegation_model_1 = require("./delegation.model");
const _workerDayUptime_1 = require("./_workerDayUptime");
const workerSnapshot_model_1 = require("./workerSnapshot.model");
let Worker = class Worker {
    constructor(props) {
        Object.assign(this, props);
    }
};
exports.Worker = Worker;
__decorate([
    (0, typeorm_store_1.PrimaryColumn)(),
    __metadata("design:type", String)
], Worker.prototype, "id", void 0);
__decorate([
    (0, typeorm_store_1.Index)(),
    (0, typeorm_store_1.StringColumn)({ nullable: false }),
    __metadata("design:type", String)
], Worker.prototype, "peerId", void 0);
__decorate([
    (0, typeorm_store_1.Index)(),
    (0, typeorm_store_1.StringColumn)({ nullable: false }),
    __metadata("design:type", String)
], Worker.prototype, "ownerId", void 0);
__decorate([
    (0, typeorm_store_1.BigIntColumn)({ nullable: false }),
    __metadata("design:type", BigInt)
], Worker.prototype, "bond", void 0);
__decorate([
    (0, typeorm_store_1.DateTimeColumn)({ nullable: false }),
    __metadata("design:type", Date)
], Worker.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_store_1.BooleanColumn)({ nullable: true }),
    __metadata("design:type", Object)
], Worker.prototype, "locked", void 0);
__decorate([
    (0, typeorm_store_1.IntColumn)({ nullable: true }),
    __metadata("design:type", Object)
], Worker.prototype, "lockStart", void 0);
__decorate([
    (0, typeorm_store_1.IntColumn)({ nullable: true }),
    __metadata("design:type", Object)
], Worker.prototype, "lockEnd", void 0);
__decorate([
    (0, typeorm_store_1.StringColumn)({ nullable: true }),
    __metadata("design:type", Object)
], Worker.prototype, "name", void 0);
__decorate([
    (0, typeorm_store_1.StringColumn)({ nullable: true }),
    __metadata("design:type", Object)
], Worker.prototype, "website", void 0);
__decorate([
    (0, typeorm_store_1.StringColumn)({ nullable: true }),
    __metadata("design:type", Object)
], Worker.prototype, "email", void 0);
__decorate([
    (0, typeorm_store_1.StringColumn)({ nullable: true }),
    __metadata("design:type", Object)
], Worker.prototype, "description", void 0);
__decorate([
    (0, typeorm_store_1.Column)("varchar", { length: 13, nullable: false }),
    __metadata("design:type", String)
], Worker.prototype, "status", void 0);
__decorate([
    (0, typeorm_store_1.OneToMany)(() => workerStatusChange_model_1.WorkerStatusChange, e => e.worker),
    __metadata("design:type", Object)
], Worker.prototype, "statusHistory", void 0);
__decorate([
    (0, typeorm_store_1.BigIntColumn)({ nullable: false }),
    __metadata("design:type", BigInt)
], Worker.prototype, "claimableReward", void 0);
__decorate([
    (0, typeorm_store_1.OneToMany)(() => workerReward_model_1.WorkerReward, e => e.worker),
    __metadata("design:type", Object)
], Worker.prototype, "rewards", void 0);
__decorate([
    (0, typeorm_store_1.BigIntColumn)({ nullable: false }),
    __metadata("design:type", BigInt)
], Worker.prototype, "claimedReward", void 0);
__decorate([
    (0, typeorm_store_1.FloatColumn)({ nullable: true }),
    __metadata("design:type", Object)
], Worker.prototype, "apr", void 0);
__decorate([
    (0, typeorm_store_1.FloatColumn)({ nullable: true }),
    __metadata("design:type", Object)
], Worker.prototype, "stakerApr", void 0);
__decorate([
    (0, typeorm_store_1.BigIntColumn)({ nullable: false }),
    __metadata("design:type", BigInt)
], Worker.prototype, "totalDelegation", void 0);
__decorate([
    (0, typeorm_store_1.BigIntColumn)({ nullable: false }),
    __metadata("design:type", BigInt)
], Worker.prototype, "capedDelegation", void 0);
__decorate([
    (0, typeorm_store_1.IntColumn)({ nullable: false }),
    __metadata("design:type", Number)
], Worker.prototype, "delegationCount", void 0);
__decorate([
    (0, typeorm_store_1.OneToMany)(() => delegation_model_1.Delegation, e => e.worker),
    __metadata("design:type", Object)
], Worker.prototype, "delegations", void 0);
__decorate([
    (0, typeorm_store_1.BigIntColumn)({ nullable: false }),
    __metadata("design:type", BigInt)
], Worker.prototype, "totalDelegationRewards", void 0);
__decorate([
    (0, typeorm_store_1.Index)(),
    (0, typeorm_store_1.BooleanColumn)({ nullable: true }),
    __metadata("design:type", Object)
], Worker.prototype, "online", void 0);
__decorate([
    (0, typeorm_store_1.BooleanColumn)({ nullable: true }),
    __metadata("design:type", Object)
], Worker.prototype, "dialOk", void 0);
__decorate([
    (0, typeorm_store_1.BooleanColumn)({ nullable: true }),
    __metadata("design:type", Object)
], Worker.prototype, "jailed", void 0);
__decorate([
    (0, typeorm_store_1.StringColumn)({ nullable: true }),
    __metadata("design:type", Object)
], Worker.prototype, "jailReason", void 0);
__decorate([
    (0, typeorm_store_1.StringColumn)({ nullable: true }),
    __metadata("design:type", Object)
], Worker.prototype, "version", void 0);
__decorate([
    (0, typeorm_store_1.BigIntColumn)({ nullable: true }),
    __metadata("design:type", Object)
], Worker.prototype, "storedData", void 0);
__decorate([
    (0, typeorm_store_1.BigIntColumn)({ nullable: true }),
    __metadata("design:type", Object)
], Worker.prototype, "queries24Hours", void 0);
__decorate([
    (0, typeorm_store_1.BigIntColumn)({ nullable: true }),
    __metadata("design:type", Object)
], Worker.prototype, "queries90Days", void 0);
__decorate([
    (0, typeorm_store_1.BigIntColumn)({ nullable: true }),
    __metadata("design:type", Object)
], Worker.prototype, "servedData24Hours", void 0);
__decorate([
    (0, typeorm_store_1.BigIntColumn)({ nullable: true }),
    __metadata("design:type", Object)
], Worker.prototype, "servedData90Days", void 0);
__decorate([
    (0, typeorm_store_1.BigIntColumn)({ nullable: true }),
    __metadata("design:type", Object)
], Worker.prototype, "scannedData24Hours", void 0);
__decorate([
    (0, typeorm_store_1.BigIntColumn)({ nullable: true }),
    __metadata("design:type", Object)
], Worker.prototype, "scannedData90Days", void 0);
__decorate([
    (0, typeorm_store_1.FloatColumn)({ nullable: true }),
    __metadata("design:type", Object)
], Worker.prototype, "uptime24Hours", void 0);
__decorate([
    (0, typeorm_store_1.FloatColumn)({ nullable: true }),
    __metadata("design:type", Object)
], Worker.prototype, "uptime90Days", void 0);
__decorate([
    (0, typeorm_store_1.FloatColumn)({ nullable: true }),
    __metadata("design:type", Object)
], Worker.prototype, "trafficWeight", void 0);
__decorate([
    (0, typeorm_store_1.FloatColumn)({ nullable: true }),
    __metadata("design:type", Object)
], Worker.prototype, "liveness", void 0);
__decorate([
    (0, typeorm_store_1.FloatColumn)({ nullable: true }),
    __metadata("design:type", Object)
], Worker.prototype, "dTenure", void 0);
__decorate([
    (0, typeorm_store_1.Column)("jsonb", { transformer: { to: obj => obj == null ? undefined : obj.map((val) => val.toJSON()), from: obj => obj == null ? undefined : marshal.fromList(obj, val => new _workerDayUptime_1.WorkerDayUptime(undefined, marshal.nonNull(val))) }, nullable: true }),
    __metadata("design:type", Object)
], Worker.prototype, "dayUptimes", void 0);
__decorate([
    (0, typeorm_store_1.OneToMany)(() => workerSnapshot_model_1.WorkerSnapshot, e => e.worker),
    __metadata("design:type", Object)
], Worker.prototype, "snapshots", void 0);
exports.Worker = Worker = __decorate([
    (0, typeorm_store_1.Index)(["id", "createdAt", "status"], { unique: false }),
    (0, typeorm_store_1.Index)(["status", "online"], { unique: false }),
    (0, typeorm_store_1.Entity)(),
    __metadata("design:paramtypes", [Object])
], Worker);
//# sourceMappingURL=worker.model.js.map