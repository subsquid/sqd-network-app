# Project Agent Guide

> Scope: Root project (applies to all subdirectories unless overridden by a nested AGENTS.md)

## Quick Facts

- **Primary language:** TypeScript (React 19 frontend, Node.js backend)
- **Package manager:** pnpm 9 — always use `pnpm`, never `npm` or `yarn`
- **Monorepo tool:** Turborepo (`turbo.json` at root)
- **Linter / Formatter:** Biome (`biome.json` at root) — replaces ESLint + Prettier
- **Branching:** `develop` (staging/dev), `main` (production)
- **CI/CD:** GitHub Actions → Docker images pushed to GCR (`gcr.io/bright-meridian-316511/...`)

---

## Repository Tour

```
subsquid-network-app/
├── packages/
│   ├── client/          # React 19 SPA (Vite + MUI v7 + wagmi/RainbowKit)
│   ├── server/          # tRPC API server (Node.js, proxies Squid GraphQL + on-chain data)
│   └── common/          # Shared ABI definitions, contract addresses, constants
├── nginx/               # nginx template for static-file serving in Docker
├── .github/workflows/   # build-web.yaml, build-server.yaml
├── Dockerfile           # Multi-stage: `server` target and `web` (nginx) target
├── biome.json           # Root lint + format config (covers all packages)
├── turbo.json           # Turborepo task graph
└── .env / .env.example  # Runtime environment variables
```

### `packages/client/src/` layout

| Directory      | Purpose                                                                    |
|----------------|----------------------------------------------------------------------------|
| `api/`         | tRPC client setup and typed query hooks                                    |
| `components/`  | Reusable UI components (MUI v7-based)                                      |
| `contexts/`    | React context providers (wallet, network, settings, etc.)                  |
| `hooks/`       | Custom hooks — includes `network/useSubsquidNetwork` (mainnet vs tethys)   |
| `layouts/`     | Page layouts; `NetworkLayout/` is the primary shell with sidebar nav       |
| `pages/`       | Route-level page components (Workers, Gateways, Portals, Delegations, …)  |
| `theme/`       | MUI theme customization — `theme.tsx`, `theme.components.ts`, palette files|
| `schema/`      | Yup validation schemas                                                     |
| `i18n/`        | Internationalisation strings                                               |
| `icons/`       | Custom SVG icon components                                                 |
| `lib/`         | Utility helpers and third-party adapters                                   |
| `logger/`      | Sentry + console logging setup                                             |

### `packages/server/src/` layout

| Directory / File | Purpose                                                              |
|------------------|----------------------------------------------------------------------|
| `routers/`       | tRPC routers (account, worker, gateway, network, pool, price, etc.) |
| `services/`      | Data-fetching services: `graphql.ts` (Squid API), `blockchain.ts`   |
| `main.ts`        | Express server entry point                                           |
| `router.ts`      | Root tRPC router composition                                         |
| `trpc.ts`        | tRPC initialisation helpers                                          |
| `generated/`     | Auto-generated GraphQL typed documents (do not edit)                |

### `packages/common/src/`

Shared constants, contract ABIs (`abi/`), and chain addresses (`addresses.ts`). Imported by both `client` and `server`.

---

## Tooling & Setup

### Prerequisites

- **Node.js 22**
- **pnpm 9**: `npm install -g pnpm` or via Corepack: `corepack enable && corepack prepare pnpm@latest --activate`
- **Docker** (for production image builds)

### Local Setup

```bash
cp .env.example .env   # fill in real values (see below)
pnpm install           # installs all workspaces
pnpm dev               # client (port 3005) + server (port 3001) in parallel
```

### Environment Variables (`.env`)

| Variable                        | Purpose                                               |
|---------------------------------|-------------------------------------------------------|
| `NETWORK`                       | `mainnet` or `tethys` — selects chain + API endpoints |
| `WALLET_CONNECT_PROJECT_ID`     | WalletConnect v2 project ID                           |
| `TESTNET_SQUID_API_URL`         | Squid GraphQL endpoint for testnet (tethys)           |
| `MAINNET_SQUID_API_URL`         | Squid GraphQL endpoint for mainnet                    |
| `TESTNET_POOL_SQUID_API_URL`    | Pool Squid GraphQL endpoint for testnet               |
| `MAINNET_POOL_SQUID_API_URL`    | Pool Squid GraphQL endpoint for mainnet               |
| `BLOCK_CHAIN_NODE_ADDRESS`      | Arbitrum RPC endpoint (default: Arbitrum One public)  |
| `SERVER_PORT`                   | Port for the tRPC server (default: `3001`)            |
| `SENTRY_DSN`                    | Sentry DSN (dev only — not set in prod)               |
| `ENABLE_DEMO_FEATURES`          | `true` on `develop`, `false` on `main`                |
| `APP_VERSION`                   | Injected by CI (short git SHA)                        |

