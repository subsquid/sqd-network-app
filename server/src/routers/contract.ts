import { BigNumber } from 'bignumber.js';
import { z } from 'zod';

import { gatewayRegistryAbi } from '../../../abi/gatewayRegistry.js';
import { networkControllerAbi } from '../../../abi/networkController.js';
import { routerAbi } from '../../../abi/router.js';
import { softCapAbi } from '../../../abi/softCap.js';
import { stakingAbi } from '../../../abi/staking.js';
import { getContractAddresses } from '../env.js';
import {
  CurrentEpochDocument,
  type CurrentEpochQuery,
} from '../generated/network-squid/graphql.js';
import { getPublicClient } from '../services/blockchain.js';
import { queryNetworkSquid } from '../services/graphql.js';
import { publicProcedure, router } from '../trpc.js';

const BLOCK_TIME_MS = 12000;

function getBlockTime(blocks: number): number {
  return blocks * BLOCK_TIME_MS;
}

export const contractRouter = router({
  stakeInfo: publicProcedure
    .input(z.object({ sourceAddress: z.string() }))
    .query(async ({ input }) => {
      const { sourceAddress } = input;
      const contracts = getContractAddresses();
      const publicClient = getPublicClient();

      // Parallel: get stake, networkController address, and epoch data
      const [stake, networkControllerAddress, epochData] = await Promise.all([
        publicClient.readContract({
          address: contracts.GATEWAY_REGISTRATION,
          abi: gatewayRegistryAbi,
          functionName: 'getStake',
          args: [sourceAddress as `0x${string}`],
        }),
        publicClient.readContract({
          address: contracts.ROUTER,
          abi: routerAbi,
          functionName: 'networkController',
        }),
        queryNetworkSquid<CurrentEpochQuery>(CurrentEpochDocument),
      ]);

      const stakeData = stake as {
        amount: bigint;
        duration: bigint;
        lockStart: bigint;
        lockEnd: bigint;
        autoExtension: boolean;
        oldCUs: bigint;
      };

      // Get workerEpochLength from NetworkController
      const workerEpochLength = await publicClient.readContract({
        address: networkControllerAddress as `0x${string}`,
        abi: networkControllerAbi,
        functionName: 'workerEpochLength',
      });

      // Get CU amount if stake exists
      let cuAmount = 0n;
      if (stakeData.amount > 0n) {
        cuAmount = (await publicClient.readContract({
          address: contracts.GATEWAY_REGISTRATION,
          abi: gatewayRegistryAbi,
          functionName: 'computationUnitsAmount',
          args: [stakeData.amount, stakeData.duration],
        })) as bigint;
      }

      const currentEpoch = {
        ...epochData.networkStats,
        epoch: epochData.epoches.length ? epochData.epoches[0] : undefined,
      };

      const lastBlockL1 = currentEpoch.lastBlockL1;
      const hasStake = stakeData.amount > 0n;

      const isPending = hasStake && Number(stakeData.lockStart) > lastBlockL1;
      const isActive =
        hasStake &&
        Number(stakeData.lockStart) <= lastBlockL1 &&
        Number(stakeData.lockEnd) >= lastBlockL1;
      const isExpired = hasStake && Number(stakeData.lockEnd) < lastBlockL1;

      let appliedAt: string | undefined;
      if (hasStake && lastBlockL1) {
        appliedAt = new Date(
          new Date(currentEpoch.lastBlockTimestampL1).getTime() +
            getBlockTime(Number(stakeData.lockStart) - lastBlockL1 + 1),
        ).toISOString();
      }

      let unlockedAt: string | undefined;
      if (hasStake && lastBlockL1 && !stakeData.autoExtension) {
        unlockedAt = new Date(
          new Date(currentEpoch.lastBlockTimestampL1).getTime() +
            getBlockTime(Number(stakeData.lockEnd) - lastBlockL1 + 1),
        ).toISOString();
      }

      let cuPerEpoch: string = '0';
      if (stakeData.lockEnd && workerEpochLength && lastBlockL1 && !isExpired) {
        const computationUnits =
          Number(stakeData.lockStart) > lastBlockL1 ? stakeData.oldCUs : cuAmount;
        if (stakeData.duration < (workerEpochLength as bigint)) {
          cuPerEpoch = computationUnits.toString();
        } else {
          cuPerEpoch = (
            (computationUnits * (workerEpochLength as bigint)) /
            stakeData.duration
          ).toString();
        }
      }

      return {
        stake: {
          amount: stakeData.amount.toString(),
          duration: stakeData.duration.toString(),
          lockStart: stakeData.lockStart.toString(),
          lockEnd: stakeData.lockEnd.toString(),
          autoExtension: stakeData.autoExtension,
          oldCUs: stakeData.oldCUs.toString(),
        },
        cuAmount: cuAmount.toString(),
        currentEpoch,
        workerEpochLength: (workerEpochLength as bigint).toString(),
        isPending,
        isActive,
        isExpired,
        appliedAt,
        unlockedAt,
        cuPerEpoch,
      };
    }),

  capedStake: publicProcedure
    .input(
      z.object({
        workerId: z.string(),
        amount: z.string(),
        undelegate: z.boolean().optional(),
      }),
    )
    .query(async ({ input }) => {
      const { workerId, amount, undelegate } = input;
      const contracts = getContractAddresses();
      const publicClient = getPublicClient();

      const delegationAmount = BigInt(amount || '0') * (undelegate ? -1n : 1n);

      const [capedDelegationRaw, totalDelegationRaw] = await Promise.all([
        publicClient.readContract({
          address: contracts.SOFT_CAP,
          abi: softCapAbi,
          functionName: 'capedStakeAfterDelegation',
          args: [BigInt(workerId), delegationAmount],
        }),
        publicClient.readContract({
          address: contracts.STAKING,
          abi: stakingAbi,
          functionName: 'delegated',
          args: [BigInt(workerId)],
        }),
      ]);

      const capedDelegation = capedDelegationRaw.toString();

      let totalDelegation = BigNumber(totalDelegationRaw);
      if (undelegate) {
        totalDelegation = totalDelegation.minus(amount);
      } else {
        totalDelegation = totalDelegation.plus(amount);
      }

      const delegationCapacity = (totalDelegation.lt(0) ? BigNumber(0) : totalDelegation)
        .div(20_000_000_000_000_000_000n)
        .times(100)
        .toNumber();

      return {
        capedDelegation,
        totalDelegation,
        delegationCapacity,
      };
    }),
});
