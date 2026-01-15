export const stakingAbi = [
  {
    type: 'function',
    name: 'getDeposit',
    inputs: [
      { name: 'staker', type: 'address', internalType: 'address' },
      { name: 'worker', type: 'uint256', internalType: 'uint256' },
    ],
    outputs: [
      { name: 'depositAmount', type: 'uint256', internalType: 'uint256' },
      { name: 'withdrawAllowed', type: 'uint256', internalType: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'deposit',
    inputs: [
      {
        name: 'worker',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'amount',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'withdraw',
    inputs: [
      {
        type: 'uint256',
        name: 'worker',
      },
      {
        type: 'uint256',
        name: 'amount',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'claimable',
    inputs: [
      {
        name: 'staker',
        type: 'address',
        internalType: 'address',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'delegated',
    inputs: [
      {
        name: 'worker',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'view',
  },
] as const;
