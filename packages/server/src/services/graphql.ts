import { getNetworkSquidUrl, getPoolSquidUrl } from '../env.js';

interface GraphQLResponse<T> {
  data: T;
  errors?: Array<{ message: string }>;
}

async function graphqlRequest<T>(
  url: string,
  query: string | { toString(): string },
  variables?: Record<string, unknown>,
): Promise<T> {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: query.toString(), variables }),
  });

  const json = (await res.json()) as GraphQLResponse<T>;

  if (json.errors?.length) {
    throw new Error(json.errors[0].message);
  }

  return json.data;
}

export function queryNetworkSquid<T>(
  query: string | { toString(): string },
  variables?: Record<string, unknown>,
): Promise<T> {
  return graphqlRequest<T>(getNetworkSquidUrl(), query, variables);
}

export function queryPoolSquid<T>(
  query: string | { toString(): string },
  variables?: Record<string, unknown>,
): Promise<T> {
  return graphqlRequest<T>(getPoolSquidUrl(), query, variables);
}
