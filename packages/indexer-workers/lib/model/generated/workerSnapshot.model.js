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
exports.WorkerSnapshot = void 0;
const typeorm_store_1 = require("@subsquid/typeorm-store");
const worker_model_1 = require("./worker.model");
const epoch_model_1 = require("./epoch.model");
let WorkerSnapshot = class WorkerSnapshot {
    constructor(props) {
        Object.assign(this, props);
    }
};
exports.WorkerSnapshot = WorkerSnapshot;
__decorate([
    (0, typeorm_store_1.PrimaryColumn)(),
    __metadata("design:type", String)
], WorkerSnapshot.prototype, "id", void 0);
__decorate([
    (0, typeorm_store_1.ManyToOne)(() => worker_model_1.Worker, { nullable: true }),
    __metadata("design:type", Object)
], WorkerSnapshot.prototype, "worker", void 0);
__decorate([
    (0, typeorm_store_1.DateTimeColumn)({ nullable: false }),
    __metadata("design:type", Date)
], WorkerSnapshot.prototype, "timestamp", void 0);
__decorate([
    (0, typeorm_store_1.FloatColumn)({ nullable: false }),
    __metadata("design:type", Number)
], WorkerSnapshot.prototype, "uptime", void 0);
__decorate([
    (0, typeorm_store_1.Index)(),
    (0, typeorm_store_1.ManyToOne)(() => epoch_model_1.Epoch, { nullable: true }),
    __metadata("design:type", Object)
], WorkerSnapshot.prototype, "epoch", void 0);
exports.WorkerSnapshot = WorkerSnapshot = __decorate([
    (0, typeorm_store_1.Index)(["worker", "timestamp"], { unique: false }),
    (0, typeorm_store_1.Entity)(),
    __metadata("design:paramtypes", [Object])
], WorkerSnapshot);
//# sourceMappingURL=workerSnapshot.model.js.map