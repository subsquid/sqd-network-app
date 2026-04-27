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
pnpm build:indexer     # build all @sqd/indexer-* packages (vendored squid)
```

## Repository layout

```
packages/
├── client/                  # @sqd/client          — React SPA
├── common/                  # @sqd/common          — shared client+server ABIs/addresses
├── server/                  # @sqd/server          — tRPC API
├── indexer-common/          # @sqd/indexer-common  — vendored squid: shared types + ABIs
├── indexer-workers/         # @sqd/workers         — vendored squid: workers indexer
├── indexer-gateways/        # @sqd/gateways        — vendored squid: gateways indexer
├── indexer-token/           # @sqd/token           — vendored squid: token indexer
└── indexer-vestings/        # @sqd/vestings        — vendored squid: vestings indexer
indexer/                     # vendored squid tooling: ABIs, manifests, scripts, plans
```

The `packages/indexer-*` packages are vendored from
[`subsquid/squid-subsquid-network`](https://github.com/subsquid/squid-subsquid-network)
via `git subtree add`. They keep their own toolchain (vitest 2, biome 1.9,
typeorm + pg) and are skipped by the root biome run. Bump them with:

```bash
git subtree pull --prefix=indexer https://github.com/subsquid/squid-subsquid-network.git master
```

After a pull, re-apply the directory rename and `@sqd/shared → @sqd/indexer-common`
relabel before running `pnpm install`. (We will simplify this once the
indexer packages are unified at the npm-name level upstream.)

> **Note on overlap with `packages/common`.** Both `packages/common` and
> `packages/indexer-common` carry contract ABIs and address books for the
> same contracts. They use different ABI shapes (wagmi tuple vs.
> `@subsquid/evm-codec` event/fun factories), so deduplication requires a
> deeper API unification — tracked as a follow-up task, deliberately out of
> scope for the merge PR.

## Other commands

```bash
pnpm lint       # lint all packages with Biome
pnpm tsc        # type-check all packages
pnpm codegen    # regenerate GraphQL + wagmi types
```
