import { mainnet, sepolia } from 'viem/chains';

import { NetworkName, getSubsquidNetwork } from './useSubsquidNetwork.ts';

export function useContracts(): {
  SQD: `0x${string}`;
  ROUTER: `0x${string}`;
  WORKER_REGISTRATION: `0x${string}`;
  STAKING: `0x${string}`;
  REWARD_TREASURY: `0x${string}`;
  REWARD_DISTRIBUTION: `0x${string}`;
  GATEWAY_REGISTRATION: `0x${string}`;
  SOFT_CAP: `0x${string}`;
  SQD_TOKEN: string;
  CHAIN_ID_L1: number;
  MULTICALL: `0x${string}`;
  BUYBACK: `0x${string}`;
  PORTAL_POOL_FACTORY: `0x${string}`;
  USDC: `0x${string}`;
} {
  const network = getSubsquidNetwork();

  switch (network) {
    case NetworkName.Tethys: {
      return {
        SQD: `0x24f9C46d86c064a6FA2a568F918fe62fC6917B3c`,
        WORKER_REGISTRATION: `0xCD8e983F8c4202B0085825Cf21833927D1e2b6Dc`,
        STAKING: `0x347E326b8b4EA27c87d5CA291e708cdEC6d65EB5`,
        REWARD_TREASURY: `0x785136e611E15D532C36502AaBdfE8E35008c7ca`,
        REWARD_DISTRIBUTION: `0x68f9fE3504652360afF430dF198E1Cb7B2dCfD57`,
        GATEWAY_REGISTRATION: `0x8C64d1Fc6dD14f54e5F78dBCa458cbAFb1D9e625`,
        SOFT_CAP: `0x52f31c9c019f840A9C0e74F66ACc95455B254BeA`,
        SQD_TOKEN: 'tSQD',
        ROUTER: '0xD2093610c5d27c201CD47bCF1Df4071610114b64',
        CHAIN_ID_L1: sepolia.id,
        MULTICALL: '0x7eCfBaa8742fDf5756DAC92fbc8b90a19b8815bF',
        BUYBACK: '0xe34189ad45044e93d3af7d93ac520d02651faf72',
        PORTAL_POOL_FACTORY: '0xa6C209a0B3392c50ce3830FbF0d1C619F5794EE6',
        USDC: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
      };
    }
    case NetworkName.Mainnet: {
      return {
        SQD: `0x1337420dED5ADb9980CFc35f8f2B054ea86f8aB1`,
        WORKER_REGISTRATION: `0x36e2b147db67e76ab67a4d07c293670ebefcae4e`,
        STAKING: `0xb31a0d39d2c69ed4b28d96e12cbf52c5f9ac9a51`,
        REWARD_TREASURY: `0x237abf43bc51fd5c50d0d598a1a4c26e56a8a2a0`,
        REWARD_DISTRIBUTION: `0x4de282bD18aE4987B3070F4D5eF8c80756362AEa`,
        GATEWAY_REGISTRATION: `0x56f61A481f2B2ce8be83108A9702b7E5A5F0Eb23`,
        SOFT_CAP: `0x0eb27b1cbba04698dd7ce0f2364584d33a616545`,
        SQD_TOKEN: 'SQD',
        ROUTER: '0x67F56D27dab93eEb07f6372274aCa277F49dA941',
        CHAIN_ID_L1: mainnet.id,
        MULTICALL: '0x7eCfBaa8742fDf5756DAC92fbc8b90a19b8815bF',
        BUYBACK: '0x4efab28e320ef16907930a06e2a5aaadb7425b48',
        PORTAL_POOL_FACTORY: '0x8baf8707861a84e3d978aC067447de9AAd862FAc',
        USDC: '0x210F4A6566522704893F0cE3791ef4b4982f8e48'
      };
    }
  }
}
