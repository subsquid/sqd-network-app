/**
 * Chain-derived resolvers for network-wide state: settings, currentEpoch,
 * squidNetworkHeight.
 *
 * Reads NetworkController via viem on demand (cached after the first call),
 * and reports `squidNetworkHeight` straight from the indexer's cursor.
 */
import type { Abi, Address, PublicClient } from 'viem';

import { networkArtifact } from '../../artifacts';
import type { AddressMap } from '../../deployments';
import { type Resolver, registerResolver } from '../dispatcher';

export interface NetworkResolverDeps {
  client: PublicClient;
  deployments: AddressMap;
  /** Live indexer cursor — used as squidNetworkHeight. */
  getLastBlock(): number;
}

const networkAbi = [
  {
    type: 'function',
    name: 'bondAmount',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ type: 'uint256' }],
  },
  {
    // The deprecated `epochLength` storage variable holds the lock period only.
    // The actual epoch length is `workerEpochLength`.
    type: 'function',
    name: 'workerEpochLength',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ type: 'uint128' }],
  },
  {
    // Computed live from block.number — not stale.
    type: 'function',
    name: 'epochNumber',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ type: 'uint128' }],
  },
  {
    // Computed live from block.number — not stale.
    type: 'function',
    name: 'nextEpoch',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ type: 'uint128' }],
  },
] as const;

// Lazy ABI loads (forge artefacts may not be on disk at module-import time).
let _workerRegAbi: Abi | undefined;
let _stakingAbi: Abi | undefined;
function workerRegAbi(): Abi {
  return (_workerRegAbi ??= networkArtifact('WorkerRegistration').abi);
}
function stakingAbi(): Abi {
  return (_stakingAbi ??= networkArtifact('Staking').abi);
}