---

## Common Tasks

> Run `pnpm codegen` after any changes to GraphQL queries or contract ABIs.

### Turborepo Task Graph

The root `turbo.json` defines five tasks:

| Task      | `dependsOn`   | Notes                                                                                    |
|-----------|---------------|------------------------------------------------------------------------------------------|
| `dev`     | `["^build"]`  | Starts persistent dev servers; builds `common` first; not cached                        |
| `build`   | `["^build"]`  | Builds dependencies first; outputs cached under `build/**` and `dist/**`                |
| `tsc`     | `["transit"]` | Type-check; runs in parallel across packages but cache-invalidates when deps change     |
| `lint`    | `[]`          | Biome check + fix; runs in parallel across all packages, no inter-package dependencies  |
| `transit` | `["^transit"]`| Virtual transit node — no script, creates cache-invalidation links between packages    |

`packages/client/turbo.json` extends the root and adds the full list of build-time environment variables to the `build` task (so Turbo cache-busts on env changes).

**Key rules for agents working with Turbo in this repo:**
- Always use `turbo run <task>` in scripts and CI — never the bare `turbo <task>` shorthand.
- Do not chain Turbo tasks with `&&`; use `dependsOn` in `turbo.json` instead.
- The `transit` task is a transit node pattern: it holds no script but propagates cache hashes from upstream packages, allowing `tsc` to run in parallel while correctly invalidating when any dependency's source changes.
- To run a single package: `npx turbo run build --filter=@subsquid/client`
- To run only what changed vs a branch: `npx turbo run build --affected`

---

## Testing & Quality Gates

- **No automated test suite** is configured at this time. TypeScript compilation (`pnpm tsc`) serves as the primary correctness gate.
- **Linting:** Biome — run `pnpm lint` before committing. CI does **not** run lint, so fix issues locally.
- **Type-check:** CI runs `npx turbo run tsc --filter=@subsquid/client` (web) and `npx turbo run tsc --filter=@subsquid/server` (server) before building.
- **Generated files:** Never edit `packages/server/src/generated/` or any `*.generated.*` files by hand; always regenerate with `pnpm codegen`.
- **Import order:** Biome enforces a specific import order (Node built-ins → react → third-party → internal aliases). The internal aliases `@components`, `@contexts`, `@hooks`, `@api`, `@network`, `@lib` are grouped last.

---

## Workflow Expectations

- **Branches:** Feature branches off `develop`; `develop` → `main` for releases.
- **CI triggers:** Pushing to `develop` or `main` automatically builds and deploys Docker images to GCR for the affected package.
  - `build-web.yaml` builds both `mainnet` and `tethys` variants as a matrix job.
  - `build-server.yaml` builds a single server image.
- **Network variants:** The client is deployed twice per environment — once for `mainnet`, once for `tethys`. Ensure UI changes work for both (the active network is driven by `NETWORK` env var at build time).
- **Feature flags:** `ENABLE_DEMO_FEATURES=true` is set on `develop` builds. Gate experimental UI behind this flag via the config context.
- **Secrets:** WalletConnect project IDs differ per network variant (see CI workflow). Never hardcode project IDs.

---

## Architecture Notes

- The **client** talks exclusively to the **server** via tRPC (not directly to the Squid GraphQL API or the blockchain). The server aggregates and transforms data from:
  1. Squid GraphQL APIs (indexed on-chain state)
  2. Direct Arbitrum RPC calls via `viem`
- The **common** package exposes contract ABIs and addresses shared by both client and server.
- Wallet connectivity uses **RainbowKit + wagmi v2** targeting Arbitrum One (mainnet) or Arbitrum Sepolia (tethys).
- UI is built with **MUI v7**.

---

## Documentation Duties

- Update `README.md` when setup steps, scripts, or environment variables change materially.
- Update `.env.example` whenever new environment variables are added.
- Run `pnpm codegen` and commit the generated output whenever GraphQL queries or contract ABIs change.

---

## Finish the Task Checklist

- [ ] Run `pnpm lint` and fix any Biome errors before committing
- [ ] Run `pnpm tsc` to confirm no TypeScript errors
- [ ] Run `pnpm codegen` if GraphQL queries or contract ABIs were modified
- [ ] Update `.env.example` if new environment variables were introduced
- [ ] Update `README.md` if setup instructions or scripts changed
- [ ] Summarize changes in conventional commit format (e.g., `feat: ...`, `fix: ...`, `chore: ...`, `refactor: ...`)
