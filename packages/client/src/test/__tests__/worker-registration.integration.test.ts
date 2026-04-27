/**
 * Layer-2 integration test for the chain-derived indexer + resolvers.
 *
 * Asserts that a brand-new on-chain `WorkerRegistration.register(...)` call
 * is reflected in the GraphQL `allWorkers` response served by the
 * mini-indexer dispatcher — no synthetic placeholders, no manual fixture
 * hand-tuning. The flow exercised:
 *
 *   1. Read the seeded `allWorkers` baseline (Carol has 2 workers).
 *   2. Approve + register a third worker as Alice via viem.
 *   3. Wait for the indexer to catch up.
 *   4. Re-query `allWorkers`; assert the new worker appears with the
 *      expected ownerId and a numeric id one greater than the baseline.
 */
import bs58 from 'bs58';
import { type Address, createPublicClient, createWalletClient, http, toBytes, toHex } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { arbitrum } from 'viem/chains';
import { describe, expect, inject, it } from 'vitest';

import '../anvil/types';

// Anvil dev-key #0 == Alice. We register a worker FROM Alice (her persona has
// 0 SQD, so we mint here and register in one go to keep the spec
// self-contained).
const ALICE_PK = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';
const ALICE_ADDR: Address = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';

// Build a deterministic test peerId payload — sha2-256 multihash framing.
function testPeerIdBytes(seed: string): `0x${string}` {
  const bytes = new Uint8Array(34);
  bytes[0] = 0x12;
  bytes[1] = 0x20;
  const seedBytes = new TextEncoder().encode(seed.padEnd(32, '\0'));
  bytes.set(seedBytes.slice(0, 32), 2);
  return toHex(bytes);
}

const erc20WriteAbi = [
  {
    type: 'function',
    name: 'approve',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'value', type: 'uint256' },
    ],
    outputs: [{ type: 'bool' }],
  },
  {
    type: 'function',
    name: 'mint',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'value', type: 'uint256' },
    ],
    outputs: [],
  },
] as const;

const workerRegisterAbi = [
  {
    type: 'function',
    name: 'register',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'peerId', type: 'bytes' },
      { name: 'metadata', type: 'string' },
    ],
    outputs: [],
  },
] as const;

interface AllWorkersResponse {
  data: { workers: Array<{ id: string; ownerId: string; peerId: string }> };
}

async function queryAllWorkers(graphqlUrl: string): Promise<AllWorkersResponse['data']> {
  const res = await fetch(graphqlUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ operationName: 'allWorkers', variables: {} }),
  });
  const json = (await res.json()) as AllWorkersResponse;
  return json.data;
}

describe('integration: register a worker on-chain → GraphQL reflects it', () => {
  it('registers a new worker as Alice and observes it via allWorkers', async () => {
    const rpcUrl = inject('rpcUrl');
    const graphqlUrl = inject('graphqlUrl');
    const deployments = inject('deployments');

    const baseline = await queryAllWorkers(graphqlUrl);
    const baselineCount = baseline.workers.length;
    const baselineIds = baseline.workers.map(w => Number(w.id));
    const maxBaselineId = baselineIds.length > 0 ? Math.max(...baselineIds) : 0;

    const account = privateKeyToAccount(ALICE_PK);
    const wallet = createWalletClient({ account, chain: arbitrum, transport: http(rpcUrl) });
    const publicClient = createPublicClient({ chain: arbitrum, transport: http(rpcUrl) });

    // Mint enough SQD for Alice to bond.
    const bond = 100_000n * 10n ** 18n;
    {
      const hash = await wallet.writeContract({
        abi: erc20WriteAbi,
        address: deployments.SQD as Address,
        functionName: 'mint',
        args: [ALICE_ADDR, bond],
      });
      await publicClient.waitForTransactionReceipt({ hash });
    }
    {
      const hash = await wallet.writeContract({
        abi: erc20WriteAbi,
        address: deployments.SQD as Address,
        functionName: 'approve',
        args: [deployments.WORKER_REGISTRATION as Address, bond],
      });
      await publicClient.waitForTransactionReceipt({ hash });
    }

    // Register a worker with a unique test peerId.
    const peerId = testPeerIdBytes(`integration-test-${Date.now()}`);
    {
      const hash = await wallet.writeContract({
        abi: workerRegisterAbi,
        address: deployments.WORKER_REGISTRATION as Address,
        functionName: 'register',
        args: [peerId, '{"name":"Integration test worker"}'],
      });
      await publicClient.waitForTransactionReceipt({ hash });
    }

    // Mine extra blocks so the indexer's tail ingestion has fresh logs to
    // pick up — the indexer polls every 100ms.
    await publicClient.request({
      // biome-ignore lint/suspicious/noExplicitAny: anvil cheatcode
      method: 'anvil_mine' as any,
      // biome-ignore lint/suspicious/noExplicitAny: anvil cheatcode
      params: ['0x2'] as any,
    });

    // Poll until the new worker appears via the mini-indexer.
    const expectedPeerId = bs58.encode(toBytes(peerId));
    let after = baseline;
    const deadline = Date.now() + 5_000;
    while (Date.now() < deadline) {
      after = await queryAllWorkers(graphqlUrl);
      if (after.workers.some(w => w.peerId === expectedPeerId)) break;
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    const newWorker = after.workers.find(w => w.peerId === expectedPeerId);
    expect(newWorker, `worker with peerId ${expectedPeerId} not found`).toBeDefined();
    expect(after.workers.length).toBe(baselineCount + 1);
    expect(newWorker?.ownerId).toBe(ALICE_ADDR.toLowerCase());
    expect(Number(newWorker?.id)).toBe(maxBaselineId + 1);
  });
});
