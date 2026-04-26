/**
 * Synthetic-aggregate fixture builder, ported from
 * `packages/server/src/services/mockGraphqlServer.ts`.
 *
 * Differences from the legacy server:
 *   1. Deterministic PRNG (`mulberry32`) instead of `Math.random()`. The seed
 *      is derived from operationName + variables so two runs of the same
 *      query return identical fixtures, while different queries get
 *      independent streams.
 *   2. Personas live in this package (`personas.ts`) — no cross-package
 *      import to `@subsquid/server`.
 *
 * Phase 7 (this commit) keeps the resolver bodies as a flat dispatch — a
 * 1:1 port of the legacy file. Future commits split each operation into a
 * dedicated module under `operations/` and start replacing chain-derived
 * fields with entries from the log-fed entity store.
 */
import { PERSONAS } from '../personas';
import { hashSeed, mulberry32 } from './prng';

// ---------------------------------------------------------------------------
// Persona aliases (lower-cased addresses)
// ---------------------------------------------------------------------------
const [ALICE_PERSONA, BOB_PERSONA, CAROL_PERSONA, DAVE_PERSONA] = PERSONAS;
const ALICE = ALICE_PERSONA.address.toLowerCase();
const BOB = BOB_PERSONA.address.toLowerCase();
const CAROL = CAROL_PERSONA.address.toLowerCase();
const DAVE = DAVE_PERSONA.address.toLowerCase();

const PERSONA_BY_ADDRESS = new Map<string, (typeof PERSONAS)[number]>(
  PERSONAS.map(p => [p.address.toLowerCase(), p]),
);

// ---------------------------------------------------------------------------
// Time helpers
// ---------------------------------------------------------------------------
const NOW = new Date().toISOString();

function daysAgo(n: number) {
  return new Date(Date.now() - n * 86_400_000).toISOString();
}

function daysFromNow(n: number) {
  return new Date(Date.now() + n * 86_400_000).toISOString();
}

// ---------------------------------------------------------------------------
// Deterministic timeseries builders (replace Math.random())
// ---------------------------------------------------------------------------
function numericSeries(
  seedKey: string,
  from: string,
  to: string,
  count = 30,
  base = 100,
  variance = 0.3,
) {
  const fromMs = new Date(from).getTime();
  const toMs = new Date(to).getTime();
  const stepMs = (toMs - fromMs) / count;
  const rng = mulberry32(hashSeed(seedKey));
  return {
    data: Array.from({ length: count }, (_, i) => ({
      timestamp: new Date(fromMs + i * stepMs).toISOString(),
      value: rng.variance(base, variance),
    })),
    step: stepMs / 1000,
    from,
    to,
  };
}

function objectSeries<T>(
  _seedKey: string,
  from: string,
  to: string,
  count: number,
  makeValue: (i: number) => T,
) {
  const fromMs = new Date(from).getTime();
  const toMs = new Date(to).getTime();
  const stepMs = (toMs - fromMs) / count;
  return {
    data: Array.from({ length: count }, (_, i) => ({
      timestamp: new Date(fromMs + i * stepMs).toISOString(),
      value: makeValue(i),
    })),
    step: stepMs / 1000,
    from,
    to,
  };
}

// ---------------------------------------------------------------------------
// Worker fixture builder
// ---------------------------------------------------------------------------
function makeWorker(overrides: Record<string, unknown>) {
  // Deterministic RNG so dayUptimes don't drift between runs.
  const rng = mulberry32(hashSeed(`worker:${overrides.id ?? 'default'}`));
  return {
    id: 'worker-mock-1',
    name: 'Mock Worker Alpha',
    peerId: 'QmMockWorker1AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
    ownerId: ALICE,
    status: 'ACTIVE',
    online: true,
    jailed: false,
    dialOk: true,
    jailReason: null,
    statusHistory: [{ blockNumber: 100, pending: false, timestamp: daysAgo(60) }],
    version: '1.1.2',
    createdAt: daysAgo(90),
    uptime90Days: 0.99,
    uptime24Hours: 1.0,
    apr: 0.14,
    stakerApr: 0.08,
    totalDelegation: '50000000000000000000000',
    capedDelegation: '50000000000000000000000',
    delegationCount: 3,
    locked: false,
    lockEnd: null,
    bond: '100000000000000000000000',
    claimableReward: '3000000000000000000000',
    claimedReward: '5000000000000000000000',
    totalDelegationRewards: '8000000000000000000000',
    queries24Hours: 182_345,
    queries90Days: 14_500_000,
    scannedData24Hours: '2147483648',
    scannedData90Days: '193273528320',
    servedData24Hours: '1073741824',
    servedData90Days: '96636764160',
    storedData: '10737418240',
    website: 'https://example.com',
    email: 'operator@example.com',
    description: 'A reliable mock worker for testing',
    dayUptimes: Array.from({ length: 7 }, (_, i) => ({
      timestamp: daysAgo(7 - i),
      uptime: 0.95 + rng.next() * 0.05,
    })),
    delegations: [],
    ...overrides,
  };
}

