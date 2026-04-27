import { CONTRACT_ADDRESSES, type NetworkName } from '@sqd/common'
import { assertNotNull } from '@subsquid/util-internal'

export type ContractConfig = {
  address: string
  range: {
    from: number
    to?: number
  }
}

export type NetworkConfig = {
  name: NetworkName
  contracts: {
    SQD: ContractConfig
    Router: ContractConfig
    VestingFactory: ContractConfig
    RewardsDistribution: ContractConfig
    GatewayRegistry: ContractConfig
    Multicall3: ContractConfig
    SoftCap: ContractConfig
    TemporaryHoldingFactory: ContractConfig
    PortalPoolFactory: ContractConfig
  }
  defaultRouterContracts: {
    networkController: string
    rewardCalculation: string
    rewardTreasury: string
    workerRegistration: string
    staking: string
  }
  epochsStart: number
  range: {
    from: number
    to?: number
  }
}

/**
 * Indexer-specific block-number metadata that does not live on the app side.
 *
 * `range`        — `from` block at which to start ingesting events for the
 *                  package as a whole (squid's `setBlockRange`).
 * `epochsStart`  — the L1 block number where on-chain epoch counting begins;
 *                  used by `toEpochStart` / `toNextEpochStart` helpers.
 * `softCapFrom`  — block range for `SoftCap`, the only contract whose
 *                  effective `from` differs from 0.
 */
const NETWORK_RANGES: Record<NetworkName, { range: { from: number }; epochsStart: number; softCapFrom: number }> = {
  mainnet: {
    range: { from: 194_120_655 },
    epochsStart: 208_420_393,
    softCapFrom: 223_460_171,
  },
  tethys: {
    range: { from: 6_000_000 },
    epochsStart: 57_869_108,
    softCapFrom: 33_215_714,
  },
}

/**
 * The indexer historically stored every address as lowercase; some downstream
 * code does case-sensitive string comparisons against `args.address`. The app
 * stores addresses as checksum-cased EIP-55 strings. Normalise once here so
 * the indexer surface keeps its existing contract.
 */
function lower(addr: string): string {
  return addr.toLowerCase()
}

function buildNetwork(name: NetworkName): NetworkConfig {
  const a = CONTRACT_ADDRESSES[name]
  const m = NETWORK_RANGES[name]
  return {
    name,
    contracts: {
      SQD: { address: lower(a.SQD), range: { from: 0 } },
      Router: { address: lower(a.ROUTER), range: { from: 0 } },
      RewardsDistribution: { address: lower(a.REWARD_DISTRIBUTION), range: { from: 0 } },
      GatewayRegistry: { address: lower(a.GATEWAY_REGISTRATION), range: { from: 0 } },
      Multicall3: { address: lower(a.MULTICALL), range: { from: 0 } },
      SoftCap: { address: lower(a.SOFT_CAP), range: { from: m.softCapFrom } },
      VestingFactory: { address: lower(a.VESTING_FACTORY), range: { from: 0 } },
      TemporaryHoldingFactory: {
        address: lower(a.TEMPORARY_HOLDING_FACTORY),
        range: { from: 0 },
      },
      PortalPoolFactory: { address: lower(a.PORTAL_POOL_FACTORY), range: { from: 0 } },
    },
    defaultRouterContracts: {
      networkController: lower(a.NETWORK_CONTROLLER),
      rewardCalculation: lower(a.REWARD_CALCULATION),
      rewardTreasury: lower(a.REWARD_TREASURY),
      workerRegistration: lower(a.WORKER_REGISTRATION),
      staking: lower(a.STAKING),
    },
    range: m.range,
    epochsStart: m.epochsStart,
  }
}

function getNetworkConfig(): NetworkConfig {
  const name = assertNotNull(process.env.NETWORK)
  if (name !== 'mainnet' && name !== 'tethys') {
    throw new Error(`Unknown network: ${name}`)
  }
  return buildNetwork(name)
}

export const network = getNetworkConfig()
