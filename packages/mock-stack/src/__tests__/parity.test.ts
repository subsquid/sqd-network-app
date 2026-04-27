/**
 * Parity test: every named operation declared in
 * `packages/server/graphql/*.graphql` must resolve through the dispatcher
 * (either via the synthetic fallback or a registered custom resolver).
 *
 * Guards against silent regressions where porting work drops an operation —
 * the legacy `mockGraphqlServer.ts` returned `{}` for unknown operations
 * which caused subtle UI regressions; the parity test makes those visible.
 */
import fs from 'node:fs';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

import { dispatch } from '../indexer/dispatcher';
import { SYNTHETIC_OPERATIONS } from '../indexer/synthetic';

function listGraphqlOperations(): string[] {
  // Resolve relative to the mock-stack package root so the test works no matter
  // where Vitest is invoked from.
  const here = path.dirname(new URL(import.meta.url).pathname);
  const graphqlDir = path.resolve(here, '../../../server/graphql');
  const files = fs
    .readdirSync(graphqlDir)
    .filter(f => f.endsWith('.graphql'))
    .map(f => path.join(graphqlDir, f));

  const ops = new Set<string>();
  for (const file of files) {
    const src = fs.readFileSync(file, 'utf-8');
    const re = /^(?:query|mutation)\s+(\w+)/gm;
    for (const match of src.matchAll(re)) {
      ops.add(match[1]);
    }
  }
  return [...ops].sort();
}

describe('mock-stack dispatcher parity', () => {
  const declared = listGraphqlOperations();

  it('finds the expected operations on disk (sanity check)', () => {
    expect(declared.length).toBeGreaterThanOrEqual(40);
  });

  it('lists every graphql operation in SYNTHETIC_OPERATIONS', () => {
    const declaredSet = new Set(declared);
    const knownSet = new Set<string>(SYNTHETIC_OPERATIONS);
    const missing = [...declaredSet].filter(op => !knownSet.has(op));
    expect(missing, `Missing synthetic resolvers for: ${missing.join(', ')}`).toEqual([]);
  });

  it('returns non-undefined data for every declared operation', async () => {
    for (const op of declared) {
      const data = await dispatch(op, {});
      expect(data, `dispatch("${op}") returned undefined`).toBeDefined();
    }
  });
});
