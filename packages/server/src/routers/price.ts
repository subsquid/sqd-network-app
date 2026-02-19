import { z } from 'zod';

import { publicProcedure, router } from '../trpc.js';

function getCoin() {
  return `arbitrum:0x1337420ded5adb9980cfc35f8f2b054ea86f8ab1`;
}

export async function fetchCurrentPrice(): Promise<number | null> {
  const coin = getCoin();
  const res = await fetch(`https://coins.llama.fi/prices/current/${coin}`);
  const json = (await res.json()) as { coins: Record<string, { price: number }> };
  return json.coins[coin]?.price ?? null;
}

export async function fetchHistoricalPrices(
  from: Date,
  to: Date,
): Promise<Array<{ timestamp: number; price: number }>> {
  const coin = getCoin();

  const fromSeconds = from.getTime() / 1000;
  const toSeconds = to.getTime() / 1000;
  const span = 30;
  const period = Math.floor((toSeconds - fromSeconds) / span / 3600);

  const url = `https://coins.llama.fi/chart/${coin}?end=${toSeconds}&span=${span}&period=${period}h`;
  const res = await fetch(url);
  const json = (await res.json()) as {
    coins: Record<
      string,
      {
        symbol: string;
        confidence: number;
        decimals: number;
        prices: Array<{ timestamp: number; price: number }>;
      }
    >;
  };

  return json.coins[coin]?.prices ?? [];
}

export const priceRouter = router({
  current: publicProcedure.query(async () => {
    return fetchCurrentPrice();
  }),

  historical: publicProcedure
    .input(
      z.object({
        from: z.coerce.date(),
        to: z.coerce.date(),
      }),
    )
    .query(async ({ input }) => {
      return fetchHistoricalPrices(input.from, input.to);
    }),
});
