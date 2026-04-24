/**
 * Mock GraphQL server for local development and testing.
 *
 * Activated when MOCK_WALLET=true (or MOCK_GRAPHQL=true) is set in the
 * environment.  Starts an in-process HTTP server on MOCK_GRAPHQL_PORT
 * (default 4321) that responds to every POST /graphql request with realistic
 * fixture data.  Account-scoped queries (sources, workers, delegations) return
 * data appropriate to each fixture account's role.
 *
 * The response is chosen by matching the GraphQL operation name in the
 * incoming request body.  Unknown operations receive an empty-but-valid
 * response so new procedures degrade gracefully.
 */

import http from 'node:http';

import { MOCK_ACCOUNTS } from './mockRpcServer.js';

export const MOCK_GRAPHQL_PORT = Number(process.env.MOCK_GRAPHQL_PORT ?? 4321);
export const MOCK_GRAPHQL_URL = `http://localhost:${MOCK_GRAPHQL_PORT}/graphql`;

// ---------------------------------------------------------------------------
// Fixture helpers
// ---------------------------------------------------------------------------

const NOW = new Date().toISOString();
const PAST = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

function ts(series: { field: string; from?: string; to?: string; step?: number }) {
  const count = 10;
  const from = series.from ?? PAST;
  const to = series.to ?? NOW;
  const stepMs = (new Date(to).getTime() - new Date(from).getTime()) / count;
  return {
    data: Array.from({ length: count }, (_, i) => ({
      timestamp: new Date(new Date(from).getTime() + i * stepMs).toISOString(),
      value: Math.random() * 100,
    })),
    step: stepMs / 1000,
    from,
    to,
  };
}

// ---------------------------------------------------------------------------
// Per-operation fixture responses
// Map key = GraphQL operationName string (case-sensitive, matches generated docs)
// ---------------------------------------------------------------------------

