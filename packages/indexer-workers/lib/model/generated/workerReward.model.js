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
exports.WorkerReward = void 0;
const typeorm_store_1 = require("@subsquid/typeorm-store");
const worker_model_1 = require("./worker.model");
let WorkerReward = class WorkerReward {
    constructor(props) {
        Object.assign(this, props);
    }
};
exports.WorkerReward = WorkerReward;
__decorate([
    (0, typeorm_store_1.PrimaryColumn)(),
    __metadata("design:type", String)
], WorkerReward.prototype, "id", void 0);
__decorate([
    (0, typeorm_store_1.IntColumn)({ nullable: false }),
    __metadata("design:type", Number)
], WorkerReward.prototype, "blockNumber", void 0);
__decorate([
    (0, typeorm_store_1.DateTimeColumn)({ nullable: false }),
    __metadata("design:type", Date)
], WorkerReward.prototype, "timestamp", void 0);
__decorate([
    (0, typeorm_store_1.ManyToOne)(() => worker_model_1.Worker, { nullable: true }),
    __metadata("design:type", Object)
], WorkerReward.prototype, "worker", void 0);
__decorate([
    (0, typeorm_store_1.BigIntColumn)({ nullable: false }),
    __metadata("design:type", BigInt)
], WorkerReward.prototype, "amount", void 0);
__decorate([
    (0, typeorm_store_1.FloatColumn)({ nullable: false }),
    __metadata("design:type", Number)
], WorkerReward.prototype, "apr", void 0);
__decorate([
    (0, typeorm_store_1.BigIntColumn)({ nullable: false }),
    __metadata("design:type", BigInt)
], WorkerReward.prototype, "stakersReward", void 0);
__decorate([
    (0, typeorm_store_1.FloatColumn)({ nullable: false }),
    __metadata("design:type", Number)
], WorkerReward.prototype, "stakerApr", void 0);
exports.WorkerReward = WorkerReward = __decorate([
    (0, typeorm_store_1.Index)(["worker", "timestamp"], { unique: false }),
    (0, typeorm_store_1.Index)(["timestamp", "apr"], { unique: false }),
    (0, typeorm_store_1.Index)(["timestamp", "stakerApr"], { unique: false }),
    (0, typeorm_store_1.Entity)(),
    __metadata("design:paramtypes", [Object])
], WorkerReward);
//# sourceMappingURL=workerReward.model.js.map