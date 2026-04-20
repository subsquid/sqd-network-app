import { BigNumber } from 'bignumber.js';

import {
  GatewaysSummaryDocument,
  type GatewaysSummaryQuery,
} from '../generated/gateways-squid/graphql.js';
import {
  CurrentEpochDocument,
  type CurrentEpochQuery,
  SettingsDocument,
  type SettingsQuery,
  WorkersSummaryDocument,
  type WorkersSummaryQuery,
} from '../generated/workers-squid/graphql.js';
import { queryGatewaysSquid, queryWorkersSquid } from '../services/graphql.js';
import { publicProcedure, router } from '../trpc.js';

export const networkRouter = router({
  settings: publicProcedure.query(async () => {
    const data = await queryWorkersSquid<SettingsQuery>(SettingsDocument);
    const node = data.settingsConnection.edges?.[0]?.node;

    return {
      bondAmount: node?.bondAmount ?? '100000000000000000000000',
      delegationLimitCoefficient: node?.delegationLimitCoefficient ?? '0',
      minimalWorkerVersion: node?.minimalWorkerVersion ?? '>=0.0.0',
      recommendedWorkerVersion: node?.recommendedWorkerVersion ?? '>=0.0.0',
    };
  }),

  stats: publicProcedure.query(async () => {
    const [workersData, gatewaysData] = await Promise.all([
      queryWorkersSquid<WorkersSummaryQuery>(WorkersSummaryDocument),
      queryGatewaysSquid<GatewaysSummaryQuery>(GatewaysSummaryDocument),
    ]);

    const ws = workersData.workersSummary;
    const gs = gatewaysData.gatewaysSummary;
    const totalPortalLock = BigNumber(gs.totalGatewayStake).plus(gs.totalPortalPoolTvl).toFixed();

    return {
      ...ws,
      totalPortalLock,
      totalLockedValue: BigNumber(ws.totalBond)
        .plus(ws.totalDelegation)
        .plus(totalPortalLock)
        .toFixed(),
    };
  }),

  currentEpoch: publicProcedure.query(async () => {
    const data = await queryWorkersSquid<CurrentEpochQuery>(CurrentEpochDocument);
    return {
      ...data.workersSummary,
      epoch: data.epoches.length ? data.epoches[0] : undefined,
    };
  }),

  summary: publicProcedure.query(async () => {
    const [workersData, gatewaysData, epochData] = await Promise.all([
      queryWorkersSquid<WorkersSummaryQuery>(WorkersSummaryDocument),
      queryGatewaysSquid<GatewaysSummaryQuery>(GatewaysSummaryDocument),
      queryWorkersSquid<CurrentEpochQuery>(CurrentEpochDocument),
    ]);

    const ws = workersData.workersSummary;
    const gs = gatewaysData.gatewaysSummary;
    const totalPortalLock = BigNumber(gs.totalGatewayStake).plus(gs.totalPortalPoolTvl).toFixed();

    return {
      ...ws,
      ...epochData.workersSummary,
      totalPortalLock,
      epoch: epochData.epoches.length ? epochData.epoches[0] : undefined,
    };
  }),
});
