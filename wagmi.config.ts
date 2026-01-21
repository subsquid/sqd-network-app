import { defineConfig } from '@wagmi/cli';
import { react } from '@wagmi/cli/plugins';
import { erc20Abi } from 'viem';

import {
  arbMulticallAbi,
  buyBackAbi,
  gatewayRegistryAbi,
  networkControllerAbi,
  portalPoolAbi,
  portalPoolFactoryAbi,
  portalRegistryAbi,
  rewardTreasuryAbi,
  routerAbi,
  softCapAbi,
  stakingAbi,
  vestingAbi,
  workerRegistryAbi,
} from './abi';

export default defineConfig({
  out: 'src/api/contracts/subsquid.generated.ts',
  contracts: [
    {
      name: 'SQD',
      abi: erc20Abi,
    },
    {
      name: 'Router',
      abi: routerAbi,
    },
    {
      name: 'WorkerRegistry',
      abi: workerRegistryAbi,
    },
    {
      name: 'Staking',
      abi: stakingAbi,
    },
    {
      name: 'Vesting',
      abi: vestingAbi,
    },
    {
      name: 'GatewayRegistry',
      abi: gatewayRegistryAbi,
    },
    {
      name: 'RewardTreasury',
      abi: rewardTreasuryAbi,
    },
    {
      name: 'SoftCap',
      abi: softCapAbi,
    },
    {
      name: 'NetworkController',
      abi: networkControllerAbi,
    },
    {
      name: 'ArbMulticall',
      abi: arbMulticallAbi,
    },
    {
      name: 'BuyBack',
      abi: buyBackAbi,
    },
    {
      name: 'PortalPoolFactory',
      abi: portalPoolFactoryAbi,
    },
    {
      name: 'PortalPool',
      abi: portalPoolAbi,
    },
    {
      name: 'PortalRegistry',
      abi: portalRegistryAbi,
    },
  ],
  plugins: [react({})],
});
