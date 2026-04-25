# SQD Network UI

## Prerequisites

- **Node.js 22**
- **pnpm 9**: `npm install -g pnpm`

## Setup

1. Copy `.env.example` to `.env` and fill in the required values
2. `pnpm install`

## Development

```bash
pnpm dev        # client (port 3005) + server (port 3001) against the live Squid + Arbitrum
pnpm dev:mock   # same, but loads .env.mock and routes the server at the in-process mock servers
```

`pnpm dev:mock` loads [`.env.mock`](.env.mock) (already pointed at
`http://localhost:4321/graphql` and `http://localhost:8545`) and starts the
server via `main.mock.ts`, which boots the in-process mock GraphQL fixture
server + mock JSON-RPC server before the regular startup. The client is
built with `vite --mode mock`, which sets the build-time `process.env.MOCK`
flag, switching it to the wagmi mock connector + the local RPC URL.

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
