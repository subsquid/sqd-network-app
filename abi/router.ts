export const routerAbi = [
  {
    type: 'function',
    name: 'networkController',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'address',
        internalType: 'contract INetworkController',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'rewardCalculation',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'address',
        internalType: 'contract IRewardCalculation',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'rewardTreasury',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'address',
        internalType: 'address',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'staking',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'address',
        internalType: 'contract IStaking',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'workerRegistration',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'address',
        internalType: 'contract IWorkerRegistration',
      },
    ],
    stateMutability: 'view',
  },
] as const;
