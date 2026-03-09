import { portalPoolAbi, portalPoolFactoryAbi, portalRegistryAbi } from '@subsquid/common';
import { BigNumber } from 'bignumber.js';
import { type Address } from 'viem';
import { z } from 'zod';

import { getContractAddresses } from '../env.js';
import {
  ApyTimeseriesDocument,
  type ApyTimeseriesQuery,
  LiquidityEventsDocument,
  type LiquidityEventsQuery,
  PoolByIdDocument,
  type PoolByIdQuery,
  PoolsListDocument,
  type PoolsListQuery,
  TopUpsDocument,
  type TopUpsQuery,
  TvlTimeseriesDocument,
  type TvlTimeseriesQuery,
} from '../generated/pool-squid/graphql.js';
import { getPublicClient, readERC20Tokens } from '../services/blockchain.js';
import { queryPoolSquid } from '../services/graphql.js';
import { publicProcedure, router } from '../trpc.js';
import { evmAddressSchema, paginationSchema } from '../validation.js';
import { fetchHistoricalPrices } from './price.js';

const SQD_DECIMALS = 18;
const DISTRIBUTION_RATE_BPS = 1000;
const POOLS_LIST_LIMIT = 500;

function fromSqd(value: bigint | string | number): string {
  return BigNumber(value.toString()).shiftedBy(-SQD_DECIMALS).toFixed();
}

function toSqd(value: number): string {
  return BigNumber(value).shiftedBy(SQD_DECIMALS).toFixed(0);
}

type PoolPhase = 'collecting' | 'active' | 'debt' | 'idle' | 'failed' | 'unknown';

function getPhase(state?: number, isOutOfMoney?: boolean): PoolPhase {
  switch (state) {
    case 0:
      return 'collecting';
    case 1:
      return isOutOfMoney ? 'debt' : 'active';
    case 2:
      return 'idle';
    case 3:
      return 'failed';
  }
  return 'unknown';
}

function parseMetadata(value?: string): {
  name?: string;
  description?: string;
  website?: string;
} {
  try {
    return value ? JSON.parse(value) : {};
  } catch {
    return {};
  }
}

async function isPortalPool(
  publicClient: ReturnType<typeof getPublicClient>,
  poolAddress: Address,
): Promise<boolean> {
  const contracts = getContractAddresses();
  return publicClient.readContract({
    address: contracts.PORTAL_POOL_FACTORY,
    abi: portalPoolFactoryAbi,
    functionName: 'isPortal',
    args: [poolAddress],
  });
}

