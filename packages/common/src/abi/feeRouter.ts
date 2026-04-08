export const feeRouterAbi = [
  {
    type: 'function',
    name: 'calculateSplit',
    inputs: [{ name: 'amount', type: 'uint256', internalType: 'uint256' }],
    outputs: [
      { name: 'toProviders', type: 'uint256', internalType: 'uint256' },
      { name: 'toWorkerPool', type: 'uint256', internalType: 'uint256' },
      { name: 'toBurn', type: 'uint256', internalType: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getFeeConfig',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'tuple',
        internalType: 'struct IFeeRouter.FeeConfig',
        components: [
          { name: 'toProvidersBPS', type: 'uint16', internalType: 'uint16' },
          { name: 'toWorkerPoolBPS', type: 'uint16', internalType: 'uint16' },
          { name: 'toBurnBPS', type: 'uint16', internalType: 'uint16' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'routeToBurnWithSlippage',
    inputs: [
      { name: 'rewardToken', type: 'address', internalType: 'address' },
      { name: 'amount', type: 'uint256', internalType: 'uint256' },
      { name: 'minSqdOut', type: 'uint256', internalType: 'uint256' },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    name: 'BuybackExecuted',
    inputs: [
      { name: 'rewardToken', type: 'address', indexed: true, internalType: 'address' },
      { name: 'amountIn', type: 'uint256', indexed: false, internalType: 'uint256' },
      { name: 'sqdBought', type: 'uint256', indexed: false, internalType: 'uint256' },
      { name: 'toWorkerPool', type: 'uint256', indexed: false, internalType: 'uint256' },
      { name: 'toBurn', type: 'uint256', indexed: false, internalType: 'uint256' },
    ],
  },
] as const;
