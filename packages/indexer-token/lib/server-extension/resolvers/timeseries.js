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
exports.AccountBalanceTimeseriesResolver = exports.UniqueAccountsTimeseriesResolver = exports.TransfersByTypeTimeseriesResolver = exports.LockedValueTimeseriesResolver = exports.HoldersCountTimeseriesResolver = void 0;
const shared_1 = require("@sqd/shared");
const graphql_server_1 = require("@subsquid/graphql-server");
const type_graphql_1 = require("type-graphql");
const INITIAL_TIMESTAMP = shared_1.network.name === 'mainnet' ? new Date('2024-03-25T16:55:45Z') : new Date('2024-01-10T00:32:20Z');
var TvlType;
(function (TvlType) {
    TvlType["WORKER"] = "WORKER";
    TvlType["DELEGATION"] = "DELEGATION";
    TvlType["PORTAL"] = "PORTAL";
    TvlType["PORTAL_POOL"] = "PORTAL_POOL";
})(TvlType || (TvlType = {}));
(0, type_graphql_1.registerEnumType)(TvlType, {
    name: 'TvlType',
});
function normalizeTimeRange(from, to) {
    const now = new Date();
    const normalizedTo = to != null && to < now ? to : now;
    const normalizedFrom = from != null && from > INITIAL_TIMESTAMP ? from : INITIAL_TIMESTAMP;
    return { from: normalizedFrom, to: normalizedTo };
}
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
/* Holders count */
let HoldersCountEntry = class HoldersCountEntry {
    constructor(props) {
        Object.assign(this, props);
    }
};
__decorate([
    (0, type_graphql_1.Field)(() => graphql_server_1.DateTime),
    __metadata("design:type", Date)
], HoldersCountEntry.prototype, "timestamp", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Number, { nullable: true }),
    __metadata("design:type", Object)
], HoldersCountEntry.prototype, "value", void 0);
HoldersCountEntry = __decorate([
    (0, type_graphql_1.ObjectType)(),
    __metadata("design:paramtypes", [Object])
], HoldersCountEntry);
let HoldersCountTimeseries = class HoldersCountTimeseries {
    constructor(props) {
        Object.assign(this, props);
    }
};
__decorate([
    (0, type_graphql_1.Field)(() => [HoldersCountEntry]),
    __metadata("design:type", Array)
], HoldersCountTimeseries.prototype, "data", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Number),
    __metadata("design:type", Number)
], HoldersCountTimeseries.prototype, "step", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => graphql_server_1.DateTime),
    __metadata("design:type", Date)
], HoldersCountTimeseries.prototype, "from", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => graphql_server_1.DateTime),
    __metadata("design:type", Date)
], HoldersCountTimeseries.prototype, "to", void 0);
HoldersCountTimeseries = __decorate([
    (0, type_graphql_1.ObjectType)(),
    __metadata("design:paramtypes", [Object])
], HoldersCountTimeseries);
let HoldersCountTimeseriesResolver = class HoldersCountTimeseriesResolver {
    constructor(tx) {
        this.tx = tx;
    }
    async holdersCountTimeseries(fromArg, toArg, step) {
        const manager = await this.tx();
        const { from, to } = normalizeTimeRange(fromArg, toArg);
        const groupSize = getGroupSizeInfo(from, to, step);
        const raw = await manager.query(sql `
        WITH initial_count AS (
          SELECT COALESCE(SUM(delta), 0) AS initial_value
          FROM mv_holders_count_daily
          WHERE timestamp < ${TRUNC_FROM}
        ),
        daily AS (
          SELECT ${truncDayUtc('timestamp')} as day, SUM(delta) as delta
          FROM mv_holders_count_daily
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
        const data = raw.map((r) => new HoldersCountEntry({ timestamp: r.timestamp, value: parseInt(r.value) }));
        return new HoldersCountTimeseries({ ...buildTimeseries(data, groupSize, from, to) });
    }
};
exports.HoldersCountTimeseriesResolver = HoldersCountTimeseriesResolver;
__decorate([
    (0, type_graphql_1.Query)(() => HoldersCountTimeseries),
    __param(0, (0, type_graphql_1.Arg)('from', { nullable: true })),
    __param(1, (0, type_graphql_1.Arg)('to', { nullable: true })),
    __param(2, (0, type_graphql_1.Arg)('step', { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Date,
        Date, String]),
    __metadata("design:returntype", Promise)
], HoldersCountTimeseriesResolver.prototype, "holdersCountTimeseries", null);
exports.HoldersCountTimeseriesResolver = HoldersCountTimeseriesResolver = __decorate([
    (0, type_graphql_1.Resolver)(),
    __metadata("design:paramtypes", [Function])
], HoldersCountTimeseriesResolver);
/* Locked value (TVL) */
let TvlEntry = class TvlEntry {
    constructor(props) {
        Object.assign(this, props);
    }
};
__decorate([
    (0, type_graphql_1.Field)(() => graphql_server_1.DateTime),
    __metadata("design:type", Date)
], TvlEntry.prototype, "timestamp", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => BigInt, { nullable: true }),
    __metadata("design:type", Object)
], TvlEntry.prototype, "value", void 0);
TvlEntry = __decorate([
    (0, type_graphql_1.ObjectType)(),
    __metadata("design:paramtypes", [Object])
], TvlEntry);
let LockedValueTimeseries = class LockedValueTimeseries {
    constructor(props) {
        Object.assign(this, props);
    }
};
__decorate([
    (0, type_graphql_1.Field)(() => [TvlEntry]),
    __metadata("design:type", Array)
], LockedValueTimeseries.prototype, "data", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Number),
    __metadata("design:type", Number)
], LockedValueTimeseries.prototype, "step", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => graphql_server_1.DateTime),
    __metadata("design:type", Date)
], LockedValueTimeseries.prototype, "from", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => graphql_server_1.DateTime),
    __metadata("design:type", Date)
], LockedValueTimeseries.prototype, "to", void 0);
LockedValueTimeseries = __decorate([
    (0, type_graphql_1.ObjectType)(),
    __metadata("design:paramtypes", [Object])
], LockedValueTimeseries);
function getTvlTypeFilter(type) {
    switch (type) {
        case TvlType.WORKER:
            return 'worker_id IS NOT NULL';
        case TvlType.DELEGATION:
            return 'delegation_id IS NOT NULL';
        case TvlType.PORTAL:
            return 'gateway_stake_id IS NOT NULL';
        case TvlType.PORTAL_POOL:
            return 'portal_pool_id IS NOT NULL';
    }
}
let LockedValueTimeseriesResolver = class LockedValueTimeseriesResolver {
    constructor(tx) {
        this.tx = tx;
    }
    async lockedValueTimeseries(fromArg, toArg, step, type) {
        const manager = await this.tx();
        const { from, to } = normalizeTimeRange(fromArg, toArg);
        const groupSize = getGroupSizeInfo(from, to, step);
        let raw;
        if (type) {
            const typeFilter = getTvlTypeFilter(type);
            raw = await manager.query(sql `
          WITH initial_value AS (
            SELECT COALESCE(SUM(
              CASE WHEN type = 'DEPOSIT' THEN amount WHEN type = 'WITHDRAW' THEN -amount ELSE 0 END
            ), 0) AS initial_locked
            FROM transfer
            WHERE type IN ('DEPOSIT', 'WITHDRAW') AND timestamp < ${TRUNC_FROM} AND ${typeFilter}
          ),
          daily AS (
            SELECT
              ${truncDayUtc('timestamp')} as day,
              SUM(CASE WHEN type = 'DEPOSIT' THEN amount WHEN type = 'WITHDRAW' THEN -amount ELSE 0 END) as delta
            FROM transfer
            WHERE type IN ('DEPOSIT', 'WITHDRAW') AND timestamp >= ${TRUNC_FROM} AND timestamp < ${TRUNC_TO} AND ${typeFilter}
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
              (SELECT initial_locked FROM initial_value) +
              SUM(delta) OVER (ORDER BY bin_ts) AS value
            FROM binned
          )
          SELECT timestamp, value
          FROM cumulative_data
          ORDER BY timestamp
        `, [from, to]);
        }
        else {
            raw = await manager.query(sql `
          WITH initial_value AS (
            SELECT COALESCE(SUM(delta), 0) AS initial_locked
            FROM mv_locked_value_daily
            WHERE timestamp < ${TRUNC_FROM}
          ),
          daily AS (
            SELECT ${truncDayUtc('timestamp')} as day, SUM(delta) as delta
            FROM mv_locked_value_daily
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
              (SELECT initial_locked FROM initial_value) +
              SUM(delta) OVER (ORDER BY bin_ts) AS value
            FROM binned
          )
          SELECT timestamp, value
          FROM cumulative_data
          ORDER BY timestamp
        `, [from, to]);
        }
        const data = raw.map((r) => new TvlEntry({ timestamp: r.timestamp, value: BigInt(r.value) }));
        return new LockedValueTimeseries({ ...buildTimeseries(data, groupSize, from, to) });
    }
};
exports.LockedValueTimeseriesResolver = LockedValueTimeseriesResolver;
__decorate([
    (0, type_graphql_1.Query)(() => LockedValueTimeseries),
    __param(0, (0, type_graphql_1.Arg)('from', { nullable: true })),
    __param(1, (0, type_graphql_1.Arg)('to', { nullable: true })),
    __param(2, (0, type_graphql_1.Arg)('step', { nullable: true })),
    __param(3, (0, type_graphql_1.Arg)('type', () => TvlType, { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Date,
        Date, String, String]),
    __metadata("design:returntype", Promise)
], LockedValueTimeseriesResolver.prototype, "lockedValueTimeseries", null);
exports.LockedValueTimeseriesResolver = LockedValueTimeseriesResolver = __decorate([
    (0, type_graphql_1.Resolver)(),
    __metadata("design:paramtypes", [Function])
], LockedValueTimeseriesResolver);
/* Transfers by type */
let TransferCountByTypeValue = class TransferCountByTypeValue {
    constructor(props) {
        Object.assign(this, props);
    }
};
__decorate([
    (0, type_graphql_1.Field)(() => Number),
    __metadata("design:type", Number)
], TransferCountByTypeValue.prototype, "deposit", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Number),
    __metadata("design:type", Number)
], TransferCountByTypeValue.prototype, "withdraw", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Number),
    __metadata("design:type", Number)
], TransferCountByTypeValue.prototype, "transfer", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Number),
    __metadata("design:type", Number)
], TransferCountByTypeValue.prototype, "reward", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Number),
    __metadata("design:type", Number)
], TransferCountByTypeValue.prototype, "release", void 0);
TransferCountByTypeValue = __decorate([
    (0, type_graphql_1.ObjectType)(),
    __metadata("design:paramtypes", [Object])
], TransferCountByTypeValue);
let TransferCountByType = class TransferCountByType {
    constructor(props) {
        Object.assign(this, props);
    }
};
__decorate([
    (0, type_graphql_1.Field)(() => graphql_server_1.DateTime),
    __metadata("design:type", Date)
], TransferCountByType.prototype, "timestamp", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => TransferCountByTypeValue, { nullable: true }),
    __metadata("design:type", Object)
], TransferCountByType.prototype, "value", void 0);
TransferCountByType = __decorate([
    (0, type_graphql_1.ObjectType)(),
    __metadata("design:paramtypes", [Object])
], TransferCountByType);
let TransfersByTypeTimeseries = class TransfersByTypeTimeseries {
    constructor(props) {
        Object.assign(this, props);
    }
};
__decorate([
    (0, type_graphql_1.Field)(() => [TransferCountByType]),
    __metadata("design:type", Array)
], TransfersByTypeTimeseries.prototype, "data", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Number),
    __metadata("design:type", Number)
], TransfersByTypeTimeseries.prototype, "step", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => graphql_server_1.DateTime),
    __metadata("design:type", Date)
], TransfersByTypeTimeseries.prototype, "from", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => graphql_server_1.DateTime),
    __metadata("design:type", Date)
], TransfersByTypeTimeseries.prototype, "to", void 0);
TransfersByTypeTimeseries = __decorate([
    (0, type_graphql_1.ObjectType)(),
    __metadata("design:paramtypes", [Object])
], TransfersByTypeTimeseries);
let TransfersByTypeTimeseriesResolver = class TransfersByTypeTimeseriesResolver {
    constructor(tx) {
        this.tx = tx;
    }
    async transfersByTypeTimeseries(fromArg, toArg, step) {
        const manager = await this.tx();
        const { from, to } = normalizeTimeRange(fromArg, toArg);
        const groupSize = getGroupSizeInfo(from, to, step);
        const raw = await manager.query(sql `
        WITH
        time_series AS (
          ${generateTimeSeries(groupSize)}
        ),
        daily AS (
          SELECT 
            ${truncDayUtc('timestamp')} as day,
            SUM(deposit) as deposit,
            SUM(withdraw) as withdraw,
            SUM(reward) as reward,
            SUM(release) as release,
            SUM(transfer) as transfer
          FROM mv_transfers_by_type_daily
          WHERE timestamp >= ${TRUNC_FROM} AND timestamp < ${TRUNC_TO}
          GROUP BY day
        )
        SELECT 
          (ts.bin_ts - interval '1 second') as date,
          COALESCE(SUM(d.deposit), 0) as deposit,
          COALESCE(SUM(d.withdraw), 0) as withdraw,
          COALESCE(SUM(d.transfer), 0) as transfer,
          COALESCE(SUM(d.reward), 0) as reward,
          COALESCE(SUM(d.release), 0) as release
        FROM time_series ts
        LEFT JOIN daily d ON ${binJoin('d.day', 'ts.bin_ts', groupSize)}
        GROUP BY ts.bin_ts
        ORDER BY ts.bin_ts
      `, [from, to]);
        const data = raw.map((r) => new TransferCountByType({
            timestamp: r.date,
            value: new TransferCountByTypeValue({
                deposit: parseInt(r.deposit),
                withdraw: parseInt(r.withdraw),
                transfer: parseInt(r.transfer),
                reward: parseInt(r.reward),
                release: parseInt(r.release),
            }),
        }));
        return new TransfersByTypeTimeseries({ ...buildTimeseries(data, groupSize, from, to) });
    }
};
exports.TransfersByTypeTimeseriesResolver = TransfersByTypeTimeseriesResolver;
__decorate([
    (0, type_graphql_1.Query)(() => TransfersByTypeTimeseries),
    __param(0, (0, type_graphql_1.Arg)('from', { nullable: true })),
    __param(1, (0, type_graphql_1.Arg)('to', { nullable: true })),
    __param(2, (0, type_graphql_1.Arg)('step', { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Date,
        Date, String]),
    __metadata("design:returntype", Promise)
], TransfersByTypeTimeseriesResolver.prototype, "transfersByTypeTimeseries", null);
exports.TransfersByTypeTimeseriesResolver = TransfersByTypeTimeseriesResolver = __decorate([
    (0, type_graphql_1.Resolver)(),
    __metadata("design:paramtypes", [Function])
], TransfersByTypeTimeseriesResolver);
/* Unique accounts */
let UniqueAccountsEntry = class UniqueAccountsEntry {
    constructor(props) {
        Object.assign(this, props);
    }
};
__decorate([
    (0, type_graphql_1.Field)(() => graphql_server_1.DateTime),
    __metadata("design:type", Date)
], UniqueAccountsEntry.prototype, "timestamp", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Number, { nullable: true }),
    __metadata("design:type", Object)
], UniqueAccountsEntry.prototype, "value", void 0);
UniqueAccountsEntry = __decorate([
    (0, type_graphql_1.ObjectType)(),
    __metadata("design:paramtypes", [Object])
], UniqueAccountsEntry);
let UniqueAccountsTimeseries = class UniqueAccountsTimeseries {
    constructor(props) {
        Object.assign(this, props);
    }
};
__decorate([
    (0, type_graphql_1.Field)(() => [UniqueAccountsEntry]),
    __metadata("design:type", Array)
], UniqueAccountsTimeseries.prototype, "data", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Number),
    __metadata("design:type", Number)
], UniqueAccountsTimeseries.prototype, "step", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => graphql_server_1.DateTime),
    __metadata("design:type", Date)
], UniqueAccountsTimeseries.prototype, "from", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => graphql_server_1.DateTime),
    __metadata("design:type", Date)
], UniqueAccountsTimeseries.prototype, "to", void 0);
UniqueAccountsTimeseries = __decorate([
    (0, type_graphql_1.ObjectType)(),
    __metadata("design:paramtypes", [Object])
], UniqueAccountsTimeseries);
let UniqueAccountsTimeseriesResolver = class UniqueAccountsTimeseriesResolver {
    constructor(tx) {
        this.tx = tx;
    }
    async uniqueAccountsTimeseries(fromArg, toArg, step) {
        const manager = await this.tx();
        const { from, to } = normalizeTimeRange(fromArg, toArg);
        const groupSize = getGroupSizeInfo(from, to, step);
        const raw = await manager.query(sql `
        WITH
        time_series AS (
          ${generateTimeSeries(groupSize)}
        ),
        daily AS (
          SELECT 
            ${truncDayUtc('timestamp')} as day,
            SUM(value) as value
          FROM mv_unique_accounts_daily
          WHERE timestamp >= ${TRUNC_FROM} AND timestamp < ${TRUNC_TO}
          GROUP BY day
        )
        SELECT 
          (ts.bin_ts - interval '1 second') as date,
          COALESCE(SUM(d.value), 0) as value
        FROM time_series ts
        LEFT JOIN daily d ON ${binJoin('d.day', 'ts.bin_ts', groupSize)}
        GROUP BY ts.bin_ts
        ORDER BY ts.bin_ts
      `, [from, to]);
        const data = raw.map((r) => new UniqueAccountsEntry({ timestamp: r.date, value: parseInt(r.value) }));
        return new UniqueAccountsTimeseries({ ...buildTimeseries(data, groupSize, from, to) });
    }
};
exports.UniqueAccountsTimeseriesResolver = UniqueAccountsTimeseriesResolver;
__decorate([
    (0, type_graphql_1.Query)(() => UniqueAccountsTimeseries),
    __param(0, (0, type_graphql_1.Arg)('from', { nullable: true })),
    __param(1, (0, type_graphql_1.Arg)('to', { nullable: true })),
    __param(2, (0, type_graphql_1.Arg)('step', { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Date,
        Date, String]),
    __metadata("design:returntype", Promise)
], UniqueAccountsTimeseriesResolver.prototype, "uniqueAccountsTimeseries", null);
exports.UniqueAccountsTimeseriesResolver = UniqueAccountsTimeseriesResolver = __decorate([
    (0, type_graphql_1.Resolver)(),
    __metadata("design:paramtypes", [Function])
], UniqueAccountsTimeseriesResolver);
/* Account balance history */
let AccountBalanceEntry = class AccountBalanceEntry {
    constructor(props) {
        Object.assign(this, props);
    }
};
__decorate([
    (0, type_graphql_1.Field)(() => graphql_server_1.DateTime),
    __metadata("design:type", Date)
], AccountBalanceEntry.prototype, "timestamp", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => BigInt, { nullable: true }),
    __metadata("design:type", Object)
], AccountBalanceEntry.prototype, "value", void 0);
AccountBalanceEntry = __decorate([
    (0, type_graphql_1.ObjectType)(),
    __metadata("design:paramtypes", [Object])
], AccountBalanceEntry);
let AccountBalanceTimeseries = class AccountBalanceTimeseries {
    constructor(props) {
        Object.assign(this, props);
    }
};
__decorate([
    (0, type_graphql_1.Field)(() => [AccountBalanceEntry]),
    __metadata("design:type", Array)
], AccountBalanceTimeseries.prototype, "data", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Number),
    __metadata("design:type", Number)
], AccountBalanceTimeseries.prototype, "step", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => graphql_server_1.DateTime),
    __metadata("design:type", Date)
], AccountBalanceTimeseries.prototype, "from", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => graphql_server_1.DateTime),
    __metadata("design:type", Date)
], AccountBalanceTimeseries.prototype, "to", void 0);
AccountBalanceTimeseries = __decorate([
    (0, type_graphql_1.ObjectType)(),
    __metadata("design:paramtypes", [Object])
], AccountBalanceTimeseries);
let AccountBalanceTimeseriesResolver = class AccountBalanceTimeseriesResolver {
    constructor(tx) {
        this.tx = tx;
    }
    async accountBalanceTimeseries(accountId, fromArg, toArg, step) {
        const manager = await this.tx();
        const { from, to } = normalizeTimeRange(fromArg, toArg);
        const groupSize = getGroupSizeInfo(from, to, step);
        const raw = await manager.query(sql `
      WITH
      owned_accounts AS (
        SELECT id FROM account WHERE id = $3
        UNION ALL
        SELECT id FROM account WHERE owner_id = $3
      ),
      all_transfers AS (
        SELECT
          t.timestamp,
          CASE 
            WHEN at.direction = 'TO' THEN t.amount
            WHEN at.direction = 'FROM' THEN -t.amount
            ELSE 0
          END AS delta
        FROM account_transfer at
        INNER JOIN transfer t ON at.transfer_id = t.id
        WHERE at.account_id IN (SELECT id FROM owned_accounts)
          AND t.timestamp < ${TRUNC_TO}
          AND t.type NOT IN ('DEPOSIT', 'WITHDRAW')
      ),
      initial_balance AS (
        SELECT COALESCE(SUM(delta), 0) AS initial_value
        FROM all_transfers
        WHERE timestamp < ${TRUNC_FROM}
      ),
      balance_daily AS (
        SELECT
          ${truncDayUtc('timestamp')} AS day,
          SUM(delta) AS delta
        FROM all_transfers
        WHERE timestamp >= ${TRUNC_FROM}
        GROUP BY day
      ),
      time_series AS (
        ${generateTimeSeries(groupSize)}
      ),
      balance_binned AS (
        SELECT ts.bin_ts, COALESCE(SUM(d.delta), 0) as delta
        FROM time_series ts
        LEFT JOIN balance_daily d ON ${binJoin('d.day', 'ts.bin_ts', groupSize)}
        GROUP BY ts.bin_ts
      ),
      cumulative_balance AS (
        SELECT
          (bin_ts - interval '1 second') AS timestamp,
          (SELECT initial_value FROM initial_balance) +
          SUM(delta) OVER (ORDER BY bin_ts) AS value
        FROM balance_binned
      )
      SELECT
        timestamp,
        value
      FROM cumulative_balance
      ORDER BY timestamp
      `, [from, to, accountId]);
        const data = raw.map((r) => new AccountBalanceEntry({
            timestamp: r.timestamp,
            value: r.value ? BigInt(r.value) : null,
        }));
        return new AccountBalanceTimeseries({ ...buildTimeseries(data, groupSize, from, to) });
    }
};
exports.AccountBalanceTimeseriesResolver = AccountBalanceTimeseriesResolver;
__decorate([
    (0, type_graphql_1.Query)(() => AccountBalanceTimeseries),
    __param(0, (0, type_graphql_1.Arg)('accountId')),
    __param(1, (0, type_graphql_1.Arg)('from', { nullable: true })),
    __param(2, (0, type_graphql_1.Arg)('to', { nullable: true })),
    __param(3, (0, type_graphql_1.Arg)('step', { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Date,
        Date, String]),
    __metadata("design:returntype", Promise)
], AccountBalanceTimeseriesResolver.prototype, "accountBalanceTimeseries", null);
exports.AccountBalanceTimeseriesResolver = AccountBalanceTimeseriesResolver = __decorate([
    (0, type_graphql_1.Resolver)(),
    __metadata("design:paramtypes", [Function])
], AccountBalanceTimeseriesResolver);
//# sourceMappingURL=timeseries.js.map