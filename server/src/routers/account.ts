import { BigNumber } from 'bignumber.js';
import { z } from 'zod';

import {
  SourcesDocument,
  type SourcesQuery,
  SourcesWithAssetsDocument,
  type SourcesWithAssetsQuery,
  SquidNetworkHeightDocument,
  type SquidNetworkHeightQuery,
  TemporaryHoldingsByAccountDocument,
  type TemporaryHoldingsByAccountQuery,
  VestingByAddressDocument,
  type VestingByAddressQuery,
  VestingsByAccountDocument,
  type VestingsByAccountQuery,
} from '../generated/network-squid/graphql.js';
import { queryNetworkSquid } from '../services/graphql.js';
import { publicProcedure, router } from '../trpc.js';

export const accountRouter = router({
  sources: publicProcedure
    .input(z.object({ address: z.string().toLowerCase() }))
    .query(async ({ input }) => {
      const data = await queryNetworkSquid<SourcesQuery>(SourcesDocument, input);
      return data.accounts;
    }),

  vesting: publicProcedure
    .input(z.object({ address: z.string().toLowerCase() }))
    .query(async ({ input }) => {
      const data = await queryNetworkSquid<VestingByAddressQuery>(VestingByAddressDocument, input);
      return data.accountById;
    }),

  vestings: publicProcedure
    .input(z.object({ address: z.string().toLowerCase() }))
    .query(async ({ input }) => {
      const data = await queryNetworkSquid<VestingsByAccountQuery>(
        VestingsByAccountDocument,
        input,
      );
      return data.accounts;
    }),

  temporaryHoldings: publicProcedure
    .input(z.object({ address: z.string().toLowerCase() }))
    .query(async ({ input }) => {
      const data = await queryNetworkSquid<TemporaryHoldingsByAccountQuery>(
        TemporaryHoldingsByAccountDocument,
        input,
      );
      return data.accounts;
    }),

  assetsSummary: publicProcedure
    .input(z.object({ address: z.string().toLowerCase() }))
    .query(async ({ input }) => {
      const data = await queryNetworkSquid<SourcesWithAssetsQuery>(
        SourcesWithAssetsDocument,
        input,
      );
      const accounts = data.accounts;

      const balances = {
        transferable: '0',
        vesting: '0',
        delegated: '0',
        claimable: '0',
        bonded: '0',
        lockedPortal: '0',
      };

      accounts.forEach(account => {
        if (account.type === 'USER') {
          balances.transferable = BigNumber(balances.transferable)
            .plus(account.balance)
            .toFixed();
        } else if (account.type === 'VESTING') {
          balances.vesting = BigNumber(balances.vesting).plus(account.balance).toFixed();
        }

        account.delegations2.forEach(delegation => {
          balances.delegated = BigNumber(balances.delegated).plus(delegation.deposit).toFixed();
          balances.claimable = BigNumber(balances.claimable)
            .plus(delegation.claimableReward)
            .toFixed();
        });

        account.workers2.forEach(worker => {
          balances.bonded = BigNumber(balances.bonded).plus(worker.bond).toFixed();
          balances.claimable = BigNumber(balances.claimable)
            .plus(worker.claimableReward)
            .toFixed();
        });

        account.gatewayStakes.forEach(stake => {
          balances.lockedPortal = BigNumber(balances.lockedPortal).plus(stake.amount).toFixed();
        });
      });

      const claimableSources = accounts.map(account => {
        const claims: Array<{
          id: string;
          peerId: string;
          name: string | null;
          claimableReward: string;
          type: 'worker' | 'delegation';
        }> = [];

        account.delegations2.forEach(delegation => {
          if (delegation.claimableReward === '0') return;
          claims.push({
            id: delegation.worker.id,
            peerId: delegation.worker.peerId,
            name: delegation.worker.name ?? null,
            claimableReward: delegation.claimableReward,
            type: 'delegation',
          });
        });

        account.workers2.forEach(worker => {
          if (worker.claimableReward === '0') return;
          claims.push({
            id: worker.id,
            peerId: worker.peerId,
            name: worker.name ?? null,
            claimableReward: worker.claimableReward,
            type: 'worker',
          });
        });

        claims.sort(
          (a, b) => BigNumber(b.claimableReward).comparedTo(a.claimableReward) ?? 0,
        );

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
        .toFixed();

      return { balances, totalBalance, claimableSources };
    }),

  squidHeight: publicProcedure.query(async () => {
    const data =
      await queryNetworkSquid<SquidNetworkHeightQuery>(SquidNetworkHeightDocument);
    return data.squidStatus;
  }),
});
