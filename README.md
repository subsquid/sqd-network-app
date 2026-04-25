# SQD Network UI

## Prerequisites

- **Node.js 22**
- **pnpm 9**: `npm install -g pnpm`

## Setup

1. Copy `.env.example` to `.env` and fill in the required values
2. `pnpm install`

## Development

```bash
pnpm dev        # client (port 3005) + server (port 3001)
```

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

The `integration` project requires [Foundry](https://book.getfoundry.sh/)
to be installed (`curl -L https://foundry.paradigm.xyz | bash && foundryup`).
Run `pnpm --filter @subsquid/mock-stack stack:prepare` once after install to
produce `packages/mock-stack/.anvil-state.json` and `.deployments.json`;
subsequent test runs reuse the cached snapshot.

See [`packages/mock-stack/README.md`](packages/mock-stack/README.md) for
details on how the mock environment is constructed.

## Other commands

```bash
pnpm lint       # lint all packages with Biome
pnpm tsc        # type-check all packages
pnpm codegen    # regenerate GraphQL + wagmi types
```
