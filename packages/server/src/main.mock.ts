/**
 * Entrypoint for `pnpm dev:mock`.
 *
 * Starts the in-process mock GraphQL fixture server + the in-process mock
 * JSON-RPC server, then hands off to the regular `main.ts` startup. The
 * `.env.mock` file points the squid URLs and `ARBITRUM_ONE_RPC_URL` at the
 * mock servers' addresses, so `main.ts` doesn't need any mock-mode branching
 * — it just reads its env as usual.
 *
 * The full mock-stack (anvil + deploy harness + log-driven mini-indexer) is
 * a follow-up — the legacy in-process servers are kept for now so dev mode
 * works without Foundry installed.
 */
import { startMockGraphqlServer } from './services/mockGraphqlServer.js';
import { startMockRpcServer } from './services/mockRpcServer.js';

await startMockGraphqlServer();
await startMockRpcServer();

await import('./main.js');
