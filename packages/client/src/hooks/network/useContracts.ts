import { CONTRACT_ADDRESSES, type ContractAddresses, type NetworkName } from '@sqd/common';

import { getSubsquidNetwork } from './useSubsquidNetwork.ts';

export type { ContractAddresses };

export function useContracts(): ContractAddresses {
  return CONTRACT_ADDRESSES[getSubsquidNetwork() as NetworkName];
}
