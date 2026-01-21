import { useMemo } from 'react';

import { NetworkName, getSubsquidNetwork } from './useSubsquidNetwork';

export function useExplorer() {
  const network = getSubsquidNetwork();

  const explorerUrl = useMemo(() => {
    return network === NetworkName.Mainnet ? 'https://arbiscan.io' : 'https://sepolia.arbiscan.io';
  }, [network]);

  const getAddressUrl = (address: string) => `${explorerUrl}/address/${address}`;
  const getTxUrl = (txHash: string) => `${explorerUrl}/tx/${txHash}`;
  const getTokenUrl = (address: string) => `${explorerUrl}/token/${address}`;
  const getBlockUrl = (block: number | string) => `${explorerUrl}/block/${block}`;

  return {
    explorerUrl,
    getAddressUrl,
    getTxUrl,
    getTokenUrl,
    getBlockUrl,
  };
}
