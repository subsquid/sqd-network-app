// Page
export const PAGE_TEXTS = {
  title: 'Portal Pool',
  betaLabel: 'New',
  notFoundItem: 'portal pool',
  tabs: {
    general: 'General',
    manage: 'Manage',
  },
} as const;

// Pool Health (Status + Bar)
export const HEALTH_TEXTS = {
  status: {
    active: 'Pool is active and earning rewards. Distributing yields to liquidity providers.',
    collecting:
      'Accepting tokens to activate the pool. Pool activates once minimum threshold is met. If not met by deadline, you can withdraw all your tokens.',
    idle: 'Pool is paused due to insufficient liquidity. Rewards are not being distributed. Pool reactivates when liquidity increases above minimum threshold.',
    debt: 'Pool has run out of USDC rewards. No rewards are being distributed. Contact the pool operator to add more USDC to resume rewards.',
    failed: 'Pool has failed. No rewards are being distributed. You can withdraw your tokens.',
    closed:
      'Pool has been closed by admin. You can withdraw your tokens immediately and claim any pending rewards.',
  },
  bar: {
    provisionWindowLabel: 'Provision window closes in',
    provisionWindowTooltip:
      'Time remaining to provide funds during the collection phase. Pool activates if the minimum threshold is met before this deadline.',
    critical:
      'Pool has insufficient liquidity. Rewards are paused until provided tokens increase above the minimum threshold required for operations.',
    warning:
      'Pool liquidity is below optimal levels. Additional tokens may be needed to maintain stable reward distribution.',
    healthy:
      'Pool has sufficient liquidity. Rewards are being distributed normally to all providers.',
    stable: {
      label: 'Stable',
      tooltip: (amount: string) => `Stable: ${amount}`,
    },
    total: {
      label: 'Total',
    },
    pendingWithdrawals: {
      tooltip: (amount: string) => `Pending withdrawals: ${amount}`,
    },
    minimumThreshold: {
      tooltip: (amount: string) => `Minimum threshold: ${amount}`,
    },
  },
} as const;

// Pool Stats
export const STATS_TEXTS = {
  tvl: {
    label: 'TVL',
    tooltip:
      'Total Value Locked: current amount provided to the pool (including pending withdrawals) out of the maximum pool capacity.',
  },
  apy: {
    label: 'APY',
    tooltip: (symbol: string) =>
      `APY = (Monthly Payout × 12) / (Max Pool Capacity × ${symbol} Price)\nBased on full pool capacity and live ${symbol} price.`,
  },
  monthlyPayout: {
    label: 'Total Funding',
    tooltip: (symbol: string) => `The total amount of rewards funded to the pool.`,
  },
} as const;

// Pool Yield Chart
export const CHART_TEXTS = {
  labels: {
    apy: 'APY',
    tvl: 'TVL',
  },
  periods: {
    oneWeek: '1W',
    oneMonth: '1M',
    threeMonths: '3M',
  },
  subtitle: {
    apy: (symbol: string) => `Historical APY based on past ${symbol} token prices.`,
    tvl: (symbol: string) => `Historical TVL showing provided ${symbol} tokens over time.`,
  },
} as const;

// Pending Withdrawals
export const WITHDRAWALS_TEXTS = {
  tabTitle: 'Pending Withdrawals',
  tooltip:
    'Withdrawals that are waiting for the unlock period to complete before they can be claimed.',
  table: {
    withdrawalId: 'Withdrawal ID',
    amount: 'Amount',
    timeLeft: {
      label: 'Time Left',
      tooltip: 'Remaining time before this withdrawal can be claimed.',
    },
  },
  noRequests: 'No withdrawal requests',
} as const;

