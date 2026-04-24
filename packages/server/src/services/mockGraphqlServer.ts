/**
 * Mock GraphQL server for local development and testing.
 *
 * Activated when MOCK_WALLET=true (or MOCK_GRAPHQL=true).  Returns complete,
 * realistic fixture data for every Squid GraphQL operation so all pages of the
 * app render meaningful content.  Account-scoped queries return data tailored
 * to each fixture persona's role.
 *
 * Operation names match the generated TypedDocumentString query names exactly.
 */

import http from 'node:http';

import { MOCK_ACCOUNTS } from './mockRpcServer.js';

export const MOCK_GRAPHQL_PORT = Number(process.env.MOCK_GRAPHQL_PORT ?? 4321);
export const MOCK_GRAPHQL_URL = `http://localhost:${MOCK_GRAPHQL_PORT}/graphql`;

// ---------------------------------------------------------------------------
// Addresses (lower-cased to match what the Squid stores)
// ---------------------------------------------------------------------------
const [ALICE, BOB, CAROL, DAVE] = MOCK_ACCOUNTS.map(a => a.address.toLowerCase());

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const NOW = new Date().toISOString();

function daysAgo(n: number) {
  return new Date(Date.now() - n * 86400_000).toISOString();
}

function daysFromNow(n: number) {
  return new Date(Date.now() + n * 86400_000).toISOString();
}

/** Generate a numeric timeseries with `count` points between PAST and NOW. */
function numericSeries(from: string, to: string, count = 30, base = 100, variance = 0.3) {
  const fromMs = new Date(from).getTime();
  const toMs = new Date(to).getTime();
  const stepMs = (toMs - fromMs) / count;
  return {
    data: Array.from({ length: count }, (_, i) => ({
      timestamp: new Date(fromMs + i * stepMs).toISOString(),
      value: base * (1 + (Math.random() - 0.5) * variance),
    })),
    step: stepMs / 1000,
    from,
    to,
  };
}

/** Timeseries with per-entry object values (e.g. APR, Reward). */
function objectSeries<T>(from: string, to: string, count = 30, makeValue: (i: number) => T) {
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
// Shared worker fixture (full field set matching allWorkers / myWorkers shapes)
// ---------------------------------------------------------------------------
function makeWorker(overrides: Record<string, unknown>) {
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
    queries24Hours: 182345,
    queries90Days: 14500000,
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
      uptime: 0.95 + Math.random() * 0.05,
    })),
    delegations: [],
    ...overrides,
  };
}

// Carol's two workers (she is the operator)
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

// The two public workers (visible to everyone on the workers list)
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
  queries24Hours: 95000,
  queries90Days: 8200000,
  servedData24Hours: '536870912',
  storedData: '5368709120',
});

// All workers list includes Carol's workers too (public network view)
const ALL_WORKERS = [PUBLIC_WORKER_1, PUBLIC_WORKER_2, CAROL_WORKER_1, CAROL_WORKER_2];