export const poolRouter = router({
  list: publicProcedure.query(async () => {
    const publicClient = getPublicClient();
    const contracts = getContractAddresses();

    const data = await queryPoolSquid<PoolsListQuery>(PoolsListDocument, {
      limit: POOLS_LIST_LIMIT,
      offset: 0,
    });

    if (!data.pools.length) return [];

    const poolContracts = data.pools.map(pool => ({
      abi: portalPoolAbi,
      address: pool.id as Address,
    }));

    const [
      clusterResults,
      poolInfoResults,
      activeStakeResults,
      creditResults,
      minCapacityResults,
      distRateResults,
      rewardTokenResults,
    ] = await Promise.all([
      publicClient.multicall({
        allowFailure: true,
        contracts: poolContracts.map(
          c =>
            ({
              address: contracts.PORTAL_REGISTRY,
              abi: portalRegistryAbi,
              functionName: 'getClusterByAddress',
              args: [c.address],
            }) as const,
        ),
      }),
      publicClient.multicall({
        allowFailure: true,
        contracts: poolContracts.map(c => ({ ...c, functionName: 'getPoolInfo' }) as const),
      }),
      publicClient.multicall({
        allowFailure: true,
        contracts: poolContracts.map(c => ({ ...c, functionName: 'getActiveStake' }) as const),
      }),
      publicClient.multicall({
        allowFailure: true,
        contracts: poolContracts.map(c => ({ ...c, functionName: 'getCredit' }) as const),
      }),
      publicClient.multicall({
        allowFailure: true,
        contracts: poolContracts.map(c => ({ ...c, functionName: 'getMinCapacity' }) as const),
      }),
      publicClient.multicall({
        allowFailure: true,
        contracts: poolContracts.map(c => ({ ...c, functionName: 'providerRatePerSec' }) as const),
      }),
      publicClient.multicall({
        allowFailure: true,
        contracts: poolContracts.map(c => ({ ...c, functionName: 'getRewardToken' }) as const),
      }),
    ]);

    const rewardTokenAddresses = new Set<string>();
    for (const r of rewardTokenResults) {
      if (r.status === 'success' && r.result) {
        rewardTokenAddresses.add((r.result as string).toLowerCase());
      }
    }
    const rewardTokens = rewardTokenAddresses.size
      ? await readERC20Tokens([...rewardTokenAddresses] as Address[])
      : [];
    const rewardTokenMap = new Map(rewardTokens.map(t => [t.address.toLowerCase(), t]));

    return data.pools.map((pool, i) => {
      const cluster = clusterResults[i];
      const metadata =
        cluster.status === 'success'
          ? parseMetadata((cluster.result as { metadata: string }).metadata)
          : {};

      const poolInfoRes = poolInfoResults[i];
      const poolInfo =
        poolInfoRes.status === 'success'
          ? (poolInfoRes.result as {
              operator: Address;
              state: number;
              capacity: bigint;
              depositDeadline: bigint;
              totalStaked: bigint;
            })
          : undefined;

      const activeStake =
        activeStakeResults[i].status === 'success' ? (activeStakeResults[i].result as bigint) : 0n;
      const credit =
        creditResults[i].status === 'success' ? (creditResults[i].result as bigint) : 0n;
      const minCapacity =
        minCapacityResults[i].status === 'success' ? (minCapacityResults[i].result as bigint) : 0n;
      const distRate =
        distRateResults[i].status === 'success' ? (distRateResults[i].result as bigint) : 0n;

      const rewardTokenAddr =
        rewardTokenResults[i].status === 'success'
          ? (rewardTokenResults[i].result as string).toLowerCase()
          : undefined;
      const rewardToken = rewardTokenAddr ? rewardTokenMap.get(rewardTokenAddr) : undefined;

      const phase = poolInfo ? getPhase(poolInfo.state, !credit) : ('unknown' as PoolPhase);
      const capacity = poolInfo ? poolInfo.capacity : 0n;
      const totalStaked = poolInfo ? poolInfo.totalStaked : 0n;

      const distributionRatePerSecond = rewardToken
        ? BigNumber(distRate.toString())
            .div(DISTRIBUTION_RATE_BPS)
            .shiftedBy(-rewardToken.decimals)
            .toFixed()
        : '0';

      const totalRewardsToppedUp = rewardToken
        ? BigNumber(pool.totalRewardsToppedUp).shiftedBy(-rewardToken.decimals).toFixed()
        : '0';

      return {
        id: pool.id,
        name: metadata.name || undefined,
        phase,
        tvl: {
          current: fromSqd(activeStake),
          total: fromSqd(totalStaked),
          max: fromSqd(capacity),
          min: fromSqd(minCapacity),
        },
        distributionRatePerSecond,
        totalRewardsToppedUp,
        rewardTokenSymbol: rewardToken?.symbol ?? 'USDC',
        createdAt: pool.createdAt,
        closedAt: pool.closedAt,
      };
    });
  }),

  get: publicProcedure.input(z.object({ poolId: evmAddressSchema })).query(async ({ input }) => {
    const { poolId } = input;
    const address = poolId as Address;
    const publicClient = getPublicClient();

    const portalPoolContract = {
      abi: portalPoolAbi,
      address,
    } as const;

    // Step 1: Verify this is a valid portal pool
    if (!(await isPortalPool(publicClient, address))) {
      return null;
    }

    const contracts = getContractAddresses();

    // Step 2: Fetch all contract data + GraphQL data in parallel
    const [
      activeStake,
      poolInfo,
      distributionRatePerSecond,
      lptTokenAddress,
      credit,
      minCapacity,
      rewardTokenAddress,
      cluster,
      poolIndexedData,
    ] = await Promise.all([
      publicClient.readContract({
        ...portalPoolContract,
        functionName: 'getActiveStake',
      }),
      publicClient.readContract({
        ...portalPoolContract,
        functionName: 'getPoolInfo',
      }),
      publicClient.readContract({
        ...portalPoolContract,
        functionName: 'providerRatePerSec',
      }),
      publicClient.readContract({
        ...portalPoolContract,
        functionName: 'lptToken',
      }),
      publicClient
        .readContract({
          ...portalPoolContract,
          functionName: 'getCredit',
        })
        .catch(() => 0n),
      publicClient
        .readContract({
          ...portalPoolContract,
          functionName: 'getMinCapacity',
        })
        .catch(() => undefined),
      publicClient.readContract({
        ...portalPoolContract,
        functionName: 'getRewardToken',
      }),
      publicClient.readContract({
        address: contracts.PORTAL_REGISTRY,
        abi: portalRegistryAbi,
        functionName: 'getClusterByAddress',
        args: [address],
      }),
      queryPoolSquid<PoolByIdQuery>(PoolByIdDocument, {
        id: poolId.toLowerCase(),
      }),
    ]);

    // Step 3: Fetch ERC20 token metadata for LP and reward tokens
    const tokenAddresses: Address[] = [lptTokenAddress as Address];
    if (rewardTokenAddress) {
      tokenAddresses.push(rewardTokenAddress as Address);
    }
    const tokens = await readERC20Tokens(tokenAddresses);

    const lptToken = tokens.find(
      t => t.address.toLowerCase() === (lptTokenAddress as string).toLowerCase(),
    );
    const rewardToken = rewardTokenAddress
      ? tokens.find(t => t.address.toLowerCase() === (rewardTokenAddress as string).toLowerCase())
      : undefined;

    if (!lptToken || !rewardToken) {
      return null;
    }

    // Extract pool info fields
    const { operator, state, capacity, depositDeadline, totalStaked } = poolInfo as {
      operator: Address;
      state: number;
      capacity: bigint;
      depositDeadline: bigint;
      totalStaked: bigint;
    };

    const metadata = parseMetadata((cluster as { metadata: string }).metadata);
    const isOutOfMoney = !credit;

    const depositWindowEndsAt = new Date(Number(depositDeadline) * 1000).toISOString();
    const createdAt = poolIndexedData.poolById?.createdAt ?? new Date(0).toISOString();

    const distRate = BigNumber(distributionRatePerSecond.toString())
      .div(DISTRIBUTION_RATE_BPS)
      .shiftedBy(-rewardToken.decimals)
      .toFixed();

    const totalRewardsToppedUp = BigNumber(poolIndexedData.poolById?.totalRewardsToppedUp ?? '0')
      .shiftedBy(-rewardToken.decimals)
      .toFixed();

    return {
      id: poolId,
      name: metadata.name ?? 'Portal Pool',
      description: metadata.description,
      website: metadata.website,
      operator: {
        name: operator,
        address: operator,
      },
      phase: getPhase(state, isOutOfMoney),
      distributionRatePerSecond: distRate,
      tvl: {
        current: fromSqd(activeStake as bigint),
        max: fromSqd(capacity),
        min: fromSqd(minCapacity ?? 0n),
        total: fromSqd(totalStaked),
      },
      depositWindowEndsAt,
      maxDepositPerAddress: fromSqd(BigInt(toSqd(100_000))),
      lptToken,
      rewardToken,
      createdAt,
      totalRewardsToppedUp,
    };
  }),

  apyTimeseries: publicProcedure
    .input(
      z.object({
        poolId: evmAddressSchema,
        from: z.date({ coerce: true }),
        to: z.date({ coerce: true }),
      }),
    )
    .query(async ({ input }) => {
      const { poolId, from, to } = input;
      const address = poolId as Address;
      const publicClient = getPublicClient();

      // Fetch APY timeseries and reward token address in parallel
      const [apyResult, rewardTokenAddress] = await Promise.all([
        queryPoolSquid<ApyTimeseriesQuery>(ApyTimeseriesDocument, {
          poolId,
          from: from.toISOString(),
          to: to.toISOString(),
        }),
        publicClient.readContract({
          abi: portalPoolAbi,
          address,
          functionName: 'getRewardToken',
        }),
      ]);

      const timeseries = apyResult.apyTimeseries;
      if (!timeseries?.data?.length) {
        return {
          data: [] as { value: number; timestamp: string }[],
          from: timeseries?.from ?? from.toISOString(),
          to: timeseries?.to ?? to.toISOString(),
          step: timeseries?.step ?? 0,
        };
      }

      // Fetch ERC20 token metadata and historical prices in parallel
      const [tokens, prices] = await Promise.all([
        readERC20Tokens([rewardTokenAddress as Address]),
        fetchHistoricalPrices(new Date(timeseries.from), new Date(timeseries.to)),
      ]);

      const rewardToken = tokens[0];
      if (!rewardToken || prices.length === 0) {
        return {
          data: [] as { value: number; timestamp: string }[],
          from: timeseries.from,
          to: timeseries.to,
          step: timeseries.step,
        };
      }

      // Map prices to milliseconds for matching
      const sortedPrices = prices.map(({ timestamp, price }) => ({
        timestamp: timestamp * 1000,
        price,
      }));

      // Calculate APY for each data point
      let priceIdx = 0;
      const data = timeseries.data.map((entry, i) => {
        const nextTimestampMs =
          i < timeseries.data.length - 1
            ? new Date(timeseries.data[i + 1].timestamp).getTime()
            : Infinity;

        // Advance price index to the latest price before the next APY point
        while (
          priceIdx < sortedPrices.length - 1 &&
          sortedPrices[priceIdx + 1].timestamp < nextTimestampMs
        ) {
          priceIdx++;
        }

        const price = sortedPrices[priceIdx].price;

        const value = BigNumber(entry.value)
          .shiftedBy(18 - rewardToken.decimals)
          .div(price)
          .times(100)
          .toNumber();

        return {
          timestamp: entry.timestamp,
          value,
        };
      });

      return {
        data,
        from: timeseries.from,
        to: timeseries.to,
        step: timeseries.step,
      };
    }),

  tvlTimeseries: publicProcedure
    .input(
      z.object({
        poolId: evmAddressSchema,
        from: z.date({ coerce: true }),
        to: z.date({ coerce: true }),
      }),
    )
    .query(async ({ input }) => {
      const data = await queryPoolSquid<TvlTimeseriesQuery>(TvlTimeseriesDocument, {
        poolId: input.poolId,
        from: input.from.toISOString(),
        to: input.to.toISOString(),
      });
      const timeseries = data.tvlTimeseries;
      return {
        from: timeseries.from,
        to: timeseries.to,
        step: timeseries.step,
        data: timeseries.data.map(entry => ({
          timestamp: entry.timestamp,
          tvlStable: BigNumber(entry.value.tvlStable).shiftedBy(-SQD_DECIMALS).toNumber(),
          tvlTotal: BigNumber(entry.value.tvlTotal).shiftedBy(-SQD_DECIMALS).toNumber(),
        })),
      };
    }),

  liquidityEvents: publicProcedure
    .input(paginationSchema.extend({ poolId: evmAddressSchema }))
    .query(async ({ input }) => {
      const publicClient = getPublicClient();
      const [data, lptTokenAddress] = await Promise.all([
        queryPoolSquid<LiquidityEventsQuery>(LiquidityEventsDocument, input),
        publicClient.readContract({
          abi: portalPoolAbi,
          address: input.poolId as Address,
          functionName: 'lptToken',
        }),
      ]);
      const tokens = await readERC20Tokens([lptTokenAddress as Address]);
      const lptToken = tokens[0];

      return {
        liquidityEvents: data.liquidityEvents.map(e => ({
          ...e,
          amount: BigNumber(e.amount)
            .shiftedBy(-(lptToken?.decimals ?? SQD_DECIMALS))
            .toFixed(),
        })),
        totalCount: data.liquidityEventsConnection.totalCount,
      };
    }),

  topUps: publicProcedure
    .input(paginationSchema.extend({ poolId: evmAddressSchema }))
    .query(async ({ input }) => {
      const publicClient = getPublicClient();
      const [data, rewardTokenAddress] = await Promise.all([
        queryPoolSquid<TopUpsQuery>(TopUpsDocument, input),
        publicClient.readContract({
          abi: portalPoolAbi,
          address: input.poolId as Address,
          functionName: 'getRewardToken',
        }),
      ]);
      const tokens = await readERC20Tokens([rewardTokenAddress as Address]);
      const rewardToken = tokens[0];

      return {
        topUps: data.topUps.map(t => ({
          ...t,
          amount: BigNumber(t.amount)
            .shiftedBy(-(rewardToken?.decimals ?? 6))
            .toFixed(),
        })),
        totalCount: data.topUpsConnection.totalCount,
      };
    }),

  userData: publicProcedure
    .input(z.object({ poolId: evmAddressSchema, address: evmAddressSchema }))
    .query(async ({ input }) => {
      const { poolId, address } = input;
      const publicClient = getPublicClient();
      const poolAddress = poolId as Address;

      if (!(await isPortalPool(publicClient, poolAddress))) return null;

      const portalPoolContract = {
        abi: portalPoolAbi,
        address: poolAddress,
      } as const;

      const [statusResult, whitelistEnabled, isWhitelisted, rewardTokenAddress] = await Promise.all(
        [
          publicClient.readContract({
            ...portalPoolContract,
            functionName: 'getPoolStatusWithRewards',
            args: [address as Address],
          }),
          publicClient.readContract({
            ...portalPoolContract,
            functionName: 'whitelistEnabled',
          }),
          publicClient.readContract({
            ...portalPoolContract,
            functionName: 'isWhitelisted',
            args: [address as Address],
          }),
          publicClient.readContract({
            ...portalPoolContract,
            functionName: 'getRewardToken',
          }),
        ],
      );

      if (!statusResult) return null;
      if (!rewardTokenAddress) {
        throw new Error('Failed to load reward token for pool');
      }

      const rawRewards = String(statusResult[5] ?? '0');
      const userStake = String(statusResult[6] ?? '0');

      const tokens = await readERC20Tokens([rewardTokenAddress as Address]);
      const rewardToken = tokens[0];
      if (!rewardToken) {
        throw new Error('Failed to load reward token metadata');
      }

      const userRewards = BigNumber(rawRewards).shiftedBy(-rewardToken.decimals).toFixed();

      return {
        userBalance: fromSqd(BigInt(userStake)),
        userRewards,
        hasRewards: rawRewards !== '0',
        whitelistEnabled,
        isWhitelisted,
      };
    }),

  pendingWithdrawals: publicProcedure
    .input(z.object({ poolId: evmAddressSchema, address: evmAddressSchema }))
    .query(async ({ input }) => {
      const { poolId, address } = input;
      const publicClient = getPublicClient();
      const poolAddress = poolId as Address;

      if (!(await isPortalPool(publicClient, poolAddress))) return null;

      const portalPoolContract = {
        abi: portalPoolAbi,
        address: poolAddress,
      } as const;

      const ticketCount = await publicClient.readContract({
        ...portalPoolContract,
        functionName: 'getTicketCount',
        args: [address as Address],
      });

      const count = Number(ticketCount);
      if (count === 0) return [];

      const ticketIds = Array.from({ length: count }, (_, i) => BigInt(i));

      const maybeWithdrawals = await Promise.all(
        ticketIds.map(async ticketId => {
          const [exitTicket, queueStatus] = await Promise.all([
            publicClient.readContract({
              ...portalPoolContract,
              functionName: 'getExitTicket',
              args: [address as Address, ticketId],
            }),
            publicClient.readContract({
              ...portalPoolContract,
              functionName: 'getQueueStatusWithTimestamp',
              args: [address as Address, ticketId],
            }),
          ]);

          if (exitTicket.withdrawn) return null;

          const unlockTimestampMs = Number(queueStatus[4]) * 1000;

          return {
            id: ticketId.toString(),
            amount: fromSqd(exitTicket.amount),
            estimatedCompletionAt: new Date(unlockTimestampMs).toISOString(),
          };
        }),
      );

      const withdrawals: Array<{
        id: string;
        amount: string;
        estimatedCompletionAt: string;
      }> = maybeWithdrawals.filter(withdrawal => withdrawal !== null);

      return withdrawals;
    }),

  rewardTokens: publicProcedure.query(async () => {
    const contracts = getContractAddresses();
    const publicClient = getPublicClient();

    const addresses = await publicClient.readContract({
      address: contracts.PORTAL_POOL_FACTORY,
      abi: portalPoolFactoryAbi,
      functionName: 'getAllowedPaymentTokens',
    });

    return readERC20Tokens(addresses as Address[]);
  }),
});