// Manage Tab
export const MANAGE_TEXTS = {
  rewardPoolBalance: {
    label: 'Reward Pool Balance',
    tooltip: 'Total rewards available for distribution to providers.',
  },
  poolSettings: 'Pool Settings',
  distributionRate: {
    label: 'Distribution Rate',
    tooltip: 'Daily reward amount distributed to providers. Monthly payout = rate × 30 days.',
    unit: '/day',
  },
  maxPoolCapacity: {
    label: 'Max Pool Capacity',
    tooltip: (symbol: string) =>
      `Maximum ${symbol} that can be provided. Higher capacity allows more providers to participate.`,
  },
} as const;

// Info Tab
export const INFO_TEXTS = {
  title: 'Pool Info',
  contract: 'Contract',
  operator: 'Operator',
  lpToken: {
    label: 'LP-Token',
    tooltip: (symbol: string) =>
      `Liquidity Provider token representing your share in the pool. You receive LP tokens when you provide ${symbol}.`,
  },
  rewardToken: {
    label: 'Reward Token',
    tooltip: 'The token used to distribute rewards to pool participants.',
  },
  created: 'Created',
  website: 'Website',
  description: 'Description',
  actions: {
    openInExplorer: 'Open in Explorer',
    addToWallet: 'Add to Wallet',
  },
  notifications: {
    tokenAddedSuccess: 'Token added to wallet',
    tokenAddedError: 'Failed to add token to wallet',
    tokenAddedErrorWithReason: (reason: string) => `Failed to add token to wallet: ${reason}`,
  },
} as const;

// Delegate Tab
export const DELEGATE_TEXTS = {
  currentBalance: {
    label: 'Current Balance',
    tooltip: (symbol: string) => `Your provided ${symbol} tokens in this pool.`,
  },
  availableRewards: {
    label: 'Available Rewards',
    tooltip: 'Accumulated rewards ready to claim.',
  },
  rewardRateUnit: '/day',
  claimButtonTooltip:
    'Claim your accumulated rewards. Rewards are distributed daily based on your pool share.',
  alerts: {
    idle: (symbol: string) =>
      `The reward distribution is paused because there are insufficient ${symbol} tokens provided to the pool.`,
    debt: 'The reward distribution is paused because the pool is out of rewards.',
  },
} as const;

// Top Up Dialog
export const TOP_UP_DIALOG_TEXTS = {
  title: 'Top Up Pool Rewards',
  description: (symbol: string) =>
    `Enter the total ${symbol} to add. The pool contract splits provider credit, worker pool, and burn per the fee router; worker and burn portions are swapped toward SQD when enabled.`,
  amountLabel: 'Total',
  feeRouterConnecting: 'Connecting to fee router…',
  feeConfigError: 'Failed to load fee configuration. Check your network connection.',
  splitPreviewTitle: 'Fee split preview',
  splitPreviewTooltip:
    'Estimated shares from on-chain fee settings (basis points). Worker and burn rows show approximate SQD from the current SQD/USD price when the reward token is treated as USD-pegged. Actual amounts may differ.',
  splitRowBuybackSpotTotal: 'Buyback total (spot ~SQD)',
  rowRewards: 'Rewards',
  rowWorker: 'Worker pool',
  rowBurn: 'Burn',
  slippageTitle: 'Max. slippage',
  slippageAutoLabel: 'Auto',
  slippageAutoHint: 'Uses on-chain TWAP price for the SQD buyback. No minimum SQD enforced.',
  slippageCustomHint:
    'Maximum price movement you accept. If the buyback returns less SQD than the computed minimum, the transaction reverts.',
  slippageHighWarning: 'High slippage — your transaction may be frontrun.',
  slippageLowWarning: 'Very low slippage — your transaction is likely to fail.',
  slippageNotStableNote:
    'Percentage-based slippage protection is only available for USD-pegged reward tokens. Using Auto mode.',
  slippageMinReceived: (sqd: string) => `Min. received: ~${sqd}`,
  slippageMinReceivedHint:
    'Minimum SQD the contract will accept from the buyback. Computed from spot price minus your slippage tolerance.',
  SLIPPAGE_PRESETS: [0.5, 1, 2, 5] as const,
  DEFAULT_SLIPPAGE_PCT: '1',
  slippageBlocked: {
    loadingPrice: 'Loading SQD price…',
    loadingPreview: 'Loading fee settings…',
    stableOnly: 'Min. SQD estimate requires a USD-pegged reward token.',
    noPrice: 'SQD price unavailable.',
    noSwap: 'No SQD buyback for this amount.',
    enterAmount: 'Enter an amount first.',
  },
} as const;