const FIXTURES: Record<string, unknown> = {
  // ── workers-squid ──────────────────────────────────────────────────────────
  squidNetworkHeight: {
    squidStatus: { height: 280_000_000 },
  },

  settings: {
    settingsConnection: {
      edges: [
        {
          node: {
            bondAmount: '100000000000000000000000',
            delegationLimitCoefficient: '20',
            minimalWorkerVersion: '>=1.0.0',
            recommendedWorkerVersion: '>=1.1.0',
          },
        },
      ],
    },
  },

  allWorkers: {
    workers: [
      {
        id: 'worker-mock-1',
        peerId: 'QmMockWorker1AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
        name: 'Mock Worker Alpha',
        status: 'ACTIVE',
        totalDelegation: '50000000000000000000000',
        bond: '100000000000000000000000',
        claimedReward: '5000000000000000000000',
        ownerId: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266',
        delegations: [],
        uptime90Days: 0.99,
        apr: 0.14,
        stakerApr: 0.08,
        delegationCapacity: 50000,
        queries24Hours: 12345,
        servedData24Hours: '1048576000',
        storedData: '10737418240',
        version: '1.1.0',
        jailReason: null,
        dialOk: true,
      },
      {
        id: 'worker-mock-2',
        peerId: 'QmMockWorker2BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB',
        name: 'Mock Worker Beta',
        status: 'ACTIVE',
        totalDelegation: '20000000000000000000000',
        bond: '100000000000000000000000',
        claimedReward: '1200000000000000000000',
        ownerId: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
        delegations: [],
        uptime90Days: 0.97,
        apr: 0.12,
        stakerApr: 0.07,
        delegationCapacity: 20000,
        queries24Hours: 8000,
        servedData24Hours: '524288000',
        storedData: '5368709120',
        version: '1.1.0',
        jailReason: null,
        dialOk: true,
      },
    ],
  },

  workerByPeerId: {
    workers: [],
  },

  myWorkers: {
    workers: [],
  },

  myWorkersCount: {
    workersConnection: { totalCount: 0 },
  },

  workerDelegationInfo: {
    workers: [],
    settingsConnection: {
      edges: [
        {
          node: {
            bondAmount: '100000000000000000000000',
            delegationLimitCoefficient: '20',
          },
        },
      ],
    },
  },

  myDelegations: {
    delegations: [],
  },

  workersByOwner: {
    workers: [],
  },

  delegationsByOwner: {
    delegations: [],
  },

  workersSummary: {
    workersSummary: {
      onlineWorkers: 1420,
      totalWorkers: 1500,
      totalBond: '150000000000000000000000000',
      totalDelegation: '80000000000000000000000000',
      aprs: { workerApr: 0.14, stakerApr: 0.08 },
      currentEpoch: 42,
      lastBlockL1: 19_800_000,
      lastBlockTimestamp: NOW,
    },
  },

  currentEpoch: {
    workersSummary: {
      currentEpoch: 42,
      lastBlockL1: 19_800_000,
      lastBlockTimestamp: NOW,
    },
    epoches: [
      {
        id: 'epoch-42',
        number: 42,
        start: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        end: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        startedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        endedAt: null,
      },
    ],
  },

  ActiveWorkersTimeseries: { activeWorkersTimeseries: ts({ field: 'value' }) },
  UniqueOperatorsTimeseries: { uniqueOperatorsTimeseries: ts({ field: 'value' }) },
  DelegationsTimeseries: { delegationsTimeseries: ts({ field: 'value' }) },
  DelegatorsTimeseries: { delegatorsTimeseries: ts({ field: 'value' }) },
  QueriesCountTimeseries: { queriesCountTimeseries: ts({ field: 'value' }) },
  ServedDataTimeseries: { servedDataTimeseries: ts({ field: 'value' }) },
  StoredDataTimeseries: { storedDataTimeseries: ts({ field: 'value' }) },
  RewardTimeseries: { rewardTimeseries: ts({ field: 'value' }) },
  AprTimeseries: {
    aprTimeseries: {
      ...ts({ field: 'value' }),
      data: Array.from({ length: 10 }, (_, i) => ({
        timestamp: new Date(Date.now() - (10 - i) * 86400_000).toISOString(),
        value: { stakerApr: 0.07 + i * 0.001, workerApr: 0.13 + i * 0.001 },
      })),
    },
  },
  UptimeTimeseries: { uptimeTimeseries: ts({ field: 'value' }) },

  // ── gateways-squid ────────────────────────────────────────────────────────
  gatewayByPeerId: {
    gateways: [],
  },

  myGateways: {
    gateways: [],
  },

  myGatewayStakes: {
    gatewayStakes: [],
  },

  gatewayStakesByOwner: {
    gatewayStakes: [],
  },

  gatewaysSummary: {
    gatewaysSummary: {
      totalGateways: 48,
      totalGatewayStake: '5000000000000000000000000',
      totalPortalPoolTvl: '3000000000000000000000000',
    },
  },

  poolProvidersByOwner: {
    poolProviders: [],
  },

  portalPools: {
    portalPools: [],
  },

  portalPoolById: {
    portalPoolById: null,
  },

  poolApyTimeseries: {
    poolApyTimeseries: ts({ field: 'value' }),
  },

  poolTvlTimeseries: {
    poolTvlTimeseries: ts({ field: 'value' }),
  },

  poolEvents: {
    poolEvents: [],
  },

  poolEventsConnection: {
    poolEventsConnection: { totalCount: 0 },
  },

  // ── token-squid ────────────────────────────────────────────────────────────
  sources: {
    accounts: [],
  },

  vestingsByAccount: {
    accounts: [],
  },

  vestingByAddress: {
    accountById: null,
  },

  accountsByOwner: {
    accounts: [],
  },

  HoldersCountTimeseries: {
    holdersCountTimeseries: ts({ field: 'value' }),
  },

  LockedValueTimeseries: {
    worker: ts({ field: 'value' }),
    delegation: ts({ field: 'value' }),
    portal: ts({ field: 'value' }),
    portalPool: ts({ field: 'value' }),
  },

  TransfersByTypeTimeseries: {
    transfersByTypeTimeseries: {
      ...ts({ field: 'value' }),
      data: Array.from({ length: 10 }, (_, i) => ({
        timestamp: new Date(Date.now() - (10 - i) * 86400_000).toISOString(),
        value: { deposit: '100', withdraw: '50', transfer: '20', reward: '10', release: '5' },
      })),
    },
  },

  UniqueAccountsTimeseries: {
    uniqueAccountsTimeseries: ts({ field: 'value' }),
  },
};

// ---------------------------------------------------------------------------
// Dynamic (account-scoped) fixtures
// ---------------------------------------------------------------------------

