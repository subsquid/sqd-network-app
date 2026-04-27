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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DaysUptimeResolver = exports.WorkerSnapshotDay = void 0;
const graphql_server_1 = require("@subsquid/graphql-server");
const type_graphql_1 = require("type-graphql");
let WorkerSnapshotDay = class WorkerSnapshotDay {
    constructor(props) {
        Object.assign(this, props);
    }
};
exports.WorkerSnapshotDay = WorkerSnapshotDay;
__decorate([
    (0, type_graphql_1.Field)(() => graphql_server_1.DateTime, { nullable: false }),
    __metadata("design:type", Date)
], WorkerSnapshotDay.prototype, "timestamp", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Number, { nullable: false }),
    __metadata("design:type", Number)
], WorkerSnapshotDay.prototype, "uptime", void 0);
exports.WorkerSnapshotDay = WorkerSnapshotDay = __decorate([
    (0, type_graphql_1.ObjectType)(),
    __metadata("design:paramtypes", [Object])
], WorkerSnapshotDay);
let DaysUptimeResolver = class DaysUptimeResolver {
    constructor(tx) {
        this.tx = tx;
    }
    async workerSnapshotsByDay(workerId, from, to) {
        const manager = await this.tx();
        const raw = await manager.query(`
      SELECT
        "timestamp",
        AVG(uptime) as "uptime"
      FROM
        (SELECT
            DATE_TRUNC('day', "timestamp") AS "timestamp",
            "uptime"
          FROM
            "worker_snapshot"
          WHERE
            "worker_id" = $1 AND
            "timestamp" >= $2 AND
            "timestamp" < $3
        ) AS a
      GROUP BY
        "timestamp"
      ORDER BY
        "timestamp"
      `, [workerId, from, to || new Date()]);
        return raw.map((d) => new WorkerSnapshotDay(d));
    }
};
exports.DaysUptimeResolver = DaysUptimeResolver;
__decorate([
    (0, type_graphql_1.Query)(() => [WorkerSnapshotDay]),
    __param(0, (0, type_graphql_1.Arg)('workerId')),
    __param(1, (0, type_graphql_1.Arg)('from')),
    __param(2, (0, type_graphql_1.Arg)('to', { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Date,
        Date]),
    __metadata("design:returntype", Promise)
], DaysUptimeResolver.prototype, "workerSnapshotsByDay", null);
exports.DaysUptimeResolver = DaysUptimeResolver = __decorate([
    (0, type_graphql_1.Resolver)(),
    __metadata("design:paramtypes", [Function])
], DaysUptimeResolver);
//# sourceMappingURL=daysUptime.js.map