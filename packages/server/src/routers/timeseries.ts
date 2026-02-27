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

export const timeseriesRouter = router({
  holdersCount: timeseriesProcedure(HoldersCountTimeseriesDocument, 'holdersCount'),
  lockedValue: timeseriesProcedure(LockedValueTimeseriesDocument, 'lockedValue'),
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
