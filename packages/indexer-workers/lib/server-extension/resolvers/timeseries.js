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
exports.AprTimeseriesResolver = exports.RewardTimeseriesResolver = exports.UptimeTimeseriesResolver = exports.StoredDataTimeseriesResolver = exports.ServedDataTimeseriesResolver = exports.QueriesCountTimeseriesResolver = exports.DelegatorsTimeseriesResolver = exports.DelegationsTimeseriesResolver = exports.UniqueOperatorsTimeseriesResolver = exports.ActiveWorkersTimeseriesResolver = exports.normalizeTimeRange = void 0;
const shared_1 = require("@sqd/shared");
const graphql_server_1 = require("@subsquid/graphql-server");
const type_graphql_1 = require("type-graphql");
/**
 * Timestamp of the first `network.contracts.Router` deployment on each
 * supported network — used as the default lower bound for time-series
 * queries when the caller does not supply `from`.
 *
 * Master used `MIN(transfer.timestamp)` resolved via a DB probe, which was
 * both expensive (extra query per request) and brittle once the `Transfer`
 * entity moved to the `token` package. The fixed constants below reproduce
 * the same effective bound without the cross-package dependency; update them
 * only when deploying the workers indexer to a new network.
 *
 * Sources:
 *   mainnet → first Router deployment block timestamp on Arbitrum One
 *   tethys  → first Router deployment block timestamp on Arbitrum Sepolia
 */
