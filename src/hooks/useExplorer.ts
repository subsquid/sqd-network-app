import { useAccount } from '@hooks/network/useAccount';
import { NetworkName, getNetworkName } from '@hooks/network/useSubsquidNetwork';

interface ExplorerUrls {
  baseUrl: string;
  getAddressUrl: (address: string) => string;
  getTxUrl: (txHash: string) => string;
}

/**
 * Hook to get the appropriate block explorer URLs based on the current network
 * @returns Explorer URLs for the current network (Arbitrum for mainnet, Arbitrum Sepolia for tethys)
 */
export function useExplorer(): ExplorerUrls {
  const { chain } = useAccount();

  const network = chain?.id ? getNetworkName(chain.id) : NetworkName.Mainnet;

  const baseUrl =
    network === NetworkName.Mainnet ? 'https://arbiscan.io' : 'https://sepolia.arbiscan.io';

  return {
    baseUrl,
    getAddressUrl: (address: string) => `${baseUrl}/address/${address}`,
    getTxUrl: (txHash: string) => `${baseUrl}/tx/${txHash}`,
  };
}