/**
 * Returns the fixture for operations that depend on the queried address.
 * Falls back to the static FIXTURES map for non-account-scoped operations.
 */
function resolveFixture(operationName: string, variables: Record<string, unknown>): unknown {
  // Normalise address from various variable shapes tRPC might send
  const rawAddress =
    (variables.address as string | undefined) ??
    (variables.ownerIds as string[] | undefined)?.[0] ??
    '';
  const address = rawAddress.toLowerCase();

  const account = MOCK_ACCOUNTS.find(a => a.address.toLowerCase() === address);

  // ── sources (token-squid) ─────────────────────────────────────────────────
  // Returns the USER account balance for the queried address.
  if (operationName === 'sources') {
    if (!account) return { accounts: [] };
    return {
      accounts: [
        {
          id: account.address.toLowerCase(),
          type: 'USER',
          balance: account.sqdBalance.toString(),
          claimableDelegationCount: 0,
          owner: null,
          ownerId: null,
        },
      ],
    };
  }

  // ── accountsByOwner (token-squid) — used by resolveAccounts ──────────────
  if (operationName === 'accountsByOwner') {
    if (!account) return { accounts: [] };
    return {
      accounts: [
        {
          id: account.address.toLowerCase(),
          type: 'USER',
          balance: account.sqdBalance.toString(),
          claimableDelegationCount: 0,
          owner: null,
          ownerId: null,
        },
      ],
    };
  }

  // ── Carol's workers (worker operator, Hardhat #2) ─────────────────────────
  const carolAddress = MOCK_ACCOUNTS[2].address.toLowerCase();
  const isCarol =
    address === carolAddress ||
    (variables.ownerIds as string[] | undefined)?.map(a => a.toLowerCase()).includes(carolAddress);

  if (operationName === 'workersByOwner') {
    if (!isCarol) return { workers: [] };
    return {
      workers: [
        {
          id: 'worker-carol-1',
          peerId: 'QmCarolWorker1AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
          name: 'Carol Worker #1',
          bond: '100000000000000000000000',
          claimedReward: '5000000000000000000000',
          ownerId: carolAddress,
        },
        {
          id: 'worker-carol-2',
          peerId: 'QmCarolWorker2BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB',
          name: 'Carol Worker #2',
          bond: '100000000000000000000000',
          claimedReward: '3000000000000000000000',
          ownerId: carolAddress,
        },
      ],
    };
  }

  if (operationName === 'myWorkersCount') {
    if (!isCarol) return { workersConnection: { totalCount: 0 } };
    return { workersConnection: { totalCount: 2 } };
  }

  // ── Bob's delegations (delegator, Hardhat #1) ─────────────────────────────
  const bobAddress = MOCK_ACCOUNTS[1].address.toLowerCase();
  const isBob =
    address === bobAddress ||
    (variables.ownerIds as string[] | undefined)?.map(a => a.toLowerCase()).includes(bobAddress);

  if (operationName === 'delegationsByOwner' || operationName === 'myDelegations') {
    if (!isBob) return { delegations: [] };
    return {
      delegations: [
        {
          id: 'delegation-bob-1',
          ownerId: bobAddress,
          worker: {
            id: 'worker-mock-1',
            peerId: 'QmMockWorker1AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
            name: 'Mock Worker Alpha',
            status: 'ACTIVE',
          },
          deposit: '50000000000000000000000',
          claimableReward: '1000000000000000000000',
          claimedReward: '2000000000000000000000',
        },
      ],
    };
  }

  // Fallback to static fixture
  const staticFixture = (FIXTURES as Record<string, unknown>)[operationName];
  if (staticFixture !== undefined) return staticFixture;

  // biome-ignore lint/suspicious/noConsole: mock server diagnostic
  console.warn(`[mock-graphql] Unknown operation: ${operationName} — returning empty data`);
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

          // Fallback: extract operation name from the query string directly
          if (!operationName && parsed.query) {
            const m = parsed.query.match(/(?:query|mutation)\s+(\w+)/);
            operationName = m?.[1];
          }
        } catch {
          respond(res, null, 400);
          return;
        }

        if (operationName) {
          respond(res, resolveFixture(operationName, variables));
        } else {
          respond(res, {});
        }
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
