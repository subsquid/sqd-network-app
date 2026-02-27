export const softCapAbi = [
  {
    type: 'function',
    name: 'cap',
    inputs: [{ name: 'x', type: 'uint256', internalType: 'UD60x18' }],
    outputs: [{ name: '', type: 'uint256', internalType: 'UD60x18' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    name: 'capedStake',
    inputs: [{ name: 'workerId', type: 'uint256', internalType: 'uint256' }],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'capedStakeAfterDelegation',
    inputs: [
      { name: 'workerId', type: 'uint256', internalType: 'uint256' },
      { name: 'delegationAmount', type: 'int256', internalType: 'int256' },
    ],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
] as const;
