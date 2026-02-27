import { initTRPC } from '@trpc/server';

export function createContext() {
  return {};
}

type Context = Awaited<ReturnType<typeof createContext>>;

const t = initTRPC.context<Context>().create();

export const router = t.router;
export const publicProcedure = t.procedure;
