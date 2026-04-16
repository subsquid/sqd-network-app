import { BigNumber } from 'bignumber.js';
import { z } from 'zod';

import {
  GatewayStakesByOwnerDocument,
  type GatewayStakesByOwnerQuery,
  PoolProvidersByOwnerDocument,
  type PoolProvidersByOwnerQuery,
} from '../generated/gateways-squid/graphql.js';
import {
  SourcesDocument,
  type SourcesQuery,
  VestingByAddressDocument,
  type VestingByAddressQuery,
  VestingsByAccountDocument,
  type VestingsByAccountQuery,
} from '../generated/token-squid/graphql.js';
import {
  DelegationsByOwnerDocument,
  type DelegationsByOwnerQuery,
  WorkersByOwnerDocument,
  type WorkersByOwnerQuery,
} from '../generated/workers-squid/graphql.js';
import { resolveAccounts } from '../services/accounts.js';
import { queryGatewaysSquid, queryTokenSquid, queryWorkersSquid } from '../services/graphql.js';
import { publicProcedure, router } from '../trpc.js';
import { evmAddressSchema } from '../validation.js';

export const accountRouter = router({
  sources: publicProcedure
    .input(z.object({ address: evmAddressSchema }))
    .query(async ({ input }) => {
      const data = await queryTokenSquid<SourcesQuery>(SourcesDocument, input);
      return data.accounts;
    }),

  vesting: publicProcedure
    .input(z.object({ address: evmAddressSchema }))
    .query(async ({ input }) => {
      const data = await queryTokenSquid<VestingByAddressQuery>(VestingByAddressDocument, input);
      return data.accountById;
    }),

  vestings: publicProcedure
    .input(z.object({ address: evmAddressSchema }))
    .query(async ({ input }) => {
      const data = await queryTokenSquid<VestingsByAccountQuery>(VestingsByAccountDocument, input);
      return data.accounts;
    }),

  temporaryHoldings: publicProcedure
    .input(z.object({ address: evmAddressSchema }))
    .query(async ({ input }) => {
      const data = await queryTokenSquid<SourcesQuery>(SourcesDocument, input);
      return data.accounts.filter(a => a.type === 'TEMPORARY_HOLDING');
    }),

  assetsSummary: publicProcedure
    .input(z.object({ address: evmAddressSchema }))
    .query(async ({ input }) => {
      const accounts = await resolveAccounts(input.address);
      if (!accounts.length) {
        return {
          balances: {
            transferable: '0',
            vesting: '0',
            delegated: '0',
            claimable: '0',
            bonded: '0',
            lockedPortal: '0',
            portalPool: '0',
          },
          totalBalance: '0',
          claimableSources: [],
        };
      }

      const ownerIds = accounts.map(a => a.id);

      const [workersData, delegationsData, stakesData, poolProvidersData] = await Promise.all([
        queryWorkersSquid<WorkersByOwnerQuery>(WorkersByOwnerDocument, { ownerIds }),
        queryWorkersSquid<DelegationsByOwnerQuery>(DelegationsByOwnerDocument, { ownerIds }),
        queryGatewaysSquid<GatewayStakesByOwnerQuery>(GatewayStakesByOwnerDocument, { ownerIds }),
        queryGatewaysSquid<PoolProvidersByOwnerQuery>(PoolProvidersByOwnerDocument, { ownerIds }),
      ]);

      const workersByOwner = new Map<string, WorkersByOwnerQuery['workers']>();
      for (const w of workersData.workers) {
        const list = workersByOwner.get(w.ownerId) ?? [];
        list.push(w);
        workersByOwner.set(w.ownerId, list);
      }

      const delegationsByOwner = new Map<string, DelegationsByOwnerQuery['delegations']>();
      for (const d of delegationsData.delegations) {
        const list = delegationsByOwner.get(d.ownerId) ?? [];
        list.push(d);
        delegationsByOwner.set(d.ownerId, list);
      }

      const stakesByOwner = new Map<string, GatewayStakesByOwnerQuery['gatewayStakes']>();
      for (const s of stakesData.gatewayStakes) {
        const list = stakesByOwner.get(s.ownerId) ?? [];
        list.push(s);
        stakesByOwner.set(s.ownerId, list);
      }

      const poolProvidersByOwner = new Map<string, PoolProvidersByOwnerQuery['poolProviders']>();
      for (const p of poolProvidersData.poolProviders) {
        const list = poolProvidersByOwner.get(p.providerId) ?? [];
        list.push(p);
        poolProvidersByOwner.set(p.providerId, list);
      }

      const balances = {
        transferable: '0',
        vesting: '0',
        delegated: '0',
        claimable: '0',
        bonded: '0',
        lockedPortal: '0',
        portalPool: '0',
      };

      const claimableSources = accounts.map(account => {
        if (account.type === 'USER') {
          balances.transferable = BigNumber(balances.transferable).plus(account.balance).toFixed();
        } else if (account.type === 'VESTING') {
          balances.vesting = BigNumber(balances.vesting).plus(account.balance).toFixed();
        }

        const accountDelegations = delegationsByOwner.get(account.id) ?? [];
        for (const delegation of accountDelegations) {
          balances.delegated = BigNumber(balances.delegated).plus(delegation.deposit).toFixed();
          balances.claimable = BigNumber(balances.claimable)
            .plus(delegation.claimableReward)
            .toFixed();
        }

        const accountWorkers = workersByOwner.get(account.id) ?? [];
        for (const worker of accountWorkers) {
          balances.bonded = BigNumber(balances.bonded).plus(worker.bond).toFixed();
          balances.claimable = BigNumber(balances.claimable).plus(worker.claimableReward).toFixed();
        }

        const accountStakes = stakesByOwner.get(account.id) ?? [];
        for (const stake of accountStakes) {
          balances.lockedPortal = BigNumber(balances.lockedPortal).plus(stake.amount).toFixed();
        }

        const accountPoolProviders = poolProvidersByOwner.get(account.id) ?? [];
        for (const provider of accountPoolProviders) {
          balances.portalPool = BigNumber(balances.portalPool).plus(provider.deposited).toFixed();
        }

        const claims: Array<{
          id: string;
          peerId: string;
          name: string | null;
          claimableReward: string;
          type: 'worker' | 'delegation';
        }> = [];

        for (const delegation of accountDelegations) {
          if (delegation.claimableReward === '0') continue;
          claims.push({
            id: delegation.worker.id,
            peerId: delegation.worker.peerId,
            name: delegation.worker.name ?? null,
            claimableReward: delegation.claimableReward,
            type: 'delegation',
          });
        }

        for (const worker of accountWorkers) {
          if (worker.claimableReward === '0') continue;
          claims.push({
            id: worker.id,
            peerId: worker.peerId,
            name: worker.name ?? null,
            claimableReward: worker.claimableReward,
            type: 'worker',
          });
        }

        claims.sort((a, b) => BigNumber(b.claimableReward).comparedTo(a.claimableReward) ?? 0);

        const totalClaimableBalance = claims
          .reduce((total, claim) => total.plus(claim.claimableReward), BigNumber(0))
          .toFixed();

        return {
          id: account.id,
          type: account.type,
          balance: totalClaimableBalance,
          claims,
        };
      });

      const totalBalance = BigNumber(balances.transferable)
        .plus(balances.vesting)
        .plus(balances.delegated)
        .plus(balances.bonded)
        .plus(balances.lockedPortal)
        .plus(balances.portalPool)
        .toFixed();

      return { balances, totalBalance, claimableSources };
    }),
});
