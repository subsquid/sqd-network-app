import { defineConfig } from '@wagmi/cli';
import { react } from '@wagmi/cli/plugins';
import { erc20Abi } from 'viem';

export default defineConfig({
  out: 'src/api/contracts/subsquid.generated.ts',
  contracts: [
    {
      name: 'SQD',
      abi: erc20Abi,
    },
    {
      name: 'Router',
      abi: [
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
      ],
    },
    {
      name: 'WorkerRegistry',
      abi: [
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
      ],
    },
    {
      name: 'Staking',
      abi: [
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
      ],
    },
    {
      name: 'Vesting',
      abi: [
        {
          type: 'function',
          name: 'depositedIntoProtocol',
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
          name: 'duration',
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
          name: 'end',
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
          name: 'execute',
          inputs: [
            {
              name: 'to',
              type: 'address',
              internalType: 'address',
            },
            {
              name: 'data',
              type: 'bytes',
              internalType: 'bytes',
            },
          ],
          outputs: [],
          stateMutability: 'nonpayable',
        },
        {
          type: 'function',
          name: 'execute',
          inputs: [
            {
              name: 'to',
              type: 'address',
              internalType: 'address',
            },
            {
              name: 'data',
              type: 'bytes',
              internalType: 'bytes',
            },
            {
              name: 'requiredApprove',
              type: 'uint256',
              internalType: 'uint256',
            },
          ],
          outputs: [
            {
              name: '',
              type: 'bytes',
              internalType: 'bytes',
            },
          ],
          stateMutability: 'nonpayable',
        },
        {
          type: 'function',
          name: 'expectedTotalAmount',
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
          name: 'immediateReleaseBIP',
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
          name: 'releasable',
          inputs: [
            {
              name: 'token',
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
          name: 'releasable',
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
          name: 'release',
          inputs: [
            {
              name: 'token',
              type: 'address',
              internalType: 'address',
            },
          ],
          outputs: [],
          stateMutability: 'nonpayable',
        },
        {
          type: 'function',
          name: 'released',
          inputs: [
            {
              name: 'token',
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
          name: 'start',
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
          name: 'vestedAmount',
          inputs: [
            {
              name: 'token',
              type: 'address',
              internalType: 'address',
            },
            {
              name: 'timestamp',
              type: 'uint64',
              internalType: 'uint64',
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
      ],
    },
    {
      name: 'GatewayRegistry',
      abi: [
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
          name: 'setMetadata',
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
          name: 'stake',
          inputs: [
            {
              name: 'amount',
              type: 'uint256',
              internalType: 'uint256',
            },
            {
              name: 'durationBlocks',
              type: 'uint128',
              internalType: 'uint128',
            },
            {
              name: 'withAutoExtension',
              type: 'bool',
              internalType: 'bool',
            },
          ],
          outputs: [],
          stateMutability: 'nonpayable',
        },
        {
          type: 'function',
          name: 'unregister',
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
          name: 'unstake',
          inputs: [],
          outputs: [],
          stateMutability: 'nonpayable',
        },
        {
          type: 'function',
          name: 'computationUnitsAmount',
          inputs: [
            {
              name: 'amount',
              type: 'uint256',
              internalType: 'uint256',
            },
            {
              name: 'durationBlocks',
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
        {
          type: 'function',
          name: 'addStake',
          inputs: [
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
          name: 'disableAutoExtension',
          inputs: [],
          outputs: [],
          stateMutability: 'nonpayable',
        },
        {
          type: 'function',
          name: 'enableAutoExtension',
          inputs: [],
          outputs: [],
          stateMutability: 'nonpayable',
        },
        {
          type: 'function',
          name: 'canUnstake',
          inputs: [
            {
              name: 'operator',
              type: 'address',
              internalType: 'address',
            },
          ],
          outputs: [
            {
              name: '',
              type: 'bool',
              internalType: 'bool',
            },
          ],
          stateMutability: 'view',
        },
        {
          type: 'function',
          name: 'computationUnitsAmount',
          inputs: [
            {
              name: 'amount',
              type: 'uint256',
              internalType: 'uint256',
            },
            {
              name: 'durationBlocks',
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
        {
          type: 'function',
          name: 'getStake',
          inputs: [
            {
              name: 'operator',
              type: 'address',
              internalType: 'address',
            },
          ],
          outputs: [
            {
              name: '',
              type: 'tuple',
              internalType: 'struct IGatewayRegistry.Stake',
              components: [
                {
                  name: 'amount',
                  type: 'uint256',
                  internalType: 'uint256',
                },
                {
                  name: 'lockStart',
                  type: 'uint128',
                  internalType: 'uint128',
                },
                {
                  name: 'lockEnd',
                  type: 'uint128',
                  internalType: 'uint128',
                },
                {
                  name: 'duration',
                  type: 'uint128',
                  internalType: 'uint128',
                },
                {
                  name: 'autoExtension',
                  type: 'bool',
                  internalType: 'bool',
                },
                {
                  name: 'oldCUs',
                  type: 'uint256',
                  internalType: 'uint256',
                },
              ],
            },
          ],
          stateMutability: 'view',
        },
        {
          type: 'function',
          name: 'minStake',
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
      ],
    },
    {
      name: 'RewardTreasury',
      abi: [
        {
          type: 'function',
          name: 'claimFor',
          inputs: [
            {
              name: 'rewardDistribution',
              type: 'address',
              internalType: 'contract IRewardsDistribution',
            },
            {
              name: 'receiver',
              type: 'address',
              internalType: 'address',
            },
          ],
          outputs: [],
          stateMutability: 'nonpayable',
        },
      ],
    },
    {
      name: 'SoftCap',
      abi: [
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
      ],
    },
    {
      name: 'NetworkController',
      abi: [
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
          name: 'minStakeThreshold',
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
          name: 'epochLength',
          inputs: [],
          outputs: [
            {
              name: '',
              type: 'uint128',
              internalType: 'uint128',
            },
          ],
          stateMutability: 'view',
        },
        {
          type: 'function',
          name: 'workerEpochLength',
          inputs: [],
          outputs: [
            {
              name: '',
              type: 'uint128',
              internalType: 'uint128',
            },
          ],
          stateMutability: 'view',
        },
      ],
    },
    {
      name: 'ArbMulticall',
      abi: [
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
      ],
    },
    {
      name: 'BuyBack',
      abi: [
        {
          type: 'function',
          name: 'deposit',
          inputs: [{ name: 'amount', type: 'uint256', internalType: 'uint256' }],
          outputs: [],
          stateMutability: 'nonpayable',
        },
        {
          type: 'function',
          name: 'withdraw',
          inputs: [
            { name: 'receiver', type: 'address', internalType: 'address' },
            { name: 'amount', type: 'uint256', internalType: 'uint256' },
          ],
          outputs: [],
          stateMutability: 'nonpayable',
        },
      ],
    },
    {
      name: 'PortalPoolFactory',
      abi: [
        {
          type: 'function',
          name: 'allPortals',
          inputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
          outputs: [{ name: '', type: 'address', internalType: 'address' }],
          stateMutability: 'view',
        },
        {
          type: 'function',
          name: 'collectionDeadlineSeconds',
          inputs: [],
          outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
          stateMutability: 'view',
        },
        {
          type: 'function',
          name: 'createPortalPool',
          inputs: [
            {
              name: 'params',
              type: 'tuple',
              internalType: 'struct IPortalFactory.CreatePortalParams',
              components: [
                { name: 'operator', type: 'address', internalType: 'address' },
                { name: 'capacity', type: 'uint256', internalType: 'uint256' },
                { name: 'peerId', type: 'bytes', internalType: 'bytes' },
                { name: 'portalName', type: 'string', internalType: 'string' },
                { name: 'distributionRatePerSecond', type: 'uint256', internalType: 'uint256' },
                { name: 'metadata', type: 'string', internalType: 'string' },
              ],
            },
          ],
          outputs: [{ name: 'portal', type: 'address', internalType: 'address' }],
          stateMutability: 'nonpayable',
        },
        {
          type: 'function',
          name: 'defaultMaxStakePerWallet',
          inputs: [],
          outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
          stateMutability: 'view',
        },
        {
          type: 'function',
          name: 'exitUnlockRatePerSecond',
          inputs: [],
          outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
          stateMutability: 'view',
        },
        {
          type: 'function',
          name: 'feeRouter',
          inputs: [],
          outputs: [{ name: '', type: 'address', internalType: 'address' }],
          stateMutability: 'view',
        },
        {
          type: 'function',
          name: 'getAllowedPaymentTokens',
          inputs: [],
          outputs: [{ name: '', type: 'address[]', internalType: 'address[]' }],
          stateMutability: 'view',
        },
        {
          type: 'function',
          name: 'getOperatorPortals',
          inputs: [{ name: 'operator', type: 'address', internalType: 'address' }],
          outputs: [{ name: '', type: 'address[]', internalType: 'address[]' }],
          stateMutability: 'view',
        },
        {
          type: 'function',
          name: 'getPortalCount',
          inputs: [],
          outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
          stateMutability: 'view',
        },
        {
          type: 'function',
          name: 'maxPoolCapacity',
          inputs: [],
          outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
          stateMutability: 'view',
        },
        {
          type: 'function',
          name: 'operatorPortals',
          inputs: [
            { name: '', type: 'address', internalType: 'address' },
            { name: '', type: 'uint256', internalType: 'uint256' },
          ],
          outputs: [{ name: '', type: 'address', internalType: 'address' }],
          stateMutability: 'view',
        },
        {
          type: 'function',
          name: 'paymentTokensList',
          inputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
          outputs: [{ name: '', type: 'address', internalType: 'address' }],
          stateMutability: 'view',
        },
        {
          type: 'function',
          name: 'portalCount',
          inputs: [],
          outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
          stateMutability: 'view',
        },
      ],
    },
    {
      name: 'PortalPool',
      abi: [
        { type: 'constructor', inputs: [], stateMutability: 'nonpayable' },
        {
          type: 'function',
          name: 'DEFAULT_ADMIN_ROLE',
          inputs: [],
          outputs: [{ name: '', type: 'bytes32', internalType: 'bytes32' }],
          stateMutability: 'view',
        },
        {
          type: 'function',
          name: 'FACTORY_ROLE',
          inputs: [],
          outputs: [{ name: '', type: 'bytes32', internalType: 'bytes32' }],
          stateMutability: 'view',
        },
        {
          type: 'function',
          name: 'OPERATOR_ROLE',
          inputs: [],
          outputs: [{ name: '', type: 'bytes32', internalType: 'bytes32' }],
          stateMutability: 'view',
        },
        {
          type: 'function',
          name: 'PRECISION',
          inputs: [],
          outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
          stateMutability: 'view',
        },
        {
          type: 'function',
          name: 'checkAndFailPortal',
          inputs: [],
          outputs: [],
          stateMutability: 'nonpayable',
        },
        {
          type: 'function',
          name: 'claimFees',
          inputs: [{ name: 'token', type: 'address', internalType: 'address' }],
          outputs: [{ name: 'claimed', type: 'uint256', internalType: 'uint256' }],
          stateMutability: 'nonpayable',
        },
        {
          type: 'function',
          name: 'claimRewards',
          inputs: [],
          outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
          stateMutability: 'nonpayable',
        },
        {
          type: 'function',
          name: 'deposit',
          inputs: [{ name: 'amount', type: 'uint256', internalType: 'uint256' }],
          outputs: [],
          stateMutability: 'nonpayable',
        },
        {
          type: 'function',
          name: 'distributeFees',
          inputs: [
            { name: 'token', type: 'address', internalType: 'address' },
            { name: 'amount', type: 'uint256', internalType: 'uint256' },
          ],
          outputs: [],
          stateMutability: 'nonpayable',
        },
        {
          type: 'function',
          name: 'distributionRateScaled',
          inputs: [],
          outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
          stateMutability: 'view',
        },
        {
          type: 'function',
          name: 'getActiveStake',
          inputs: [],
          outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
          stateMutability: 'view',
        },
        {
          type: 'function',
          name: 'getAllowedPaymentTokens',
          inputs: [],
          outputs: [{ name: '', type: 'address[]', internalType: 'address[]' }],
          stateMutability: 'view',
        },
        {
          type: 'function',
          name: 'getClaimableFees',
          inputs: [
            { name: 'provider', type: 'address', internalType: 'address' },
            { name: 'token', type: 'address', internalType: 'address' },
          ],
          outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
          stateMutability: 'view',
        },
        {
          type: 'function',
          name: 'getClaimableRewards',
          inputs: [{ name: 'delegator', type: 'address', internalType: 'address' }],
          outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
          stateMutability: 'view',
        },
        {
          type: 'function',
          name: 'getComputationUnits',
          inputs: [],
          outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
          stateMutability: 'view',
        },
        {
          type: 'function',
          name: 'getCurrentRewardBalance',
          inputs: [],
          outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
          stateMutability: 'view',
        },
        {
          type: 'function',
          name: 'getExitTicket',
          inputs: [
            { name: 'provider', type: 'address', internalType: 'address' },
            { name: 'ticketId', type: 'uint256', internalType: 'uint256' },
          ],
          outputs: [
            {
              name: '',
              type: 'tuple',
              internalType: 'struct IPortalPool.ExitTicket',
              components: [
                { name: 'endPosition', type: 'uint256', internalType: 'uint256' },
                { name: 'amount', type: 'uint256', internalType: 'uint256' },
                { name: 'withdrawn', type: 'bool', internalType: 'bool' },
              ],
            },
          ],
          stateMutability: 'view',
        },
        {
          type: 'function',
          name: 'getPeerId',
          inputs: [],
          outputs: [{ name: '', type: 'bytes', internalType: 'bytes' }],
          stateMutability: 'view',
        },
        {
          type: 'function',
          name: 'getPortalInfo',
          inputs: [],
          outputs: [
            {
              name: '',
              type: 'tuple',
              internalType: 'struct IPortalPool.PortalInfo',
              components: [
                { name: 'operator', type: 'address', internalType: 'address' },
                { name: 'maxCapacity', type: 'uint256', internalType: 'uint256' },
                { name: 'totalStaked', type: 'uint256', internalType: 'uint256' },
                { name: 'depositDeadline', type: 'uint64', internalType: 'uint64' },
                { name: 'activationTime', type: 'uint64', internalType: 'uint64' },
                { name: 'state', type: 'uint8', internalType: 'enum IPortalPool.PortalState' },
                { name: 'paused', type: 'bool', internalType: 'bool' },
                { name: 'firstActivated', type: 'bool', internalType: 'bool' },
              ],
            },
          ],
          stateMutability: 'view',
        },
        {
          type: 'function',
          name: 'getProviderStake',
          inputs: [{ name: 'provider', type: 'address', internalType: 'address' }],
          outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
          stateMutability: 'view',
        },
        {
          type: 'function',
          name: 'getQueueStatus',
          inputs: [
            { name: 'user', type: 'address', internalType: 'address' },
            { name: 'ticketId', type: 'uint256', internalType: 'uint256' },
          ],
          outputs: [
            { name: 'processed', type: 'uint256', internalType: 'uint256' },
            { name: 'userEndPos', type: 'uint256', internalType: 'uint256' },
            { name: 'secondsRemaining', type: 'uint256', internalType: 'uint256' },
            { name: 'ready', type: 'bool', internalType: 'bool' },
          ],
          stateMutability: 'view',
        },
        {
          type: 'function',
          name: 'getRoleAdmin',
          inputs: [{ name: 'role', type: 'bytes32', internalType: 'bytes32' }],
          outputs: [{ name: '', type: 'bytes32', internalType: 'bytes32' }],
          stateMutability: 'view',
        },
        {
          type: 'function',
          name: 'getState',
          inputs: [],
          outputs: [{ name: '', type: 'uint8', internalType: 'enum IPortalPool.PortalState' }],
          stateMutability: 'view',
        },
        {
          type: 'function',
          name: 'getTicketCount',
          inputs: [{ name: 'provider', type: 'address', internalType: 'address' }],
          outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
          stateMutability: 'view',
        },
        {
          type: 'function',
          name: 'getTotalProcessed',
          inputs: [],
          outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
          stateMutability: 'view',
        },
        {
          type: 'function',
          name: 'grantRole',
          inputs: [
            { name: 'role', type: 'bytes32', internalType: 'bytes32' },
            { name: 'account', type: 'address', internalType: 'address' },
          ],
          outputs: [],
          stateMutability: 'nonpayable',
        },
        {
          type: 'function',
          name: 'hasRole',
          inputs: [
            { name: 'role', type: 'bytes32', internalType: 'bytes32' },
            { name: 'account', type: 'address', internalType: 'address' },
          ],
          outputs: [{ name: '', type: 'bool', internalType: 'bool' }],
          stateMutability: 'view',
        },
        {
          type: 'function',
          name: 'initialize',
          inputs: [
            {
              name: 'params',
              type: 'tuple',
              internalType: 'struct IPortalPool.InitParams',
              components: [
                { name: 'operator', type: 'address', internalType: 'address' },
                { name: 'maxCapacity', type: 'uint256', internalType: 'uint256' },
                { name: 'depositDeadline', type: 'uint256', internalType: 'uint256' },
                { name: 'peerId', type: 'bytes', internalType: 'bytes' },
                { name: 'portalName', type: 'string', internalType: 'string' },
                { name: 'sqd', type: 'address', internalType: 'address' },
                { name: 'usdc', type: 'address', internalType: 'address' },
                { name: 'portalRegistry', type: 'address', internalType: 'address' },
                { name: 'feeRouter', type: 'address', internalType: 'address' },
                { name: 'networkController', type: 'address', internalType: 'address' },
                { name: 'distributionRatePerSecond', type: 'uint256', internalType: 'uint256' },
                { name: 'maxStakePerWallet', type: 'uint256', internalType: 'uint256' },
                { name: 'metadata', type: 'string', internalType: 'string' },
              ],
            },
          ],
          outputs: [],
          stateMutability: 'nonpayable',
        },
        {
          type: 'function',
          name: 'lastDistributionTime',
          inputs: [{ name: '', type: 'address', internalType: 'address' }],
          outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
          stateMutability: 'view',
        },
        {
          type: 'function',
          name: 'lastRewardBalanceScaled',
          inputs: [],
          outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
          stateMutability: 'view',
        },
        {
          type: 'function',
          name: 'lastRewardTimestamp',
          inputs: [],
          outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
          stateMutability: 'view',
        },
        {
          type: 'function',
          name: 'lptToken',
          inputs: [],
          outputs: [{ name: '', type: 'address', internalType: 'contract LiquidPortalToken' }],
          stateMutability: 'view',
        },
        {
          type: 'function',
          name: 'maxStakePerWallet',
          inputs: [],
          outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
          stateMutability: 'view',
        },
        {
          type: 'function',
          name: 'onAllocationReduced',
          inputs: [
            { name: 'provider', type: 'address', internalType: 'address' },
            { name: 'amount', type: 'uint256', internalType: 'uint256' },
          ],
          outputs: [],
          stateMutability: 'nonpayable',
        },
        {
          type: 'function',
          name: 'onLPTTransfer',
          inputs: [
            { name: 'from', type: 'address', internalType: 'address' },
            { name: 'to', type: 'address', internalType: 'address' },
            { name: 'amount', type: 'uint256', internalType: 'uint256' },
          ],
          outputs: [],
          stateMutability: 'nonpayable',
        },
        { type: 'function', name: 'pause', inputs: [], outputs: [], stateMutability: 'nonpayable' },
        {
          type: 'function',
          name: 'paused',
          inputs: [],
          outputs: [{ name: '', type: 'bool', internalType: 'bool' }],
          stateMutability: 'view',
        },
        {
          type: 'function',
          name: 'renounceRole',
          inputs: [
            { name: 'role', type: 'bytes32', internalType: 'bytes32' },
            { name: 'callerConfirmation', type: 'address', internalType: 'address' },
          ],
          outputs: [],
          stateMutability: 'nonpayable',
        },
        {
          type: 'function',
          name: 'requestExit',
          inputs: [{ name: 'amount', type: 'uint256', internalType: 'uint256' }],
          outputs: [{ name: 'ticketId', type: 'uint256', internalType: 'uint256' }],
          stateMutability: 'nonpayable',
        },
        {
          type: 'function',
          name: 'revokeRole',
          inputs: [
            { name: 'role', type: 'bytes32', internalType: 'bytes32' },
            { name: 'account', type: 'address', internalType: 'address' },
          ],
          outputs: [],
          stateMutability: 'nonpayable',
        },
        {
          type: 'function',
          name: 'setDistributionRate',
          inputs: [{ name: 'newRatePerSecond', type: 'uint256', internalType: 'uint256' }],
          outputs: [],
          stateMutability: 'nonpayable',
        },
        {
          type: 'function',
          name: 'supportsInterface',
          inputs: [{ name: 'interfaceId', type: 'bytes4', internalType: 'bytes4' }],
          outputs: [{ name: '', type: 'bool', internalType: 'bool' }],
          stateMutability: 'view',
        },
        {
          type: 'function',
          name: 'topUpRewards',
          inputs: [{ name: 'amount', type: 'uint256', internalType: 'uint256' }],
          outputs: [],
          stateMutability: 'nonpayable',
        },
        {
          type: 'function',
          name: 'totalFeesDistributed',
          inputs: [{ name: '', type: 'address', internalType: 'address' }],
          outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
          stateMutability: 'view',
        },
        {
          type: 'function',
          name: 'unpause',
          inputs: [],
          outputs: [],
          stateMutability: 'nonpayable',
        },
        {
          type: 'function',
          name: 'withdrawExit',
          inputs: [{ name: 'ticketId', type: 'uint256', internalType: 'uint256' }],
          outputs: [],
          stateMutability: 'nonpayable',
        },
        {
          type: 'function',
          name: 'withdrawFromFailed',
          inputs: [],
          outputs: [],
          stateMutability: 'nonpayable',
        },
        {
          type: 'event',
          name: 'AllocationReduced',
          inputs: [
            { name: 'provider', type: 'address', indexed: true, internalType: 'address' },
            { name: 'amount', type: 'uint256', indexed: false, internalType: 'uint256' },
          ],
          anonymous: false,
        },
        {
          type: 'event',
          name: 'DistributionRateChanged',
          inputs: [
            { name: 'oldRate', type: 'uint256', indexed: false, internalType: 'uint256' },
            { name: 'newRate', type: 'uint256', indexed: false, internalType: 'uint256' },
          ],
          anonymous: false,
        },
        {
          type: 'event',
          name: 'ExitClaimed',
          inputs: [
            { name: 'provider', type: 'address', indexed: true, internalType: 'address' },
            { name: 'amount', type: 'uint256', indexed: false, internalType: 'uint256' },
          ],
          anonymous: false,
        },
        {
          type: 'event',
          name: 'ExitRequested',
          inputs: [
            { name: 'provider', type: 'address', indexed: true, internalType: 'address' },
            { name: 'amount', type: 'uint256', indexed: false, internalType: 'uint256' },
            { name: 'endPosition', type: 'uint256', indexed: false, internalType: 'uint256' },
          ],
          anonymous: false,
        },
        {
          type: 'event',
          name: 'FeesClaimed',
          inputs: [
            { name: 'provider', type: 'address', indexed: true, internalType: 'address' },
            { name: 'token', type: 'address', indexed: true, internalType: 'address' },
            { name: 'amount', type: 'uint256', indexed: false, internalType: 'uint256' },
          ],
          anonymous: false,
        },
        {
          type: 'event',
          name: 'FeesDistributed',
          inputs: [
            { name: 'token', type: 'address', indexed: true, internalType: 'address' },
            { name: 'totalAmount', type: 'uint256', indexed: false, internalType: 'uint256' },
            { name: 'toProviders', type: 'uint256', indexed: false, internalType: 'uint256' },
            { name: 'toWorkers', type: 'uint256', indexed: false, internalType: 'uint256' },
            { name: 'toBurn', type: 'uint256', indexed: false, internalType: 'uint256' },
          ],
          anonymous: false,
        },
        {
          type: 'event',
          name: 'Initialized',
          inputs: [{ name: 'version', type: 'uint64', indexed: false, internalType: 'uint64' }],
          anonymous: false,
        },
        {
          type: 'event',
          name: 'Paused',
          inputs: [{ name: 'account', type: 'address', indexed: false, internalType: 'address' }],
          anonymous: false,
        },
        {
          type: 'event',
          name: 'RewardsClaimed',
          inputs: [
            { name: 'delegator', type: 'address', indexed: true, internalType: 'address' },
            { name: 'amount', type: 'uint256', indexed: false, internalType: 'uint256' },
          ],
          anonymous: false,
        },
        {
          type: 'event',
          name: 'RewardsToppedUp',
          inputs: [
            { name: 'operator', type: 'address', indexed: true, internalType: 'address' },
            { name: 'amount', type: 'uint256', indexed: false, internalType: 'uint256' },
            { name: 'newBalanceScaled', type: 'uint256', indexed: false, internalType: 'uint256' },
          ],
          anonymous: false,
        },
        {
          type: 'event',
          name: 'RoleAdminChanged',
          inputs: [
            { name: 'role', type: 'bytes32', indexed: true, internalType: 'bytes32' },
            { name: 'previousAdminRole', type: 'bytes32', indexed: true, internalType: 'bytes32' },
            { name: 'newAdminRole', type: 'bytes32', indexed: true, internalType: 'bytes32' },
          ],
          anonymous: false,
        },
        {
          type: 'event',
          name: 'RoleGranted',
          inputs: [
            { name: 'role', type: 'bytes32', indexed: true, internalType: 'bytes32' },
            { name: 'account', type: 'address', indexed: true, internalType: 'address' },
            { name: 'sender', type: 'address', indexed: true, internalType: 'address' },
          ],
          anonymous: false,
        },
        {
          type: 'event',
          name: 'RoleRevoked',
          inputs: [
            { name: 'role', type: 'bytes32', indexed: true, internalType: 'bytes32' },
            { name: 'account', type: 'address', indexed: true, internalType: 'address' },
            { name: 'sender', type: 'address', indexed: true, internalType: 'address' },
          ],
          anonymous: false,
        },
        {
          type: 'event',
          name: 'StakeTransferred',
          inputs: [
            { name: 'from', type: 'address', indexed: true, internalType: 'address' },
            { name: 'to', type: 'address', indexed: true, internalType: 'address' },
            { name: 'amount', type: 'uint256', indexed: false, internalType: 'uint256' },
          ],
          anonymous: false,
        },
        {
          type: 'event',
          name: 'Staked',
          inputs: [
            { name: 'provider', type: 'address', indexed: true, internalType: 'address' },
            { name: 'amount', type: 'uint256', indexed: false, internalType: 'uint256' },
            { name: 'newTotal', type: 'uint256', indexed: false, internalType: 'uint256' },
          ],
          anonymous: false,
        },
        {
          type: 'event',
          name: 'StateChanged',
          inputs: [
            {
              name: 'oldState',
              type: 'uint8',
              indexed: false,
              internalType: 'enum IPortalPool.PortalState',
            },
            {
              name: 'newState',
              type: 'uint8',
              indexed: false,
              internalType: 'enum IPortalPool.PortalState',
            },
          ],
          anonymous: false,
        },
        {
          type: 'event',
          name: 'Unpaused',
          inputs: [{ name: 'account', type: 'address', indexed: false, internalType: 'address' }],
          anonymous: false,
        },
        {
          type: 'event',
          name: 'Withdrawn',
          inputs: [
            { name: 'provider', type: 'address', indexed: true, internalType: 'address' },
            { name: 'amount', type: 'uint256', indexed: false, internalType: 'uint256' },
          ],
          anonymous: false,
        },
        { type: 'error', name: 'AccessControlBadConfirmation', inputs: [] },
        {
          type: 'error',
          name: 'AccessControlUnauthorizedAccount',
          inputs: [
            { name: 'account', type: 'address', internalType: 'address' },
            { name: 'neededRole', type: 'bytes32', internalType: 'bytes32' },
          ],
        },
        { type: 'error', name: 'AlreadyWithdrawn', inputs: [] },
        { type: 'error', name: 'BelowMinimum', inputs: [] },
        { type: 'error', name: 'CapacityExceeded', inputs: [] },
        { type: 'error', name: 'DeadlineNotPassed', inputs: [] },
        { type: 'error', name: 'EnforcedPause', inputs: [] },
        { type: 'error', name: 'ExceedsWalletLimit', inputs: [] },
        { type: 'error', name: 'ExpectedPause', inputs: [] },
        { type: 'error', name: 'InsufficientStake', inputs: [] },
        { type: 'error', name: 'InsufficientTransferableStake', inputs: [] },
        { type: 'error', name: 'InvalidAddress', inputs: [] },
        { type: 'error', name: 'InvalidAmount', inputs: [] },
        { type: 'error', name: 'InvalidInitialization', inputs: [] },
        { type: 'error', name: 'InvalidState', inputs: [] },
        { type: 'error', name: 'NoActiveExitRequest', inputs: [] },
        { type: 'error', name: 'NoStakeToWithdraw', inputs: [] },
        { type: 'error', name: 'NotInitializing', inputs: [] },
        { type: 'error', name: 'NotLPTToken', inputs: [] },
        { type: 'error', name: 'NotOperator', inputs: [] },
        { type: 'error', name: 'NotPortalRegistry', inputs: [] },
        { type: 'error', name: 'NothingToClaim', inputs: [] },
        { type: 'error', name: 'PortalNotFailed', inputs: [] },
        { type: 'error', name: 'ReentrancyGuardReentrantCall', inputs: [] },
        {
          type: 'error',
          name: 'SafeERC20FailedOperation',
          inputs: [{ name: 'token', type: 'address', internalType: 'address' }],
        },
        { type: 'error', name: 'StillInQueue', inputs: [] },
        { type: 'error', name: 'TokenNotAllowed', inputs: [] },
        { type: 'error', name: 'UseWithdrawFromFailed', inputs: [] },
      ],
    },
    {
      name: 'PortalRegistry',
      abi: [
        {
          type: 'constructor',
          inputs: [
            { name: '_sqd', type: 'address', internalType: 'address' },
            { name: '_networkController', type: 'address', internalType: 'address' },
            { name: '_minStake', type: 'uint256', internalType: 'uint256' },
            { name: '_mana', type: 'uint256', internalType: 'uint256' },
          ],
          stateMutability: 'nonpayable',
        },
        {
          type: 'function',
          name: 'DEFAULT_ADMIN_ROLE',
          inputs: [],
          outputs: [{ name: '', type: 'bytes32', internalType: 'bytes32' }],
          stateMutability: 'view',
        },
        {
          type: 'function',
          name: 'PAUSER_ROLE',
          inputs: [],
          outputs: [{ name: '', type: 'bytes32', internalType: 'bytes32' }],
          stateMutability: 'view',
        },
        {
          type: 'function',
          name: 'SQD',
          inputs: [],
          outputs: [{ name: '', type: 'address', internalType: 'contract IERC20' }],
          stateMutability: 'view',
        },
        {
          type: 'function',
          name: 'activatePortalPool',
          inputs: [],
          outputs: [],
          stateMutability: 'nonpayable',
        },
        {
          type: 'function',
          name: 'getComputationUnits',
          inputs: [{ name: 'portalAddress', type: 'address', internalType: 'address' }],
          outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
          stateMutability: 'view',
        },
        {
          type: 'function',
          name: 'getDirectPortalId',
          inputs: [{ name: 'operator', type: 'address', internalType: 'address' }],
          outputs: [{ name: '', type: 'address', internalType: 'address' }],
          stateMutability: 'view',
        },
        {
          type: 'function',
          name: 'getMetadata',
          inputs: [{ name: 'portalAddress', type: 'address', internalType: 'address' }],
          outputs: [{ name: '', type: 'string', internalType: 'string' }],
          stateMutability: 'view',
        },
        {
          type: 'function',
          name: 'getPortal',
          inputs: [{ name: 'portalAddress', type: 'address', internalType: 'address' }],
          outputs: [
            {
              name: '',
              type: 'tuple',
              internalType: 'struct IPortalRegistry.Portal',
              components: [
                { name: 'peerId', type: 'bytes', internalType: 'bytes' },
                { name: 'portalAddress', type: 'address', internalType: 'address' },
                { name: 'operator', type: 'address', internalType: 'address' },
                { name: 'totalStaked', type: 'uint256', internalType: 'uint256' },
                { name: 'registeredAt', type: 'uint256', internalType: 'uint256' },
                { name: 'active', type: 'bool', internalType: 'bool' },
                {
                  name: 'portalType',
                  type: 'uint8',
                  internalType: 'enum IPortalRegistry.PortalType',
                },
                { name: 'metadata', type: 'string', internalType: 'string' },
              ],
            },
          ],
          stateMutability: 'view',
        },
        {
          type: 'function',
          name: 'getRoleAdmin',
          inputs: [{ name: 'role', type: 'bytes32', internalType: 'bytes32' }],
          outputs: [{ name: '', type: 'bytes32', internalType: 'bytes32' }],
          stateMutability: 'view',
        },
        {
          type: 'function',
          name: 'grantRole',
          inputs: [
            { name: 'role', type: 'bytes32', internalType: 'bytes32' },
            { name: 'account', type: 'address', internalType: 'address' },
          ],
          outputs: [],
          stateMutability: 'nonpayable',
        },
        {
          type: 'function',
          name: 'hasRole',
          inputs: [
            { name: 'role', type: 'bytes32', internalType: 'bytes32' },
            { name: 'account', type: 'address', internalType: 'address' },
          ],
          outputs: [{ name: '', type: 'bool', internalType: 'bool' }],
          stateMutability: 'view',
        },
        {
          type: 'function',
          name: 'immediateUnlock',
          inputs: [
            { name: 'provider', type: 'address', internalType: 'address' },
            { name: 'amount', type: 'uint256', internalType: 'uint256' },
          ],
          outputs: [],
          stateMutability: 'nonpayable',
        },
        {
          type: 'function',
          name: 'isDirectPortal',
          inputs: [{ name: 'portalAddress', type: 'address', internalType: 'address' }],
          outputs: [{ name: '', type: 'bool', internalType: 'bool' }],
          stateMutability: 'view',
        },
        {
          type: 'function',
          name: 'isPortal',
          inputs: [{ name: '', type: 'address', internalType: 'address' }],
          outputs: [{ name: '', type: 'bool', internalType: 'bool' }],
          stateMutability: 'view',
        },
        {
          type: 'function',
          name: 'mana',
          inputs: [],
          outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
          stateMutability: 'view',
        },
        {
          type: 'function',
          name: 'minStake',
          inputs: [],
          outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
          stateMutability: 'view',
        },
        {
          type: 'function',
          name: 'networkController',
          inputs: [],
          outputs: [{ name: '', type: 'address', internalType: 'contract INetworkController' }],
          stateMutability: 'view',
        },
        {
          type: 'function',
          name: 'operatorToDirectPortal',
          inputs: [{ name: '', type: 'address', internalType: 'address' }],
          outputs: [{ name: '', type: 'address', internalType: 'address' }],
          stateMutability: 'view',
        },
        { type: 'function', name: 'pause', inputs: [], outputs: [], stateMutability: 'nonpayable' },
        {
          type: 'function',
          name: 'paused',
          inputs: [],
          outputs: [{ name: '', type: 'bool', internalType: 'bool' }],
          stateMutability: 'view',
        },
        {
          type: 'function',
          name: 'peerIdToPortal',
          inputs: [{ name: '', type: 'bytes32', internalType: 'bytes32' }],
          outputs: [{ name: '', type: 'address', internalType: 'address' }],
          stateMutability: 'view',
        },
        {
          type: 'function',
          name: 'portals',
          inputs: [{ name: '', type: 'address', internalType: 'address' }],
          outputs: [
            { name: 'peerId', type: 'bytes', internalType: 'bytes' },
            { name: 'portalAddress', type: 'address', internalType: 'address' },
            { name: 'operator', type: 'address', internalType: 'address' },
            { name: 'totalStaked', type: 'uint256', internalType: 'uint256' },
            { name: 'registeredAt', type: 'uint256', internalType: 'uint256' },
            { name: 'active', type: 'bool', internalType: 'bool' },
            { name: 'portalType', type: 'uint8', internalType: 'enum IPortalRegistry.PortalType' },
            { name: 'metadata', type: 'string', internalType: 'string' },
          ],
          stateMutability: 'view',
        },
        {
          type: 'function',
          name: 'providerAllocations',
          inputs: [
            { name: '', type: 'address', internalType: 'address' },
            { name: '', type: 'address', internalType: 'address' },
          ],
          outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
          stateMutability: 'view',
        },
        {
          type: 'function',
          name: 'registerDirectPortal',
          inputs: [
            { name: 'peerId', type: 'bytes', internalType: 'bytes' },
            { name: 'metadata', type: 'string', internalType: 'string' },
          ],
          outputs: [{ name: 'portalId', type: 'address', internalType: 'address' }],
          stateMutability: 'nonpayable',
        },
        {
          type: 'function',
          name: 'registerPortalPool',
          inputs: [
            { name: 'peerId', type: 'bytes', internalType: 'bytes' },
            { name: 'portalAddress', type: 'address', internalType: 'address' },
            { name: 'operator', type: 'address', internalType: 'address' },
            { name: 'metadata', type: 'string', internalType: 'string' },
          ],
          outputs: [],
          stateMutability: 'nonpayable',
        },
        {
          type: 'function',
          name: 'renounceRole',
          inputs: [
            { name: 'role', type: 'bytes32', internalType: 'bytes32' },
            { name: 'callerConfirmation', type: 'address', internalType: 'address' },
          ],
          outputs: [],
          stateMutability: 'nonpayable',
        },
        {
          type: 'function',
          name: 'revokeRole',
          inputs: [
            { name: 'role', type: 'bytes32', internalType: 'bytes32' },
            { name: 'account', type: 'address', internalType: 'address' },
          ],
          outputs: [],
          stateMutability: 'nonpayable',
        },
        {
          type: 'function',
          name: 'setMana',
          inputs: [{ name: '_mana', type: 'uint256', internalType: 'uint256' }],
          outputs: [],
          stateMutability: 'nonpayable',
        },
        {
          type: 'function',
          name: 'setMetadata',
          inputs: [
            { name: 'portalAddress', type: 'address', internalType: 'address' },
            { name: 'metadata', type: 'string', internalType: 'string' },
          ],
          outputs: [],
          stateMutability: 'nonpayable',
        },
        {
          type: 'function',
          name: 'setMinStake',
          inputs: [{ name: '_minStake', type: 'uint256', internalType: 'uint256' }],
          outputs: [],
          stateMutability: 'nonpayable',
        },
        {
          type: 'function',
          name: 'setPortalStatus',
          inputs: [
            { name: 'portal', type: 'address', internalType: 'address' },
            { name: 'status', type: 'bool', internalType: 'bool' },
          ],
          outputs: [],
          stateMutability: 'nonpayable',
        },
        {
          type: 'function',
          name: 'stake',
          inputs: [
            { name: 'portalAddress', type: 'address', internalType: 'address' },
            { name: 'provider', type: 'address', internalType: 'address' },
            { name: 'amount', type: 'uint256', internalType: 'uint256' },
          ],
          outputs: [],
          stateMutability: 'nonpayable',
        },
        {
          type: 'function',
          name: 'stakePoolFunds',
          inputs: [{ name: 'amount', type: 'uint256', internalType: 'uint256' }],
          outputs: [],
          stateMutability: 'nonpayable',
        },
        {
          type: 'function',
          name: 'stakeToDirectPortal',
          inputs: [{ name: 'amount', type: 'uint256', internalType: 'uint256' }],
          outputs: [],
          stateMutability: 'nonpayable',
        },
        {
          type: 'function',
          name: 'supportsInterface',
          inputs: [{ name: 'interfaceId', type: 'bytes4', internalType: 'bytes4' }],
          outputs: [{ name: '', type: 'bool', internalType: 'bool' }],
          stateMutability: 'view',
        },
        {
          type: 'function',
          name: 'unpause',
          inputs: [],
          outputs: [],
          stateMutability: 'nonpayable',
        },
        {
          type: 'function',
          name: 'unstakeFromDirectPortal',
          inputs: [{ name: 'amount', type: 'uint256', internalType: 'uint256' }],
          outputs: [],
          stateMutability: 'nonpayable',
        },
        {
          type: 'function',
          name: 'withdrawFailedPortal',
          inputs: [
            { name: 'provider', type: 'address', internalType: 'address' },
            { name: 'amount', type: 'uint256', internalType: 'uint256' },
          ],
          outputs: [],
          stateMutability: 'nonpayable',
        },
        {
          type: 'event',
          name: 'ManaUpdated',
          inputs: [
            { name: 'oldValue', type: 'uint256', indexed: false, internalType: 'uint256' },
            { name: 'newValue', type: 'uint256', indexed: false, internalType: 'uint256' },
          ],
          anonymous: false,
        },
        {
          type: 'event',
          name: 'MetadataChanged',
          inputs: [
            { name: 'portal', type: 'address', indexed: true, internalType: 'address' },
            { name: 'metadata', type: 'string', indexed: false, internalType: 'string' },
          ],
          anonymous: false,
        },
        {
          type: 'event',
          name: 'MinStakeUpdated',
          inputs: [
            { name: 'oldValue', type: 'uint256', indexed: false, internalType: 'uint256' },
            { name: 'newValue', type: 'uint256', indexed: false, internalType: 'uint256' },
          ],
          anonymous: false,
        },
        {
          type: 'event',
          name: 'Paused',
          inputs: [{ name: 'account', type: 'address', indexed: false, internalType: 'address' }],
          anonymous: false,
        },
        {
          type: 'event',
          name: 'PortalActivated',
          inputs: [{ name: 'portal', type: 'address', indexed: true, internalType: 'address' }],
          anonymous: false,
        },
        {
          type: 'event',
          name: 'PortalDeactivated',
          inputs: [{ name: 'portal', type: 'address', indexed: true, internalType: 'address' }],
          anonymous: false,
        },
        {
          type: 'event',
          name: 'PortalRegistered',
          inputs: [
            { name: 'portal', type: 'address', indexed: true, internalType: 'address' },
            { name: 'peerId', type: 'bytes', indexed: false, internalType: 'bytes' },
            { name: 'operator', type: 'address', indexed: false, internalType: 'address' },
            {
              name: 'portalType',
              type: 'uint8',
              indexed: false,
              internalType: 'enum IPortalRegistry.PortalType',
            },
          ],
          anonymous: false,
        },
        {
          type: 'event',
          name: 'PortalStatusChanged',
          inputs: [
            { name: 'portal', type: 'address', indexed: true, internalType: 'address' },
            { name: 'status', type: 'bool', indexed: false, internalType: 'bool' },
          ],
          anonymous: false,
        },
        {
          type: 'event',
          name: 'RoleAdminChanged',
          inputs: [
            { name: 'role', type: 'bytes32', indexed: true, internalType: 'bytes32' },
            { name: 'previousAdminRole', type: 'bytes32', indexed: true, internalType: 'bytes32' },
            { name: 'newAdminRole', type: 'bytes32', indexed: true, internalType: 'bytes32' },
          ],
          anonymous: false,
        },
        {
          type: 'event',
          name: 'RoleGranted',
          inputs: [
            { name: 'role', type: 'bytes32', indexed: true, internalType: 'bytes32' },
            { name: 'account', type: 'address', indexed: true, internalType: 'address' },
            { name: 'sender', type: 'address', indexed: true, internalType: 'address' },
          ],
          anonymous: false,
        },
        {
          type: 'event',
          name: 'RoleRevoked',
          inputs: [
            { name: 'role', type: 'bytes32', indexed: true, internalType: 'bytes32' },
            { name: 'account', type: 'address', indexed: true, internalType: 'address' },
            { name: 'sender', type: 'address', indexed: true, internalType: 'address' },
          ],
          anonymous: false,
        },
        {
          type: 'event',
          name: 'Staked',
          inputs: [
            { name: 'portal', type: 'address', indexed: true, internalType: 'address' },
            { name: 'provider', type: 'address', indexed: true, internalType: 'address' },
            { name: 'amount', type: 'uint256', indexed: false, internalType: 'uint256' },
          ],
          anonymous: false,
        },
        {
          type: 'event',
          name: 'Unpaused',
          inputs: [{ name: 'account', type: 'address', indexed: false, internalType: 'address' }],
          anonymous: false,
        },
        {
          type: 'event',
          name: 'Unstaked',
          inputs: [
            { name: 'portal', type: 'address', indexed: true, internalType: 'address' },
            { name: 'provider', type: 'address', indexed: true, internalType: 'address' },
            { name: 'amount', type: 'uint256', indexed: false, internalType: 'uint256' },
          ],
          anonymous: false,
        },
        {
          type: 'event',
          name: 'Withdrawn',
          inputs: [
            { name: 'provider', type: 'address', indexed: true, internalType: 'address' },
            { name: 'amount', type: 'uint256', indexed: false, internalType: 'uint256' },
          ],
          anonymous: false,
        },
        { type: 'error', name: 'AccessControlBadConfirmation', inputs: [] },
        {
          type: 'error',
          name: 'AccessControlUnauthorizedAccount',
          inputs: [
            { name: 'account', type: 'address', internalType: 'address' },
            { name: 'neededRole', type: 'bytes32', internalType: 'bytes32' },
          ],
        },
        { type: 'error', name: 'AlreadyHasDirectPortal', inputs: [] },
        { type: 'error', name: 'EnforcedPause', inputs: [] },
        { type: 'error', name: 'ExpectedPause', inputs: [] },
        { type: 'error', name: 'InsufficientAllocation', inputs: [] },
        { type: 'error', name: 'InvalidAddress', inputs: [] },
        { type: 'error', name: 'InvalidAmount', inputs: [] },
        { type: 'error', name: 'InvalidPeerId', inputs: [] },
        { type: 'error', name: 'NoDirectPortal', inputs: [] },
        { type: 'error', name: 'NotOperator', inputs: [] },
        { type: 'error', name: 'OnlyPoolPortal', inputs: [] },
        { type: 'error', name: 'OnlyPortal', inputs: [] },
        { type: 'error', name: 'PeerIdInUse', inputs: [] },
        { type: 'error', name: 'PortalAlreadyRegistered', inputs: [] },
        { type: 'error', name: 'PortalNotRegistered', inputs: [] },
        {
          type: 'error',
          name: 'SafeERC20FailedOperation',
          inputs: [{ name: 'token', type: 'address', internalType: 'address' }],
        },
      ],
    },
  ],
  plugins: [react({})],
});
