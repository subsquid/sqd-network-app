# @subsquid/mock-stack

Single-owner mock environment for the Subsquid Network app. Used by:

- Vitest globalSetup (Layer-2 integration tests).
- Future Playwright E2E (see `plans/playwright-e2e.md`).
- `pnpm dev` mock mode (`MOCK_WALLET=true`).

The package wraps three pieces that together replicate everything the app
needs to render meaningfully without real Squid APIs or mainnet RPC:

1. **Anvil** — fresh chain id 42161 (mainnet) or 421614 (tethys), pre-loaded
   from `.anvil-state.json` so consumers don't pay the deploy cost on every
   spawn.
2. **TS deploy harness** (`src/deploy.ts`) — compiles + deploys all required
   contracts (mock SQD/USDC/WETH/V3 router/Multicall3 from `contracts/`,
   plus the network and portal contracts from the submodules), seeds persona
   state, and writes `.deployments.json` + `.anvil-state.json`.
3. **Mini-indexer** (`src/indexer/`) — subscribes to log events on the
   relevant addresses, projects them into TS Map-backed entities, and serves
   the same operation-name dispatcher contract that
   `packages/server/src/services/mockGraphqlServer.ts` exposes today.

## Public API

```ts
import { startMockStack, type MockStackHandle } from '@subsquid/mock-stack';

const handle = await startMockStack({ stateFile });
// ... run tests / dev server pointed at handle.rpcUrl + handle.graphqlUrl
await handle.stop();
```

## Status (Phase 4)

The package skeleton exists. `startMockStack()` currently throws — the real
implementation lands across Phases 5–7 of the rollout in
`plans/wagmi-viem-testing.md`.

Until then `pnpm dev` mock mode keeps using the legacy in-process servers in
`packages/server/src/services/mockRpcServer.ts` and `mockGraphqlServer.ts`.
Phase 10 deletes those.

## Scripts

- `pnpm --filter @subsquid/mock-stack stack:prepare` — runs the deploy harness
  and writes `.anvil-state.json` + `.deployments.json` (also wired as the
  `mock-stack#stack:prepare` Turbo task with appropriate cache inputs).
- `pnpm --filter @subsquid/mock-stack stack:rebuild` — wipes generated state
  and re-runs `stack:prepare`.
