# SQD Network UI

## Prerequisites

- **Node.js 22**
- **pnpm 9**: `npm install -g pnpm`

## Setup

1. Copy `.env.example` to `.env` and fill in the required values
2. `pnpm install`

## Development

```bash
pnpm dev          # client (port 3005) + server (port 3001) against live Squid + Arbitrum
pnpm mock         # convenience: runs both pnpm mock:chain and pnpm mock:app together
pnpm mock:chain   # long-lived chain (anvil :8545 + mini-indexer GraphQL :4321)
pnpm mock:app     # client + tRPC server pointed at the running chain
```

### Mock mode (two-process layout)

`pnpm mock:chain` is the slow, long-lived process: it auto-runs
`forge build` if needed, deploys the contracts, seeds personas, and
keeps anvil + the mini-indexer GraphQL server up. State lives at
`packages/mock-stack/{.anvil-state.json,.deployments.json}`. Start it
**once per session** in its own terminal — restart only when you change
the deploy harness, contract sources, or want a fresh chain.

`pnpm mock:app` is the fast-iterating process: client (vite, watch mode)
+ tRPC server (`tsx --watch`). It reads the chain endpoints from the
filesystem and runs forever; saving a server file just hot-reloads the
tRPC routers without touching anvil.

`pnpm mock` is a convenience that runs both halves at once for one-off
work; `pnpm mock:chain` + `pnpm mock:app` in two terminals is the
recommended dev loop.

What's deployed (~20 contracts):
[`@subsquid/mock-stack`](packages/mock-stack/README.md): MockSQD + USDC
+ WETH + Multicall3 + Router proxy + NetworkController + Staking +
WorkerRegistration + RewardTreasury + SoftCap + DistributedRewards +
RewardCalculation + GatewayRegistry proxy + VestingFactory +
PortalRegistry proxy + FeeRouterModule + PortalPoolImplementation +
PortalPoolFactory proxy + PortalPoolBeacon. Personas: Carol registers 2
workers; Bob delegates 50 000 SQD to worker 1 + deposits 25 000 SQD into
Carol's portal pool; Dave gets a 1 000 000 SQD vesting account. Worker
IDs, peer IDs, delegation amounts, balances are all read directly from
chain state via view functions — no indexed entity store, no drift.

**Prerequisite**: Foundry installed (`curl -L https://foundry.paradigm.xyz | bash && foundryup`).

The client is built with `vite --mode mock`, which sets the build-time
`process.env.MOCK` flag, switching it to the wagmi mock connector + the
local RPC URL.

## Build

```bash
pnpm build             # build all packages
pnpm build:client      # build client only
pnpm build:server      # build server only
```

## Testing

```bash
pnpm test                                         # run every package's Vitest suite
pnpm --filter @subsquid/client test:unit          # layer-1 hook + component specs
pnpm --filter @subsquid/client test:integration   # layer-2 specs (Foundry required)
```

The `integration` project needs [Foundry](https://book.getfoundry.sh/)
installed (`curl -L https://foundry.paradigm.xyz | bash && foundryup`).
**No other setup steps are required** — the test runner spawns Anvil on an
ephemeral port, runs `forge build` + the deploy harness automatically the
first time, and reuses the resulting `.anvil-state.json` snapshot
afterwards. No env vars to set, no commands to memorize.

See [`packages/mock-stack/README.md`](packages/mock-stack/README.md) for
details on how the mock environment is constructed.

## Other commands

```bash
pnpm lint       # lint all packages with Biome
pnpm tsc        # type-check all packages
pnpm codegen    # regenerate GraphQL + wagmi types
```
