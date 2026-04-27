/**
 * MSW v2 server lifecycle for tests.
 *
 * The base server starts with **no** handlers — Layer-2 specs hit the real
 * tRPC + indexer stack by default. Specs that need to force a tRPC error
 * pass a handler from `trpc-error-handlers.ts` to `server.use(...)` for
 * the duration of one assertion, then `server.resetHandlers()` undoes it.
 *
 * MSW intercepts at the fetch/XHR layer, so it composes cleanly with the
 * real backend: only the listed handlers fire, everything else passes
 * through to the actual HTTP server.
 */
import { setupServer } from 'msw/node';

export const mswServer = setupServer();

export function startMsw(): void {
  mswServer.listen({ onUnhandledRequest: 'bypass' });
}

export function stopMsw(): void {
  mswServer.close();
}

export function resetMswHandlers(): void {
  mswServer.resetHandlers();
}
