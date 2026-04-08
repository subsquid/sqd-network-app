import { arbitrum, arbitrumSepolia } from 'wagmi/chains';

export enum NetworkName {
  Tethys = 'tethys',
  Mainnet = 'mainnet',
}

function validate(app?: string): NetworkName {
  return app && Object.values(NetworkName).includes(app as NetworkName)
    ? (app as NetworkName)
    : NetworkName.Mainnet;
}

export function getSubsquidNetwork() {
  return validate(process.env.NETWORK);
}

export function getChain(network: NetworkName = getSubsquidNetwork()) {
  return network === NetworkName.Mainnet ? arbitrum : arbitrumSepolia;
}

export function getNetworkName(chainId: number) {
  return chainId === arbitrum.id ? NetworkName.Mainnet : NetworkName.Tethys;
}

/**
 * Whether the portal pool UI should show the slippage selector and pass
 * `minSqdOut` as a second argument to `createPortalPool` / `topUpRewards`.
 * Mainnet uses the single-arg overload; testnets use the two-arg overload.
 */
export function supportsPortalPoolMinSqdOut(): boolean {
  return getSubsquidNetwork() !== NetworkName.Mainnet;
}