const INITIAL_TIMESTAMP = shared_1.network.name === 'mainnet' ? new Date('2024-03-25T16:55:45Z') : new Date('2024-01-10T00:32:20Z');
function normalizeTimeRange(from, to) {
    const now = new Date();
    const normalizedTo = to != null && to < now ? to : now;
    // Clamp `from` so the returned range always starts at or after the indexer's
    // earliest observable data. Callers passing `from` from the frontend's date
    // picker routinely ask for multi-year ranges; without this clamp every
    // daily-bucket aggregate would materialize thousands of empty rows.
    const normalizedFrom = from != null && from > INITIAL_TIMESTAMP ? from : INITIAL_TIMESTAMP;
    return { from: normalizedFrom, to: normalizedTo };
}
exports.normalizeTimeRange = normalizeTimeRange;
function getGroupSizeInfo(from, to, step) {
    return (0, shared_1.getGroupSize)(step ? step : { from, to, maxPoints: 50 });
}
function stepInterval(groupSize) {
    return `${groupSize.days} days`;
}
function startOfDayUtc(date) {
    const d = new Date(date);
    d.setUTCHours(0, 0, 0, 0);
    return d;
}
function buildTimeseries(data, groupSize, from, to) {
    return {
        data: data,
        step: groupSize.ms,
        from: data[0]?.timestamp ?? startOfDayUtc(from),
        to: data[data.length - 1]?.timestamp ?? startOfDayUtc(to),
    };
}
function sql(strings, ...values) {
    return String.raw({ raw: strings }, ...values).replace(/[\n\s]+/g, ' ');
}
function truncDayUtc(expr) {
    return sql `date_trunc('day', ${expr} AT TIME ZONE 'UTC') AT TIME ZONE 'UTC'`;
}
const TRUNC_FROM = truncDayUtc('$1::timestamptz');
const TRUNC_TO = truncDayUtc('$2::timestamptz');
function generateTimeSeries(groupSize) {
    const interval = stepInterval(groupSize);
    return sql `
    SELECT bin_ts::timestamptz
    FROM generate_series(
      ${TRUNC_TO},
      ${TRUNC_FROM} + '1 day'::interval,
      -'${interval}'::interval
    ) AS bin_ts
    ORDER BY bin_ts
  `;
}
function binJoin(dayColumn, seriesColumn, groupSize) {
    const interval = stepInterval(groupSize);
    return sql `${dayColumn} >= ${seriesColumn} - '${interval}'::interval AND ${dayColumn} < ${seriesColumn}`;
}
function buildWorkerFilter(workerId) {
    if (workerId) {
        return {
            filter: sql `AND worker_id = $3`,
            params: [],
            paramIndex: 3,
        };
    }
    return {
        filter: '',
        params: [],
        paramIndex: 2,
    };
}
function prepareTimeseriesContext(fromArg, toArg, step) {
    const { from, to } = normalizeTimeRange(fromArg, toArg);
    const groupSize = getGroupSizeInfo(from, to, step);
    return { groupSize, from, to };
}
/* Active workers */
let ActiveWorkersEntry = class ActiveWorkersEntry {
    constructor(props) {
        Object.assign(this, props);
    }
};
__decorate([
    (0, type_graphql_1.Field)(() => graphql_server_1.DateTime),
    __metadata("design:type", Date)
], ActiveWorkersEntry.prototype, "timestamp", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Number, { nullable: true }),
    __metadata("design:type", Object)
], ActiveWorkersEntry.prototype, "value", void 0);
ActiveWorkersEntry = __decorate([
    (0, type_graphql_1.ObjectType)(),
    __metadata("design:paramtypes", [Object])
], ActiveWorkersEntry);
let ActiveWorkersTimeseries = class ActiveWorkersTimeseries {
    constructor(props) {
        Object.assign(this, props);
    }
};
__decorate([
    (0, type_graphql_1.Field)(() => [ActiveWorkersEntry]),
    __metadata("design:type", Array)
], ActiveWorkersTimeseries.prototype, "data", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Number),
    __metadata("design:type", Number)
], ActiveWorkersTimeseries.prototype, "step", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => graphql_server_1.DateTime),
    __metadata("design:type", Date)
], ActiveWorkersTimeseries.prototype, "from", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => graphql_server_1.DateTime),
    __metadata("design:type", Date)
], ActiveWorkersTimeseries.prototype, "to", void 0);
ActiveWorkersTimeseries = __decorate([
    (0, type_graphql_1.ObjectType)(),
    __metadata("design:paramtypes", [Object])
], ActiveWorkersTimeseries);
let ActiveWorkersTimeseriesResolver = class ActiveWorkersTimeseriesResolver {
    constructor(tx) {
        this.tx = tx;
    }
    async activeWorkersTimeseries(fromArg, toArg, step) {
        const manager = await this.tx();
        const { from, to } = normalizeTimeRange(fromArg, toArg);
        const groupSize = getGroupSizeInfo(from, to, step);
        const raw = await manager.query(sql `
        WITH initial_count AS (
          SELECT COALESCE(SUM(delta), 0) AS initial_value
          FROM mv_active_workers_daily
          WHERE timestamp < ${TRUNC_FROM}
        ),
        daily AS (
          SELECT ${truncDayUtc('timestamp')} as day, SUM(delta) as delta
          FROM mv_active_workers_daily
          WHERE timestamp >= ${TRUNC_FROM} AND timestamp < ${TRUNC_TO}
          GROUP BY day
        ),
        time_series AS (
          ${generateTimeSeries(groupSize)}
        ),
        binned AS (
          SELECT ts.bin_ts, COALESCE(SUM(d.delta), 0) as delta
          FROM time_series ts
          LEFT JOIN daily d ON ${binJoin('d.day', 'ts.bin_ts', groupSize)}
          GROUP BY ts.bin_ts
        ),
        cumulative_data AS (
          SELECT
            (bin_ts - interval '1 second') AS timestamp,
            (SELECT initial_value FROM initial_count) +
            SUM(delta) OVER (ORDER BY bin_ts) AS value
          FROM binned
        )
        SELECT timestamp, value
        FROM cumulative_data
        ORDER BY timestamp
      `, [from, to]);
        const data = raw.map((r) => new ActiveWorkersEntry({ timestamp: r.timestamp, value: parseInt(r.value) }));
        return new ActiveWorkersTimeseries({ ...buildTimeseries(data, groupSize, from, to) });
    }
};
exports.ActiveWorkersTimeseriesResolver = ActiveWorkersTimeseriesResolver;
__decorate([
    (0, type_graphql_1.Query)(() => ActiveWorkersTimeseries),
    __param(0, (0, type_graphql_1.Arg)('from', { nullable: true })),
    __param(1, (0, type_graphql_1.Arg)('to', { nullable: true })),
    __param(2, (0, type_graphql_1.Arg)('step', { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Date,
        Date, String]),
    __metadata("design:returntype", Promise)
], ActiveWorkersTimeseriesResolver.prototype, "activeWorkersTimeseries", null);
exports.ActiveWorkersTimeseriesResolver = ActiveWorkersTimeseriesResolver = __decorate([
    (0, type_graphql_1.Resolver)(),
    __metadata("design:paramtypes", [Function])
], ActiveWorkersTimeseriesResolver);
/* Unique operators */
let OperatorsEntry = class OperatorsEntry {
    constructor(props) {
        Object.assign(this, props);
    }
};
__decorate([
    (0, type_graphql_1.Field)(() => graphql_server_1.DateTime),
    __metadata("design:type", Date)
], OperatorsEntry.prototype, "timestamp", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Number, { nullable: true }),
    __metadata("design:type", Object)
], OperatorsEntry.prototype, "value", void 0);
OperatorsEntry = __decorate([
    (0, type_graphql_1.ObjectType)(),
    __metadata("design:paramtypes", [Object])
], OperatorsEntry);
let UniqueOperatorsTimeseries = class UniqueOperatorsTimeseries {
    constructor(props) {
        Object.assign(this, props);
    }
};
__decorate([
    (0, type_graphql_1.Field)(() => [OperatorsEntry]),
    __metadata("design:type", Array)
], UniqueOperatorsTimeseries.prototype, "data", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Number),
    __metadata("design:type", Number)
], UniqueOperatorsTimeseries.prototype, "step", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => graphql_server_1.DateTime),
    __metadata("design:type", Date)
], UniqueOperatorsTimeseries.prototype, "from", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => graphql_server_1.DateTime),
    __metadata("design:type", Date)
], UniqueOperatorsTimeseries.prototype, "to", void 0);
UniqueOperatorsTimeseries = __decorate([
    (0, type_graphql_1.ObjectType)(),
    __metadata("design:paramtypes", [Object])
], UniqueOperatorsTimeseries);
let UniqueOperatorsTimeseriesResolver = class UniqueOperatorsTimeseriesResolver {
    constructor(tx) {
        this.tx = tx;
    }
    async uniqueOperatorsTimeseries(fromArg, toArg, step) {
        const manager = await this.tx();
        const { from, to } = normalizeTimeRange(fromArg, toArg);
        const groupSize = getGroupSizeInfo(from, to, step);
        const raw = await manager.query(sql `
        WITH initial_count AS (
          SELECT COALESCE(SUM(delta), 0) AS initial_value
          FROM mv_unique_operators_daily
          WHERE timestamp < ${TRUNC_FROM}
        ),
        daily AS (
          SELECT ${truncDayUtc('timestamp')} as day, SUM(delta) as delta
          FROM mv_unique_operators_daily
          WHERE timestamp >= ${TRUNC_FROM} AND timestamp < ${TRUNC_TO}
          GROUP BY day
        ),
        time_series AS (
          ${generateTimeSeries(groupSize)}
        ),
        binned AS (
          SELECT ts.bin_ts, COALESCE(SUM(d.delta), 0) as delta
          FROM time_series ts
          LEFT JOIN daily d ON ${binJoin('d.day', 'ts.bin_ts', groupSize)}
          GROUP BY ts.bin_ts
        ),
        cumulative_data AS (
          SELECT
            (bin_ts - interval '1 second') AS timestamp,
            (SELECT initial_value FROM initial_count) +
            SUM(delta) OVER (ORDER BY bin_ts) AS value
          FROM binned
        )
        SELECT timestamp, value
        FROM cumulative_data
        ORDER BY timestamp
      `, [from, to]);
        const data = raw.map((r) => new OperatorsEntry({ timestamp: r.timestamp, value: parseInt(r.value) }));
        return new UniqueOperatorsTimeseries({ ...buildTimeseries(data, groupSize, from, to) });
    }
};
exports.UniqueOperatorsTimeseriesResolver = UniqueOperatorsTimeseriesResolver;
__decorate([
    (0, type_graphql_1.Query)(() => UniqueOperatorsTimeseries),
    __param(0, (0, type_graphql_1.Arg)('from', { nullable: true })),
    __param(1, (0, type_graphql_1.Arg)('to', { nullable: true })),
    __param(2, (0, type_graphql_1.Arg)('step', { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Date,
        Date, String]),
    __metadata("design:returntype", Promise)
], UniqueOperatorsTimeseriesResolver.prototype, "uniqueOperatorsTimeseries", null);
exports.UniqueOperatorsTimeseriesResolver = UniqueOperatorsTimeseriesResolver = __decorate([
    (0, type_graphql_1.Resolver)(),
    __metadata("design:paramtypes", [Function])
], UniqueOperatorsTimeseriesResolver);
/* Delegations count */
let DelegationsEntry = class DelegationsEntry {
    constructor(props) {
        Object.assign(this, props);
    }
};
__decorate([
    (0, type_graphql_1.Field)(() => graphql_server_1.DateTime),
    __metadata("design:type", Date)
], DelegationsEntry.prototype, "timestamp", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Number, { nullable: true }),
    __metadata("design:type", Object)
], DelegationsEntry.prototype, "value", void 0);
DelegationsEntry = __decorate([
    (0, type_graphql_1.ObjectType)(),
    __metadata("design:paramtypes", [Object])
], DelegationsEntry);
let DelegationsTimeseries = class DelegationsTimeseries {
    constructor(props) {
        Object.assign(this, props);
    }
};
__decorate([
    (0, type_graphql_1.Field)(() => [DelegationsEntry]),
    __metadata("design:type", Array)
], DelegationsTimeseries.prototype, "data", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Number),
    __metadata("design:type", Number)
], DelegationsTimeseries.prototype, "step", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => graphql_server_1.DateTime),
    __metadata("design:type", Date)
], DelegationsTimeseries.prototype, "from", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => graphql_server_1.DateTime),
    __metadata("design:type", Date)
], DelegationsTimeseries.prototype, "to", void 0);
DelegationsTimeseries = __decorate([
    (0, type_graphql_1.ObjectType)(),
    __metadata("design:paramtypes", [Object])
], DelegationsTimeseries);
let DelegationsTimeseriesResolver = class DelegationsTimeseriesResolver {
    constructor(tx) {
        this.tx = tx;
    }
    async delegationsTimeseries(fromArg, toArg, step) {
        const manager = await this.tx();
        const { from, to } = normalizeTimeRange(fromArg, toArg);
        const groupSize = getGroupSizeInfo(from, to, step);
        const raw = await manager.query(sql `
        WITH initial_count AS (
          SELECT COALESCE(SUM(delta), 0) AS initial_value
          FROM mv_delegations_daily
          WHERE timestamp < ${TRUNC_FROM}
        ),
        daily AS (
          SELECT ${truncDayUtc('timestamp')} as day, SUM(delta) as delta
          FROM mv_delegations_daily
          WHERE timestamp >= ${TRUNC_FROM} AND timestamp < ${TRUNC_TO}
          GROUP BY day
        ),
        time_series AS (
          ${generateTimeSeries(groupSize)}
        ),
        binned AS (
          SELECT ts.bin_ts, COALESCE(SUM(d.delta), 0) as delta
          FROM time_series ts
          LEFT JOIN daily d ON ${binJoin('d.day', 'ts.bin_ts', groupSize)}
          GROUP BY ts.bin_ts
        ),
        cumulative_data AS (
          SELECT
            (bin_ts - interval '1 second') AS timestamp,
            (SELECT initial_value FROM initial_count) +
            SUM(delta) OVER (ORDER BY bin_ts) AS value
          FROM binned
        )
        SELECT timestamp, value
        FROM cumulative_data
        ORDER BY timestamp
      `, [from, to]);
        const data = raw.map((r) => new DelegationsEntry({ timestamp: r.timestamp, value: parseInt(r.value) }));
        return new DelegationsTimeseries({ ...buildTimeseries(data, groupSize, from, to) });
    }
};
exports.DelegationsTimeseriesResolver = DelegationsTimeseriesResolver;
__decorate([
    (0, type_graphql_1.Query)(() => DelegationsTimeseries),
    __param(0, (0, type_graphql_1.Arg)('from', { nullable: true })),
    __param(1, (0, type_graphql_1.Arg)('to', { nullable: true })),
    __param(2, (0, type_graphql_1.Arg)('step', { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Date,
        Date, String]),
    __metadata("design:returntype", Promise)
], DelegationsTimeseriesResolver.prototype, "delegationsTimeseries", null);
exports.DelegationsTimeseriesResolver = DelegationsTimeseriesResolver = __decorate([
    (0, type_graphql_1.Resolver)(),
    __metadata("design:paramtypes", [Function])
], DelegationsTimeseriesResolver);
/* Unique delegators */
let DelegatorsEntry = class DelegatorsEntry {
    constructor(props) {
        Object.assign(this, props);
    }
};
__decorate([
    (0, type_graphql_1.Field)(() => graphql_server_1.DateTime),
    __metadata("design:type", Date)
], DelegatorsEntry.prototype, "timestamp", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Number, { nullable: true }),
    __metadata("design:type", Object)
], DelegatorsEntry.prototype, "value", void 0);
DelegatorsEntry = __decorate([
    (0, type_graphql_1.ObjectType)(),
    __metadata("design:paramtypes", [Object])
], DelegatorsEntry);
let DelegatorsTimeseries = class DelegatorsTimeseries {
    constructor(props) {
        Object.assign(this, props);
    }
};
__decorate([
    (0, type_graphql_1.Field)(() => [DelegatorsEntry]),
    __metadata("design:type", Array)
], DelegatorsTimeseries.prototype, "data", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Number),
    __metadata("design:type", Number)
], DelegatorsTimeseries.prototype, "step", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => graphql_server_1.DateTime),
    __metadata("design:type", Date)
], DelegatorsTimeseries.prototype, "from", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => graphql_server_1.DateTime),
    __metadata("design:type", Date)
], DelegatorsTimeseries.prototype, "to", void 0);
DelegatorsTimeseries = __decorate([
    (0, type_graphql_1.ObjectType)(),
    __metadata("design:paramtypes", [Object])
], DelegatorsTimeseries);
let DelegatorsTimeseriesResolver = class DelegatorsTimeseriesResolver {
    constructor(tx) {
        this.tx = tx;
    }
    async delegatorsTimeseries(fromArg, toArg, step) {
        const manager = await this.tx();
        const { from, to } = normalizeTimeRange(fromArg, toArg);
        const groupSize = getGroupSizeInfo(from, to, step);
        const raw = await manager.query(sql `
        WITH initial_count AS (
          SELECT COALESCE(SUM(delta), 0) AS initial_value
          FROM mv_delegators_daily
          WHERE timestamp < ${TRUNC_FROM}
        ),
        daily AS (
          SELECT ${truncDayUtc('timestamp')} as day, SUM(delta) as delta
          FROM mv_delegators_daily
          WHERE timestamp >= ${TRUNC_FROM} AND timestamp < ${TRUNC_TO}
          GROUP BY day
        ),
        time_series AS (
          ${generateTimeSeries(groupSize)}
        ),
        binned AS (
          SELECT ts.bin_ts, COALESCE(SUM(d.delta), 0) as delta
          FROM time_series ts
          LEFT JOIN daily d ON ${binJoin('d.day', 'ts.bin_ts', groupSize)}
          GROUP BY ts.bin_ts
        ),
        cumulative_data AS (
          SELECT
            (bin_ts - interval '1 second') AS timestamp,
            (SELECT initial_value FROM initial_count) +
            SUM(delta) OVER (ORDER BY bin_ts) AS value
          FROM binned
        )
        SELECT timestamp, value
        FROM cumulative_data
        ORDER BY timestamp
      `, [from, to]);
        const data = raw.map((r) => new DelegatorsEntry({ timestamp: r.timestamp, value: parseInt(r.value) }));
        return new DelegatorsTimeseries({ ...buildTimeseries(data, groupSize, from, to) });
    }
};
exports.DelegatorsTimeseriesResolver = DelegatorsTimeseriesResolver;
__decorate([
    (0, type_graphql_1.Query)(() => DelegatorsTimeseries),
    __param(0, (0, type_graphql_1.Arg)('from', { nullable: true })),
    __param(1, (0, type_graphql_1.Arg)('to', { nullable: true })),
    __param(2, (0, type_graphql_1.Arg)('step', { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Date,
        Date, String]),
    __metadata("design:returntype", Promise)
], DelegatorsTimeseriesResolver.prototype, "delegatorsTimeseries", null);
exports.DelegatorsTimeseriesResolver = DelegatorsTimeseriesResolver = __decorate([
    (0, type_graphql_1.Resolver)(),
    __metadata("design:paramtypes", [Function])
], DelegatorsTimeseriesResolver);
/* Queries count */
let QueriesCountEntry = class QueriesCountEntry {
    constructor(props) {
        Object.assign(this, props);
    }
};
__decorate([
    (0, type_graphql_1.Field)(() => graphql_server_1.DateTime),
    __metadata("design:type", Date)
], QueriesCountEntry.prototype, "timestamp", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Number, { nullable: true }),
    __metadata("design:type", Object)
], QueriesCountEntry.prototype, "value", void 0);
QueriesCountEntry = __decorate([
    (0, type_graphql_1.ObjectType)(),
    __metadata("design:paramtypes", [Object])
], QueriesCountEntry);
let QueriesCountTimeseries = class QueriesCountTimeseries {
    constructor(props) {
        Object.assign(this, props);
    }
};
__decorate([
    (0, type_graphql_1.Field)(() => [QueriesCountEntry]),
    __metadata("design:type", Array)
], QueriesCountTimeseries.prototype, "data", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Number),
    __metadata("design:type", Number)
], QueriesCountTimeseries.prototype, "step", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => graphql_server_1.DateTime),
    __metadata("design:type", Date)
], QueriesCountTimeseries.prototype, "from", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => graphql_server_1.DateTime),
    __metadata("design:type", Date)
], QueriesCountTimeseries.prototype, "to", void 0);
QueriesCountTimeseries = __decorate([
    (0, type_graphql_1.ObjectType)(),
    __metadata("design:paramtypes", [Object])
], QueriesCountTimeseries);
let QueriesCountTimeseriesResolver = class QueriesCountTimeseriesResolver {
    constructor(tx) {
        this.tx = tx;
    }
    async queriesCountTimeseries(fromArg, toArg, step, workerId) {
        const manager = await this.tx();
        const { groupSize, from, to } = prepareTimeseriesContext(fromArg, toArg, step);
        const { filter: workerFilter } = buildWorkerFilter(workerId);
        const params = workerId ? [from, to, workerId] : [from, to];
        const raw = await manager.query(sql `
      WITH
      time_series AS (
        ${generateTimeSeries(groupSize)}
      ),
      daily AS (
        SELECT ${truncDayUtc('timestamp')} as day, sum(value) as value
        FROM mv_queries_daily
        WHERE timestamp >= ${TRUNC_FROM} AND timestamp < ${TRUNC_TO} ${workerFilter}
        GROUP BY day
      )
      SELECT 
        (ts.bin_ts - interval '1 second') as date,
        COALESCE(SUM(d.value), 0) as value
      FROM time_series ts
      LEFT JOIN daily d ON ${binJoin('d.day', 'ts.bin_ts', groupSize)}
      GROUP BY ts.bin_ts
      ORDER BY ts.bin_ts
      `, params);
        const data = raw.map((r) => new QueriesCountEntry({ timestamp: r.date, value: parseInt(r.value) }));
        return new QueriesCountTimeseries({ ...buildTimeseries(data, groupSize, from, to) });
    }
};
exports.QueriesCountTimeseriesResolver = QueriesCountTimeseriesResolver;
__decorate([
    (0, type_graphql_1.Query)(() => QueriesCountTimeseries),
    __param(0, (0, type_graphql_1.Arg)('from', { nullable: true })),
    __param(1, (0, type_graphql_1.Arg)('to', { nullable: true })),
    __param(2, (0, type_graphql_1.Arg)('step', { nullable: true })),
    __param(3, (0, type_graphql_1.Arg)('workerId', { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Date,
        Date, String, String]),
    __metadata("design:returntype", Promise)
], QueriesCountTimeseriesResolver.prototype, "queriesCountTimeseries", null);
exports.QueriesCountTimeseriesResolver = QueriesCountTimeseriesResolver = __decorate([
    (0, type_graphql_1.Resolver)(),
    __metadata("design:paramtypes", [Function])
], QueriesCountTimeseriesResolver);
/* Served data */
let ServedDataEntry = class ServedDataEntry {
    constructor(props) {
        Object.assign(this, props);
    }
};
__decorate([
    (0, type_graphql_1.Field)(() => graphql_server_1.DateTime),
    __metadata("design:type", Date)
], ServedDataEntry.prototype, "timestamp", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Number, { nullable: true }),
    __metadata("design:type", Object)
], ServedDataEntry.prototype, "value", void 0);
ServedDataEntry = __decorate([
    (0, type_graphql_1.ObjectType)(),
    __metadata("design:paramtypes", [Object])
], ServedDataEntry);
let ServedDataTimeseries = class ServedDataTimeseries {
    constructor(props) {
        Object.assign(this, props);
    }
};
__decorate([
    (0, type_graphql_1.Field)(() => [ServedDataEntry]),
    __metadata("design:type", Array)
], ServedDataTimeseries.prototype, "data", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Number),
    __metadata("design:type", Number)
], ServedDataTimeseries.prototype, "step", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => graphql_server_1.DateTime),
    __metadata("design:type", Date)
], ServedDataTimeseries.prototype, "from", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => graphql_server_1.DateTime),
    __metadata("design:type", Date)
], ServedDataTimeseries.prototype, "to", void 0);
ServedDataTimeseries = __decorate([
    (0, type_graphql_1.ObjectType)(),
    __metadata("design:paramtypes", [Object])
], ServedDataTimeseries);
let ServedDataTimeseriesResolver = class ServedDataTimeseriesResolver {
    constructor(tx) {
        this.tx = tx;
    }
    async servedDataTimeseries(fromArg, toArg, step, workerId) {
        const manager = await this.tx();
        const { groupSize, from, to } = prepareTimeseriesContext(fromArg, toArg, step);
        const { filter: workerFilter } = buildWorkerFilter(workerId);
        const params = workerId ? [from, to, workerId] : [from, to];
        const raw = await manager.query(sql `
      WITH
      time_series AS (
        ${generateTimeSeries(groupSize)}
      ),
      daily AS (
        SELECT ${truncDayUtc('timestamp')} as day, sum(value) as value
        FROM mv_served_data_daily
        WHERE timestamp >= ${TRUNC_FROM} AND timestamp < ${TRUNC_TO} ${workerFilter}
        GROUP BY day
      )
      SELECT 
        (ts.bin_ts - interval '1 second') as date,
        COALESCE(SUM(d.value), 0) as value
      FROM time_series ts
      LEFT JOIN daily d ON ${binJoin('d.day', 'ts.bin_ts', groupSize)}
      GROUP BY ts.bin_ts
      ORDER BY ts.bin_ts
      `, params);
        const data = raw.map((r) => new ServedDataEntry({ timestamp: r.date, value: parseInt(r.value) }));
        return new ServedDataTimeseries({ ...buildTimeseries(data, groupSize, from, to) });
    }
};
exports.ServedDataTimeseriesResolver = ServedDataTimeseriesResolver;
__decorate([
    (0, type_graphql_1.Query)(() => ServedDataTimeseries),
    __param(0, (0, type_graphql_1.Arg)('from', { nullable: true })),
    __param(1, (0, type_graphql_1.Arg)('to', { nullable: true })),
    __param(2, (0, type_graphql_1.Arg)('step', { nullable: true })),
    __param(3, (0, type_graphql_1.Arg)('workerId', { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Date,
        Date, String, String]),
    __metadata("design:returntype", Promise)
], ServedDataTimeseriesResolver.prototype, "servedDataTimeseries", null);
exports.ServedDataTimeseriesResolver = ServedDataTimeseriesResolver = __decorate([
    (0, type_graphql_1.Resolver)(),
    __metadata("design:paramtypes", [Function])
], ServedDataTimeseriesResolver);
/* Stored data */
let StoredDataEntry = class StoredDataEntry {
    constructor(props) {
        Object.assign(this, props);
    }
};
__decorate([
    (0, type_graphql_1.Field)(() => graphql_server_1.DateTime),
    __metadata("design:type", Date)
], StoredDataEntry.prototype, "timestamp", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Number, { nullable: true }),
    __metadata("design:type", Object)
], StoredDataEntry.prototype, "value", void 0);
StoredDataEntry = __decorate([
    (0, type_graphql_1.ObjectType)(),
    __metadata("design:paramtypes", [Object])
], StoredDataEntry);
let StoredDataTimeseries = class StoredDataTimeseries {
    constructor(props) {
        Object.assign(this, props);
    }
};
__decorate([
    (0, type_graphql_1.Field)(() => [StoredDataEntry]),
    __metadata("design:type", Array)
], StoredDataTimeseries.prototype, "data", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Number),
    __metadata("design:type", Number)
], StoredDataTimeseries.prototype, "step", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => graphql_server_1.DateTime),
    __metadata("design:type", Date)
], StoredDataTimeseries.prototype, "from", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => graphql_server_1.DateTime),
    __metadata("design:type", Date)
], StoredDataTimeseries.prototype, "to", void 0);
StoredDataTimeseries = __decorate([
    (0, type_graphql_1.ObjectType)(),
    __metadata("design:paramtypes", [Object])
], StoredDataTimeseries);
let StoredDataTimeseriesResolver = class StoredDataTimeseriesResolver {
    constructor(tx) {
        this.tx = tx;
    }
    async storedDataTimeseries(fromArg, toArg, step, workerId) {
        const manager = await this.tx();
        const { groupSize, from, to } = prepareTimeseriesContext(fromArg, toArg, step);
        const { filter: workerFilter } = buildWorkerFilter(workerId);
        const params = workerId ? [from, to, workerId] : [from, to];
        const raw = await manager.query(sql `
      WITH
      time_series AS (
        ${generateTimeSeries(groupSize)}
      ),
      daily AS (
        SELECT day, SUM(avg_per_worker) as value
        FROM (
          SELECT 
            ${truncDayUtc('timestamp')} as day,
            worker_id,
            AVG(value) as avg_per_worker
          FROM mv_stored_data_daily
          WHERE timestamp >= ${TRUNC_FROM} AND timestamp < ${TRUNC_TO} ${workerFilter}
          GROUP BY day, worker_id
        ) worker_averages
        GROUP BY day
      )
      SELECT 
        (ts.bin_ts - interval '1 second') as date,
        COALESCE(SUM(d.value), COALESCE(LAG(SUM(d.value)) OVER (ORDER BY ts.bin_ts), 0)) as value
      FROM time_series ts
      LEFT JOIN daily d ON ${binJoin('d.day', 'ts.bin_ts', groupSize)}
      GROUP BY ts.bin_ts
      ORDER BY ts.bin_ts
      `, params);
        const data = raw.map((r) => new StoredDataEntry({ timestamp: r.date, value: parseInt(r.value) }));
        return new StoredDataTimeseries({ ...buildTimeseries(data, groupSize, from, to) });
    }
};
exports.StoredDataTimeseriesResolver = StoredDataTimeseriesResolver;
__decorate([
    (0, type_graphql_1.Query)(() => StoredDataTimeseries),
    __param(0, (0, type_graphql_1.Arg)('from', { nullable: true })),
    __param(1, (0, type_graphql_1.Arg)('to', { nullable: true })),
    __param(2, (0, type_graphql_1.Arg)('step', { nullable: true })),
    __param(3, (0, type_graphql_1.Arg)('workerId', { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Date,
        Date, String, String]),
    __metadata("design:returntype", Promise)
], StoredDataTimeseriesResolver.prototype, "storedDataTimeseries", null);
exports.StoredDataTimeseriesResolver = StoredDataTimeseriesResolver = __decorate([
    (0, type_graphql_1.Resolver)(),
    __metadata("design:paramtypes", [Function])
], StoredDataTimeseriesResolver);
/* Uptime */
let UptimeEntry = class UptimeEntry {
    constructor(props) {
        Object.assign(this, props);
    }
};
__decorate([
    (0, type_graphql_1.Field)(() => graphql_server_1.DateTime),
    __metadata("design:type", Date)
], UptimeEntry.prototype, "timestamp", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Number, { nullable: true }),
    __metadata("design:type", Object)
], UptimeEntry.prototype, "value", void 0);
UptimeEntry = __decorate([
    (0, type_graphql_1.ObjectType)(),
    __metadata("design:paramtypes", [Object])
], UptimeEntry);
let UptimeTimeseries = class UptimeTimeseries {
    constructor(props) {
        Object.assign(this, props);
    }
};
__decorate([
    (0, type_graphql_1.Field)(() => [UptimeEntry]),
    __metadata("design:type", Array)
], UptimeTimeseries.prototype, "data", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Number),
    __metadata("design:type", Number)
], UptimeTimeseries.prototype, "step", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => graphql_server_1.DateTime),
    __metadata("design:type", Date)
], UptimeTimeseries.prototype, "from", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => graphql_server_1.DateTime),
    __metadata("design:type", Date)
], UptimeTimeseries.prototype, "to", void 0);
UptimeTimeseries = __decorate([
    (0, type_graphql_1.ObjectType)(),
    __metadata("design:paramtypes", [Object])
], UptimeTimeseries);
let UptimeTimeseriesResolver = class UptimeTimeseriesResolver {
    constructor(tx) {
        this.tx = tx;
    }
    async uptimeTimeseries(fromArg, toArg, step, workerId) {
        const manager = await this.tx();
        const { groupSize, from, to } = prepareTimeseriesContext(fromArg, toArg, step);
        const { filter: workerFilter } = buildWorkerFilter(workerId);
        const params = workerId ? [from, to, workerId] : [from, to];
        const raw = await manager.query(sql `
      WITH
      time_series AS (
        ${generateTimeSeries(groupSize)}
      ),
      daily AS (
        SELECT 
          ${truncDayUtc('timestamp')} as day,
          AVG(value) as value
        FROM mv_uptime_daily
        WHERE timestamp >= ${TRUNC_FROM} AND timestamp < ${TRUNC_TO} ${workerFilter}
        GROUP BY day
      )
      SELECT 
        (ts.bin_ts - interval '1 second') as date,
        COALESCE(AVG(d.value), 0) as value
      FROM time_series ts
      LEFT JOIN daily d ON ${binJoin('d.day', 'ts.bin_ts', groupSize)}
      GROUP BY ts.bin_ts
      ORDER BY ts.bin_ts
      `, params);
        const data = raw.map((r) => new UptimeEntry({ timestamp: r.date, value: parseFloat(r.value) }));
        return new UptimeTimeseries({ ...buildTimeseries(data, groupSize, from, to) });
    }
};
exports.UptimeTimeseriesResolver = UptimeTimeseriesResolver;
__decorate([
    (0, type_graphql_1.Query)(() => UptimeTimeseries),
    __param(0, (0, type_graphql_1.Arg)('from', { nullable: true })),
    __param(1, (0, type_graphql_1.Arg)('to', { nullable: true })),
    __param(2, (0, type_graphql_1.Arg)('step', { nullable: true })),
    __param(3, (0, type_graphql_1.Arg)('workerId', { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Date,
        Date, String, String]),
    __metadata("design:returntype", Promise)
], UptimeTimeseriesResolver.prototype, "uptimeTimeseries", null);
exports.UptimeTimeseriesResolver = UptimeTimeseriesResolver = __decorate([
    (0, type_graphql_1.Resolver)(),
    __metadata("design:paramtypes", [Function])
], UptimeTimeseriesResolver);
/* Reward */
let RewardValue = class RewardValue {
    constructor(props) {
        Object.assign(this, props);
    }
};
__decorate([
    (0, type_graphql_1.Field)(() => BigInt),
    __metadata("design:type", BigInt)
], RewardValue.prototype, "workerReward", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => BigInt),
    __metadata("design:type", BigInt)
], RewardValue.prototype, "stakerReward", void 0);
RewardValue = __decorate([
    (0, type_graphql_1.ObjectType)(),
    __metadata("design:paramtypes", [Object])
], RewardValue);
let RewardEntry = class RewardEntry {
    constructor(props) {
        Object.assign(this, props);
    }
};
__decorate([
    (0, type_graphql_1.Field)(() => graphql_server_1.DateTime),
    __metadata("design:type", Date)
], RewardEntry.prototype, "timestamp", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => RewardValue, { nullable: true }),
    __metadata("design:type", Object)
], RewardEntry.prototype, "value", void 0);
RewardEntry = __decorate([
    (0, type_graphql_1.ObjectType)(),
    __metadata("design:paramtypes", [Object])
], RewardEntry);
let RewardTimeseries = class RewardTimeseries {
    constructor(props) {
        Object.assign(this, props);
    }
};
__decorate([
    (0, type_graphql_1.Field)(() => [RewardEntry]),
    __metadata("design:type", Array)
], RewardTimeseries.prototype, "data", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Number),
    __metadata("design:type", Number)
], RewardTimeseries.prototype, "step", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => graphql_server_1.DateTime),
    __metadata("design:type", Date)
], RewardTimeseries.prototype, "from", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => graphql_server_1.DateTime),
    __metadata("design:type", Date)
], RewardTimeseries.prototype, "to", void 0);
RewardTimeseries = __decorate([
    (0, type_graphql_1.ObjectType)(),
    __metadata("design:paramtypes", [Object])
], RewardTimeseries);
let RewardTimeseriesResolver = class RewardTimeseriesResolver {
    constructor(tx) {
        this.tx = tx;
    }
    async rewardTimeseries(fromArg, toArg, step, workerId) {
        const manager = await this.tx();
        const { groupSize, from, to } = prepareTimeseriesContext(fromArg, toArg, step);
        const workerFilter = workerId ? sql `AND worker_id = $3` : '';
        const params = workerId ? [from, to, workerId] : [from, to];
        const raw = await manager.query(sql `
      WITH
      time_series AS (
        ${generateTimeSeries(groupSize)}
      ),
      daily AS (
        SELECT
          ${truncDayUtc('timestamp')} as day,
          SUM(worker_value) AS worker_value,
          SUM(staker_value) AS staker_value
        FROM mv_reward_daily
        WHERE timestamp >= ${TRUNC_FROM} AND timestamp < ${TRUNC_TO} ${workerFilter}
        GROUP BY day
      )
      SELECT 
        (ts.bin_ts - interval '1 second') as date,
        COALESCE(SUM(d.worker_value), 0) as worker_value,
        COALESCE(SUM(d.staker_value), 0) as staker_value
      FROM time_series ts
      LEFT JOIN daily d ON ${binJoin('d.day', 'ts.bin_ts', groupSize)}
      GROUP BY ts.bin_ts
      ORDER BY ts.bin_ts
      `, params);
        const data = raw.map((r) => new RewardEntry({
            timestamp: r.date,
            value: new RewardValue({
                workerReward: BigInt(r.worker_value),
                stakerReward: BigInt(r.staker_value),
            }),
        }));
        return new RewardTimeseries({ ...buildTimeseries(data, groupSize, from, to) });
    }
};
exports.RewardTimeseriesResolver = RewardTimeseriesResolver;
__decorate([
    (0, type_graphql_1.Query)(() => RewardTimeseries),
    __param(0, (0, type_graphql_1.Arg)('from', { nullable: true })),
    __param(1, (0, type_graphql_1.Arg)('to', { nullable: true })),
    __param(2, (0, type_graphql_1.Arg)('step', { nullable: true })),
    __param(3, (0, type_graphql_1.Arg)('workerId', { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Date,
        Date, String, String]),
    __metadata("design:returntype", Promise)
], RewardTimeseriesResolver.prototype, "rewardTimeseries", null);
exports.RewardTimeseriesResolver = RewardTimeseriesResolver = __decorate([
    (0, type_graphql_1.Resolver)(),
    __metadata("design:paramtypes", [Function])
], RewardTimeseriesResolver);
/* APR */
let AprValue = class AprValue {
    constructor(props) {
        Object.assign(this, props);
    }
};
__decorate([
    (0, type_graphql_1.Field)(() => Number),
    __metadata("design:type", Number)
], AprValue.prototype, "workerApr", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Number),
    __metadata("design:type", Number)
], AprValue.prototype, "stakerApr", void 0);
AprValue = __decorate([
    (0, type_graphql_1.ObjectType)(),
    __metadata("design:paramtypes", [Object])
], AprValue);
let AprEntry = class AprEntry {
    constructor(props) {
        Object.assign(this, props);
    }
};
__decorate([
    (0, type_graphql_1.Field)(() => graphql_server_1.DateTime),
    __metadata("design:type", Date)
], AprEntry.prototype, "timestamp", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => AprValue, { nullable: true }),
    __metadata("design:type", Object)
], AprEntry.prototype, "value", void 0);
AprEntry = __decorate([
    (0, type_graphql_1.ObjectType)(),
    __metadata("design:paramtypes", [Object])
], AprEntry);
let AprTimeseries = class AprTimeseries {
    constructor(props) {
        Object.assign(this, props);
    }
};
__decorate([
    (0, type_graphql_1.Field)(() => [AprEntry]),
    __metadata("design:type", Array)
], AprTimeseries.prototype, "data", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Number),
    __metadata("design:type", Number)
], AprTimeseries.prototype, "step", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => graphql_server_1.DateTime),
    __metadata("design:type", Date)
], AprTimeseries.prototype, "from", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => graphql_server_1.DateTime),
    __metadata("design:type", Date)
], AprTimeseries.prototype, "to", void 0);
AprTimeseries = __decorate([
    (0, type_graphql_1.ObjectType)(),
    __metadata("design:paramtypes", [Object])
], AprTimeseries);
let AprTimeseriesResolver = class AprTimeseriesResolver {
    constructor(tx) {
        this.tx = tx;
    }
    async aprTimeseries(fromArg, toArg, step, workerId) {
        const manager = await this.tx();
        const { groupSize, from, to } = prepareTimeseriesContext(fromArg, toArg, step);
        let raw;
        if (workerId) {
            const params = [from, to, workerId];
            raw = await manager.query(sql `
        WITH
        time_series AS (
          ${generateTimeSeries(groupSize)}
        ),
        daily AS (
          SELECT
            ${truncDayUtc('timestamp')} as day,
            COALESCE(PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY apr) FILTER (WHERE apr > 0), 0) AS "workerApr",
            COALESCE(PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY staker_apr) FILTER (WHERE staker_apr > 0), 0) AS "stakerApr"
          FROM worker_reward
          WHERE timestamp >= ${TRUNC_FROM} AND timestamp < ${TRUNC_TO} AND worker_id = $3
          GROUP BY day
        )
        SELECT 
          (ts.bin_ts - interval '1 second') as date,
          COALESCE(AVG(d."workerApr"), 0) as "workerApr",
          COALESCE(AVG(d."stakerApr"), 0) as "stakerApr"
        FROM time_series ts
        LEFT JOIN daily d ON ${binJoin('d.day', 'ts.bin_ts', groupSize)}
        GROUP BY ts.bin_ts
        ORDER BY ts.bin_ts
        `, params);
        }
        else {
            const params = [from, to];
            raw = await manager.query(sql `
        WITH
        time_series AS (
          ${generateTimeSeries(groupSize)}
        ),
        daily AS (
          SELECT
            ${truncDayUtc('timestamp')} as day,
            AVG(worker_apr) FILTER (WHERE worker_apr > 0) AS "workerApr",
            AVG(staker_apr) FILTER (WHERE staker_apr > 0) AS "stakerApr"
          FROM mv_apr_daily
          WHERE timestamp >= ${TRUNC_FROM} AND timestamp < ${TRUNC_TO}
          GROUP BY day
        )
        SELECT 
          (ts.bin_ts - interval '1 second') as date,
          COALESCE(AVG(d."workerApr"), 0) as "workerApr",
          COALESCE(AVG(d."stakerApr"), 0) as "stakerApr"
        FROM time_series ts
        LEFT JOIN daily d ON ${binJoin('d.day', 'ts.bin_ts', groupSize)}
        GROUP BY ts.bin_ts
        ORDER BY ts.bin_ts
        `, params);
        }
        const data = raw.map((r) => new AprEntry({
            timestamp: r.date,
            value: new AprValue({
                workerApr: Number(r.workerApr),
                stakerApr: Number(r.stakerApr),
            }),
        }));
        return new AprTimeseries({ ...buildTimeseries(data, groupSize, from, to) });
    }
};
exports.AprTimeseriesResolver = AprTimeseriesResolver;
__decorate([
    (0, type_graphql_1.Query)(() => AprTimeseries),
    __param(0, (0, type_graphql_1.Arg)('from', { nullable: true })),
    __param(1, (0, type_graphql_1.Arg)('to', { nullable: true })),
    __param(2, (0, type_graphql_1.Arg)('step', { nullable: true })),
    __param(3, (0, type_graphql_1.Arg)('workerId', { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Date,
        Date, String, String]),
    __metadata("design:returntype", Promise)
], AprTimeseriesResolver.prototype, "aprTimeseries", null);
exports.AprTimeseriesResolver = AprTimeseriesResolver = __decorate([
    (0, type_graphql_1.Resolver)(),
    __metadata("design:paramtypes", [Function])
], AprTimeseriesResolver);
//# sourceMappingURL=timeseries.js.map