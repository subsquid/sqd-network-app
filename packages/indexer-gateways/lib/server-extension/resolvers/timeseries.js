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
exports.PoolApyTimeseriesResolver = exports.PoolTvlTimeseriesResolver = void 0;
const shared_1 = require("@sqd/shared");
const graphql_server_1 = require("@subsquid/graphql-server");
const date_fns_1 = require("date-fns");
const type_graphql_1 = require("type-graphql");
const INITIAL_TIMESTAMP = shared_1.network.name === 'mainnet' ? new Date('2024-03-25T16:55:45Z') : new Date('2024-01-10T00:32:20Z');
function normalizeTimeRange(from, to) {
    const now = new Date();
    const normalizedTo = to != null && to < now ? to : now;
    const normalizedFrom = from != null && from > INITIAL_TIMESTAMP ? from : INITIAL_TIMESTAMP;
    return { from: normalizedFrom, to: normalizedTo };
}
function getGroupSizeInfo(from, to, step) {
    return (0, shared_1.getGroupSize)(step ? step : { from, to, maxPoints: 50 });
}
function msToInterval(ms) {
    const seconds = ms / 1000;
    const minutes = seconds / 60;
    const hours = minutes / 60;
    const days = hours / 24;
    if (days >= 1 && days === Math.floor(days)) {
        return `${days} days`;
    }
    else if (hours >= 1 && hours === Math.floor(hours)) {
        return `${hours} hours`;
    }
    else if (minutes >= 1 && minutes === Math.floor(minutes)) {
        return `${minutes} minutes`;
    }
    else {
        return `${seconds} seconds`;
    }
}
async function getAlignedDates(manager, from, to, groupSize) {
    const interval = msToInterval(groupSize.ms);
    const result = await manager.query(`SELECT
      date_bin('${interval}', $1::timestamptz, '2001-01-01'::timestamp) as aligned_from,
      date_bin('${interval}', $2::timestamptz, '2001-01-01'::timestamp) as aligned_to`, [from, to]);
    return {
        alignedFrom: new Date(result[0].aligned_from),
        alignedTo: new Date(result[0].aligned_to),
    };
}
function sql(strings, ...values) {
    return String.raw({ raw: strings }, ...values).replace(/[\n\s]+/g, ' ');
}
function dateBin(column, groupSize) {
    const interval = msToInterval(groupSize.ms);
    return sql `date_bin('${interval}', ${column}, '2001-01-01'::timestamp)`;
}
function generateTimeSeries(groupSize) {
    const interval = msToInterval(groupSize.ms);
    return sql `generate_series(
    $1::timestamptz,
    $2::timestamptz,
    '${interval}'::interval
  )`;
}
function trimNullValues(data) {
    if (data.length === 0)
        return data;
    let firstNonNullIndex = 0;
    while (firstNonNullIndex < data.length && isValueNull(data[firstNonNullIndex].value)) {
        firstNonNullIndex++;
    }
    let lastNonNullIndex = data.length - 1;
    while (lastNonNullIndex >= 0 && isValueNull(data[lastNonNullIndex].value)) {
        lastNonNullIndex--;
    }
    if (firstNonNullIndex > lastNonNullIndex) {
        return [];
    }
    return data.slice(firstNonNullIndex, lastNonNullIndex + 1);
}
function isValueNull(value) {
    if (value == null)
        return true;
    if (typeof value === 'object' && value !== null) {
        return Object.values(value).every((v) => v == null || v === 0 || v === 0n);
    }
    if (value === 0 || value === 0n)
        return true;
    return false;
}
async function prepareTimeseriesContext(manager, fromArg, toArg, step, poolId) {
    let { from, to } = normalizeTimeRange(fromArg, toArg);
    if (poolId) {
        const poolResult = await manager.query('SELECT created_at FROM portal_pool WHERE id = $1', [
            poolId,
        ]);
        if (poolResult[0]?.created_at) {
            const poolCreatedAt = new Date(poolResult[0].created_at);
            from = (0, date_fns_1.max)([from, poolCreatedAt]);
        }
    }
    const groupSize = getGroupSizeInfo(from, to, step);
    const { alignedFrom, alignedTo } = await getAlignedDates(manager, from, to, groupSize);
    return { groupSize, alignedFrom, alignedTo };
}
/* Pool TVL Timeseries */
let PoolTvlValue = class PoolTvlValue {
    constructor(props) {
        Object.assign(this, props);
    }
};
__decorate([
    (0, type_graphql_1.Field)(() => graphql_server_1.BigInteger),
    __metadata("design:type", BigInt)
], PoolTvlValue.prototype, "tvlTotal", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => graphql_server_1.BigInteger),
    __metadata("design:type", BigInt)
], PoolTvlValue.prototype, "tvlStable", void 0);
PoolTvlValue = __decorate([
    (0, type_graphql_1.ObjectType)(),
    __metadata("design:paramtypes", [Object])
], PoolTvlValue);
let PoolTvlEntry = class PoolTvlEntry {
    constructor(props) {
        Object.assign(this, props);
    }
};
__decorate([
    (0, type_graphql_1.Field)(() => graphql_server_1.DateTime),
    __metadata("design:type", Date)
], PoolTvlEntry.prototype, "timestamp", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => PoolTvlValue),
    __metadata("design:type", PoolTvlValue)
], PoolTvlEntry.prototype, "value", void 0);
PoolTvlEntry = __decorate([
    (0, type_graphql_1.ObjectType)(),
    __metadata("design:paramtypes", [Object])
], PoolTvlEntry);
let PoolTvlTimeseries = class PoolTvlTimeseries {
    constructor(props) {
        Object.assign(this, props);
    }
};
__decorate([
    (0, type_graphql_1.Field)(() => [PoolTvlEntry]),
    __metadata("design:type", Array)
], PoolTvlTimeseries.prototype, "data", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Number),
    __metadata("design:type", Number)
], PoolTvlTimeseries.prototype, "step", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => graphql_server_1.DateTime),
    __metadata("design:type", Date)
], PoolTvlTimeseries.prototype, "from", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => graphql_server_1.DateTime),
    __metadata("design:type", Date)
], PoolTvlTimeseries.prototype, "to", void 0);
PoolTvlTimeseries = __decorate([
    (0, type_graphql_1.ObjectType)(),
    __metadata("design:paramtypes", [Object])
], PoolTvlTimeseries);
let PoolTvlTimeseriesResolver = class PoolTvlTimeseriesResolver {
    constructor(tx) {
        this.tx = tx;
    }
    async poolTvlTimeseries(fromArg, toArg, step, poolId) {
        const manager = await this.tx();
        const { groupSize, alignedFrom, alignedTo } = await prepareTimeseriesContext(manager, fromArg, toArg, step, poolId);
        const poolFilter = poolId ? sql `AND pool_id = $3` : '';
        const params = poolId ? [alignedFrom, alignedTo, poolId] : [alignedFrom, alignedTo];
        const raw = await manager.query(sql `
      WITH
      time_series AS (
        SELECT ${generateTimeSeries(groupSize)} as timestamp
      ),
      events_binned AS (
        SELECT
          ${dateBin('timestamp', groupSize)} as bin_ts,
          SUM(CASE 
            WHEN event_type = 'DEPOSIT' THEN amount
            WHEN event_type = 'WITHDRAWAL' THEN 0
            WHEN event_type = 'EXIT' THEN -amount
          END) as stable_delta,
          SUM(CASE 
            WHEN event_type = 'DEPOSIT' THEN amount
            WHEN event_type = 'WITHDRAWAL' THEN -amount
            WHEN event_type = 'EXIT' THEN 0
          END) as total_delta
        FROM pool_event
        WHERE event_type IN ('DEPOSIT', 'WITHDRAWAL', 'EXIT')
          AND ${dateBin('timestamp', groupSize)} >= $1 AND ${dateBin('timestamp', groupSize)} <= $2 ${poolFilter}
        GROUP BY bin_ts
      ),
      initial_tvl AS (
        SELECT
          COALESCE(SUM(CASE 
            WHEN event_type = 'DEPOSIT' THEN amount
            WHEN event_type = 'WITHDRAWAL' THEN 0
            WHEN event_type = 'EXIT' THEN -amount
          END), 0) as initial_stable,
          COALESCE(SUM(CASE 
            WHEN event_type = 'DEPOSIT' THEN amount
            WHEN event_type = 'WITHDRAWAL' THEN -amount
            WHEN event_type = 'EXIT' THEN 0
          END), 0) as initial_total
        FROM pool_event
        WHERE event_type IN ('DEPOSIT', 'WITHDRAWAL', 'EXIT')
          AND timestamp < $1 ${poolFilter}
      ),
      cumulative_tvl AS (
        SELECT
          ts.timestamp,
          (SELECT initial_stable FROM initial_tvl) +
          SUM(COALESCE(eb.stable_delta, 0)) OVER (ORDER BY ts.timestamp) as tvl_stable,
          (SELECT initial_total FROM initial_tvl) +
          SUM(COALESCE(eb.total_delta, 0)) OVER (ORDER BY ts.timestamp) as tvl_total
        FROM time_series ts
        LEFT JOIN events_binned eb ON ts.timestamp = eb.bin_ts
      )
      SELECT timestamp, tvl_total, tvl_stable
      FROM cumulative_tvl
      ORDER BY timestamp
      `, params);
        const data = raw.map((r) => new PoolTvlEntry({
            timestamp: r.timestamp,
            value: new PoolTvlValue({
                tvlTotal: BigInt(r.tvl_total),
                tvlStable: BigInt(r.tvl_stable),
            }),
        }));
        return new PoolTvlTimeseries({
            data: trimNullValues(data),
            step: groupSize.ms,
            from: alignedFrom,
            to: alignedTo,
        });
    }
};
exports.PoolTvlTimeseriesResolver = PoolTvlTimeseriesResolver;
__decorate([
    (0, type_graphql_1.Query)(() => PoolTvlTimeseries),
    __param(0, (0, type_graphql_1.Arg)('from', { nullable: true })),
    __param(1, (0, type_graphql_1.Arg)('to', { nullable: true })),
    __param(2, (0, type_graphql_1.Arg)('step', { nullable: true })),
    __param(3, (0, type_graphql_1.Arg)('poolId', { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Date,
        Date, String, String]),
    __metadata("design:returntype", Promise)
], PoolTvlTimeseriesResolver.prototype, "poolTvlTimeseries", null);
exports.PoolTvlTimeseriesResolver = PoolTvlTimeseriesResolver = __decorate([
    (0, type_graphql_1.Resolver)(),
    __metadata("design:paramtypes", [Function])
], PoolTvlTimeseriesResolver);
/* Pool APY Timeseries */
let PoolApyEntry = class PoolApyEntry {
    constructor(props) {
        Object.assign(this, props);
    }
};
__decorate([
    (0, type_graphql_1.Field)(() => graphql_server_1.DateTime),
    __metadata("design:type", Date)
], PoolApyEntry.prototype, "timestamp", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Number),
    __metadata("design:type", Number)
], PoolApyEntry.prototype, "value", void 0);
PoolApyEntry = __decorate([
    (0, type_graphql_1.ObjectType)(),
    __metadata("design:paramtypes", [Object])
], PoolApyEntry);
let PoolApyTimeseries = class PoolApyTimeseries {
    constructor(props) {
        Object.assign(this, props);
    }
};
__decorate([
    (0, type_graphql_1.Field)(() => [PoolApyEntry]),
    __metadata("design:type", Array)
], PoolApyTimeseries.prototype, "data", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Number),
    __metadata("design:type", Number)
], PoolApyTimeseries.prototype, "step", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => graphql_server_1.DateTime),
    __metadata("design:type", Date)
], PoolApyTimeseries.prototype, "from", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => graphql_server_1.DateTime),
    __metadata("design:type", Date)
], PoolApyTimeseries.prototype, "to", void 0);
PoolApyTimeseries = __decorate([
    (0, type_graphql_1.ObjectType)(),
    __metadata("design:paramtypes", [Object])
], PoolApyTimeseries);
let PoolApyTimeseriesResolver = class PoolApyTimeseriesResolver {
    constructor(tx) {
        this.tx = tx;
    }
    async poolApyTimeseries(fromArg, toArg, step, poolId) {
        const manager = await this.tx();
        const { groupSize, alignedFrom, alignedTo } = await prepareTimeseriesContext(manager, fromArg, toArg, step, poolId);
        const poolFilter = poolId ? 'AND pool_id = $3' : '';
        const poolWhereClause = poolId ? 'WHERE id = $3' : '';
        const params = poolId ? [alignedFrom, alignedTo, poolId] : [alignedFrom, alignedTo];
        const query = `
      WITH
      time_series AS (
        SELECT ${generateTimeSeries(groupSize)} as timestamp
      ),
      rate_history AS (
        SELECT
          ${dateBin('timestamp', groupSize)} as bin_ts,
          LAST_VALUE(new_rate) OVER (
            PARTITION BY ${dateBin('timestamp', groupSize)}
            ORDER BY timestamp
            ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
          ) as reward_rate
        FROM pool_distribution_rate_change
        WHERE ${dateBin('timestamp', groupSize)} >= $1 AND ${dateBin('timestamp', groupSize)} <= $2 ${poolFilter}
      ),
      capacity_history AS (
        SELECT
          ${dateBin('timestamp', groupSize)} as bin_ts,
          LAST_VALUE(new_capacity) OVER (
            PARTITION BY ${dateBin('timestamp', groupSize)}
            ORDER BY timestamp
            ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
          ) as capacity
        FROM pool_capacity_change
        WHERE ${dateBin('timestamp', groupSize)} >= $1 AND ${dateBin('timestamp', groupSize)} < $2 ${poolFilter}
      ),
      initial_rate AS (
        SELECT COALESCE(
          (SELECT new_rate FROM pool_distribution_rate_change 
           WHERE timestamp < $1 ${poolFilter}
           ORDER BY timestamp DESC LIMIT 1),
          (SELECT reward_rate FROM portal_pool ${poolWhereClause} LIMIT 1),
          0
        ) as rate
      ),
      initial_capacity AS (
        SELECT COALESCE(
          (SELECT new_capacity FROM pool_capacity_change 
           WHERE timestamp < $1 ${poolFilter}
           ORDER BY timestamp DESC LIMIT 1),
          (SELECT capacity FROM portal_pool ${poolWhereClause} LIMIT 1),
          0
        ) as capacity
      )
      SELECT
        ts.timestamp,
        COALESCE(rh.reward_rate, (SELECT rate FROM initial_rate)) as reward_rate,
        COALESCE(ch.capacity, (SELECT capacity FROM initial_capacity)) as capacity
      FROM time_series ts
      LEFT JOIN rate_history rh ON ts.timestamp = rh.bin_ts
      LEFT JOIN capacity_history ch ON ts.timestamp = ch.bin_ts
      ORDER BY ts.timestamp
    `;
        const raw = await manager.query(query, params);
        const data = raw.map((r) => {
            const rewardRate = BigInt(r.reward_rate || 0);
            const capacity = BigInt(r.capacity || 0);
            const secondsPerYear = 365 * 24 * 3600;
            let apy = 0;
            if (capacity > 0n) {
                apy = (Number(rewardRate) * secondsPerYear) / 1000 / Number(capacity);
            }
            return new PoolApyEntry({
                timestamp: r.timestamp,
                value: apy,
            });
        });
        return new PoolApyTimeseries({
            data: trimNullValues(data),
            step: groupSize.ms,
            from: alignedFrom,
            to: alignedTo,
        });
    }
};
exports.PoolApyTimeseriesResolver = PoolApyTimeseriesResolver;
__decorate([
    (0, type_graphql_1.Query)(() => PoolApyTimeseries),
    __param(0, (0, type_graphql_1.Arg)('from', { nullable: true })),
    __param(1, (0, type_graphql_1.Arg)('to', { nullable: true })),
    __param(2, (0, type_graphql_1.Arg)('step', { nullable: true })),
    __param(3, (0, type_graphql_1.Arg)('poolId', { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Date,
        Date, String, String]),
    __metadata("design:returntype", Promise)
], PoolApyTimeseriesResolver.prototype, "poolApyTimeseries", null);
exports.PoolApyTimeseriesResolver = PoolApyTimeseriesResolver = __decorate([
    (0, type_graphql_1.Resolver)(),
    __metadata("design:paramtypes", [Function])
], PoolApyTimeseriesResolver);
//# sourceMappingURL=timeseries.js.map