import { API_UPSTREAM_REQUEST_TIMEOUT_MS } from '@subsquid/common';

import { getGatewaysSquidUrl, getTokenSquidUrl, getWorkersSquidUrl } from '../env.js';

interface GraphQLResponse<T> {
  data: T;
  errors?: Array<{ message: string }>;
}

export const GRAPHQL_REQUEST_TIMEOUT_MS = API_UPSTREAM_REQUEST_TIMEOUT_MS;

async function graphqlRequest<T>(
  url: string,
  query: string | { toString(): string },
  variables?: Record<string, unknown>,
): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), GRAPHQL_REQUEST_TIMEOUT_MS);

  let res: Response;
  try {
    res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: query.toString(), variables }),
      signal: controller.signal,
    });
  } catch (err) {
    if (controller.signal.aborted) {
      throw new Error(
        `GraphQL request timed out after ${GRAPHQL_REQUEST_TIMEOUT_MS / 1000}s (url: ${url})`,
      );
    }
    throw err;
  } finally {
    clearTimeout(timeoutId);
  }

  if (!res.ok) {
    throw new Error(`GraphQL request failed: HTTP ${res.status} ${res.statusText} (url: ${url})`);
  }

  const json = (await res.json()) as GraphQLResponse<T>;

  if (json.errors?.length) {
    const messages = json.errors.map(e => e.message).join('; ');
    throw new Error(`GraphQL errors: ${messages}`);
  }

  return json.data;
}

export function queryWorkersSquid<T>(
  query: string | { toString(): string },
  variables?: Record<string, unknown>,
): Promise<T> {
  return graphqlRequest<T>(getWorkersSquidUrl(), query, variables);
}

export function queryGatewaysSquid<T>(
  query: string | { toString(): string },
  variables?: Record<string, unknown>,
): Promise<T> {
  return graphqlRequest<T>(getGatewaysSquidUrl(), query, variables);
}

export function queryTokenSquid<T>(
  query: string | { toString(): string },
  variables?: Record<string, unknown>,
): Promise<T> {
  return graphqlRequest<T>(getTokenSquidUrl(), query, variables);
}
