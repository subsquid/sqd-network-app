/**
 * Layer-2 anvil round-trip test.
 *
 * Confirms that:
 *   1. Anvil is reachable on the URL provided by `global-setup.ts`.
 *   2. Persona balances seeded by the deploy harness are visible to viem
 *      after `loadAnvilState()`.
 *   3. The deployed MockSQD contract returns Bob's balance via `balanceOf`.
 *
 * This is the proof that the deploy harness state survives the
 * dump-and-load round-trip and that downstream specs can reliably read
 * persona state without re-running the deploy on every test.
 */
import { createPublicClient, erc20Abi, getAddress, http } from 'viem';
import { describe, expect, inject, it } from 'vitest';

import '../anvil/types';

const BOB = getAddress('0x70997970C51812dc3A010C7d01b50e0d17dc79C8');
// Bob is seeded with 200_000 SQD; during the seed flow he then:
//   - delegates 50_000 SQD to Carol's worker 1
//   - deposits 25_000 SQD into Carol's portal pool
// Net on-chain SQD balance after the seed completes: 125_000.
const BOB_SQD_BALANCE_WEI = 125_000n * 10n ** 18n;
// Bob's seeded ETH balance is 10 ETH (anvil_setBalance during deploy).
const BOB_ETH_BALANCE_WEI = 10n * 10n ** 18n;

describe('integration: anvil + mock-stack persona seeding', () => {
  it('reports the seeded ETH balance for Bob (modulo gas spent during seed)', async () => {
    const client = createPublicClient({ transport: http(inject('rpcUrl')) });
    const balance = await client.getBalance({ address: BOB });
    // Bob's seed sends two transactions (approve + deposit) so a small gas
    // amount has been deducted from the 10-ETH starting balance — assert
    // 'within a tenth of an ETH' rather than exact equality.
    expect(balance).toBeLessThanOrEqual(BOB_ETH_BALANCE_WEI);
    expect(balance).toBeGreaterThan(BOB_ETH_BALANCE_WEI - 10n ** 17n);
  });

  it('reports the seeded SQD balance for Bob via the deployed token contract', async () => {
    const deployments = inject('deployments');
    const sqdAddress = deployments.SQD as `0x${string}`;
    expect(sqdAddress).toBeDefined();
    const client = createPublicClient({ transport: http(inject('rpcUrl')) });
    const balance = await client.readContract({
      address: sqdAddress,
      abi: erc20Abi,
      functionName: 'balanceOf',
      args: [BOB],
    });
    expect(balance).toBe(BOB_SQD_BALANCE_WEI);
  });
});
