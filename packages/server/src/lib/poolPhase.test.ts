import assert from 'node:assert/strict';
import { test } from 'node:test';

import { getPhase, isInDebt } from './poolPhase.js';

test('never-funded pool is not in debt', () => {
  assert.equal(isInDebt(0n, 0n), false);
  assert.equal(getPhase(1, isInDebt(0n, 0n)), 'active');
});

test('funded pool with balance left is not in debt', () => {
  assert.equal(isInDebt(100n, 40n), false);
  assert.equal(getPhase(1, isInDebt(100n, 40n)), 'active');
});

test('funded pool that ran out is in debt', () => {
  assert.equal(isInDebt(100n, 0n), true);
  assert.equal(getPhase(1, isInDebt(100n, 0n)), 'debt');
});

test('debt only applies to active pools', () => {
  assert.equal(getPhase(0, true), 'collecting');
  assert.equal(getPhase(2, true), 'idle');
  assert.equal(getPhase(4, true), 'closed');
  assert.equal(getPhase(9, false), 'unknown');
});