// Withdraw Dialog
export const WITHDRAW_DIALOG_TEXTS = {
  title: 'Withdraw from Pool',
  amountLabel: 'Amount',
  fields: {
    totalDelegation: 'Total Tokens',
    yourDelegation: 'Your Tokens',
    expectedMonthlyPayout: 'Expected Monthly Payout',
    expectedUnlockDate: {
      label: 'Expected Unlock Date',
      tooltip:
        'Date when withdrawn funds will be available to claim. Withdrawal requests require a waiting period for pool security.',
    },
  },
  tooltips: {
    collecting: 'You cannot withdraw funds while the pool is still collecting',
    nothingToWithdraw: 'Nothing to withdraw',
  },
  failedWithdraw: {
    title: 'Withdraw from Failed Pool',
    description:
      'This pool failed to activate before the deadline. Your full balance will be returned immediately.',
    button: 'WITHDRAW ALL',
  },
  closedWithdraw: {
    title: 'Emergency Withdraw',
    description:
      'This pool has been closed. Your full balance will be returned immediately without a waiting period.',
    button: 'EMERGENCY WITHDRAW',
  },
} as const;

// Provide Dialog
export const PROVIDE_DIALOG_TEXTS = {
  title: 'Provide to Pool',
  sourceLabel: 'Source',
  amountLabel: 'Amount',
  fields: {
    totalDelegation: 'Total Tokens',
    yourDelegation: 'Your Tokens',
    expectedMonthlyPayout: {
      label: 'Expected Monthly Payout',
      tooltip: 'Estimated monthly rewards based on your share of the pool at current APY.',
    },
  },
  alerts: {
    collecting:
      'Pool is collecting tokens to activate. Your tokens are locked until the pool activates or the provision window closes. If activation fails, you can withdraw in full.',
    idle: 'Pool is paused due to low liquidity. Rewards are not being distributed.',
    poolFull: 'Pool is at maximum capacity. No more tokens are accepted.',
    userAtLimit: (amount: string) => `You have reached the maximum token limit of ${amount}.`,
  },
  tooltips: {
    poolAtCapacity: 'Pool is at maximum capacity',
    notWhitelisted: 'You are not whitelisted for this pool',
    poolNotAccepting: 'Pool is no longer accepting deposits',
  },
} as const;

// Edit Settings Dialog
export const EDIT_SETTINGS_DIALOG_TEXTS = {
  editCapacity: {
    title: 'Edit Max Pool Capacity',
    label: (symbol: string) => `Max Pool Capacity (${symbol})`,
  },
  editDistributionRate: {
    title: 'Edit Distribution Rate',
    label: (symbol: string) => `Distribution Rate (${symbol}/day)`,
  },
} as const;

// Edit Metadata Dialog
export const EDIT_METADATA_DIALOG_TEXTS = {
  title: 'Edit Pool Metadata',
  nameLabel: 'Pool Name',
  descriptionLabel: 'Description',
  websiteLabel: 'Website',
} as const;

// Activity Tab
export const ACTIVITY_TEXTS = {
  title: 'Activity',
  myActivityToggle: 'My Activity',
  table: {
    account: 'Account',
    type: 'Type',
    amount: 'Amount',
    time: 'Time',
    txn: 'Txn',
  },
  eventTypes: {
    provide: 'Provide',
    withdrawal: 'Withdraw',
    exit: 'Exit',
    topup: 'Top Up',
    claim: 'Claim',
  },
  noActivity: 'No activity yet',
} as const;
