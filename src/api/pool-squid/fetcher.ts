export function fetcher<TData, TVariables>(query: string, variables?: TVariables) {
  return throttleRequest(async (): Promise<TData> => {
    const res = await fetch(
      process.env.NETWORK === 'tethys'
        ? process.env.TESTNET_POOL_SQUID_API_URL || '/graphql'
        : process.env.MAINNET_POOL_SQUID_API_URL || '/graphql',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query, variables }),
      },
    );

    const json = await res.json();

    if (json.errors) {
      const { message } = json.errors[0];

      throw new Error(message);
    }

    return json.data;
  }, 0);
}

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

export function throttleRequest<T>(fn: () => Promise<T>, timeout = 300): () => Promise<T> {
  return async (): Promise<T> => {
    const startTime = Date.now();
    const res = await fn();
    const diff = Date.now() - startTime;
    if (diff < timeout) {
      await sleep(timeout - diff);
    }

    return res;
  };
}
