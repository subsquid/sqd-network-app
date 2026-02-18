import { BigNumber } from 'bignumber.js';

import {
  CurrentEpochDocument,
  type CurrentEpochQuery,
  NetworkSummaryDocument,
  type NetworkSummaryQuery,
  SettingsDocument,
  type SettingsQuery,
} from '../generated/network-squid/graphql.js';
import { queryNetworkSquid } from '../services/graphql.js';
import { publicProcedure, router } from '../trpc.js';

export const networkRouter = router({
  settings: publicProcedure.query(async () => {
    const data = await queryNetworkSquid<SettingsQuery>(SettingsDocument);
    const node = data.settingsConnection.edges?.[0]?.node;

    return {
      bondAmount: node?.bondAmount ?? '100000000000000000000000',
      delegationLimitCoefficient: node?.delegationLimitCoefficient ?? '0',
      minimalWorkerVersion: node?.minimalWorkerVersion ?? '>=0.0.0',
      recommendedWorkerVersion: node?.recommendedWorkerVersion ?? '>=0.0.0',
    };
  }),

  stats: publicProcedure.query(async () => {
    const data = await queryNetworkSquid<NetworkSummaryQuery>(NetworkSummaryDocument);
    const stats = data.networkStats;
    return {
      ...stats,
      totalLockedValue: BigNumber(stats.totalBond)
        .plus(stats.totalDelegation)
        .plus(stats.totalPortalLock)
        .toFixed(),
    };
  }),

  currentEpoch: publicProcedure.query(async () => {
    const data = await queryNetworkSquid<CurrentEpochQuery>(CurrentEpochDocument);
    return {
      ...data.networkStats,
      epoch: data.epoches.length ? data.epoches[0] : undefined,
    };
  }),

  summary: publicProcedure.query(async () => {
    const [summaryData, epochData] = await Promise.all([
      queryNetworkSquid<NetworkSummaryQuery>(NetworkSummaryDocument),
      queryNetworkSquid<CurrentEpochQuery>(CurrentEpochDocument),
    ]);

    return {
      ...summaryData.networkStats,
      ...epochData.networkStats,
      epoch: epochData.epoches.length ? epochData.epoches[0] : undefined,
    };
  }),
});