const CAROL_WORKER_1 = makeWorker({
  id: 'worker-carol-1',
  name: 'Carol Worker #1',
  peerId: 'QmCarolWorker1AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
  ownerId: CAROL,
  bond: '100000000000000000000000',
  claimableReward: '4500000000000000000000',
  claimedReward: '8000000000000000000000',
  totalDelegation: '30000000000000000000000',
  capedDelegation: '30000000000000000000000',
  delegationCount: 2,
  apr: 0.13,
  stakerApr: 0.07,
  uptime90Days: 0.98,
  uptime24Hours: 1.0,
});

const CAROL_WORKER_2 = makeWorker({
  id: 'worker-carol-2',
  name: 'Carol Worker #2',
  peerId: 'QmCarolWorker2BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB',
  ownerId: CAROL,
  bond: '100000000000000000000000',
  claimableReward: '2000000000000000000000',
  claimedReward: '3500000000000000000000',
  totalDelegation: '10000000000000000000000',
  capedDelegation: '10000000000000000000000',
  delegationCount: 1,
  apr: 0.11,
  stakerApr: 0.065,
  uptime90Days: 0.97,
  uptime24Hours: 0.99,
});

const PUBLIC_WORKER_1 = makeWorker({ id: 'worker-mock-1', ownerId: ALICE });
const PUBLIC_WORKER_2 = makeWorker({
  id: 'worker-mock-2',
  name: 'Mock Worker Beta',
  peerId: 'QmMockWorker2BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB',
  ownerId: BOB,
  totalDelegation: '20000000000000000000000',
  capedDelegation: '20000000000000000000000',
  bond: '100000000000000000000000',
  claimableReward: '1200000000000000000000',
  claimedReward: '2400000000000000000000',
  apr: 0.12,
  stakerApr: 0.07,
  uptime90Days: 0.97,
  queries24Hours: 95_000,
  queries90Days: 8_200_000,
  servedData24Hours: '536870912',
  storedData: '5368709120',
});

const ALL_WORKERS = [PUBLIC_WORKER_1, PUBLIC_WORKER_2, CAROL_WORKER_1, CAROL_WORKER_2];

// ---------------------------------------------------------------------------
// Resolver dispatcher (pure port of mockGraphqlServer.ts → resolveFixture)
// ---------------------------------------------------------------------------

/**
 * Operation names recognised by the synthetic resolver. Used by the parity
 * test in `__tests__/parity.test.ts` to ensure we don't drop any operation
 * when refactoring.
 */
export const SYNTHETIC_OPERATIONS = [
  // workers-squid
  'squidNetworkHeight',
  'settings',
  'allWorkers',
  'workerByPeerId',
  'myWorkers',
  'myWorkersCount',
  'workerDelegationInfo',
  'myDelegations',
  'workersByOwner',
  'delegationsByOwner',
  'workersSummary',
  'currentEpoch',
  'ActiveWorkersTimeseries',
  'UniqueOperatorsTimeseries',
  'DelegationsTimeseries',
  'DelegatorsTimeseries',
  'QueriesCountTimeseries',
  'ServedDataTimeseries',
  'StoredDataTimeseries',
  'RewardTimeseries',
  'AprTimeseries',
  'UptimeTimeseries',
  // gateways-squid
  'gatewayByPeerId',
  'myGateways',
  'myGatewayStakes',
  'gatewayStakesByOwner',
  'gatewaysSummary',
  'poolProvidersByOwner',
  'portalPools',
  'portalPoolById',
  'poolApyTimeseries',
  'poolTvlTimeseries',
  'poolEvents',
  'poolEventsConnection',
  // token-squid
  'sources',
  'vestingByAddress',
  'vestingsByAccount',
  'accountsByOwner',
  'HoldersCountTimeseries',
  'LockedValueTimeseries',
  'TransfersByTypeTimeseries',
  'UniqueAccountsTimeseries',
] as const;

