# SQD Network App

Web application for the SQD Network: a frontend for viewing and managing network participants (workers, gateways, portal pools, and delegations) along with the SQD token assets they involve.

## What it is

This is the web UI for [SQD Network](https://sqd.dev/network), the decentralized data lake behind SQD. It is a pnpm + Turborepo monorepo with three packages:

- `packages/client`: React 19 single-page app (Vite, MUI v7, RainbowKit + wagmi v2). Wallet connectivity targets Arbitrum One (mainnet) or Arbitrum Sepolia (the `tethys` testnet).
- `packages/server`: Node.js tRPC API server. The client talks only to this server, which aggregates data from the SQD Squid GraphQL APIs (indexed onchain state) and direct Arbitrum RPC calls (via viem).
- `packages/common`: shared contract ABIs and addresses used by both client and server.

The client renders pages for the dashboard, workers, gateways, portal pools, delegations, assets, and buy-back.

## Prerequisites

- Node.js 22
- pnpm 9: `npm install -g pnpm`

## Setup

1. Copy `.env.example` to `.env` and fill in the required values.
2. `pnpm install`

### Environment variables

See `.env.example` for the full list. Key variables:

| Variable | Purpose |
|---|---|
| `NETWORK` | `mainnet` or `tethys` (testnet): selects chain and API endpoints |
| `RPC_URL` | Arbitrum RPC endpoint |
| `WALLET_CONNECT_PROJECT_ID` | WalletConnect project ID |
| `MAINNET_WORKERS_SQUID_API_URL` / `TESTNET_WORKERS_SQUID_API_URL` | Workers Squid GraphQL endpoint |
| `MAINNET_GATEWAYS_SQUID_API_URL` / `TESTNET_GATEWAYS_SQUID_API_URL` | Gateways Squid GraphQL endpoint |
| `MAINNET_TOKEN_SQUID_API_URL` / `TESTNET_TOKEN_SQUID_API_URL` | Token Squid GraphQL endpoint |
| `SERVER_PORT` | Port for the tRPC server (default: `3001`) |
| `SENTRY_DSN` | Sentry DSN (optional) |

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

## Documentation

- SQD Network: https://docs.sqd.dev/en/network
- SQD docs: https://docs.sqd.dev
