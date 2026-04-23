export const rewardDistributionAbi = [
  {
    type: 'function',
    name: 'claimable',
    inputs: [
      {
        name: 'who',
        type: 'address',
        internalType: 'address',
      },
    ],
    outputs: [
      {
        name: 'reward',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'claim',
    inputs: [
      {
        name: 'who',
        type: 'address',
        internalType: 'address',
      },
    ],
    outputs: [
      {
        name: 'reward',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
  },
] as const;