// ---------------------------------------------------------------------------
// Dynamic fixture resolver — dispatches by operationName + variables
// ---------------------------------------------------------------------------
function resolveFixture(operationName: string, variables: Record<string, unknown>): unknown {
  const rawAddress =
    (variables.address as string | undefined) ?? (variables.ownerIds as string[] | undefined)?.[0];
  const address = (rawAddress ?? '').toLowerCase();

  const fromVar = (variables.from as string | undefined) ?? daysAgo(30);
  const toVar = (variables.to as string | undefined) ?? NOW;

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
    // Bob has delegations; others don't
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
        blockTimeL1: 12,
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
        blockTimeL1: 12,
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
    return { activeWorkersTimeseries: numericSeries(fromVar, toVar, 30, 1420, 0.05) };
  }
  if (operationName === 'UniqueOperatorsTimeseries') {
    return { uniqueOperatorsTimeseries: numericSeries(fromVar, toVar, 30, 380, 0.08) };
  }
  if (operationName === 'DelegationsTimeseries') {
    return { delegationsTimeseries: numericSeries(fromVar, toVar, 30, 4200, 0.12) };
  }
  if (operationName === 'DelegatorsTimeseries') {
    return { delegatorsTimeseries: numericSeries(fromVar, toVar, 30, 2800, 0.1) };
  }
  if (operationName === 'QueriesCountTimeseries') {
    return { queriesCountTimeseries: numericSeries(fromVar, toVar, 30, 22_000_000, 0.2) };
  }
  if (operationName === 'ServedDataTimeseries') {
    return { servedDataTimeseries: numericSeries(fromVar, toVar, 30, 2_147_483_648, 0.15) };
  }
  if (operationName === 'StoredDataTimeseries') {
    return { storedDataTimeseries: numericSeries(fromVar, toVar, 30, 10_737_418_240_000, 0.03) };
  }
  if (operationName === 'RewardTimeseries') {
    return {
      rewardTimeseries: objectSeries(fromVar, toVar, 30, i => ({
        workerReward: (800_000 + i * 5000) * 1e18,
        stakerReward: (200_000 + i * 2000) * 1e18,
      })),
    };
  }
  if (operationName === 'AprTimeseries') {
    return {
      aprTimeseries: objectSeries(fromVar, toVar, 30, i => ({
        workerApr: 0.13 + i * 0.0003,
        stakerApr: 0.07 + i * 0.0002,
      })),
    };
  }
  if (operationName === 'UptimeTimeseries') {
    return { uptimeTimeseries: numericSeries(fromVar, toVar, 30, 0.98, 0.02) };
  }

  // ── gateways-squid ────────────────────────────────────────────────────────

  if (operationName === 'gatewayByPeerId') {
    return { gateways: [] };
  }
  if (operationName === 'myGateways') {
    return { gateways: [] };
  }
  if (operationName === 'myGatewayStakes') {
    return { gatewayStakes: [] };
  }
  if (operationName === 'gatewayStakesByOwner') {
    return { gatewayStakes: [] };
  }
  if (operationName === 'gatewaysSummary') {
    return {
      gatewaysSummary: {
        totalGateways: 48,
        totalGatewayStake: '5000000000000000000000000',
        totalPortalPoolTvl: '3000000000000000000000000',
      },
    };
  }
  if (operationName === 'poolProvidersByOwner') {
    return { poolProviders: [] };
  }
  if (operationName === 'portalPools') {
    return { portalPools: [] };
  }
  if (operationName === 'portalPoolById') {
    return { portalPoolById: null };
  }
  if (operationName === 'poolApyTimeseries') {
    return { poolApyTimeseries: numericSeries(fromVar, toVar, 30, 0.12, 0.1) };
  }
  if (operationName === 'poolTvlTimeseries') {
    return { poolTvlTimeseries: numericSeries(fromVar, toVar, 30, 3_000_000, 0.05) };
  }
  if (operationName === 'poolEvents') {
    return { poolEvents: [] };
  }
  if (operationName === 'poolEventsConnection') {
    return { poolEventsConnection: { totalCount: 0 } };
  }

  // ── token-squid ───────────────────────────────────────────────────────────

  if (operationName === 'sources') {
    const account = MOCK_ACCOUNTS.find(a => a.address.toLowerCase() === address);
    if (!account) return { accounts: [] };
    return {
      accounts: [
        {
          id: account.address.toLowerCase(),
          type: 'USER',
          balance: account.sqdBalance.toString(),
          claimableDelegationCount: account.address.toLowerCase() === BOB ? 1 : 0,
          owner: null,
          ownerId: null,
        },
      ],
    };
  }

  if (operationName === 'vestingByAddress') {
    // Dave has a vesting account
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
    const account = MOCK_ACCOUNTS.find(a => a.address.toLowerCase() === address);
    const results = [];
    if (account) {
      results.push({
        id: account.address.toLowerCase(),
        type: 'USER',
        balance: account.sqdBalance.toString(),
        claimableDelegationCount: account.address.toLowerCase() === BOB ? 1 : 0,
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
    return { holdersCountTimeseries: numericSeries(fromVar, toVar, 30, 18500, 0.05) };
  }

  if (operationName === 'LockedValueTimeseries') {
    return {
      worker: numericSeries(fromVar, toVar, 30, 150_000_000, 0.04),
      delegation: numericSeries(fromVar, toVar, 30, 80_000_000, 0.08),
      portal: numericSeries(fromVar, toVar, 30, 5_000_000, 0.12),
      portalPool: numericSeries(fromVar, toVar, 30, 3_000_000, 0.1),
    };
  }

  if (operationName === 'TransfersByTypeTimeseries') {
    return {
      transfersByTypeTimeseries: objectSeries(fromVar, toVar, 30, () => ({
        deposit: String(Math.floor(Math.random() * 100_000) * 1e18),
        withdraw: String(Math.floor(Math.random() * 50_000) * 1e18),
        transfer: String(Math.floor(Math.random() * 20_000) * 1e18),
        reward: String(Math.floor(Math.random() * 10_000) * 1e18),
        release: String(Math.floor(Math.random() * 5_000) * 1e18),
      })),
    };
  }

  if (operationName === 'UniqueAccountsTimeseries') {
    return { uniqueAccountsTimeseries: numericSeries(fromVar, toVar, 30, 18500, 0.05) };
  }

  // Fallback
  // biome-ignore lint/suspicious/noConsole: mock server diagnostic
  console.warn(`[mock-graphql] Unknown operation: "${operationName}" — returning empty data`);
  return {};
}

// ---------------------------------------------------------------------------
// HTTP server
// ---------------------------------------------------------------------------

function respond(res: http.ServerResponse, data: unknown, status = 200) {
  const body = JSON.stringify({ data });
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(body),
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'content-type',
  });
  res.end(body);
}

export function startMockGraphqlServer(): Promise<void> {
  return new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      if (req.method === 'OPTIONS') {
        res.writeHead(204, {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'content-type',
        });
        res.end();
        return;
      }
      if (req.method !== 'POST') {
        res.writeHead(405);
        res.end();
        return;
      }

      let body = '';
      req.on('data', chunk => {
        body += chunk;
      });
      req.on('end', () => {
        let operationName: string | undefined;
        let variables: Record<string, unknown> = {};
        try {
          const parsed = JSON.parse(body) as {
            operationName?: string;
            query?: string;
            variables?: Record<string, unknown>;
          };
          operationName = parsed.operationName;
          variables = parsed.variables ?? {};
          if (!operationName && parsed.query) {
            const m = parsed.query.match(/(?:query|mutation)\s+(\w+)/);
            operationName = m?.[1];
          }
        } catch {
          respond(res, null, 400);
          return;
        }

        respond(res, operationName ? resolveFixture(operationName, variables) : {});
      });
    });

    server.on('error', reject);
    server.listen(MOCK_GRAPHQL_PORT, '127.0.0.1', () => {
      // biome-ignore lint/suspicious/noConsole: startup diagnostic
      console.log(`[mock-graphql] Fixture server listening on ${MOCK_GRAPHQL_URL}`);
      resolve();
    });
  });
}
