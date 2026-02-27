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

## Other commands

```bash
pnpm lint       # lint all packages with Biome
pnpm tsc        # type-check all packages
pnpm codegen    # regenerate GraphQL + wagmi types
```
