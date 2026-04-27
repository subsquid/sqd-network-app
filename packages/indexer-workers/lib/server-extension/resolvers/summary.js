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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkersSummaryResolver = exports.WorkersSummary = exports.AprSnapshot = void 0;
const assert_1 = __importDefault(require("assert"));
const graphql_server_1 = require("@subsquid/graphql-server");
const type_graphql_1 = require("type-graphql");
let AprSnapshot = class AprSnapshot {
    constructor({ timestamp, ...props }) {
        this.timestamp = new Date(timestamp);
        Object.assign(this, props);
    }
};
exports.AprSnapshot = AprSnapshot;
__decorate([
    (0, type_graphql_1.Field)(() => graphql_server_1.DateTime, { nullable: false }),
    __metadata("design:type", Date)
], AprSnapshot.prototype, "timestamp", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Number, { nullable: false }),
    __metadata("design:type", Number)
], AprSnapshot.prototype, "stakerApr", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Number, { nullable: false }),
    __metadata("design:type", Number)
], AprSnapshot.prototype, "workerApr", void 0);
exports.AprSnapshot = AprSnapshot = __decorate([
    (0, type_graphql_1.ObjectType)(),
    __metadata("design:paramtypes", [AprSnapshot])
], AprSnapshot);
let WorkersSummary = class WorkersSummary {
    constructor({ aprs, ...props }) {
        this.aprs = aprs?.map((apr) => new AprSnapshot(apr)) || [];
        Object.assign(this, props);
    }
};
exports.WorkersSummary = WorkersSummary;
__decorate([
    (0, type_graphql_1.Field)(() => Number, { nullable: false }),
    __metadata("design:type", Number)
], WorkersSummary.prototype, "workerApr", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Number, { nullable: false }),
    __metadata("design:type", Number)
], WorkersSummary.prototype, "stakerApr", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => graphql_server_1.BigInteger, { nullable: false }),
    __metadata("design:type", BigInt)
], WorkersSummary.prototype, "storedData", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => graphql_server_1.BigInteger, { nullable: false }),
    __metadata("design:type", BigInt)
], WorkersSummary.prototype, "queries24Hours", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => graphql_server_1.BigInteger, { nullable: false }),
    __metadata("design:type", BigInt)
], WorkersSummary.prototype, "queries90Days", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => graphql_server_1.BigInteger, { nullable: false }),
    __metadata("design:type", BigInt)
], WorkersSummary.prototype, "servedData24Hours", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => graphql_server_1.BigInteger, { nullable: false }),
    __metadata("design:type", BigInt)
], WorkersSummary.prototype, "servedData90Days", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Number, { nullable: false }),
    __metadata("design:type", Number)
], WorkersSummary.prototype, "workersCount", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Number, { nullable: false }),
    __metadata("design:type", Number)
], WorkersSummary.prototype, "onlineWorkersCount", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => graphql_server_1.BigInteger, { nullable: false }),
    __metadata("design:type", BigInt)
], WorkersSummary.prototype, "totalBond", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => graphql_server_1.BigInteger, { nullable: false }),
    __metadata("design:type", BigInt)
], WorkersSummary.prototype, "totalDelegation", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Number, { nullable: false }),
    __metadata("design:type", Number)
], WorkersSummary.prototype, "lastBlock", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => graphql_server_1.DateTime, { nullable: false }),
    __metadata("design:type", Date)
], WorkersSummary.prototype, "lastBlockTimestamp", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Number, { nullable: false }),
    __metadata("design:type", Number)
], WorkersSummary.prototype, "blockTime", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Number, { nullable: false }),
    __metadata("design:type", Number)
], WorkersSummary.prototype, "lastBlockL1", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => graphql_server_1.DateTime, { nullable: false, defaultValue: new Date(0) }),
    __metadata("design:type", Date)
], WorkersSummary.prototype, "lastBlockTimestampL1", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Number, { nullable: false }),
    __metadata("design:type", Number)
], WorkersSummary.prototype, "blockTimeL1", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [AprSnapshot], { nullable: false }),
    __metadata("design:type", Array)
], WorkersSummary.prototype, "aprs", void 0);
exports.WorkersSummary = WorkersSummary = __decorate([
    (0, type_graphql_1.ObjectType)(),
    __metadata("design:paramtypes", [Object])
], WorkersSummary);
let WorkersSummaryResolver = class WorkersSummaryResolver {
    constructor(tx) {
        this.tx = tx;
    }
    async workersSummary() {
        const manager = await this.tx();
        return await manager
            .query(`
        WITH block_l1 as (
          SELECT l1_block_number as height, min(timestamp) as timestamp FROM public.block GROUP BY l1_block_number ORDER BY height DESC LIMIT 100 
        ),
        block as (
          SELECT height, timestamp as timestamp FROM public.block ORDER BY height DESC LIMIT 100 
        )
        SELECT
          COALESCE(SUM(bond), 0) as "totalBond",
          COALESCE(SUM(total_delegation), 0) as "totalDelegation",
          COALESCE(PERCENTILE_CONT(0.5) WITHIN GROUP(ORDER BY apr) FILTER(WHERE apr > 0), 0) as "workerApr",
          COALESCE(PERCENTILE_CONT(0.5) WITHIN GROUP(ORDER BY staker_apr) FILTER(WHERE staker_apr > 0), 0) as "stakerApr",
          COALESCE(SUM(queries90_days), 0) as "queries90Days",
          COALESCE(SUM(queries24_hours), 0) as "queries24Hours",
          COALESCE(SUM(served_data24_hours), 0) as "servedData24Hours",
          COALESCE(SUM(served_data90_days), 0) as "servedData90Days",
          COALESCE(SUM(stored_data), 0) as "storedData",
          COALESCE((SELECT count(*) FROM worker WHERE status IN ('ACTIVE')), 0) as "workersCount",
          COALESCE((SELECT count(*) FROM worker WHERE online = TRUE AND status IN ('ACTIVE')), 0) as "onlineWorkersCount",
          (SELECT max(height) FROM block) as "lastBlock",
          (SELECT max(timestamp) FROM block) as "lastBlockTimestamp",
          (SELECT EXTRACT(EPOCH FROM (max(timestamp) - min(timestamp))) / 100 * 1000 FROM block) as "blockTime",
          (SELECT max(height) FROM block_l1) as "lastBlockL1",
          (SELECT max(timestamp) FROM block_l1) as "lastBlockTimestampL1",
          (SELECT ((EXTRACT(EPOCH FROM (max(timestamp) - min(timestamp))) / 100) - 2) * 1000 FROM block_l1) as "blockTimeL1",
          (SELECT json_agg(row_to_json(aprs_raw)) FROM (
            SELECT 
              DATE_TRUNC('day', "to") as "timestamp",
              COALESCE(PERCENTILE_CONT(0.5) WITHIN GROUP(ORDER BY (recipient -> 'workerApr')::float) FILTER(WHERE (recipient -> 'workerApr')::float > 0), 0) as "workerApr",
              COALESCE(PERCENTILE_CONT(0.5) WITHIN GROUP(ORDER BY (recipient -> 'stakerApr')::float) FILTER(WHERE (recipient -> 'stakerApr')::float > 0), 0) as "stakerApr"
            FROM COMMITMENT, JSONB_ARRAY_ELEMENTS(recipients) AS recipient
            WHERE "to" >= DATE_TRUNC('day', NOW() - interval '13 DAY')
            GROUP BY DATE_TRUNC('day', "to")
            ORDER BY "timestamp") as "aprs_raw"
          ) as "aprs"
        FROM worker
        `)
            .then((r) => {
            (0, assert_1.default)(r.length === 1);
            return new WorkersSummary(r[0]);
        });
    }
};
exports.WorkersSummaryResolver = WorkersSummaryResolver;
__decorate([
    (0, type_graphql_1.Query)(() => WorkersSummary),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], WorkersSummaryResolver.prototype, "workersSummary", null);
exports.WorkersSummaryResolver = WorkersSummaryResolver = __decorate([
    (0, type_graphql_1.Resolver)(),
    __metadata("design:paramtypes", [Function])
], WorkersSummaryResolver);
//# sourceMappingURL=summary.js.map