import assert from 'node:assert/strict';
import { test } from 'node:test';

import { isSqdOperatedPool, parsePoolMetadata } from '@subsquid/common';

test('pool metadata that is not a JSON object parses to empty metadata', () => {
  for (const value of ['null', '1', '"name"', '[]', 'not json', '', undefined]) {
    const metadata = parsePoolMetadata(value);
    assert.equal(metadata.name, undefined, String(value));
    assert.equal(metadata.description, undefined, String(value));
    assert.equal(metadata.website, undefined, String(value));
  }
});

test('pool metadata keeps only string fields', () => {
  const metadata = parsePoolMetadata('{"name":"sqd-getblock","description":5,"website":null}');
  assert.equal(metadata.name, 'sqd-getblock');
  assert.equal(metadata.description, undefined);
  assert.equal(metadata.website, undefined);
});

test('only allowlisted pools are SQD-operated, in any address case', () => {
  assert.equal(isSqdOperatedPool('mainnet', '0x438c2a47e82cd445524ce5651ae7e6c1dd386d09'), true);
  assert.equal(isSqdOperatedPool('mainnet', '0x89CA93E09EC7355A1D6BD410FE0BB4C9B24542DB'), true);
  assert.equal(isSqdOperatedPool('mainnet', '0x3113CA8FcaeD1709CC1109FDa4A536aBaA866206'), false);
  assert.equal(isSqdOperatedPool('tethys', '0x438c2a47e82cD445524Ce5651AE7E6c1Dd386D09'), false);
});
