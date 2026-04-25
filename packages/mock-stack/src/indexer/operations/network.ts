/**
 * Chain-derived resolvers for network-wide state: settings, currentEpoch,
 * squidNetworkHeight.
 *
 * Reads NetworkController via viem on demand (cached after the first call),
 * and reports `squidNetworkHeight` straight from the indexer's cursor.
 */
import { type Address, type PublicClient } from 'viem';

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
    type: 'function',
    name: 'epochLength',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ type: 'uint128' }],
  },
  {
    type: 'function',
    name: 'epochNumber',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ type: 'uint128' }],
  },
  {
    type: 'function',
    name: 'nextEpoch',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ type: 'uint128' }],
  },
] as const;

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

  const currentEpoch: Resolver = async () => {
    let epochNumber = 0n;
    let nextEpoch = 0n;
    let epochLength = 2n;
    if (deps.deployments.NETWORK_CONTROLLER) {
      try {
        const addr = deps.deployments.NETWORK_CONTROLLER as Address;
        epochNumber = (await deps.client.readContract({
          abi: networkAbi,
          address: addr,
          functionName: 'epochNumber',
        })) as bigint;
        nextEpoch = (await deps.client.readContract({
          abi: networkAbi,
          address: addr,
          functionName: 'nextEpoch',
        })) as bigint;
        epochLength = (await deps.client.readContract({
          abi: networkAbi,
          address: addr,
          functionName: 'epochLength',
        })) as bigint;
      } catch {
        // fallback values stay
      }
    }
    const head = deps.getLastBlock();
    const blockTimestamp = (block: bigint) =>
      new Date(Date.now() - Math.max(0, head - Number(block)) * 12_000).toISOString();
    return {
      workersSummary: {
        blockTimeL1: 12,
        lastBlockL1: head,
        lastBlockTimestampL1: new Date().toISOString(),
      },
      epoches: [
        {
          number: Number(epochNumber),
          start: blockTimestamp(BigInt(head) - epochLength),
          end: blockTimestamp(BigInt(nextEpoch)),
        },
      ],
    };
  };
  registerResolver('currentEpoch', currentEpoch);
}
