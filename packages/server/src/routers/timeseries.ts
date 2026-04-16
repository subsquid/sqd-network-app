import { z } from 'zod';

import {
  HoldersCountTimeseriesDocument,
  LockedValueTimeseriesDocument,
  TransfersByTypeTimeseriesDocument,
  UniqueAccountsTimeseriesDocument,
} from '../generated/token-squid/graphql.js';
import {
  ActiveWorkersTimeseriesDocument,
  AprTimeseriesDocument,
  DelegationsTimeseriesDocument,
  DelegatorsTimeseriesDocument,
  QueriesCountTimeseriesDocument,
  RewardTimeseriesDocument,
  ServedDataTimeseriesDocument,
  StoredDataTimeseriesDocument,
  UniqueOperatorsTimeseriesDocument,
  UptimeTimeseriesDocument,
} from '../generated/workers-squid/graphql.js';
import { queryTokenSquid, queryWorkersSquid } from '../services/graphql.js';
import { publicProcedure, router } from '../trpc.js';

const timeseriesInput = z.object({
  from: z.string(),
  to: z.string(),
  step: z.string().optional(),
  workerId: z.string().optional(),
});

export interface TimeseriesResult {
  data: Array<{ timestamp: string; value: unknown }>;
  step?: number;
  from?: string;
  to?: string;
}

type QueryFn = <T>(
  query: string | { toString(): string },
  variables?: Record<string, unknown>,
) => Promise<T>;

function timeseriesProcedure(document: { toString(): string }, key: string, queryFn: QueryFn) {
  return publicProcedure
    .input(timeseriesInput)
    .query(async ({ input }): Promise<TimeseriesResult> => {
      const data = await queryFn<Record<string, TimeseriesResult>>(document, input);
      return data[`${key}Timeseries`];
    });
}

function mergeAliasedTimeseries(
  series: Record<string, TimeseriesResult>,
  keys: readonly string[],
): TimeseriesResult {
  const byTimestamp = new Map<string, Record<string, unknown>>();
  const defaults = Object.fromEntries(keys.map(k => [k, null]));

  for (const key of keys) {
    for (const entry of series[key].data) {
      let rec = byTimestamp.get(entry.timestamp);
      if (!rec) {
        rec = { ...defaults };
        byTimestamp.set(entry.timestamp, rec);
      }
      rec[key] = entry.value ?? null;
    }
  }

  const ref = series[keys[0]];
  const timestamps = [...byTimestamp.keys()].sort();

  return {
    step: ref.step,
    from: ref.from,
    to: ref.to,
    data: timestamps.map(ts => ({ timestamp: ts, value: byTimestamp.get(ts)! })),
  };
}

const LOCKED_VALUE_KEYS = ['worker', 'delegation', 'portal', 'portalPool'] as const;

const lockedValueProcedure = publicProcedure
  .input(timeseriesInput)
  .query(async ({ input }): Promise<TimeseriesResult> => {
    const data = await queryTokenSquid<Record<string, TimeseriesResult>>(
      LockedValueTimeseriesDocument,
      input,
    );
    return mergeAliasedTimeseries(data, LOCKED_VALUE_KEYS);
  });

export const timeseriesRouter = router({
  holdersCount: timeseriesProcedure(
    HoldersCountTimeseriesDocument,
    'holdersCount',
    queryTokenSquid,
  ),
  lockedValue: lockedValueProcedure,
  activeWorkers: timeseriesProcedure(
    ActiveWorkersTimeseriesDocument,
    'activeWorkers',
    queryWorkersSquid,
  ),
  uniqueOperators: timeseriesProcedure(
    UniqueOperatorsTimeseriesDocument,
    'uniqueOperators',
    queryWorkersSquid,
  ),
  delegations: timeseriesProcedure(DelegationsTimeseriesDocument, 'delegations', queryWorkersSquid),
  delegators: timeseriesProcedure(DelegatorsTimeseriesDocument, 'delegators', queryWorkersSquid),
  transfersByType: timeseriesProcedure(
    TransfersByTypeTimeseriesDocument,
    'transfersByType',
    queryTokenSquid,
  ),
  uniqueAccounts: timeseriesProcedure(
    UniqueAccountsTimeseriesDocument,
    'uniqueAccounts',
    queryTokenSquid,
  ),
  queriesCount: timeseriesProcedure(
    QueriesCountTimeseriesDocument,
    'queriesCount',
    queryWorkersSquid,
  ),
  servedData: timeseriesProcedure(ServedDataTimeseriesDocument, 'servedData', queryWorkersSquid),
  storedData: timeseriesProcedure(StoredDataTimeseriesDocument, 'storedData', queryWorkersSquid),
  reward: timeseriesProcedure(RewardTimeseriesDocument, 'reward', queryWorkersSquid),
  apr: timeseriesProcedure(AprTimeseriesDocument, 'apr', queryWorkersSquid),
  uptime: timeseriesProcedure(UptimeTimeseriesDocument, 'uptime', queryWorkersSquid),
});
