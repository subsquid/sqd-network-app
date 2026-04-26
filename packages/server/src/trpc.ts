import { initTRPC } from '@trpc/server';

export function createContext() {
  return {};
}

type Context = Awaited<ReturnType<typeof createContext>>;

const t = initTRPC.context<Context>().create();

export const router = t.router;

/**
 * Middleware that logs the procedure path and elapsed time for every call.
 * Errors are re-thrown so tRPC's onError handler still fires.
 */
const loggerMiddleware = t.middleware(async ({ path, type, next }) => {
  const start = Date.now();
  // biome-ignore lint/suspicious/noConsole: procedure timing log
  console.log(`[tRPC] --> ${type} ${path}`);
  try {
    const result = await next();
    const ms = Date.now() - start;
    if (result.ok) {
      // biome-ignore lint/suspicious/noConsole: procedure timing log
      console.log(`[tRPC] <-- ${type} ${path} OK (${ms}ms)`);
    } else {
      // biome-ignore lint/suspicious/noConsole: procedure timing log
      console.error(`[tRPC] <-- ${type} ${path} ERROR (${ms}ms)`);
    }
    return result;
  } catch (err) {
    const ms = Date.now() - start;
    // biome-ignore lint/suspicious/noConsole: procedure timing log
    console.error(`[tRPC] <-- ${type} ${path} THREW (${ms}ms)`, err);
    throw err;
  }
});

export const publicProcedure = t.procedure.use(loggerMiddleware);
