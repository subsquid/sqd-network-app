export const arbMulticallAbi = [
  {
    inputs: [],
    name: 'getCurrentBlockTimestamp',
    outputs: [{ internalType: 'uint256', name: 'timestamp', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getL1BlockNumber',
    outputs: [{ internalType: 'uint256', name: 'l1BlockNumber', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;