export type SyntheticOperation = (typeof SYNTHETIC_OPERATIONS)[number];

export function resolveSynthetic(
  operationName: string,
  variables: Record<string, unknown>,
): unknown {
  const rawAddress =
    (variables.address as string | undefined) ?? (variables.ownerIds as string[] | undefined)?.[0];
  const address = (rawAddress ?? '').toLowerCase();

  const fromVar = (variables.from as string | undefined) ?? daysAgo(30);
  const toVar = (variables.to as string | undefined) ?? NOW;
  const seedKey = `${operationName}:${fromVar}:${toVar}:${address}`;

  // ── workers-squid ──────────────────────────────────────────────────────────

  if (operationName === 'squidNetworkHeight') {
    return { squidStatus: { height: 280_000_000 } };
  }

  if (operationName === 'settings') {
    return {
      settingsConnection: {
        edges: [
          {
            node: {
              bondAmount: '100000000000000000000000',
              delegationLimitCoefficient: '20',
              minimalWorkerVersion: '>=1.0.0',
              recommendedWorkerVersion: '>=1.1.2',
            },
          },
        ],
      },
    };
  }

  if (operationName === 'allWorkers') {
    return { workers: ALL_WORKERS };
  }

  if (operationName === 'workerByPeerId') {
    const peerId = variables.peerId as string | undefined;
    const worker = ALL_WORKERS.find(w => w.peerId === peerId);
    return { workers: worker ? [worker] : [] };
  }

  if (operationName === 'myWorkers') {
    const ownerIds = (variables.ownerIds as string[] | undefined)?.map(a => a.toLowerCase()) ?? [];
    return {
      workers: [CAROL_WORKER_1, CAROL_WORKER_2].filter(w =>
        ownerIds.includes(w.ownerId.toLowerCase()),
      ),
    };
  }

  if (operationName === 'myWorkersCount') {
    const ownerIds = (variables.ownerIds as string[] | undefined)?.map(a => a.toLowerCase()) ?? [];
    const count = ownerIds.includes(CAROL) ? 2 : 0;
    return { workersConnection: { totalCount: count } };
  }

  if (operationName === 'workerDelegationInfo') {
    const workerId = variables.workerId as string | undefined;
    const worker = ALL_WORKERS.find(w => w.id === workerId);
    return {
      workerById: worker
        ? {
            bond: worker.bond,
            totalDelegation: worker.totalDelegation,
            capedDelegation: worker.capedDelegation,
            liveness: 0.99,
            dTenure: 0.95,
            trafficWeight: 0.85,
          }
        : null,
      settings: [{ utilizedStake: '60000000000000000000000000', baseApr: 0.15 }],
    };
  }

  if (operationName === 'myDelegations') {
    const ownerIds = (variables.ownerIds as string[] | undefined)?.map(a => a.toLowerCase()) ?? [];
    if (!ownerIds.includes(BOB)) return { workers: [] };
    const bobDelegation = {
      deposit: '50000000000000000000000',
      claimableReward: '1000000000000000000000',
      claimedReward: '2000000000000000000000',
      locked: false,
      lockEnd: null,
      ownerId: BOB,
    };
    return {
      workers: [
        {
          ...PUBLIC_WORKER_1,
          delegations: [bobDelegation],
        },
      ],
    };
  }

  if (operationName === 'workersByOwner') {
    const ownerIds = (variables.ownerIds as string[] | undefined)?.map(a => a.toLowerCase()) ?? [];
    return {
      workers: [CAROL_WORKER_1, CAROL_WORKER_2]
        .filter(w => ownerIds.includes(w.ownerId.toLowerCase()))
        .map(w => ({
          id: w.id,
          name: w.name,
          peerId: w.peerId,
          ownerId: w.ownerId,
          bond: w.bond,
          claimableReward: w.claimableReward,
        })),
    };
  }

  if (operationName === 'delegationsByOwner') {
    const ownerIds = (variables.ownerIds as string[] | undefined)?.map(a => a.toLowerCase()) ?? [];
    if (!ownerIds.includes(BOB)) return { delegations: [] };
    return {
      delegations: [
        {
          id: 'delegation-bob-1',
          ownerId: BOB,
          deposit: '50000000000000000000000',
          claimableReward: '1000000000000000000000',
          claimedReward: '2000000000000000000000',
          locked: false,
          lockEnd: null,
        },
      ],
    };
  }

  if (operationName === 'workersSummary') {
    return {
      workersSummary: {
        onlineWorkersCount: 1420,
        workersCount: 1500,
        queries90Days: '1850000000',
        queries24Hours: '22000000',
        servedData90Days: '193273528320',
        servedData24Hours: '2147483648',
        stakerApr: 0.08,
        totalBond: '150000000000000000000000000',
        totalDelegation: '80000000000000000000000000',
        storedData: '10737418240000',
        workerApr: 0.14,
        blockTimeL1: 12_000,
        lastBlockL1: 19_800_000,
        lastBlockTimestampL1: NOW,
        aprs: Array.from({ length: 7 }, (_, i) => ({
          timestamp: daysAgo(7 - i),
          workerApr: 0.13 + i * 0.001,
          stakerApr: 0.07 + i * 0.001,
        })),
      },
    };
  }

  if (operationName === 'currentEpoch') {
    return {
      workersSummary: {
        blockTimeL1: 12_000,
        lastBlockL1: 19_800_000,
        lastBlockTimestampL1: NOW,
      },
      epoches: [
        {
          number: 42,
          start: daysAgo(5),
          end: daysFromNow(2),
        },
      ],
    };
  }

  // Workers-squid timeseries
  if (operationName === 'ActiveWorkersTimeseries') {
    return { activeWorkersTimeseries: numericSeries(seedKey, fromVar, toVar, 30, 1420, 0.05) };
  }
  if (operationName === 'UniqueOperatorsTimeseries') {
    return { uniqueOperatorsTimeseries: numericSeries(seedKey, fromVar, toVar, 30, 380, 0.08) };
  }
  if (operationName === 'DelegationsTimeseries') {
    return { delegationsTimeseries: numericSeries(seedKey, fromVar, toVar, 30, 4200, 0.12) };
  }
  if (operationName === 'DelegatorsTimeseries') {
    return { delegatorsTimeseries: numericSeries(seedKey, fromVar, toVar, 30, 2800, 0.1) };
  }
  if (operationName === 'QueriesCountTimeseries') {
    return {
      queriesCountTimeseries: numericSeries(seedKey, fromVar, toVar, 30, 22_000_000, 0.2),
    };
  }
  if (operationName === 'ServedDataTimeseries') {
    return {
      servedDataTimeseries: numericSeries(seedKey, fromVar, toVar, 30, 2_147_483_648, 0.15),
    };
  }
  if (operationName === 'StoredDataTimeseries') {
    return {
      storedDataTimeseries: numericSeries(seedKey, fromVar, toVar, 30, 10_737_418_240_000, 0.03),
    };
  }
  if (operationName === 'RewardTimeseries') {
    return {
      rewardTimeseries: objectSeries(seedKey, fromVar, toVar, 30, i => ({
        workerReward: (800_000 + i * 5000) * 1e18,
        stakerReward: (200_000 + i * 2000) * 1e18,
      })),
    };
  }
  if (operationName === 'AprTimeseries') {
    return {
      aprTimeseries: objectSeries(seedKey, fromVar, toVar, 30, i => ({
        workerApr: 0.13 + i * 0.0003,
        stakerApr: 0.07 + i * 0.0002,
      })),
    };
  }
  if (operationName === 'UptimeTimeseries') {
    return { uptimeTimeseries: numericSeries(seedKey, fromVar, toVar, 30, 0.98, 0.02) };
  }

  // ── gateways-squid ────────────────────────────────────────────────────────

  if (operationName === 'gatewayByPeerId') return { gateways: [] };
  if (operationName === 'myGateways') return { gateways: [] };
  if (operationName === 'myGatewayStakes') return { gatewayStakes: [] };
  if (operationName === 'gatewayStakesByOwner') return { gatewayStakes: [] };
  if (operationName === 'gatewaysSummary') {
    return {
      gatewaysSummary: {
        totalGateways: 48,
        totalGatewayStake: '5000000000000000000000000',
        totalPortalPoolTvl: '3000000000000000000000000',
      },
    };
  }
  if (operationName === 'poolProvidersByOwner') return { poolProviders: [] };
  if (operationName === 'portalPools') return { portalPools: [] };
  if (operationName === 'portalPoolById') return { portalPoolById: null };
  if (operationName === 'poolApyTimeseries') {
    return { poolApyTimeseries: numericSeries(seedKey, fromVar, toVar, 30, 0.12, 0.1) };
  }
  if (operationName === 'poolTvlTimeseries') {
    return { poolTvlTimeseries: numericSeries(seedKey, fromVar, toVar, 30, 3_000_000, 0.05) };
  }
  if (operationName === 'poolEvents') return { poolEvents: [] };
  if (operationName === 'poolEventsConnection') return { poolEventsConnection: { totalCount: 0 } };

  // ── token-squid ───────────────────────────────────────────────────────────

  if (operationName === 'sources') {
    const persona = PERSONA_BY_ADDRESS.get(address);
    if (!persona) return { accounts: [] };
    return {
      accounts: [
        {
          id: persona.address.toLowerCase(),
          type: 'USER',
          balance: persona.sqdBalance.toString(),
          claimableDelegationCount: persona.address.toLowerCase() === BOB ? 1 : 0,
          owner: null,
          ownerId: null,
        },
      ],
    };
  }

  if (operationName === 'vestingByAddress') {
    if (address === DAVE) {
      return {
        accountById: {
          id: `vesting-${DAVE}`,
          type: 'VESTING',
          balance: '1000000000000000000000000',
          claimableDelegationCount: 0,
          owner: { id: DAVE, type: 'USER' },
          ownerId: DAVE,
        },
      };
    }
    return { accountById: null };
  }

  if (operationName === 'vestingsByAccount') {
    if (address === DAVE) {
      return {
        accounts: [
          {
            id: `vesting-${DAVE}`,
            type: 'VESTING',
            balance: '1000000000000000000000000',
            claimableDelegationCount: 0,
            owner: { id: DAVE, type: 'USER' },
            ownerId: DAVE,
          },
        ],
      };
    }
    return { accounts: [] };
  }

  if (operationName === 'accountsByOwner') {
    const persona = PERSONA_BY_ADDRESS.get(address);
    const results: unknown[] = [];
    if (persona) {
      results.push({
        id: persona.address.toLowerCase(),
        type: 'USER',
        balance: persona.sqdBalance.toString(),
        claimableDelegationCount: persona.address.toLowerCase() === BOB ? 1 : 0,
        owner: null,
        ownerId: null,
      });
    }
    if (address === DAVE) {
      results.push({
        id: `vesting-${DAVE}`,
        type: 'VESTING',
        balance: '1000000000000000000000000',
        claimableDelegationCount: 0,
        owner: { id: DAVE, type: 'USER' },
        ownerId: DAVE,
      });
    }
    return { accounts: results };
  }

  // Token-squid timeseries
  if (operationName === 'HoldersCountTimeseries') {
    return { holdersCountTimeseries: numericSeries(seedKey, fromVar, toVar, 30, 18_500, 0.05) };
  }

  if (operationName === 'LockedValueTimeseries') {
    return {
      worker: numericSeries(`${seedKey}:worker`, fromVar, toVar, 30, 150_000_000, 0.04),
      delegation: numericSeries(`${seedKey}:delegation`, fromVar, toVar, 30, 80_000_000, 0.08),
      portal: numericSeries(`${seedKey}:portal`, fromVar, toVar, 30, 5_000_000, 0.12),
      portalPool: numericSeries(`${seedKey}:portalPool`, fromVar, toVar, 30, 3_000_000, 0.1),
    };
  }

  if (operationName === 'TransfersByTypeTimeseries') {
    const rng = mulberry32(hashSeed(seedKey));
    return {
      transfersByTypeTimeseries: objectSeries(seedKey, fromVar, toVar, 30, () => ({
        deposit: String(Math.floor(rng.next() * 100_000) * 1e18),
        withdraw: String(Math.floor(rng.next() * 50_000) * 1e18),
        transfer: String(Math.floor(rng.next() * 20_000) * 1e18),
        reward: String(Math.floor(rng.next() * 10_000) * 1e18),
        release: String(Math.floor(rng.next() * 5_000) * 1e18),
      })),
    };
  }

  if (operationName === 'UniqueAccountsTimeseries') {
    return { uniqueAccountsTimeseries: numericSeries(seedKey, fromVar, toVar, 30, 18_500, 0.05) };
  }

  // Fallback
  return null;
}