export function registerNetworkResolvers(deps: NetworkResolverDeps): void {
  const settings: Resolver = async () => {
    let bondAmount = 100_000n * 10n ** 18n;
    if (deps.deployments.NETWORK_CONTROLLER) {
      try {
        bondAmount = (await deps.client.readContract({
          abi: networkAbi,
          address: deps.deployments.NETWORK_CONTROLLER as Address,
          functionName: 'bondAmount',
        })) as bigint;
      } catch {
        // keep fallback
      }
    }
    return {
      settingsConnection: {
        edges: [
          {
            node: {
              bondAmount: bondAmount.toString(),
              delegationLimitCoefficient: '20',
              minimalWorkerVersion: '>=1.0.0',
              recommendedWorkerVersion: '>=1.1.2',
            },
          },
        ],
      },
    };
  };
  registerResolver('settings', settings);

  registerResolver('squidNetworkHeight', () => {
    return { squidStatus: { height: deps.getLastBlock() } };
  });

  /**
   * workersSummary — chain-derived totals.
   *
   * On-chain fields:
   *   - workersCount / onlineWorkersCount: WorkerRegistration.getActiveWorkerCount()
   *     (no on-chain "online" notion in mock mode — every active worker is
   *     reported as online).
   *   - totalBond: sum of getWorker(id).bond across active worker ids.
   *   - totalDelegation: sum of Staking.delegated(id) across active worker ids.
   *   - blockTimeL1 (ms) / lastBlockL1 / lastBlockTimestampL1: current head.
   *
   * Off-chain metric fields (queries, served data, stored data, APR, aprs)
   * are zeros / empty arrays — the UI's "no data" path renders fine.
   */
  const workersSummary: Resolver = async () => {
    const head = deps.getLastBlock();
    let workersCount = 0n;
    let totalBond = 0n;
    let totalDelegation = 0n;

    const wr = deps.deployments.WORKER_REGISTRATION;
    const stk = deps.deployments.STAKING;
    if (wr) {
      try {
        const ids = (await deps.client.readContract({
          abi: workerRegAbi(),
          address: wr as Address,
          functionName: 'getActiveWorkerIds',
        })) as readonly bigint[];
        workersCount = BigInt(ids.length);
        for (const id of ids) {
          try {
            const w = (await deps.client.readContract({
              abi: workerRegAbi(),
              address: wr as Address,
              functionName: 'getWorker',
              args: [id],
            })) as { bond: bigint };
            totalBond += w.bond;
          } catch {
            // ignore single-worker read failure
          }
          if (stk) {
            try {
              const d = (await deps.client.readContract({
                abi: stakingAbi(),
                address: stk as Address,
                functionName: 'delegated',
                args: [id],
              })) as bigint;
              totalDelegation += d;
            } catch {
              // ignore
            }
          }
        }
      } catch {
        // ignore — fall through to zeros
      }
    }

    return {
      workersSummary: {
        workersCount: Number(workersCount),
        onlineWorkersCount: Number(workersCount),
        totalBond: totalBond.toString(),
        totalDelegation: totalDelegation.toString(),
        // Off-chain metrics — chain has no answer; surface zeros.
        queries24Hours: '0',
        queries90Days: '0',
        servedData24Hours: '0',
        servedData90Days: '0',
        storedData: '0',
        workerApr: 0,
        stakerApr: 0,
        blockTimeL1: 12_000,
        lastBlockL1: head,
        lastBlockTimestampL1: new Date().toISOString(),
        aprs: [],
      },
    };
  };
  registerResolver('workersSummary', workersSummary);

  // Timeseries — UI charts gracefully render the empty state when `data` is [].
  const emptySeries = (key: string) => () => ({
    [key]: { data: [], step: 86_400, from: null, to: null },
  });
  registerResolver('ActiveWorkersTimeseries', emptySeries('activeWorkersTimeseries'));
  registerResolver('UniqueOperatorsTimeseries', emptySeries('uniqueOperatorsTimeseries'));
  registerResolver('DelegationsTimeseries', emptySeries('delegationsTimeseries'));
  registerResolver('DelegatorsTimeseries', emptySeries('delegatorsTimeseries'));
  registerResolver('QueriesCountTimeseries', emptySeries('queriesCountTimeseries'));
  registerResolver('ServedDataTimeseries', emptySeries('servedDataTimeseries'));
  registerResolver('StoredDataTimeseries', emptySeries('storedDataTimeseries'));
  registerResolver('RewardTimeseries', emptySeries('rewardTimeseries'));
  registerResolver('AprTimeseries', emptySeries('aprTimeseries'));
  registerResolver('UptimeTimeseries', emptySeries('uptimeTimeseries'));
  registerResolver('HoldersCountTimeseries', emptySeries('holdersCountTimeseries'));
  registerResolver('UniqueAccountsTimeseries', emptySeries('uniqueAccountsTimeseries'));
  registerResolver('TransfersByTypeTimeseries', emptySeries('transfersByTypeTimeseries'));
  registerResolver('poolApyTimeseries', emptySeries('poolApyTimeseries'));
  registerResolver('poolTvlTimeseries', emptySeries('poolTvlTimeseries'));
  registerResolver('LockedValueTimeseries', () => ({
    worker: { data: [], step: 86_400, from: null, to: null },
    delegation: { data: [], step: 86_400, from: null, to: null },
    portal: { data: [], step: 86_400, from: null, to: null },
    portalPool: { data: [], step: 86_400, from: null, to: null },
  }));

  const currentEpoch: Resolver = async () => {
    if (!deps.deployments.NETWORK_CONTROLLER) {
      throw new Error('NETWORK_CONTROLLER address is missing from deployments');
    }
    const addr = deps.deployments.NETWORK_CONTROLLER as Address;
    // epochNumber() and nextEpoch() are computed live from block.number in the
    // contract — they are always up-to-date. workerEpochLength is the actual
    // epoch length (the deprecated `epochLength` variable is the lock period).
    const [epochNumber, nextEpochBlock, workerEpochLength] = (await Promise.all([
      deps.client.readContract({ abi: networkAbi, address: addr, functionName: 'epochNumber' }),
      deps.client.readContract({ abi: networkAbi, address: addr, functionName: 'nextEpoch' }),
      deps.client.readContract({ abi: networkAbi, address: addr, functionName: 'workerEpochLength' }),
    ])) as [bigint, bigint, bigint];

    const head = deps.getLastBlock();
    return {
      workersSummary: {
        blockTimeL1: 12_000,
        lastBlockL1: head,
        lastBlockTimestampL1: new Date().toISOString(),
      },
      epoches: [
        {
          number: Number(epochNumber),
          start: Number(nextEpochBlock - workerEpochLength),
          end: Number(nextEpochBlock) - 1,
        },
      ],
    };
  };
  registerResolver('currentEpoch', currentEpoch);
}
