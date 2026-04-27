/**
 * Tests for the per-squid URL override added to support the real-indexer
 * (`MOCK_REAL_INDEXER=1`) workflow alongside the mini-indexer single-URL
 * mode.
 *
 * Precedence under test:
 *   1. per-squid override (workersSquidUrl/gatewaysSquidUrl/tokenSquidUrl)
 *   2. squidGraphqlUrl (mini-indexer single endpoint)
 *   3. process.env.<NETWORK>_<*>_SQUID_API_URL
 */
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import {
  getGatewaysSquidUrl,
  getTokenSquidUrl,
  getWorkersSquidUrl,
  setRuntimeOverride,
} from './env.js';

const ORIGINAL_ENV = { ...process.env };

beforeEach(() => {
  setRuntimeOverride({});
  for (const key of [
    'MAINNET_WORKERS_SQUID_API_URL',
    'MAINNET_GATEWAYS_SQUID_API_URL',
    'MAINNET_TOKEN_SQUID_API_URL',
    'TETHYS_WORKERS_SQUID_API_URL',
    'TETHYS_GATEWAYS_SQUID_API_URL',
    'TETHYS_TOKEN_SQUID_API_URL',
    'NETWORK',
  ]) {
    delete process.env[key];
  }
});

afterEach(() => {
  setRuntimeOverride({});
  process.env = { ...ORIGINAL_ENV };
});

describe('squid URL precedence', () => {
  it('falls back to env vars when nothing is overridden', () => {
    process.env.MAINNET_WORKERS_SQUID_API_URL = 'https://workers.example';
    process.env.MAINNET_GATEWAYS_SQUID_API_URL = 'https://gateways.example';
    process.env.MAINNET_TOKEN_SQUID_API_URL = 'https://token.example';

    expect(getWorkersSquidUrl()).toBe('https://workers.example');
    expect(getGatewaysSquidUrl()).toBe('https://gateways.example');
    expect(getTokenSquidUrl()).toBe('https://token.example');
  });

  it('mini-indexer mode (single squidGraphqlUrl) maps all three getters', () => {
    setRuntimeOverride({
      network: 'mainnet',
      squidGraphqlUrl: 'http://localhost:4321/graphql',
    });

    expect(getWorkersSquidUrl()).toBe('http://localhost:4321/graphql');
    expect(getGatewaysSquidUrl()).toBe('http://localhost:4321/graphql');
    expect(getTokenSquidUrl()).toBe('http://localhost:4321/graphql');
  });

  it('real-indexer mode (per-squid URLs) routes each getter independently', () => {
    setRuntimeOverride({
      network: 'mainnet',
      workersSquidUrl: 'http://localhost:4351/graphql',
      gatewaysSquidUrl: 'http://localhost:4352/graphql',
      tokenSquidUrl: 'http://localhost:4353/graphql',
    });

    expect(getWorkersSquidUrl()).toBe('http://localhost:4351/graphql');
    expect(getGatewaysSquidUrl()).toBe('http://localhost:4352/graphql');
    expect(getTokenSquidUrl()).toBe('http://localhost:4353/graphql');
  });

  it('per-squid URL wins over squidGraphqlUrl when both are set', () => {
    setRuntimeOverride({
      network: 'mainnet',
      squidGraphqlUrl: 'http://mini',
      workersSquidUrl: 'http://workers',
    });

    expect(getWorkersSquidUrl()).toBe('http://workers');
    // Other getters fall back to squidGraphqlUrl.
    expect(getGatewaysSquidUrl()).toBe('http://mini');
    expect(getTokenSquidUrl()).toBe('http://mini');
  });

  it('per-squid URL wins over env vars', () => {
    process.env.MAINNET_WORKERS_SQUID_API_URL = 'https://prod-workers';
    setRuntimeOverride({
      network: 'mainnet',
      workersSquidUrl: 'http://localhost:4351/graphql',
    });

    expect(getWorkersSquidUrl()).toBe('http://localhost:4351/graphql');
  });
});
