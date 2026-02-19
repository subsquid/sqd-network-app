export const workerRegistryAbi = [
  {
    type: 'function',
    name: 'bondAmount',
    inputs: [],
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
    name: 'register',
    inputs: [
      {
        name: 'peerId',
        type: 'bytes',
        internalType: 'bytes',
      },
      {
        name: 'metadata',
        type: 'string',
        internalType: 'string',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'updateMetadata',
    inputs: [
      {
        name: 'peerId',
        type: 'bytes',
        internalType: 'bytes',
      },
      {
        name: 'metadata',
        type: 'string',
        internalType: 'string',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    inputs: [
      {
        internalType: 'bytes',
        name: 'peerId',
        type: 'bytes',
      },
    ],
    name: 'deregister',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    type: 'function',
    name: 'withdraw',
    inputs: [
      {
        name: 'peerId',
        type: 'bytes',
        internalType: 'bytes',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'lockPeriod',
    inputs: [],
    outputs: [{ name: '', type: 'uint128', internalType: 'uint128' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getWorker',
    inputs: [{ name: 'workerId', type: 'uint256', internalType: 'uint256' }],
    outputs: [
      {
        name: '',
        type: 'tuple',
        internalType: 'struct WorkerRegistration.Worker',
        components: [
          { name: 'creator', type: 'address', internalType: 'address' },
          { name: 'peerId', type: 'bytes', internalType: 'bytes' },
          { name: 'bond', type: 'uint256', internalType: 'uint256' },
          { name: 'registeredAt', type: 'uint128', internalType: 'uint128' },
          { name: 'deregisteredAt', type: 'uint128', internalType: 'uint128' },
          { name: 'metadata', type: 'string', internalType: 'string' },
        ],
      },
    ],
    stateMutability: 'view',
  },
] as const;
