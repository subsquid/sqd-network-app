import { CONTRACT_ADDRESSES, type ContractAddresses, type NetworkName } from '@subsquid/common';
import type { AppRouter } from '@subsquid/server';
import { createTRPCClient, httpLink } from '@trpc/client';

import { isMockMode } from '../../config';
import { getSubsquidNetwork } from './useSubsquidNetwork.ts';

export type { ContractAddresses };

/**
 * In live mode the address book is the static `CONTRACT_ADDRESSES[network]`
 * map bundled in `@subsquid/common`. In mock mode the running mock-stack
 * deploys to non-canonical addresses, so the client has to ask the server
 * (`contract.list` tRPC) for the active map at boot.
 *
 * `bootstrapContracts()` is called once from `index.tsx` before React
 * renders. It populates the module-level cache so every subsequent
 * `useContracts()` call is synchronous — consumers don't have to think
 * about loading states.
 */
let cachedContracts: ContractAddresses | undefined;

export async function bootstrapContracts(): Promise<ContractAddresses> {
  // Live mode: addresses are static at build time, no fetch needed.
  if (!isMockMode) {
    cachedContracts = CONTRACT_ADDRESSES[getSubsquidNetwork() as NetworkName];
    return cachedContracts;
  }
  // Mock mode: fetch the deployed-by-the-mock-stack address book from tRPC.
  // Use a dedicated client (not the shared one in api/trpc.ts) so this can
  // be called from the boot path before any React Query plumbing is mounted.
  const client = createTRPCClient<AppRouter>({
    links: [httpLink({ url: '/api/trpc' })],
  });
  const remote = await client.contract.list.query();
  cachedContracts = remote as unknown as ContractAddresses;
  return cachedContracts;
}

export function useContracts(): ContractAddresses {
  if (!cachedContracts) {
    throw new Error(
      'useContracts() called before bootstrapContracts() resolved. ' +
        "This shouldn't happen — bootstrapContracts() runs before React renders.",
    );
  }
  return cachedContracts;
}

/**
 * Synchronous accessor for code that runs outside React (e.g. wagmi config
 * factory). Returns `undefined` if bootstrap hasn't finished — caller
 * decides what to do.
 */
export function getContractsSync(): ContractAddresses | undefined {
  return cachedContracts;
}
