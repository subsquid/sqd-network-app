import { initTRPC } from '@trpc/server';

import { logger } from './logger.js';

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
  logger.debug({ trpcType: type, trpcPath: path }, `tRPC --> ${type} ${path}`);
  try {
    const result = await next();
    const ms = Date.now() - start;
    if (result.ok) {
      logger.debug({ trpcType: type, trpcPath: path, ms }, `tRPC <-- ${type} ${path} OK`);
    } else {
      logger.warn({ trpcType: type, trpcPath: path, ms }, `tRPC <-- ${type} ${path} ERROR`);
    }
    return result;
  } catch (err) {
    const ms = Date.now() - start;
    logger.error({ err, trpcType: type, trpcPath: path, ms }, `tRPC <-- ${type} ${path} THREW`);
    throw err;
  }
});

export const publicProcedure = t.procedure.use(loggerMiddleware);
