/**
 * Mock GraphQL server for local development and testing.
 *
 * Activated when MOCK_GRAPHQL=true is set in the environment.  Starts an
 * in-process HTTP server on MOCK_GRAPHQL_PORT (default 4321) that responds
 * to every POST /graphql request with realistic fixture data regardless of
 * which Squid (workers / gateways / token) the tRPC server is calling.
 *
 * The response is chosen by matching the GraphQL operation name in the
 * incoming request body.  Unknown operations receive an empty-but-valid
 * response so new procedures degrade gracefully.
 *
 * Usage: set the following in .env
 *   MOCK_GRAPHQL=true
 *   MOCK_GRAPHQL_PORT=4321   # optional, default 4321
 */

import http from 'node:http';

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
        try {
          const parsed = JSON.parse(body) as { operationName?: string; query?: string };
          operationName = parsed.operationName;

          // Fallback: extract operation name from the query string directly
          if (!operationName && parsed.query) {
            const m = parsed.query.match(/(?:query|mutation)\s+(\w+)/);
            operationName = m?.[1];
          }
        } catch {
          respond(res, null, 400);
          return;
        }

        const fixture = operationName ? FIXTURES[operationName] : undefined;
        if (fixture !== undefined) {
          respond(res, fixture);
        } else {
          // biome-ignore lint/suspicious/noConsole: mock server diagnostic
          console.warn(
            `[mock-graphql] Unknown operation: ${operationName ?? '(none)'} — returning empty data`,
          );
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
