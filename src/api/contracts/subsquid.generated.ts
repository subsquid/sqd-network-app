import {
  createUseReadContract,
  createUseWriteContract,
  createUseSimulateContract,
  createUseWatchContractEvent,
} from 'wagmi/codegen'

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ArbMulticall
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const arbMulticallAbi = [
  {
    type: 'function',
    inputs: [],
    name: 'getCurrentBlockTimestamp',
    outputs: [{ name: 'timestamp', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getL1BlockNumber',
    outputs: [
      { name: 'l1BlockNumber', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// BuyBack
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const buyBackAbi = [
  {
    type: 'function',
    inputs: [{ name: 'amount', internalType: 'uint256', type: 'uint256' }],
    name: 'deposit',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'receiver', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'withdraw',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// GatewayRegistry
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const gatewayRegistryAbi = [
  {
    type: 'function',
    inputs: [
      { name: 'peerId', internalType: 'bytes', type: 'bytes' },
      { name: 'metadata', internalType: 'string', type: 'string' },
    ],
    name: 'register',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'peerId', internalType: 'bytes', type: 'bytes' },
      { name: 'metadata', internalType: 'string', type: 'string' },
    ],
    name: 'setMetadata',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
      { name: 'durationBlocks', internalType: 'uint128', type: 'uint128' },
      { name: 'withAutoExtension', internalType: 'bool', type: 'bool' },
    ],
    name: 'stake',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'peerId', internalType: 'bytes', type: 'bytes' }],
    name: 'unregister',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'unstake',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
      { name: 'durationBlocks', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'computationUnitsAmount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'amount', internalType: 'uint256', type: 'uint256' }],
    name: 'addStake',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'disableAutoExtension',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'enableAutoExtension',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'operator', internalType: 'address', type: 'address' }],
    name: 'canUnstake',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
      { name: 'durationBlocks', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'computationUnitsAmount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'operator', internalType: 'address', type: 'address' }],
    name: 'getStake',
    outputs: [
      {
        name: '',
        internalType: 'struct IGatewayRegistry.Stake',
        type: 'tuple',
        components: [
          { name: 'amount', internalType: 'uint256', type: 'uint256' },
          { name: 'lockStart', internalType: 'uint128', type: 'uint128' },
          { name: 'lockEnd', internalType: 'uint128', type: 'uint128' },
          { name: 'duration', internalType: 'uint128', type: 'uint128' },
          { name: 'autoExtension', internalType: 'bool', type: 'bool' },
          { name: 'oldCUs', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'minStake',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// NetworkController
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const networkControllerAbi = [
  {
    type: 'function',
    inputs: [],
    name: 'bondAmount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'minStakeThreshold',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'epochLength',
    outputs: [{ name: '', internalType: 'uint128', type: 'uint128' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'workerEpochLength',
    outputs: [{ name: '', internalType: 'uint128', type: 'uint128' }],
    stateMutability: 'view',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// PortalPool
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const portalPoolAbi = [
  { type: 'constructor', inputs: [], stateMutability: 'nonpayable' },
  {
    type: 'function',
    inputs: [],
    name: 'DEFAULT_ADMIN_ROLE',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'FACTORY_ROLE',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'OPERATOR_ROLE',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'PRECISION',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'checkAndFailPortal',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'token', internalType: 'address', type: 'address' }],
    name: 'claimFees',
    outputs: [{ name: 'claimed', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'claimRewards',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'amount', internalType: 'uint256', type: 'uint256' }],
    name: 'deposit',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'token', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'distributeFees',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'distributionRateScaled',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getActiveStake',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getAllowedPaymentTokens',
    outputs: [{ name: '', internalType: 'address[]', type: 'address[]' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'provider', internalType: 'address', type: 'address' },
      { name: 'token', internalType: 'address', type: 'address' },
    ],
    name: 'getClaimableFees',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'delegator', internalType: 'address', type: 'address' }],
    name: 'getClaimableRewards',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getComputationUnits',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getCurrentRewardBalance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'provider', internalType: 'address', type: 'address' },
      { name: 'ticketId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getExitTicket',
    outputs: [
      {
        name: '',
        internalType: 'struct IPortalPool.ExitTicket',
        type: 'tuple',
        components: [
          { name: 'endPosition', internalType: 'uint256', type: 'uint256' },
          { name: 'amount', internalType: 'uint256', type: 'uint256' },
          { name: 'withdrawn', internalType: 'bool', type: 'bool' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getPeerId',
    outputs: [{ name: '', internalType: 'bytes', type: 'bytes' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getPortalInfo',
    outputs: [
      {
        name: '',
        internalType: 'struct IPortalPool.PortalInfo',
        type: 'tuple',
        components: [
          { name: 'operator', internalType: 'address', type: 'address' },
          { name: 'maxCapacity', internalType: 'uint256', type: 'uint256' },
          { name: 'totalStaked', internalType: 'uint256', type: 'uint256' },
          { name: 'depositDeadline', internalType: 'uint64', type: 'uint64' },
          { name: 'activationTime', internalType: 'uint64', type: 'uint64' },
          {
            name: 'state',
            internalType: 'enum IPortalPool.PortalState',
            type: 'uint8',
          },
          { name: 'paused', internalType: 'bool', type: 'bool' },
          { name: 'firstActivated', internalType: 'bool', type: 'bool' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'provider', internalType: 'address', type: 'address' }],
    name: 'getProviderStake',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'user', internalType: 'address', type: 'address' },
      { name: 'ticketId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getQueueStatus',
    outputs: [
      { name: 'processed', internalType: 'uint256', type: 'uint256' },
      { name: 'userEndPos', internalType: 'uint256', type: 'uint256' },
      { name: 'secondsRemaining', internalType: 'uint256', type: 'uint256' },
      { name: 'ready', internalType: 'bool', type: 'bool' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'role', internalType: 'bytes32', type: 'bytes32' }],
    name: 'getRoleAdmin',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getState',
    outputs: [
      { name: '', internalType: 'enum IPortalPool.PortalState', type: 'uint8' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'provider', internalType: 'address', type: 'address' }],
    name: 'getTicketCount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getTotalProcessed',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32' },
      { name: 'account', internalType: 'address', type: 'address' },
    ],
    name: 'grantRole',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32' },
      { name: 'account', internalType: 'address', type: 'address' },
    ],
    name: 'hasRole',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'params',
        internalType: 'struct IPortalPool.InitParams',
        type: 'tuple',
        components: [
          { name: 'operator', internalType: 'address', type: 'address' },
          { name: 'maxCapacity', internalType: 'uint256', type: 'uint256' },
          { name: 'depositDeadline', internalType: 'uint256', type: 'uint256' },
          { name: 'peerId', internalType: 'bytes', type: 'bytes' },
          { name: 'portalName', internalType: 'string', type: 'string' },
          { name: 'sqd', internalType: 'address', type: 'address' },
          { name: 'usdc', internalType: 'address', type: 'address' },
          { name: 'portalRegistry', internalType: 'address', type: 'address' },
          { name: 'feeRouter', internalType: 'address', type: 'address' },
          {
            name: 'networkController',
            internalType: 'address',
            type: 'address',
          },
          {
            name: 'distributionRatePerSecond',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'maxStakePerWallet',
            internalType: 'uint256',
            type: 'uint256',
          },
          { name: 'metadata', internalType: 'string', type: 'string' },
        ],
      },
    ],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'lastDistributionTime',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'lastRewardBalanceScaled',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'lastRewardTimestamp',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'lptToken',
    outputs: [
      { name: '', internalType: 'contract LiquidPortalToken', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'maxStakePerWallet',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'provider', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'onAllocationReduced',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'onLPTTransfer',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'pause',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'paused',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32' },
      { name: 'callerConfirmation', internalType: 'address', type: 'address' },
    ],
    name: 'renounceRole',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'amount', internalType: 'uint256', type: 'uint256' }],
    name: 'requestExit',
    outputs: [{ name: 'ticketId', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32' },
      { name: 'account', internalType: 'address', type: 'address' },
    ],
    name: 'revokeRole',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'newRatePerSecond', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'setDistributionRate',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'interfaceId', internalType: 'bytes4', type: 'bytes4' }],
    name: 'supportsInterface',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'amount', internalType: 'uint256', type: 'uint256' }],
    name: 'topUpRewards',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'totalFeesDistributed',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'unpause',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'ticketId', internalType: 'uint256', type: 'uint256' }],
    name: 'withdrawExit',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'withdrawFromFailed',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'provider',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'AllocationReduced',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'oldRate',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'newRate',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'DistributionRateChanged',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'provider',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'ExitClaimed',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'provider',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'endPosition',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'ExitRequested',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'provider',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'token',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'FeesClaimed',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'token',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'totalAmount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'toProviders',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'toWorkers',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'toBurn',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'FeesDistributed',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'version',
        internalType: 'uint64',
        type: 'uint64',
        indexed: false,
      },
    ],
    name: 'Initialized',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'account',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'Paused',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'delegator',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'RewardsClaimed',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'operator',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'newBalanceScaled',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'RewardsToppedUp',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32', indexed: true },
      {
        name: 'previousAdminRole',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
      {
        name: 'newAdminRole',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
    ],
    name: 'RoleAdminChanged',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32', indexed: true },
      {
        name: 'account',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'sender',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'RoleGranted',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32', indexed: true },
      {
        name: 'account',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'sender',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'RoleRevoked',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'StakeTransferred',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'provider',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'newTotal',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Staked',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'oldState',
        internalType: 'enum IPortalPool.PortalState',
        type: 'uint8',
        indexed: false,
      },
      {
        name: 'newState',
        internalType: 'enum IPortalPool.PortalState',
        type: 'uint8',
        indexed: false,
      },
    ],
    name: 'StateChanged',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'account',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'Unpaused',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'provider',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Withdrawn',
  },
  { type: 'error', inputs: [], name: 'AccessControlBadConfirmation' },
  {
    type: 'error',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'neededRole', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'AccessControlUnauthorizedAccount',
  },
  { type: 'error', inputs: [], name: 'AlreadyWithdrawn' },
  { type: 'error', inputs: [], name: 'BelowMinimum' },
  { type: 'error', inputs: [], name: 'CapacityExceeded' },
  { type: 'error', inputs: [], name: 'DeadlineNotPassed' },
  { type: 'error', inputs: [], name: 'EnforcedPause' },
  { type: 'error', inputs: [], name: 'ExceedsWalletLimit' },
  { type: 'error', inputs: [], name: 'ExpectedPause' },
  { type: 'error', inputs: [], name: 'InsufficientStake' },
  { type: 'error', inputs: [], name: 'InsufficientTransferableStake' },
  { type: 'error', inputs: [], name: 'InvalidAddress' },
  { type: 'error', inputs: [], name: 'InvalidAmount' },
  { type: 'error', inputs: [], name: 'InvalidInitialization' },
  { type: 'error', inputs: [], name: 'InvalidState' },
  { type: 'error', inputs: [], name: 'NoActiveExitRequest' },
  { type: 'error', inputs: [], name: 'NoStakeToWithdraw' },
  { type: 'error', inputs: [], name: 'NotInitializing' },
  { type: 'error', inputs: [], name: 'NotLPTToken' },
  { type: 'error', inputs: [], name: 'NotOperator' },
  { type: 'error', inputs: [], name: 'NotPortalRegistry' },
  { type: 'error', inputs: [], name: 'NothingToClaim' },
  { type: 'error', inputs: [], name: 'PortalNotFailed' },
  { type: 'error', inputs: [], name: 'ReentrancyGuardReentrantCall' },
  {
    type: 'error',
    inputs: [{ name: 'token', internalType: 'address', type: 'address' }],
    name: 'SafeERC20FailedOperation',
  },
  { type: 'error', inputs: [], name: 'StillInQueue' },
  { type: 'error', inputs: [], name: 'TokenNotAllowed' },
  { type: 'error', inputs: [], name: 'UseWithdrawFromFailed' },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// PortalPoolFactory
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const portalPoolFactoryAbi = [
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    name: 'allPortals',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'collectionDeadlineSeconds',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'params',
        internalType: 'struct IPortalFactory.CreatePortalParams',
        type: 'tuple',
        components: [
          { name: 'operator', internalType: 'address', type: 'address' },
          { name: 'capacity', internalType: 'uint256', type: 'uint256' },
          { name: 'peerId', internalType: 'bytes', type: 'bytes' },
          { name: 'portalName', internalType: 'string', type: 'string' },
          {
            name: 'distributionRatePerSecond',
            internalType: 'uint256',
            type: 'uint256',
          },
          { name: 'metadata', internalType: 'string', type: 'string' },
        ],
      },
    ],
    name: 'createPortalPool',
    outputs: [{ name: 'portal', internalType: 'address', type: 'address' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'defaultMaxStakePerWallet',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'exitUnlockRatePerSecond',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'feeRouter',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getAllowedPaymentTokens',
    outputs: [{ name: '', internalType: 'address[]', type: 'address[]' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'operator', internalType: 'address', type: 'address' }],
    name: 'getOperatorPortals',
    outputs: [{ name: '', internalType: 'address[]', type: 'address[]' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getPortalCount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'maxPoolCapacity',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'operatorPortals',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    name: 'paymentTokensList',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'portalCount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// PortalRegistry
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const portalRegistryAbi = [
  {
    type: 'constructor',
    inputs: [
      { name: '_sqd', internalType: 'address', type: 'address' },
      { name: '_networkController', internalType: 'address', type: 'address' },
      { name: '_minStake', internalType: 'uint256', type: 'uint256' },
      { name: '_mana', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'DEFAULT_ADMIN_ROLE',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'PAUSER_ROLE',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'SQD',
    outputs: [{ name: '', internalType: 'contract IERC20', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'activatePortalPool',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'portalAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getComputationUnits',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'operator', internalType: 'address', type: 'address' }],
    name: 'getDirectPortalId',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'portalAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getMetadata',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'portalAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getPortal',
    outputs: [
      {
        name: '',
        internalType: 'struct IPortalRegistry.Portal',
        type: 'tuple',
        components: [
          { name: 'peerId', internalType: 'bytes', type: 'bytes' },
          { name: 'portalAddress', internalType: 'address', type: 'address' },
          { name: 'operator', internalType: 'address', type: 'address' },
          { name: 'totalStaked', internalType: 'uint256', type: 'uint256' },
          { name: 'registeredAt', internalType: 'uint256', type: 'uint256' },
          { name: 'active', internalType: 'bool', type: 'bool' },
          {
            name: 'portalType',
            internalType: 'enum IPortalRegistry.PortalType',
            type: 'uint8',
          },
          { name: 'metadata', internalType: 'string', type: 'string' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'role', internalType: 'bytes32', type: 'bytes32' }],
    name: 'getRoleAdmin',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32' },
      { name: 'account', internalType: 'address', type: 'address' },
    ],
    name: 'grantRole',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32' },
      { name: 'account', internalType: 'address', type: 'address' },
    ],
    name: 'hasRole',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'provider', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'immediateUnlock',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'portalAddress', internalType: 'address', type: 'address' },
    ],
    name: 'isDirectPortal',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'isPortal',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'mana',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'minStake',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'networkController',
    outputs: [
      {
        name: '',
        internalType: 'contract INetworkController',
        type: 'address',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'operatorToDirectPortal',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'pause',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'paused',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    name: 'peerIdToPortal',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'portals',
    outputs: [
      { name: 'peerId', internalType: 'bytes', type: 'bytes' },
      { name: 'portalAddress', internalType: 'address', type: 'address' },
      { name: 'operator', internalType: 'address', type: 'address' },
      { name: 'totalStaked', internalType: 'uint256', type: 'uint256' },
      { name: 'registeredAt', internalType: 'uint256', type: 'uint256' },
      { name: 'active', internalType: 'bool', type: 'bool' },
      {
        name: 'portalType',
        internalType: 'enum IPortalRegistry.PortalType',
        type: 'uint8',
      },
      { name: 'metadata', internalType: 'string', type: 'string' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'address', type: 'address' },
    ],
    name: 'providerAllocations',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'peerId', internalType: 'bytes', type: 'bytes' },
      { name: 'metadata', internalType: 'string', type: 'string' },
    ],
    name: 'registerDirectPortal',
    outputs: [{ name: 'portalId', internalType: 'address', type: 'address' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'peerId', internalType: 'bytes', type: 'bytes' },
      { name: 'portalAddress', internalType: 'address', type: 'address' },
      { name: 'operator', internalType: 'address', type: 'address' },
      { name: 'metadata', internalType: 'string', type: 'string' },
    ],
    name: 'registerPortalPool',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32' },
      { name: 'callerConfirmation', internalType: 'address', type: 'address' },
    ],
    name: 'renounceRole',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32' },
      { name: 'account', internalType: 'address', type: 'address' },
    ],
    name: 'revokeRole',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_mana', internalType: 'uint256', type: 'uint256' }],
    name: 'setMana',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'portalAddress', internalType: 'address', type: 'address' },
      { name: 'metadata', internalType: 'string', type: 'string' },
    ],
    name: 'setMetadata',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_minStake', internalType: 'uint256', type: 'uint256' }],
    name: 'setMinStake',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'portal', internalType: 'address', type: 'address' },
      { name: 'status', internalType: 'bool', type: 'bool' },
    ],
    name: 'setPortalStatus',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'portalAddress', internalType: 'address', type: 'address' },
      { name: 'provider', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'stake',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'amount', internalType: 'uint256', type: 'uint256' }],
    name: 'stakePoolFunds',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'amount', internalType: 'uint256', type: 'uint256' }],
    name: 'stakeToDirectPortal',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'interfaceId', internalType: 'bytes4', type: 'bytes4' }],
    name: 'supportsInterface',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'unpause',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'amount', internalType: 'uint256', type: 'uint256' }],
    name: 'unstakeFromDirectPortal',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'provider', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'withdrawFailedPortal',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'oldValue',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'newValue',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'ManaUpdated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'portal',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'metadata',
        internalType: 'string',
        type: 'string',
        indexed: false,
      },
    ],
    name: 'MetadataChanged',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'oldValue',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'newValue',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'MinStakeUpdated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'account',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'Paused',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'portal',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'PortalActivated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'portal',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'PortalDeactivated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'portal',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      { name: 'peerId', internalType: 'bytes', type: 'bytes', indexed: false },
      {
        name: 'operator',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'portalType',
        internalType: 'enum IPortalRegistry.PortalType',
        type: 'uint8',
        indexed: false,
      },
    ],
    name: 'PortalRegistered',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'portal',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      { name: 'status', internalType: 'bool', type: 'bool', indexed: false },
    ],
    name: 'PortalStatusChanged',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32', indexed: true },
      {
        name: 'previousAdminRole',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
      {
        name: 'newAdminRole',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
    ],
    name: 'RoleAdminChanged',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32', indexed: true },
      {
        name: 'account',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'sender',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'RoleGranted',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32', indexed: true },
      {
        name: 'account',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'sender',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'RoleRevoked',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'portal',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'provider',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Staked',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'account',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'Unpaused',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'portal',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'provider',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Unstaked',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'provider',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Withdrawn',
  },
  { type: 'error', inputs: [], name: 'AccessControlBadConfirmation' },
  {
    type: 'error',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'neededRole', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'AccessControlUnauthorizedAccount',
  },
  { type: 'error', inputs: [], name: 'AlreadyHasDirectPortal' },
  { type: 'error', inputs: [], name: 'EnforcedPause' },
  { type: 'error', inputs: [], name: 'ExpectedPause' },
  { type: 'error', inputs: [], name: 'InsufficientAllocation' },
  { type: 'error', inputs: [], name: 'InvalidAddress' },
  { type: 'error', inputs: [], name: 'InvalidAmount' },
  { type: 'error', inputs: [], name: 'InvalidPeerId' },
  { type: 'error', inputs: [], name: 'NoDirectPortal' },
  { type: 'error', inputs: [], name: 'NotOperator' },
  { type: 'error', inputs: [], name: 'OnlyPoolPortal' },
  { type: 'error', inputs: [], name: 'OnlyPortal' },
  { type: 'error', inputs: [], name: 'PeerIdInUse' },
  { type: 'error', inputs: [], name: 'PortalAlreadyRegistered' },
  { type: 'error', inputs: [], name: 'PortalNotRegistered' },
  {
    type: 'error',
    inputs: [{ name: 'token', internalType: 'address', type: 'address' }],
    name: 'SafeERC20FailedOperation',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// RewardTreasury
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const rewardTreasuryAbi = [
  {
    type: 'function',
    inputs: [
      {
        name: 'rewardDistribution',
        internalType: 'contract IRewardsDistribution',
        type: 'address',
      },
      { name: 'receiver', internalType: 'address', type: 'address' },
    ],
    name: 'claimFor',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Router
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const routerAbi = [
  {
    type: 'function',
    inputs: [],
    name: 'networkController',
    outputs: [
      {
        name: '',
        internalType: 'contract INetworkController',
        type: 'address',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'rewardCalculation',
    outputs: [
      {
        name: '',
        internalType: 'contract IRewardCalculation',
        type: 'address',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'rewardTreasury',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'staking',
    outputs: [{ name: '', internalType: 'contract IStaking', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'workerRegistration',
    outputs: [
      {
        name: '',
        internalType: 'contract IWorkerRegistration',
        type: 'address',
      },
    ],
    stateMutability: 'view',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// SQD
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const sqdAbi = [
  {
    type: 'event',
    inputs: [
      { name: 'owner', type: 'address', indexed: true },
      { name: 'spender', type: 'address', indexed: true },
      { name: 'value', type: 'uint256', indexed: false },
    ],
    name: 'Approval',
  },
  {
    type: 'event',
    inputs: [
      { name: 'from', type: 'address', indexed: true },
      { name: 'to', type: 'address', indexed: true },
      { name: 'value', type: 'uint256', indexed: false },
    ],
    name: 'Transfer',
  },
  {
    type: 'function',
    inputs: [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' },
    ],
    name: 'allowance',
    outputs: [{ type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'account', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'decimals',
    outputs: [{ type: 'uint8' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'name',
    outputs: [{ type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'symbol',
    outputs: [{ type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'totalSupply',
    outputs: [{ type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'recipient', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'sender', type: 'address' },
      { name: 'recipient', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    name: 'transferFrom',
    outputs: [{ type: 'bool' }],
    stateMutability: 'nonpayable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// SoftCap
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const softCapAbi = [
  {
    type: 'function',
    inputs: [{ name: 'x', internalType: 'UD60x18', type: 'uint256' }],
    name: 'cap',
    outputs: [{ name: '', internalType: 'UD60x18', type: 'uint256' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [{ name: 'workerId', internalType: 'uint256', type: 'uint256' }],
    name: 'capedStake',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'workerId', internalType: 'uint256', type: 'uint256' },
      { name: 'delegationAmount', internalType: 'int256', type: 'int256' },
    ],
    name: 'capedStakeAfterDelegation',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Staking
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const stakingAbi = [
  {
    type: 'function',
    inputs: [
      { name: 'staker', internalType: 'address', type: 'address' },
      { name: 'worker', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getDeposit',
    outputs: [
      { name: 'depositAmount', internalType: 'uint256', type: 'uint256' },
      { name: 'withdrawAllowed', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'worker', internalType: 'uint256', type: 'uint256' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'deposit',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'worker', type: 'uint256' },
      { name: 'amount', type: 'uint256' },
    ],
    name: 'withdraw',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'staker', internalType: 'address', type: 'address' }],
    name: 'claimable',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'worker', internalType: 'uint256', type: 'uint256' }],
    name: 'delegated',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Vesting
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const vestingAbi = [
  {
    type: 'function',
    inputs: [],
    name: 'depositedIntoProtocol',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'duration',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'end',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'execute',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
      { name: 'requiredApprove', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'execute',
    outputs: [{ name: '', internalType: 'bytes', type: 'bytes' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'expectedTotalAmount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'immediateReleaseBIP',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'token', internalType: 'address', type: 'address' }],
    name: 'releasable',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'releasable',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'token', internalType: 'address', type: 'address' }],
    name: 'release',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'token', internalType: 'address', type: 'address' }],
    name: 'released',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'start',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'token', internalType: 'address', type: 'address' },
      { name: 'timestamp', internalType: 'uint64', type: 'uint64' },
    ],
    name: 'vestedAmount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// WorkerRegistry
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const workerRegistryAbi = [
  {
    type: 'function',
    inputs: [],
    name: 'bondAmount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'peerId', internalType: 'bytes', type: 'bytes' },
      { name: 'metadata', internalType: 'string', type: 'string' },
    ],
    name: 'register',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'peerId', internalType: 'bytes', type: 'bytes' },
      { name: 'metadata', internalType: 'string', type: 'string' },
    ],
    name: 'updateMetadata',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'peerId', internalType: 'bytes', type: 'bytes' }],
    name: 'deregister',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'peerId', internalType: 'bytes', type: 'bytes' }],
    name: 'withdraw',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'lockPeriod',
    outputs: [{ name: '', internalType: 'uint128', type: 'uint128' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'workerId', internalType: 'uint256', type: 'uint256' }],
    name: 'getWorker',
    outputs: [
      {
        name: '',
        internalType: 'struct WorkerRegistration.Worker',
        type: 'tuple',
        components: [
          { name: 'creator', internalType: 'address', type: 'address' },
          { name: 'peerId', internalType: 'bytes', type: 'bytes' },
          { name: 'bond', internalType: 'uint256', type: 'uint256' },
          { name: 'registeredAt', internalType: 'uint128', type: 'uint128' },
          { name: 'deregisteredAt', internalType: 'uint128', type: 'uint128' },
          { name: 'metadata', internalType: 'string', type: 'string' },
        ],
      },
    ],
    stateMutability: 'view',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// React
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link arbMulticallAbi}__
 */
export const useReadArbMulticall = /*#__PURE__*/ createUseReadContract({
  abi: arbMulticallAbi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link arbMulticallAbi}__ and `functionName` set to `"getCurrentBlockTimestamp"`
 */
export const useReadArbMulticallGetCurrentBlockTimestamp =
  /*#__PURE__*/ createUseReadContract({
    abi: arbMulticallAbi,
    functionName: 'getCurrentBlockTimestamp',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link arbMulticallAbi}__ and `functionName` set to `"getL1BlockNumber"`
 */
export const useReadArbMulticallGetL1BlockNumber =
  /*#__PURE__*/ createUseReadContract({
    abi: arbMulticallAbi,
    functionName: 'getL1BlockNumber',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link buyBackAbi}__
 */
export const useWriteBuyBack = /*#__PURE__*/ createUseWriteContract({
  abi: buyBackAbi,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link buyBackAbi}__ and `functionName` set to `"deposit"`
 */
export const useWriteBuyBackDeposit = /*#__PURE__*/ createUseWriteContract({
  abi: buyBackAbi,
  functionName: 'deposit',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link buyBackAbi}__ and `functionName` set to `"withdraw"`
 */
export const useWriteBuyBackWithdraw = /*#__PURE__*/ createUseWriteContract({
  abi: buyBackAbi,
  functionName: 'withdraw',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link buyBackAbi}__
 */
export const useSimulateBuyBack = /*#__PURE__*/ createUseSimulateContract({
  abi: buyBackAbi,
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link buyBackAbi}__ and `functionName` set to `"deposit"`
 */
export const useSimulateBuyBackDeposit =
  /*#__PURE__*/ createUseSimulateContract({
    abi: buyBackAbi,
    functionName: 'deposit',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link buyBackAbi}__ and `functionName` set to `"withdraw"`
 */
export const useSimulateBuyBackWithdraw =
  /*#__PURE__*/ createUseSimulateContract({
    abi: buyBackAbi,
    functionName: 'withdraw',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link gatewayRegistryAbi}__
 */
export const useReadGatewayRegistry = /*#__PURE__*/ createUseReadContract({
  abi: gatewayRegistryAbi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link gatewayRegistryAbi}__ and `functionName` set to `"computationUnitsAmount"`
 */
export const useReadGatewayRegistryComputationUnitsAmount =
  /*#__PURE__*/ createUseReadContract({
    abi: gatewayRegistryAbi,
    functionName: 'computationUnitsAmount',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link gatewayRegistryAbi}__ and `functionName` set to `"canUnstake"`
 */
export const useReadGatewayRegistryCanUnstake =
  /*#__PURE__*/ createUseReadContract({
    abi: gatewayRegistryAbi,
    functionName: 'canUnstake',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link gatewayRegistryAbi}__ and `functionName` set to `"getStake"`
 */
export const useReadGatewayRegistryGetStake =
  /*#__PURE__*/ createUseReadContract({
    abi: gatewayRegistryAbi,
    functionName: 'getStake',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link gatewayRegistryAbi}__ and `functionName` set to `"minStake"`
 */
export const useReadGatewayRegistryMinStake =
  /*#__PURE__*/ createUseReadContract({
    abi: gatewayRegistryAbi,
    functionName: 'minStake',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link gatewayRegistryAbi}__
 */
export const useWriteGatewayRegistry = /*#__PURE__*/ createUseWriteContract({
  abi: gatewayRegistryAbi,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link gatewayRegistryAbi}__ and `functionName` set to `"register"`
 */
export const useWriteGatewayRegistryRegister =
  /*#__PURE__*/ createUseWriteContract({
    abi: gatewayRegistryAbi,
    functionName: 'register',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link gatewayRegistryAbi}__ and `functionName` set to `"setMetadata"`
 */
export const useWriteGatewayRegistrySetMetadata =
  /*#__PURE__*/ createUseWriteContract({
    abi: gatewayRegistryAbi,
    functionName: 'setMetadata',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link gatewayRegistryAbi}__ and `functionName` set to `"stake"`
 */
export const useWriteGatewayRegistryStake =
  /*#__PURE__*/ createUseWriteContract({
    abi: gatewayRegistryAbi,
    functionName: 'stake',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link gatewayRegistryAbi}__ and `functionName` set to `"unregister"`
 */
export const useWriteGatewayRegistryUnregister =
  /*#__PURE__*/ createUseWriteContract({
    abi: gatewayRegistryAbi,
    functionName: 'unregister',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link gatewayRegistryAbi}__ and `functionName` set to `"unstake"`
 */
export const useWriteGatewayRegistryUnstake =
  /*#__PURE__*/ createUseWriteContract({
    abi: gatewayRegistryAbi,
    functionName: 'unstake',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link gatewayRegistryAbi}__ and `functionName` set to `"addStake"`
 */
export const useWriteGatewayRegistryAddStake =
  /*#__PURE__*/ createUseWriteContract({
    abi: gatewayRegistryAbi,
    functionName: 'addStake',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link gatewayRegistryAbi}__ and `functionName` set to `"disableAutoExtension"`
 */
export const useWriteGatewayRegistryDisableAutoExtension =
  /*#__PURE__*/ createUseWriteContract({
    abi: gatewayRegistryAbi,
    functionName: 'disableAutoExtension',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link gatewayRegistryAbi}__ and `functionName` set to `"enableAutoExtension"`
 */
export const useWriteGatewayRegistryEnableAutoExtension =
  /*#__PURE__*/ createUseWriteContract({
    abi: gatewayRegistryAbi,
    functionName: 'enableAutoExtension',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link gatewayRegistryAbi}__
 */
export const useSimulateGatewayRegistry =
  /*#__PURE__*/ createUseSimulateContract({ abi: gatewayRegistryAbi })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link gatewayRegistryAbi}__ and `functionName` set to `"register"`
 */
export const useSimulateGatewayRegistryRegister =
  /*#__PURE__*/ createUseSimulateContract({
    abi: gatewayRegistryAbi,
    functionName: 'register',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link gatewayRegistryAbi}__ and `functionName` set to `"setMetadata"`
 */
export const useSimulateGatewayRegistrySetMetadata =
  /*#__PURE__*/ createUseSimulateContract({
    abi: gatewayRegistryAbi,
    functionName: 'setMetadata',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link gatewayRegistryAbi}__ and `functionName` set to `"stake"`
 */
export const useSimulateGatewayRegistryStake =
  /*#__PURE__*/ createUseSimulateContract({
    abi: gatewayRegistryAbi,
    functionName: 'stake',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link gatewayRegistryAbi}__ and `functionName` set to `"unregister"`
 */
export const useSimulateGatewayRegistryUnregister =
  /*#__PURE__*/ createUseSimulateContract({
    abi: gatewayRegistryAbi,
    functionName: 'unregister',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link gatewayRegistryAbi}__ and `functionName` set to `"unstake"`
 */
export const useSimulateGatewayRegistryUnstake =
  /*#__PURE__*/ createUseSimulateContract({
    abi: gatewayRegistryAbi,
    functionName: 'unstake',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link gatewayRegistryAbi}__ and `functionName` set to `"addStake"`
 */
export const useSimulateGatewayRegistryAddStake =
  /*#__PURE__*/ createUseSimulateContract({
    abi: gatewayRegistryAbi,
    functionName: 'addStake',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link gatewayRegistryAbi}__ and `functionName` set to `"disableAutoExtension"`
 */
export const useSimulateGatewayRegistryDisableAutoExtension =
  /*#__PURE__*/ createUseSimulateContract({
    abi: gatewayRegistryAbi,
    functionName: 'disableAutoExtension',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link gatewayRegistryAbi}__ and `functionName` set to `"enableAutoExtension"`
 */
export const useSimulateGatewayRegistryEnableAutoExtension =
  /*#__PURE__*/ createUseSimulateContract({
    abi: gatewayRegistryAbi,
    functionName: 'enableAutoExtension',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link networkControllerAbi}__
 */
export const useReadNetworkController = /*#__PURE__*/ createUseReadContract({
  abi: networkControllerAbi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link networkControllerAbi}__ and `functionName` set to `"bondAmount"`
 */
export const useReadNetworkControllerBondAmount =
  /*#__PURE__*/ createUseReadContract({
    abi: networkControllerAbi,
    functionName: 'bondAmount',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link networkControllerAbi}__ and `functionName` set to `"minStakeThreshold"`
 */
export const useReadNetworkControllerMinStakeThreshold =
  /*#__PURE__*/ createUseReadContract({
    abi: networkControllerAbi,
    functionName: 'minStakeThreshold',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link networkControllerAbi}__ and `functionName` set to `"epochLength"`
 */
export const useReadNetworkControllerEpochLength =
  /*#__PURE__*/ createUseReadContract({
    abi: networkControllerAbi,
    functionName: 'epochLength',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link networkControllerAbi}__ and `functionName` set to `"workerEpochLength"`
 */
export const useReadNetworkControllerWorkerEpochLength =
  /*#__PURE__*/ createUseReadContract({
    abi: networkControllerAbi,
    functionName: 'workerEpochLength',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link portalPoolAbi}__
 */
export const useReadPortalPool = /*#__PURE__*/ createUseReadContract({
  abi: portalPoolAbi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link portalPoolAbi}__ and `functionName` set to `"DEFAULT_ADMIN_ROLE"`
 */
export const useReadPortalPoolDefaultAdminRole =
  /*#__PURE__*/ createUseReadContract({
    abi: portalPoolAbi,
    functionName: 'DEFAULT_ADMIN_ROLE',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link portalPoolAbi}__ and `functionName` set to `"FACTORY_ROLE"`
 */
export const useReadPortalPoolFactoryRole = /*#__PURE__*/ createUseReadContract(
  { abi: portalPoolAbi, functionName: 'FACTORY_ROLE' },
)

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link portalPoolAbi}__ and `functionName` set to `"OPERATOR_ROLE"`
 */
export const useReadPortalPoolOperatorRole =
  /*#__PURE__*/ createUseReadContract({
    abi: portalPoolAbi,
    functionName: 'OPERATOR_ROLE',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link portalPoolAbi}__ and `functionName` set to `"PRECISION"`
 */
export const useReadPortalPoolPrecision = /*#__PURE__*/ createUseReadContract({
  abi: portalPoolAbi,
  functionName: 'PRECISION',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link portalPoolAbi}__ and `functionName` set to `"distributionRateScaled"`
 */
export const useReadPortalPoolDistributionRateScaled =
  /*#__PURE__*/ createUseReadContract({
    abi: portalPoolAbi,
    functionName: 'distributionRateScaled',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link portalPoolAbi}__ and `functionName` set to `"getActiveStake"`
 */
export const useReadPortalPoolGetActiveStake =
  /*#__PURE__*/ createUseReadContract({
    abi: portalPoolAbi,
    functionName: 'getActiveStake',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link portalPoolAbi}__ and `functionName` set to `"getAllowedPaymentTokens"`
 */
export const useReadPortalPoolGetAllowedPaymentTokens =
  /*#__PURE__*/ createUseReadContract({
    abi: portalPoolAbi,
    functionName: 'getAllowedPaymentTokens',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link portalPoolAbi}__ and `functionName` set to `"getClaimableFees"`
 */
export const useReadPortalPoolGetClaimableFees =
  /*#__PURE__*/ createUseReadContract({
    abi: portalPoolAbi,
    functionName: 'getClaimableFees',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link portalPoolAbi}__ and `functionName` set to `"getClaimableRewards"`
 */
export const useReadPortalPoolGetClaimableRewards =
  /*#__PURE__*/ createUseReadContract({
    abi: portalPoolAbi,
    functionName: 'getClaimableRewards',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link portalPoolAbi}__ and `functionName` set to `"getComputationUnits"`
 */
export const useReadPortalPoolGetComputationUnits =
  /*#__PURE__*/ createUseReadContract({
    abi: portalPoolAbi,
    functionName: 'getComputationUnits',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link portalPoolAbi}__ and `functionName` set to `"getCurrentRewardBalance"`
 */
export const useReadPortalPoolGetCurrentRewardBalance =
  /*#__PURE__*/ createUseReadContract({
    abi: portalPoolAbi,
    functionName: 'getCurrentRewardBalance',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link portalPoolAbi}__ and `functionName` set to `"getExitTicket"`
 */
export const useReadPortalPoolGetExitTicket =
  /*#__PURE__*/ createUseReadContract({
    abi: portalPoolAbi,
    functionName: 'getExitTicket',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link portalPoolAbi}__ and `functionName` set to `"getPeerId"`
 */
export const useReadPortalPoolGetPeerId = /*#__PURE__*/ createUseReadContract({
  abi: portalPoolAbi,
  functionName: 'getPeerId',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link portalPoolAbi}__ and `functionName` set to `"getPortalInfo"`
 */
export const useReadPortalPoolGetPortalInfo =
  /*#__PURE__*/ createUseReadContract({
    abi: portalPoolAbi,
    functionName: 'getPortalInfo',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link portalPoolAbi}__ and `functionName` set to `"getProviderStake"`
 */
export const useReadPortalPoolGetProviderStake =
  /*#__PURE__*/ createUseReadContract({
    abi: portalPoolAbi,
    functionName: 'getProviderStake',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link portalPoolAbi}__ and `functionName` set to `"getQueueStatus"`
 */
export const useReadPortalPoolGetQueueStatus =
  /*#__PURE__*/ createUseReadContract({
    abi: portalPoolAbi,
    functionName: 'getQueueStatus',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link portalPoolAbi}__ and `functionName` set to `"getRoleAdmin"`
 */
export const useReadPortalPoolGetRoleAdmin =
  /*#__PURE__*/ createUseReadContract({
    abi: portalPoolAbi,
    functionName: 'getRoleAdmin',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link portalPoolAbi}__ and `functionName` set to `"getState"`
 */
export const useReadPortalPoolGetState = /*#__PURE__*/ createUseReadContract({
  abi: portalPoolAbi,
  functionName: 'getState',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link portalPoolAbi}__ and `functionName` set to `"getTicketCount"`
 */
export const useReadPortalPoolGetTicketCount =
  /*#__PURE__*/ createUseReadContract({
    abi: portalPoolAbi,
    functionName: 'getTicketCount',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link portalPoolAbi}__ and `functionName` set to `"getTotalProcessed"`
 */
export const useReadPortalPoolGetTotalProcessed =
  /*#__PURE__*/ createUseReadContract({
    abi: portalPoolAbi,
    functionName: 'getTotalProcessed',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link portalPoolAbi}__ and `functionName` set to `"hasRole"`
 */
export const useReadPortalPoolHasRole = /*#__PURE__*/ createUseReadContract({
  abi: portalPoolAbi,
  functionName: 'hasRole',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link portalPoolAbi}__ and `functionName` set to `"lastDistributionTime"`
 */
export const useReadPortalPoolLastDistributionTime =
  /*#__PURE__*/ createUseReadContract({
    abi: portalPoolAbi,
    functionName: 'lastDistributionTime',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link portalPoolAbi}__ and `functionName` set to `"lastRewardBalanceScaled"`
 */
export const useReadPortalPoolLastRewardBalanceScaled =
  /*#__PURE__*/ createUseReadContract({
    abi: portalPoolAbi,
    functionName: 'lastRewardBalanceScaled',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link portalPoolAbi}__ and `functionName` set to `"lastRewardTimestamp"`
 */
export const useReadPortalPoolLastRewardTimestamp =
  /*#__PURE__*/ createUseReadContract({
    abi: portalPoolAbi,
    functionName: 'lastRewardTimestamp',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link portalPoolAbi}__ and `functionName` set to `"lptToken"`
 */
export const useReadPortalPoolLptToken = /*#__PURE__*/ createUseReadContract({
  abi: portalPoolAbi,
  functionName: 'lptToken',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link portalPoolAbi}__ and `functionName` set to `"maxStakePerWallet"`
 */
export const useReadPortalPoolMaxStakePerWallet =
  /*#__PURE__*/ createUseReadContract({
    abi: portalPoolAbi,
    functionName: 'maxStakePerWallet',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link portalPoolAbi}__ and `functionName` set to `"paused"`
 */
export const useReadPortalPoolPaused = /*#__PURE__*/ createUseReadContract({
  abi: portalPoolAbi,
  functionName: 'paused',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link portalPoolAbi}__ and `functionName` set to `"supportsInterface"`
 */
export const useReadPortalPoolSupportsInterface =
  /*#__PURE__*/ createUseReadContract({
    abi: portalPoolAbi,
    functionName: 'supportsInterface',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link portalPoolAbi}__ and `functionName` set to `"totalFeesDistributed"`
 */
export const useReadPortalPoolTotalFeesDistributed =
  /*#__PURE__*/ createUseReadContract({
    abi: portalPoolAbi,
    functionName: 'totalFeesDistributed',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link portalPoolAbi}__
 */
export const useWritePortalPool = /*#__PURE__*/ createUseWriteContract({
  abi: portalPoolAbi,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link portalPoolAbi}__ and `functionName` set to `"checkAndFailPortal"`
 */
export const useWritePortalPoolCheckAndFailPortal =
  /*#__PURE__*/ createUseWriteContract({
    abi: portalPoolAbi,
    functionName: 'checkAndFailPortal',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link portalPoolAbi}__ and `functionName` set to `"claimFees"`
 */
export const useWritePortalPoolClaimFees = /*#__PURE__*/ createUseWriteContract(
  { abi: portalPoolAbi, functionName: 'claimFees' },
)

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link portalPoolAbi}__ and `functionName` set to `"claimRewards"`
 */
export const useWritePortalPoolClaimRewards =
  /*#__PURE__*/ createUseWriteContract({
    abi: portalPoolAbi,
    functionName: 'claimRewards',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link portalPoolAbi}__ and `functionName` set to `"deposit"`
 */
export const useWritePortalPoolDeposit = /*#__PURE__*/ createUseWriteContract({
  abi: portalPoolAbi,
  functionName: 'deposit',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link portalPoolAbi}__ and `functionName` set to `"distributeFees"`
 */
export const useWritePortalPoolDistributeFees =
  /*#__PURE__*/ createUseWriteContract({
    abi: portalPoolAbi,
    functionName: 'distributeFees',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link portalPoolAbi}__ and `functionName` set to `"grantRole"`
 */
export const useWritePortalPoolGrantRole = /*#__PURE__*/ createUseWriteContract(
  { abi: portalPoolAbi, functionName: 'grantRole' },
)

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link portalPoolAbi}__ and `functionName` set to `"initialize"`
 */
export const useWritePortalPoolInitialize =
  /*#__PURE__*/ createUseWriteContract({
    abi: portalPoolAbi,
    functionName: 'initialize',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link portalPoolAbi}__ and `functionName` set to `"onAllocationReduced"`
 */
export const useWritePortalPoolOnAllocationReduced =
  /*#__PURE__*/ createUseWriteContract({
    abi: portalPoolAbi,
    functionName: 'onAllocationReduced',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link portalPoolAbi}__ and `functionName` set to `"onLPTTransfer"`
 */
export const useWritePortalPoolOnLptTransfer =
  /*#__PURE__*/ createUseWriteContract({
    abi: portalPoolAbi,
    functionName: 'onLPTTransfer',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link portalPoolAbi}__ and `functionName` set to `"pause"`
 */
export const useWritePortalPoolPause = /*#__PURE__*/ createUseWriteContract({
  abi: portalPoolAbi,
  functionName: 'pause',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link portalPoolAbi}__ and `functionName` set to `"renounceRole"`
 */
export const useWritePortalPoolRenounceRole =
  /*#__PURE__*/ createUseWriteContract({
    abi: portalPoolAbi,
    functionName: 'renounceRole',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link portalPoolAbi}__ and `functionName` set to `"requestExit"`
 */
export const useWritePortalPoolRequestExit =
  /*#__PURE__*/ createUseWriteContract({
    abi: portalPoolAbi,
    functionName: 'requestExit',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link portalPoolAbi}__ and `functionName` set to `"revokeRole"`
 */
export const useWritePortalPoolRevokeRole =
  /*#__PURE__*/ createUseWriteContract({
    abi: portalPoolAbi,
    functionName: 'revokeRole',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link portalPoolAbi}__ and `functionName` set to `"setDistributionRate"`
 */
export const useWritePortalPoolSetDistributionRate =
  /*#__PURE__*/ createUseWriteContract({
    abi: portalPoolAbi,
    functionName: 'setDistributionRate',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link portalPoolAbi}__ and `functionName` set to `"topUpRewards"`
 */
export const useWritePortalPoolTopUpRewards =
  /*#__PURE__*/ createUseWriteContract({
    abi: portalPoolAbi,
    functionName: 'topUpRewards',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link portalPoolAbi}__ and `functionName` set to `"unpause"`
 */
export const useWritePortalPoolUnpause = /*#__PURE__*/ createUseWriteContract({
  abi: portalPoolAbi,
  functionName: 'unpause',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link portalPoolAbi}__ and `functionName` set to `"withdrawExit"`
 */
export const useWritePortalPoolWithdrawExit =
  /*#__PURE__*/ createUseWriteContract({
    abi: portalPoolAbi,
    functionName: 'withdrawExit',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link portalPoolAbi}__ and `functionName` set to `"withdrawFromFailed"`
 */
export const useWritePortalPoolWithdrawFromFailed =
  /*#__PURE__*/ createUseWriteContract({
    abi: portalPoolAbi,
    functionName: 'withdrawFromFailed',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link portalPoolAbi}__
 */
export const useSimulatePortalPool = /*#__PURE__*/ createUseSimulateContract({
  abi: portalPoolAbi,
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link portalPoolAbi}__ and `functionName` set to `"checkAndFailPortal"`
 */
export const useSimulatePortalPoolCheckAndFailPortal =
  /*#__PURE__*/ createUseSimulateContract({
    abi: portalPoolAbi,
    functionName: 'checkAndFailPortal',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link portalPoolAbi}__ and `functionName` set to `"claimFees"`
 */
export const useSimulatePortalPoolClaimFees =
  /*#__PURE__*/ createUseSimulateContract({
    abi: portalPoolAbi,
    functionName: 'claimFees',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link portalPoolAbi}__ and `functionName` set to `"claimRewards"`
 */
export const useSimulatePortalPoolClaimRewards =
  /*#__PURE__*/ createUseSimulateContract({
    abi: portalPoolAbi,
    functionName: 'claimRewards',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link portalPoolAbi}__ and `functionName` set to `"deposit"`
 */
export const useSimulatePortalPoolDeposit =
  /*#__PURE__*/ createUseSimulateContract({
    abi: portalPoolAbi,
    functionName: 'deposit',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link portalPoolAbi}__ and `functionName` set to `"distributeFees"`
 */
export const useSimulatePortalPoolDistributeFees =
  /*#__PURE__*/ createUseSimulateContract({
    abi: portalPoolAbi,
    functionName: 'distributeFees',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link portalPoolAbi}__ and `functionName` set to `"grantRole"`
 */
export const useSimulatePortalPoolGrantRole =
  /*#__PURE__*/ createUseSimulateContract({
    abi: portalPoolAbi,
    functionName: 'grantRole',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link portalPoolAbi}__ and `functionName` set to `"initialize"`
 */
export const useSimulatePortalPoolInitialize =
  /*#__PURE__*/ createUseSimulateContract({
    abi: portalPoolAbi,
    functionName: 'initialize',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link portalPoolAbi}__ and `functionName` set to `"onAllocationReduced"`
 */
export const useSimulatePortalPoolOnAllocationReduced =
  /*#__PURE__*/ createUseSimulateContract({
    abi: portalPoolAbi,
    functionName: 'onAllocationReduced',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link portalPoolAbi}__ and `functionName` set to `"onLPTTransfer"`
 */
export const useSimulatePortalPoolOnLptTransfer =
  /*#__PURE__*/ createUseSimulateContract({
    abi: portalPoolAbi,
    functionName: 'onLPTTransfer',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link portalPoolAbi}__ and `functionName` set to `"pause"`
 */
export const useSimulatePortalPoolPause =
  /*#__PURE__*/ createUseSimulateContract({
    abi: portalPoolAbi,
    functionName: 'pause',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link portalPoolAbi}__ and `functionName` set to `"renounceRole"`
 */
export const useSimulatePortalPoolRenounceRole =
  /*#__PURE__*/ createUseSimulateContract({
    abi: portalPoolAbi,
    functionName: 'renounceRole',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link portalPoolAbi}__ and `functionName` set to `"requestExit"`
 */
export const useSimulatePortalPoolRequestExit =
  /*#__PURE__*/ createUseSimulateContract({
    abi: portalPoolAbi,
    functionName: 'requestExit',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link portalPoolAbi}__ and `functionName` set to `"revokeRole"`
 */
export const useSimulatePortalPoolRevokeRole =
  /*#__PURE__*/ createUseSimulateContract({
    abi: portalPoolAbi,
    functionName: 'revokeRole',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link portalPoolAbi}__ and `functionName` set to `"setDistributionRate"`
 */
export const useSimulatePortalPoolSetDistributionRate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: portalPoolAbi,
    functionName: 'setDistributionRate',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link portalPoolAbi}__ and `functionName` set to `"topUpRewards"`
 */
export const useSimulatePortalPoolTopUpRewards =
  /*#__PURE__*/ createUseSimulateContract({
    abi: portalPoolAbi,
    functionName: 'topUpRewards',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link portalPoolAbi}__ and `functionName` set to `"unpause"`
 */
export const useSimulatePortalPoolUnpause =
  /*#__PURE__*/ createUseSimulateContract({
    abi: portalPoolAbi,
    functionName: 'unpause',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link portalPoolAbi}__ and `functionName` set to `"withdrawExit"`
 */
export const useSimulatePortalPoolWithdrawExit =
  /*#__PURE__*/ createUseSimulateContract({
    abi: portalPoolAbi,
    functionName: 'withdrawExit',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link portalPoolAbi}__ and `functionName` set to `"withdrawFromFailed"`
 */
export const useSimulatePortalPoolWithdrawFromFailed =
  /*#__PURE__*/ createUseSimulateContract({
    abi: portalPoolAbi,
    functionName: 'withdrawFromFailed',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link portalPoolAbi}__
 */
export const useWatchPortalPoolEvent =
  /*#__PURE__*/ createUseWatchContractEvent({ abi: portalPoolAbi })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link portalPoolAbi}__ and `eventName` set to `"AllocationReduced"`
 */
export const useWatchPortalPoolAllocationReducedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: portalPoolAbi,
    eventName: 'AllocationReduced',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link portalPoolAbi}__ and `eventName` set to `"DistributionRateChanged"`
 */
export const useWatchPortalPoolDistributionRateChangedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: portalPoolAbi,
    eventName: 'DistributionRateChanged',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link portalPoolAbi}__ and `eventName` set to `"ExitClaimed"`
 */
export const useWatchPortalPoolExitClaimedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: portalPoolAbi,
    eventName: 'ExitClaimed',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link portalPoolAbi}__ and `eventName` set to `"ExitRequested"`
 */
export const useWatchPortalPoolExitRequestedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: portalPoolAbi,
    eventName: 'ExitRequested',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link portalPoolAbi}__ and `eventName` set to `"FeesClaimed"`
 */
export const useWatchPortalPoolFeesClaimedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: portalPoolAbi,
    eventName: 'FeesClaimed',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link portalPoolAbi}__ and `eventName` set to `"FeesDistributed"`
 */
export const useWatchPortalPoolFeesDistributedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: portalPoolAbi,
    eventName: 'FeesDistributed',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link portalPoolAbi}__ and `eventName` set to `"Initialized"`
 */
export const useWatchPortalPoolInitializedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: portalPoolAbi,
    eventName: 'Initialized',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link portalPoolAbi}__ and `eventName` set to `"Paused"`
 */
export const useWatchPortalPoolPausedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: portalPoolAbi,
    eventName: 'Paused',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link portalPoolAbi}__ and `eventName` set to `"RewardsClaimed"`
 */
export const useWatchPortalPoolRewardsClaimedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: portalPoolAbi,
    eventName: 'RewardsClaimed',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link portalPoolAbi}__ and `eventName` set to `"RewardsToppedUp"`
 */
export const useWatchPortalPoolRewardsToppedUpEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: portalPoolAbi,
    eventName: 'RewardsToppedUp',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link portalPoolAbi}__ and `eventName` set to `"RoleAdminChanged"`
 */
export const useWatchPortalPoolRoleAdminChangedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: portalPoolAbi,
    eventName: 'RoleAdminChanged',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link portalPoolAbi}__ and `eventName` set to `"RoleGranted"`
 */
export const useWatchPortalPoolRoleGrantedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: portalPoolAbi,
    eventName: 'RoleGranted',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link portalPoolAbi}__ and `eventName` set to `"RoleRevoked"`
 */
export const useWatchPortalPoolRoleRevokedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: portalPoolAbi,
    eventName: 'RoleRevoked',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link portalPoolAbi}__ and `eventName` set to `"StakeTransferred"`
 */
export const useWatchPortalPoolStakeTransferredEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: portalPoolAbi,
    eventName: 'StakeTransferred',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link portalPoolAbi}__ and `eventName` set to `"Staked"`
 */
export const useWatchPortalPoolStakedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: portalPoolAbi,
    eventName: 'Staked',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link portalPoolAbi}__ and `eventName` set to `"StateChanged"`
 */
export const useWatchPortalPoolStateChangedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: portalPoolAbi,
    eventName: 'StateChanged',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link portalPoolAbi}__ and `eventName` set to `"Unpaused"`
 */
export const useWatchPortalPoolUnpausedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: portalPoolAbi,
    eventName: 'Unpaused',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link portalPoolAbi}__ and `eventName` set to `"Withdrawn"`
 */
export const useWatchPortalPoolWithdrawnEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: portalPoolAbi,
    eventName: 'Withdrawn',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link portalPoolFactoryAbi}__
 */
export const useReadPortalPoolFactory = /*#__PURE__*/ createUseReadContract({
  abi: portalPoolFactoryAbi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link portalPoolFactoryAbi}__ and `functionName` set to `"allPortals"`
 */
export const useReadPortalPoolFactoryAllPortals =
  /*#__PURE__*/ createUseReadContract({
    abi: portalPoolFactoryAbi,
    functionName: 'allPortals',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link portalPoolFactoryAbi}__ and `functionName` set to `"collectionDeadlineSeconds"`
 */
export const useReadPortalPoolFactoryCollectionDeadlineSeconds =
  /*#__PURE__*/ createUseReadContract({
    abi: portalPoolFactoryAbi,
    functionName: 'collectionDeadlineSeconds',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link portalPoolFactoryAbi}__ and `functionName` set to `"defaultMaxStakePerWallet"`
 */
export const useReadPortalPoolFactoryDefaultMaxStakePerWallet =
  /*#__PURE__*/ createUseReadContract({
    abi: portalPoolFactoryAbi,
    functionName: 'defaultMaxStakePerWallet',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link portalPoolFactoryAbi}__ and `functionName` set to `"exitUnlockRatePerSecond"`
 */
export const useReadPortalPoolFactoryExitUnlockRatePerSecond =
  /*#__PURE__*/ createUseReadContract({
    abi: portalPoolFactoryAbi,
    functionName: 'exitUnlockRatePerSecond',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link portalPoolFactoryAbi}__ and `functionName` set to `"feeRouter"`
 */
export const useReadPortalPoolFactoryFeeRouter =
  /*#__PURE__*/ createUseReadContract({
    abi: portalPoolFactoryAbi,
    functionName: 'feeRouter',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link portalPoolFactoryAbi}__ and `functionName` set to `"getAllowedPaymentTokens"`
 */
export const useReadPortalPoolFactoryGetAllowedPaymentTokens =
  /*#__PURE__*/ createUseReadContract({
    abi: portalPoolFactoryAbi,
    functionName: 'getAllowedPaymentTokens',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link portalPoolFactoryAbi}__ and `functionName` set to `"getOperatorPortals"`
 */
export const useReadPortalPoolFactoryGetOperatorPortals =
  /*#__PURE__*/ createUseReadContract({
    abi: portalPoolFactoryAbi,
    functionName: 'getOperatorPortals',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link portalPoolFactoryAbi}__ and `functionName` set to `"getPortalCount"`
 */
export const useReadPortalPoolFactoryGetPortalCount =
  /*#__PURE__*/ createUseReadContract({
    abi: portalPoolFactoryAbi,
    functionName: 'getPortalCount',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link portalPoolFactoryAbi}__ and `functionName` set to `"maxPoolCapacity"`
 */
export const useReadPortalPoolFactoryMaxPoolCapacity =
  /*#__PURE__*/ createUseReadContract({
    abi: portalPoolFactoryAbi,
    functionName: 'maxPoolCapacity',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link portalPoolFactoryAbi}__ and `functionName` set to `"operatorPortals"`
 */
export const useReadPortalPoolFactoryOperatorPortals =
  /*#__PURE__*/ createUseReadContract({
    abi: portalPoolFactoryAbi,
    functionName: 'operatorPortals',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link portalPoolFactoryAbi}__ and `functionName` set to `"paymentTokensList"`
 */
export const useReadPortalPoolFactoryPaymentTokensList =
  /*#__PURE__*/ createUseReadContract({
    abi: portalPoolFactoryAbi,
    functionName: 'paymentTokensList',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link portalPoolFactoryAbi}__ and `functionName` set to `"portalCount"`
 */
export const useReadPortalPoolFactoryPortalCount =
  /*#__PURE__*/ createUseReadContract({
    abi: portalPoolFactoryAbi,
    functionName: 'portalCount',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link portalPoolFactoryAbi}__
 */
export const useWritePortalPoolFactory = /*#__PURE__*/ createUseWriteContract({
  abi: portalPoolFactoryAbi,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link portalPoolFactoryAbi}__ and `functionName` set to `"createPortalPool"`
 */
export const useWritePortalPoolFactoryCreatePortalPool =
  /*#__PURE__*/ createUseWriteContract({
    abi: portalPoolFactoryAbi,
    functionName: 'createPortalPool',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link portalPoolFactoryAbi}__
 */
export const useSimulatePortalPoolFactory =
  /*#__PURE__*/ createUseSimulateContract({ abi: portalPoolFactoryAbi })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link portalPoolFactoryAbi}__ and `functionName` set to `"createPortalPool"`
 */
export const useSimulatePortalPoolFactoryCreatePortalPool =
  /*#__PURE__*/ createUseSimulateContract({
    abi: portalPoolFactoryAbi,
    functionName: 'createPortalPool',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link portalRegistryAbi}__
 */
export const useReadPortalRegistry = /*#__PURE__*/ createUseReadContract({
  abi: portalRegistryAbi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link portalRegistryAbi}__ and `functionName` set to `"DEFAULT_ADMIN_ROLE"`
 */
export const useReadPortalRegistryDefaultAdminRole =
  /*#__PURE__*/ createUseReadContract({
    abi: portalRegistryAbi,
    functionName: 'DEFAULT_ADMIN_ROLE',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link portalRegistryAbi}__ and `functionName` set to `"PAUSER_ROLE"`
 */
export const useReadPortalRegistryPauserRole =
  /*#__PURE__*/ createUseReadContract({
    abi: portalRegistryAbi,
    functionName: 'PAUSER_ROLE',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link portalRegistryAbi}__ and `functionName` set to `"SQD"`
 */
export const useReadPortalRegistrySqd = /*#__PURE__*/ createUseReadContract({
  abi: portalRegistryAbi,
  functionName: 'SQD',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link portalRegistryAbi}__ and `functionName` set to `"getComputationUnits"`
 */
export const useReadPortalRegistryGetComputationUnits =
  /*#__PURE__*/ createUseReadContract({
    abi: portalRegistryAbi,
    functionName: 'getComputationUnits',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link portalRegistryAbi}__ and `functionName` set to `"getDirectPortalId"`
 */
export const useReadPortalRegistryGetDirectPortalId =
  /*#__PURE__*/ createUseReadContract({
    abi: portalRegistryAbi,
    functionName: 'getDirectPortalId',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link portalRegistryAbi}__ and `functionName` set to `"getMetadata"`
 */
export const useReadPortalRegistryGetMetadata =
  /*#__PURE__*/ createUseReadContract({
    abi: portalRegistryAbi,
    functionName: 'getMetadata',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link portalRegistryAbi}__ and `functionName` set to `"getPortal"`
 */
export const useReadPortalRegistryGetPortal =
  /*#__PURE__*/ createUseReadContract({
    abi: portalRegistryAbi,
    functionName: 'getPortal',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link portalRegistryAbi}__ and `functionName` set to `"getRoleAdmin"`
 */
export const useReadPortalRegistryGetRoleAdmin =
  /*#__PURE__*/ createUseReadContract({
    abi: portalRegistryAbi,
    functionName: 'getRoleAdmin',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link portalRegistryAbi}__ and `functionName` set to `"hasRole"`
 */
export const useReadPortalRegistryHasRole = /*#__PURE__*/ createUseReadContract(
  { abi: portalRegistryAbi, functionName: 'hasRole' },
)

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link portalRegistryAbi}__ and `functionName` set to `"isDirectPortal"`
 */
export const useReadPortalRegistryIsDirectPortal =
  /*#__PURE__*/ createUseReadContract({
    abi: portalRegistryAbi,
    functionName: 'isDirectPortal',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link portalRegistryAbi}__ and `functionName` set to `"isPortal"`
 */
export const useReadPortalRegistryIsPortal =
  /*#__PURE__*/ createUseReadContract({
    abi: portalRegistryAbi,
    functionName: 'isPortal',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link portalRegistryAbi}__ and `functionName` set to `"mana"`
 */
export const useReadPortalRegistryMana = /*#__PURE__*/ createUseReadContract({
  abi: portalRegistryAbi,
  functionName: 'mana',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link portalRegistryAbi}__ and `functionName` set to `"minStake"`
 */
export const useReadPortalRegistryMinStake =
  /*#__PURE__*/ createUseReadContract({
    abi: portalRegistryAbi,
    functionName: 'minStake',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link portalRegistryAbi}__ and `functionName` set to `"networkController"`
 */
export const useReadPortalRegistryNetworkController =
  /*#__PURE__*/ createUseReadContract({
    abi: portalRegistryAbi,
    functionName: 'networkController',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link portalRegistryAbi}__ and `functionName` set to `"operatorToDirectPortal"`
 */
export const useReadPortalRegistryOperatorToDirectPortal =
  /*#__PURE__*/ createUseReadContract({
    abi: portalRegistryAbi,
    functionName: 'operatorToDirectPortal',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link portalRegistryAbi}__ and `functionName` set to `"paused"`
 */
export const useReadPortalRegistryPaused = /*#__PURE__*/ createUseReadContract({
  abi: portalRegistryAbi,
  functionName: 'paused',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link portalRegistryAbi}__ and `functionName` set to `"peerIdToPortal"`
 */
export const useReadPortalRegistryPeerIdToPortal =
  /*#__PURE__*/ createUseReadContract({
    abi: portalRegistryAbi,
    functionName: 'peerIdToPortal',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link portalRegistryAbi}__ and `functionName` set to `"portals"`
 */
export const useReadPortalRegistryPortals = /*#__PURE__*/ createUseReadContract(
  { abi: portalRegistryAbi, functionName: 'portals' },
)

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link portalRegistryAbi}__ and `functionName` set to `"providerAllocations"`
 */
export const useReadPortalRegistryProviderAllocations =
  /*#__PURE__*/ createUseReadContract({
    abi: portalRegistryAbi,
    functionName: 'providerAllocations',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link portalRegistryAbi}__ and `functionName` set to `"supportsInterface"`
 */
export const useReadPortalRegistrySupportsInterface =
  /*#__PURE__*/ createUseReadContract({
    abi: portalRegistryAbi,
    functionName: 'supportsInterface',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link portalRegistryAbi}__
 */
export const useWritePortalRegistry = /*#__PURE__*/ createUseWriteContract({
  abi: portalRegistryAbi,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link portalRegistryAbi}__ and `functionName` set to `"activatePortalPool"`
 */
export const useWritePortalRegistryActivatePortalPool =
  /*#__PURE__*/ createUseWriteContract({
    abi: portalRegistryAbi,
    functionName: 'activatePortalPool',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link portalRegistryAbi}__ and `functionName` set to `"grantRole"`
 */
export const useWritePortalRegistryGrantRole =
  /*#__PURE__*/ createUseWriteContract({
    abi: portalRegistryAbi,
    functionName: 'grantRole',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link portalRegistryAbi}__ and `functionName` set to `"immediateUnlock"`
 */
export const useWritePortalRegistryImmediateUnlock =
  /*#__PURE__*/ createUseWriteContract({
    abi: portalRegistryAbi,
    functionName: 'immediateUnlock',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link portalRegistryAbi}__ and `functionName` set to `"pause"`
 */
export const useWritePortalRegistryPause = /*#__PURE__*/ createUseWriteContract(
  { abi: portalRegistryAbi, functionName: 'pause' },
)

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link portalRegistryAbi}__ and `functionName` set to `"registerDirectPortal"`
 */
export const useWritePortalRegistryRegisterDirectPortal =
  /*#__PURE__*/ createUseWriteContract({
    abi: portalRegistryAbi,
    functionName: 'registerDirectPortal',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link portalRegistryAbi}__ and `functionName` set to `"registerPortalPool"`
 */
export const useWritePortalRegistryRegisterPortalPool =
  /*#__PURE__*/ createUseWriteContract({
    abi: portalRegistryAbi,
    functionName: 'registerPortalPool',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link portalRegistryAbi}__ and `functionName` set to `"renounceRole"`
 */
export const useWritePortalRegistryRenounceRole =
  /*#__PURE__*/ createUseWriteContract({
    abi: portalRegistryAbi,
    functionName: 'renounceRole',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link portalRegistryAbi}__ and `functionName` set to `"revokeRole"`
 */
export const useWritePortalRegistryRevokeRole =
  /*#__PURE__*/ createUseWriteContract({
    abi: portalRegistryAbi,
    functionName: 'revokeRole',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link portalRegistryAbi}__ and `functionName` set to `"setMana"`
 */
export const useWritePortalRegistrySetMana =
  /*#__PURE__*/ createUseWriteContract({
    abi: portalRegistryAbi,
    functionName: 'setMana',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link portalRegistryAbi}__ and `functionName` set to `"setMetadata"`
 */
export const useWritePortalRegistrySetMetadata =
  /*#__PURE__*/ createUseWriteContract({
    abi: portalRegistryAbi,
    functionName: 'setMetadata',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link portalRegistryAbi}__ and `functionName` set to `"setMinStake"`
 */
export const useWritePortalRegistrySetMinStake =
  /*#__PURE__*/ createUseWriteContract({
    abi: portalRegistryAbi,
    functionName: 'setMinStake',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link portalRegistryAbi}__ and `functionName` set to `"setPortalStatus"`
 */
export const useWritePortalRegistrySetPortalStatus =
  /*#__PURE__*/ createUseWriteContract({
    abi: portalRegistryAbi,
    functionName: 'setPortalStatus',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link portalRegistryAbi}__ and `functionName` set to `"stake"`
 */
export const useWritePortalRegistryStake = /*#__PURE__*/ createUseWriteContract(
  { abi: portalRegistryAbi, functionName: 'stake' },
)

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link portalRegistryAbi}__ and `functionName` set to `"stakePoolFunds"`
 */
export const useWritePortalRegistryStakePoolFunds =
  /*#__PURE__*/ createUseWriteContract({
    abi: portalRegistryAbi,
    functionName: 'stakePoolFunds',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link portalRegistryAbi}__ and `functionName` set to `"stakeToDirectPortal"`
 */
export const useWritePortalRegistryStakeToDirectPortal =
  /*#__PURE__*/ createUseWriteContract({
    abi: portalRegistryAbi,
    functionName: 'stakeToDirectPortal',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link portalRegistryAbi}__ and `functionName` set to `"unpause"`
 */
export const useWritePortalRegistryUnpause =
  /*#__PURE__*/ createUseWriteContract({
    abi: portalRegistryAbi,
    functionName: 'unpause',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link portalRegistryAbi}__ and `functionName` set to `"unstakeFromDirectPortal"`
 */
export const useWritePortalRegistryUnstakeFromDirectPortal =
  /*#__PURE__*/ createUseWriteContract({
    abi: portalRegistryAbi,
    functionName: 'unstakeFromDirectPortal',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link portalRegistryAbi}__ and `functionName` set to `"withdrawFailedPortal"`
 */
export const useWritePortalRegistryWithdrawFailedPortal =
  /*#__PURE__*/ createUseWriteContract({
    abi: portalRegistryAbi,
    functionName: 'withdrawFailedPortal',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link portalRegistryAbi}__
 */
export const useSimulatePortalRegistry =
  /*#__PURE__*/ createUseSimulateContract({ abi: portalRegistryAbi })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link portalRegistryAbi}__ and `functionName` set to `"activatePortalPool"`
 */
export const useSimulatePortalRegistryActivatePortalPool =
  /*#__PURE__*/ createUseSimulateContract({
    abi: portalRegistryAbi,
    functionName: 'activatePortalPool',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link portalRegistryAbi}__ and `functionName` set to `"grantRole"`
 */
export const useSimulatePortalRegistryGrantRole =
  /*#__PURE__*/ createUseSimulateContract({
    abi: portalRegistryAbi,
    functionName: 'grantRole',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link portalRegistryAbi}__ and `functionName` set to `"immediateUnlock"`
 */
export const useSimulatePortalRegistryImmediateUnlock =
  /*#__PURE__*/ createUseSimulateContract({
    abi: portalRegistryAbi,
    functionName: 'immediateUnlock',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link portalRegistryAbi}__ and `functionName` set to `"pause"`
 */
export const useSimulatePortalRegistryPause =
  /*#__PURE__*/ createUseSimulateContract({
    abi: portalRegistryAbi,
    functionName: 'pause',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link portalRegistryAbi}__ and `functionName` set to `"registerDirectPortal"`
 */
export const useSimulatePortalRegistryRegisterDirectPortal =
  /*#__PURE__*/ createUseSimulateContract({
    abi: portalRegistryAbi,
    functionName: 'registerDirectPortal',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link portalRegistryAbi}__ and `functionName` set to `"registerPortalPool"`
 */
export const useSimulatePortalRegistryRegisterPortalPool =
  /*#__PURE__*/ createUseSimulateContract({
    abi: portalRegistryAbi,
    functionName: 'registerPortalPool',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link portalRegistryAbi}__ and `functionName` set to `"renounceRole"`
 */
export const useSimulatePortalRegistryRenounceRole =
  /*#__PURE__*/ createUseSimulateContract({
    abi: portalRegistryAbi,
    functionName: 'renounceRole',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link portalRegistryAbi}__ and `functionName` set to `"revokeRole"`
 */
export const useSimulatePortalRegistryRevokeRole =
  /*#__PURE__*/ createUseSimulateContract({
    abi: portalRegistryAbi,
    functionName: 'revokeRole',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link portalRegistryAbi}__ and `functionName` set to `"setMana"`
 */
export const useSimulatePortalRegistrySetMana =
  /*#__PURE__*/ createUseSimulateContract({
    abi: portalRegistryAbi,
    functionName: 'setMana',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link portalRegistryAbi}__ and `functionName` set to `"setMetadata"`
 */
export const useSimulatePortalRegistrySetMetadata =
  /*#__PURE__*/ createUseSimulateContract({
    abi: portalRegistryAbi,
    functionName: 'setMetadata',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link portalRegistryAbi}__ and `functionName` set to `"setMinStake"`
 */
export const useSimulatePortalRegistrySetMinStake =
  /*#__PURE__*/ createUseSimulateContract({
    abi: portalRegistryAbi,
    functionName: 'setMinStake',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link portalRegistryAbi}__ and `functionName` set to `"setPortalStatus"`
 */
export const useSimulatePortalRegistrySetPortalStatus =
  /*#__PURE__*/ createUseSimulateContract({
    abi: portalRegistryAbi,
    functionName: 'setPortalStatus',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link portalRegistryAbi}__ and `functionName` set to `"stake"`
 */
export const useSimulatePortalRegistryStake =
  /*#__PURE__*/ createUseSimulateContract({
    abi: portalRegistryAbi,
    functionName: 'stake',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link portalRegistryAbi}__ and `functionName` set to `"stakePoolFunds"`
 */
export const useSimulatePortalRegistryStakePoolFunds =
  /*#__PURE__*/ createUseSimulateContract({
    abi: portalRegistryAbi,
    functionName: 'stakePoolFunds',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link portalRegistryAbi}__ and `functionName` set to `"stakeToDirectPortal"`
 */
export const useSimulatePortalRegistryStakeToDirectPortal =
  /*#__PURE__*/ createUseSimulateContract({
    abi: portalRegistryAbi,
    functionName: 'stakeToDirectPortal',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link portalRegistryAbi}__ and `functionName` set to `"unpause"`
 */
export const useSimulatePortalRegistryUnpause =
  /*#__PURE__*/ createUseSimulateContract({
    abi: portalRegistryAbi,
    functionName: 'unpause',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link portalRegistryAbi}__ and `functionName` set to `"unstakeFromDirectPortal"`
 */
export const useSimulatePortalRegistryUnstakeFromDirectPortal =
  /*#__PURE__*/ createUseSimulateContract({
    abi: portalRegistryAbi,
    functionName: 'unstakeFromDirectPortal',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link portalRegistryAbi}__ and `functionName` set to `"withdrawFailedPortal"`
 */
export const useSimulatePortalRegistryWithdrawFailedPortal =
  /*#__PURE__*/ createUseSimulateContract({
    abi: portalRegistryAbi,
    functionName: 'withdrawFailedPortal',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link portalRegistryAbi}__
 */
export const useWatchPortalRegistryEvent =
  /*#__PURE__*/ createUseWatchContractEvent({ abi: portalRegistryAbi })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link portalRegistryAbi}__ and `eventName` set to `"ManaUpdated"`
 */
export const useWatchPortalRegistryManaUpdatedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: portalRegistryAbi,
    eventName: 'ManaUpdated',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link portalRegistryAbi}__ and `eventName` set to `"MetadataChanged"`
 */
export const useWatchPortalRegistryMetadataChangedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: portalRegistryAbi,
    eventName: 'MetadataChanged',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link portalRegistryAbi}__ and `eventName` set to `"MinStakeUpdated"`
 */
export const useWatchPortalRegistryMinStakeUpdatedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: portalRegistryAbi,
    eventName: 'MinStakeUpdated',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link portalRegistryAbi}__ and `eventName` set to `"Paused"`
 */
export const useWatchPortalRegistryPausedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: portalRegistryAbi,
    eventName: 'Paused',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link portalRegistryAbi}__ and `eventName` set to `"PortalActivated"`
 */
export const useWatchPortalRegistryPortalActivatedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: portalRegistryAbi,
    eventName: 'PortalActivated',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link portalRegistryAbi}__ and `eventName` set to `"PortalDeactivated"`
 */
export const useWatchPortalRegistryPortalDeactivatedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: portalRegistryAbi,
    eventName: 'PortalDeactivated',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link portalRegistryAbi}__ and `eventName` set to `"PortalRegistered"`
 */
export const useWatchPortalRegistryPortalRegisteredEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: portalRegistryAbi,
    eventName: 'PortalRegistered',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link portalRegistryAbi}__ and `eventName` set to `"PortalStatusChanged"`
 */
export const useWatchPortalRegistryPortalStatusChangedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: portalRegistryAbi,
    eventName: 'PortalStatusChanged',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link portalRegistryAbi}__ and `eventName` set to `"RoleAdminChanged"`
 */
export const useWatchPortalRegistryRoleAdminChangedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: portalRegistryAbi,
    eventName: 'RoleAdminChanged',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link portalRegistryAbi}__ and `eventName` set to `"RoleGranted"`
 */
export const useWatchPortalRegistryRoleGrantedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: portalRegistryAbi,
    eventName: 'RoleGranted',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link portalRegistryAbi}__ and `eventName` set to `"RoleRevoked"`
 */
export const useWatchPortalRegistryRoleRevokedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: portalRegistryAbi,
    eventName: 'RoleRevoked',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link portalRegistryAbi}__ and `eventName` set to `"Staked"`
 */
export const useWatchPortalRegistryStakedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: portalRegistryAbi,
    eventName: 'Staked',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link portalRegistryAbi}__ and `eventName` set to `"Unpaused"`
 */
export const useWatchPortalRegistryUnpausedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: portalRegistryAbi,
    eventName: 'Unpaused',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link portalRegistryAbi}__ and `eventName` set to `"Unstaked"`
 */
export const useWatchPortalRegistryUnstakedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: portalRegistryAbi,
    eventName: 'Unstaked',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link portalRegistryAbi}__ and `eventName` set to `"Withdrawn"`
 */
export const useWatchPortalRegistryWithdrawnEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: portalRegistryAbi,
    eventName: 'Withdrawn',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link rewardTreasuryAbi}__
 */
export const useWriteRewardTreasury = /*#__PURE__*/ createUseWriteContract({
  abi: rewardTreasuryAbi,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link rewardTreasuryAbi}__ and `functionName` set to `"claimFor"`
 */
export const useWriteRewardTreasuryClaimFor =
  /*#__PURE__*/ createUseWriteContract({
    abi: rewardTreasuryAbi,
    functionName: 'claimFor',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link rewardTreasuryAbi}__
 */
export const useSimulateRewardTreasury =
  /*#__PURE__*/ createUseSimulateContract({ abi: rewardTreasuryAbi })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link rewardTreasuryAbi}__ and `functionName` set to `"claimFor"`
 */
export const useSimulateRewardTreasuryClaimFor =
  /*#__PURE__*/ createUseSimulateContract({
    abi: rewardTreasuryAbi,
    functionName: 'claimFor',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link routerAbi}__
 */
export const useReadRouter = /*#__PURE__*/ createUseReadContract({
  abi: routerAbi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link routerAbi}__ and `functionName` set to `"networkController"`
 */
export const useReadRouterNetworkController =
  /*#__PURE__*/ createUseReadContract({
    abi: routerAbi,
    functionName: 'networkController',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link routerAbi}__ and `functionName` set to `"rewardCalculation"`
 */
export const useReadRouterRewardCalculation =
  /*#__PURE__*/ createUseReadContract({
    abi: routerAbi,
    functionName: 'rewardCalculation',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link routerAbi}__ and `functionName` set to `"rewardTreasury"`
 */
export const useReadRouterRewardTreasury = /*#__PURE__*/ createUseReadContract({
  abi: routerAbi,
  functionName: 'rewardTreasury',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link routerAbi}__ and `functionName` set to `"staking"`
 */
export const useReadRouterStaking = /*#__PURE__*/ createUseReadContract({
  abi: routerAbi,
  functionName: 'staking',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link routerAbi}__ and `functionName` set to `"workerRegistration"`
 */
export const useReadRouterWorkerRegistration =
  /*#__PURE__*/ createUseReadContract({
    abi: routerAbi,
    functionName: 'workerRegistration',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link sqdAbi}__
 */
export const useReadSqd = /*#__PURE__*/ createUseReadContract({ abi: sqdAbi })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link sqdAbi}__ and `functionName` set to `"allowance"`
 */
export const useReadSqdAllowance = /*#__PURE__*/ createUseReadContract({
  abi: sqdAbi,
  functionName: 'allowance',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link sqdAbi}__ and `functionName` set to `"balanceOf"`
 */
export const useReadSqdBalanceOf = /*#__PURE__*/ createUseReadContract({
  abi: sqdAbi,
  functionName: 'balanceOf',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link sqdAbi}__ and `functionName` set to `"decimals"`
 */
export const useReadSqdDecimals = /*#__PURE__*/ createUseReadContract({
  abi: sqdAbi,
  functionName: 'decimals',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link sqdAbi}__ and `functionName` set to `"name"`
 */
export const useReadSqdName = /*#__PURE__*/ createUseReadContract({
  abi: sqdAbi,
  functionName: 'name',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link sqdAbi}__ and `functionName` set to `"symbol"`
 */
export const useReadSqdSymbol = /*#__PURE__*/ createUseReadContract({
  abi: sqdAbi,
  functionName: 'symbol',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link sqdAbi}__ and `functionName` set to `"totalSupply"`
 */
export const useReadSqdTotalSupply = /*#__PURE__*/ createUseReadContract({
  abi: sqdAbi,
  functionName: 'totalSupply',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link sqdAbi}__
 */
export const useWriteSqd = /*#__PURE__*/ createUseWriteContract({ abi: sqdAbi })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link sqdAbi}__ and `functionName` set to `"approve"`
 */
export const useWriteSqdApprove = /*#__PURE__*/ createUseWriteContract({
  abi: sqdAbi,
  functionName: 'approve',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link sqdAbi}__ and `functionName` set to `"transfer"`
 */
export const useWriteSqdTransfer = /*#__PURE__*/ createUseWriteContract({
  abi: sqdAbi,
  functionName: 'transfer',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link sqdAbi}__ and `functionName` set to `"transferFrom"`
 */
export const useWriteSqdTransferFrom = /*#__PURE__*/ createUseWriteContract({
  abi: sqdAbi,
  functionName: 'transferFrom',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link sqdAbi}__
 */
export const useSimulateSqd = /*#__PURE__*/ createUseSimulateContract({
  abi: sqdAbi,
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link sqdAbi}__ and `functionName` set to `"approve"`
 */
export const useSimulateSqdApprove = /*#__PURE__*/ createUseSimulateContract({
  abi: sqdAbi,
  functionName: 'approve',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link sqdAbi}__ and `functionName` set to `"transfer"`
 */
export const useSimulateSqdTransfer = /*#__PURE__*/ createUseSimulateContract({
  abi: sqdAbi,
  functionName: 'transfer',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link sqdAbi}__ and `functionName` set to `"transferFrom"`
 */
export const useSimulateSqdTransferFrom =
  /*#__PURE__*/ createUseSimulateContract({
    abi: sqdAbi,
    functionName: 'transferFrom',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link sqdAbi}__
 */
export const useWatchSqdEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: sqdAbi,
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link sqdAbi}__ and `eventName` set to `"Approval"`
 */
export const useWatchSqdApprovalEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: sqdAbi,
    eventName: 'Approval',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link sqdAbi}__ and `eventName` set to `"Transfer"`
 */
export const useWatchSqdTransferEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: sqdAbi,
    eventName: 'Transfer',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link softCapAbi}__
 */
export const useReadSoftCap = /*#__PURE__*/ createUseReadContract({
  abi: softCapAbi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link softCapAbi}__ and `functionName` set to `"cap"`
 */
export const useReadSoftCapCap = /*#__PURE__*/ createUseReadContract({
  abi: softCapAbi,
  functionName: 'cap',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link softCapAbi}__ and `functionName` set to `"capedStake"`
 */
export const useReadSoftCapCapedStake = /*#__PURE__*/ createUseReadContract({
  abi: softCapAbi,
  functionName: 'capedStake',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link softCapAbi}__ and `functionName` set to `"capedStakeAfterDelegation"`
 */
export const useReadSoftCapCapedStakeAfterDelegation =
  /*#__PURE__*/ createUseReadContract({
    abi: softCapAbi,
    functionName: 'capedStakeAfterDelegation',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link stakingAbi}__
 */
export const useReadStaking = /*#__PURE__*/ createUseReadContract({
  abi: stakingAbi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link stakingAbi}__ and `functionName` set to `"getDeposit"`
 */
export const useReadStakingGetDeposit = /*#__PURE__*/ createUseReadContract({
  abi: stakingAbi,
  functionName: 'getDeposit',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link stakingAbi}__ and `functionName` set to `"claimable"`
 */
export const useReadStakingClaimable = /*#__PURE__*/ createUseReadContract({
  abi: stakingAbi,
  functionName: 'claimable',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link stakingAbi}__ and `functionName` set to `"delegated"`
 */
export const useReadStakingDelegated = /*#__PURE__*/ createUseReadContract({
  abi: stakingAbi,
  functionName: 'delegated',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link stakingAbi}__
 */
export const useWriteStaking = /*#__PURE__*/ createUseWriteContract({
  abi: stakingAbi,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link stakingAbi}__ and `functionName` set to `"deposit"`
 */
export const useWriteStakingDeposit = /*#__PURE__*/ createUseWriteContract({
  abi: stakingAbi,
  functionName: 'deposit',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link stakingAbi}__ and `functionName` set to `"withdraw"`
 */
export const useWriteStakingWithdraw = /*#__PURE__*/ createUseWriteContract({
  abi: stakingAbi,
  functionName: 'withdraw',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link stakingAbi}__
 */
export const useSimulateStaking = /*#__PURE__*/ createUseSimulateContract({
  abi: stakingAbi,
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link stakingAbi}__ and `functionName` set to `"deposit"`
 */
export const useSimulateStakingDeposit =
  /*#__PURE__*/ createUseSimulateContract({
    abi: stakingAbi,
    functionName: 'deposit',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link stakingAbi}__ and `functionName` set to `"withdraw"`
 */
export const useSimulateStakingWithdraw =
  /*#__PURE__*/ createUseSimulateContract({
    abi: stakingAbi,
    functionName: 'withdraw',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link vestingAbi}__
 */
export const useReadVesting = /*#__PURE__*/ createUseReadContract({
  abi: vestingAbi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link vestingAbi}__ and `functionName` set to `"depositedIntoProtocol"`
 */
export const useReadVestingDepositedIntoProtocol =
  /*#__PURE__*/ createUseReadContract({
    abi: vestingAbi,
    functionName: 'depositedIntoProtocol',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link vestingAbi}__ and `functionName` set to `"duration"`
 */
export const useReadVestingDuration = /*#__PURE__*/ createUseReadContract({
  abi: vestingAbi,
  functionName: 'duration',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link vestingAbi}__ and `functionName` set to `"end"`
 */
export const useReadVestingEnd = /*#__PURE__*/ createUseReadContract({
  abi: vestingAbi,
  functionName: 'end',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link vestingAbi}__ and `functionName` set to `"expectedTotalAmount"`
 */
export const useReadVestingExpectedTotalAmount =
  /*#__PURE__*/ createUseReadContract({
    abi: vestingAbi,
    functionName: 'expectedTotalAmount',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link vestingAbi}__ and `functionName` set to `"immediateReleaseBIP"`
 */
export const useReadVestingImmediateReleaseBip =
  /*#__PURE__*/ createUseReadContract({
    abi: vestingAbi,
    functionName: 'immediateReleaseBIP',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link vestingAbi}__ and `functionName` set to `"releasable"`
 */
export const useReadVestingReleasable = /*#__PURE__*/ createUseReadContract({
  abi: vestingAbi,
  functionName: 'releasable',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link vestingAbi}__ and `functionName` set to `"released"`
 */
export const useReadVestingReleased = /*#__PURE__*/ createUseReadContract({
  abi: vestingAbi,
  functionName: 'released',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link vestingAbi}__ and `functionName` set to `"start"`
 */
export const useReadVestingStart = /*#__PURE__*/ createUseReadContract({
  abi: vestingAbi,
  functionName: 'start',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link vestingAbi}__ and `functionName` set to `"vestedAmount"`
 */
export const useReadVestingVestedAmount = /*#__PURE__*/ createUseReadContract({
  abi: vestingAbi,
  functionName: 'vestedAmount',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link vestingAbi}__
 */
export const useWriteVesting = /*#__PURE__*/ createUseWriteContract({
  abi: vestingAbi,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link vestingAbi}__ and `functionName` set to `"execute"`
 */
export const useWriteVestingExecute = /*#__PURE__*/ createUseWriteContract({
  abi: vestingAbi,
  functionName: 'execute',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link vestingAbi}__ and `functionName` set to `"release"`
 */
export const useWriteVestingRelease = /*#__PURE__*/ createUseWriteContract({
  abi: vestingAbi,
  functionName: 'release',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link vestingAbi}__
 */
export const useSimulateVesting = /*#__PURE__*/ createUseSimulateContract({
  abi: vestingAbi,
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link vestingAbi}__ and `functionName` set to `"execute"`
 */
export const useSimulateVestingExecute =
  /*#__PURE__*/ createUseSimulateContract({
    abi: vestingAbi,
    functionName: 'execute',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link vestingAbi}__ and `functionName` set to `"release"`
 */
export const useSimulateVestingRelease =
  /*#__PURE__*/ createUseSimulateContract({
    abi: vestingAbi,
    functionName: 'release',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link workerRegistryAbi}__
 */
export const useReadWorkerRegistry = /*#__PURE__*/ createUseReadContract({
  abi: workerRegistryAbi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link workerRegistryAbi}__ and `functionName` set to `"bondAmount"`
 */
export const useReadWorkerRegistryBondAmount =
  /*#__PURE__*/ createUseReadContract({
    abi: workerRegistryAbi,
    functionName: 'bondAmount',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link workerRegistryAbi}__ and `functionName` set to `"lockPeriod"`
 */
export const useReadWorkerRegistryLockPeriod =
  /*#__PURE__*/ createUseReadContract({
    abi: workerRegistryAbi,
    functionName: 'lockPeriod',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link workerRegistryAbi}__ and `functionName` set to `"getWorker"`
 */
export const useReadWorkerRegistryGetWorker =
  /*#__PURE__*/ createUseReadContract({
    abi: workerRegistryAbi,
    functionName: 'getWorker',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link workerRegistryAbi}__
 */
export const useWriteWorkerRegistry = /*#__PURE__*/ createUseWriteContract({
  abi: workerRegistryAbi,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link workerRegistryAbi}__ and `functionName` set to `"register"`
 */
export const useWriteWorkerRegistryRegister =
  /*#__PURE__*/ createUseWriteContract({
    abi: workerRegistryAbi,
    functionName: 'register',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link workerRegistryAbi}__ and `functionName` set to `"updateMetadata"`
 */
export const useWriteWorkerRegistryUpdateMetadata =
  /*#__PURE__*/ createUseWriteContract({
    abi: workerRegistryAbi,
    functionName: 'updateMetadata',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link workerRegistryAbi}__ and `functionName` set to `"deregister"`
 */
export const useWriteWorkerRegistryDeregister =
  /*#__PURE__*/ createUseWriteContract({
    abi: workerRegistryAbi,
    functionName: 'deregister',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link workerRegistryAbi}__ and `functionName` set to `"withdraw"`
 */
export const useWriteWorkerRegistryWithdraw =
  /*#__PURE__*/ createUseWriteContract({
    abi: workerRegistryAbi,
    functionName: 'withdraw',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link workerRegistryAbi}__
 */
export const useSimulateWorkerRegistry =
  /*#__PURE__*/ createUseSimulateContract({ abi: workerRegistryAbi })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link workerRegistryAbi}__ and `functionName` set to `"register"`
 */
export const useSimulateWorkerRegistryRegister =
  /*#__PURE__*/ createUseSimulateContract({
    abi: workerRegistryAbi,
    functionName: 'register',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link workerRegistryAbi}__ and `functionName` set to `"updateMetadata"`
 */
export const useSimulateWorkerRegistryUpdateMetadata =
  /*#__PURE__*/ createUseSimulateContract({
    abi: workerRegistryAbi,
    functionName: 'updateMetadata',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link workerRegistryAbi}__ and `functionName` set to `"deregister"`
 */
export const useSimulateWorkerRegistryDeregister =
  /*#__PURE__*/ createUseSimulateContract({
    abi: workerRegistryAbi,
    functionName: 'deregister',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link workerRegistryAbi}__ and `functionName` set to `"withdraw"`
 */
export const useSimulateWorkerRegistryWithdraw =
  /*#__PURE__*/ createUseSimulateContract({
    abi: workerRegistryAbi,
    functionName: 'withdraw',
  })
