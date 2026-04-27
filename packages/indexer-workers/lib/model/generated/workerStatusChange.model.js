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
exports.WorkerStatusChange = void 0;
const typeorm_store_1 = require("@subsquid/typeorm-store");
const worker_model_1 = require("./worker.model");
const _workerStatus_1 = require("./_workerStatus");
let WorkerStatusChange = class WorkerStatusChange {
    constructor(props) {
        Object.assign(this, props);
    }
};
exports.WorkerStatusChange = WorkerStatusChange;
__decorate([
    (0, typeorm_store_1.PrimaryColumn)(),
    __metadata("design:type", String)
], WorkerStatusChange.prototype, "id", void 0);
__decorate([
    (0, typeorm_store_1.ManyToOne)(() => worker_model_1.Worker, { nullable: true }),
    __metadata("design:type", Object)
], WorkerStatusChange.prototype, "worker", void 0);
__decorate([
    (0, typeorm_store_1.Column)("varchar", { length: 13, nullable: false }),
    __metadata("design:type", String)
], WorkerStatusChange.prototype, "status", void 0);
__decorate([
    (0, typeorm_store_1.DateTimeColumn)({ nullable: true }),
    __metadata("design:type", Object)
], WorkerStatusChange.prototype, "timestamp", void 0);
__decorate([
    (0, typeorm_store_1.IntColumn)({ nullable: false }),
    __metadata("design:type", Number)
], WorkerStatusChange.prototype, "blockNumber", void 0);
__decorate([
    (0, typeorm_store_1.BooleanColumn)({ nullable: false }),
    __metadata("design:type", Boolean)
], WorkerStatusChange.prototype, "pending", void 0);
exports.WorkerStatusChange = WorkerStatusChange = __decorate([
    (0, typeorm_store_1.Index)(["pending", "timestamp"], { unique: false }),
    (0, typeorm_store_1.Index)(["status", "timestamp"], { unique: false }),
    (0, typeorm_store_1.Index)(["worker", "blockNumber"], { unique: false }),
    (0, typeorm_store_1.Entity)(),
    __metadata("design:paramtypes", [Object])
], WorkerStatusChange);
//# sourceMappingURL=workerStatusChange.model.js.map