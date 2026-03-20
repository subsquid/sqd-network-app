import { z } from 'zod';

import {
  ActiveWorkersTimeseriesDocument,
  AprTimeseriesDocument,
  DelegationsTimeseriesDocument,
  DelegatorsTimeseriesDocument,
  HoldersCountTimeseriesDocument,
  LockedValueTimeseriesDocument,
  QueriesCountTimeseriesDocument,
  RewardTimeseriesDocument,
  ServedDataTimeseriesDocument,
  StoredDataTimeseriesDocument,
  TransfersByTypeTimeseriesDocument,
  UniqueAccountsTimeseriesDocument,
  UniqueOperatorsTimeseriesDocument,
  UptimeTimeseriesDocument,
} from '../generated/network-squid/graphql.js';
import { queryNetworkSquid } from '../services/graphql.js';
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

function timeseriesProcedure(document: { toString(): string }, key: string) {
  return publicProcedure
    .input(timeseriesInput)
    .query(async ({ input }): Promise<TimeseriesResult> => {
      const data = await queryNetworkSquid<Record<string, TimeseriesResult>>(document, input);
      return data[`${key}Timeseries`];
    });
}

/**
 * Merges multiple aliased timeseries into a single series keyed by timestamp.
 * Each data point's value becomes `{ [alias]: value, ... }`.
 */
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
    const data = await queryNetworkSquid<Record<string, TimeseriesResult>>(
      LockedValueTimeseriesDocument,
      input,
    );
    return mergeAliasedTimeseries(data, LOCKED_VALUE_KEYS);
  });

export const timeseriesRouter = router({
  holdersCount: timeseriesProcedure(HoldersCountTimeseriesDocument, 'holdersCount'),
  lockedValue: lockedValueProcedure,
  activeWorkers: timeseriesProcedure(ActiveWorkersTimeseriesDocument, 'activeWorkers'),
  uniqueOperators: timeseriesProcedure(UniqueOperatorsTimeseriesDocument, 'uniqueOperators'),
  delegations: timeseriesProcedure(DelegationsTimeseriesDocument, 'delegations'),
  delegators: timeseriesProcedure(DelegatorsTimeseriesDocument, 'delegators'),
  transfersByType: timeseriesProcedure(TransfersByTypeTimeseriesDocument, 'transfersByType'),
  uniqueAccounts: timeseriesProcedure(UniqueAccountsTimeseriesDocument, 'uniqueAccounts'),
  queriesCount: timeseriesProcedure(QueriesCountTimeseriesDocument, 'queriesCount'),
  servedData: timeseriesProcedure(ServedDataTimeseriesDocument, 'servedData'),
  storedData: timeseriesProcedure(StoredDataTimeseriesDocument, 'storedData'),
  reward: timeseriesProcedure(RewardTimeseriesDocument, 'reward'),
  apr: timeseriesProcedure(AprTimeseriesDocument, 'apr'),
  uptime: timeseriesProcedure(UptimeTimeseriesDocument, 'uptime'),
});
