// Page
export const PAGE_TEXTS = {
  title: 'Portal Pool',
  betaLabel: 'Beta',
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
      'Accepting lock-ups to activate the pool. Pool activates once minimum threshold is met. If not met by deadline, you can withdraw your full lock-up.',
    idle: 'Pool is paused due to insufficient liquidity. Rewards are not being distributed. Pool reactivates when liquidity increases above minimum threshold.',
    debt: 'Pool has run out of USDC rewards. No rewards are being distributed. Contact the pool operator to add more USDC to resume rewards.',
  },
  bar: {
    depositWindowLabel: 'Lock-up window closes in',
    depositWindowTooltip:
      'Time remaining to lock up funds during the collection phase. Pool activates if the minimum threshold is met before this deadline.',
    critical:
      'Pool has insufficient liquidity. Rewards are paused until lock-ups increase above the minimum threshold required for operations.',
    warning:
      'Pool liquidity is below optimal levels. Additional lock-ups may be needed to maintain stable reward distribution.',
    healthy:
      'Pool has sufficient liquidity. Rewards are being distributed normally to all delegators.',
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
    tooltip: 'Total Value Locked - current lock-ups relative to maximum pool capacity.',
  },
  apy: {
    label: 'APY',
    tooltip: (symbol: string) =>
      `APY = (Monthly Payout × 12) / (Max Pool Capacity × ${symbol} Price)\nBased on full pool capacity and live ${symbol} price.`,
  },
  monthlyPayout: {
    label: 'Total Funding',
    tooltip: (symbol: string) => `Total amount of rewards funded to the pool`,
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
    tvl: (symbol: string) => `Historical TVL showing locked ${symbol} tokens over time.`,
  },
} as const;

// Pending Withdrawals
export const WITHDRAWALS_TEXTS = {
  tabTitle: 'Withdrawals',
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
    tooltip: 'Total rewards available for distribution to delegators.',
  },
  poolSettings: 'Pool Settings',
  distributionRate: {
    label: 'Distribution Rate',
    tooltip: 'Daily reward amount distributed to delegators. Monthly payout = rate × 30 days.',
    unit: '/day',
  },
  maxPoolCapacity: {
    label: 'Max Pool Capacity',
    tooltip: (symbol: string) =>
      `Maximum ${symbol} that can be locked up. Higher capacity allows more delegators to participate.`,
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
      `Liquidity Provider token representing your share in the pool. You receive LP tokens when you lock up ${symbol}.`,
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
    tooltip: (symbol: string) => `Your locked up ${symbol} tokens in this pool.`,
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
      `The reward distribution is paused because there is insufficient ${symbol} locked in the pool`,
    debt: 'The reward distribution is paused because the pool is out of rewards',
  },
} as const;

// Top Up Dialog
export const TOP_UP_DIALOG_TEXTS = {
  title: 'Top Up Pool Rewards',
  description: (symbol: string) =>
    `Add ${symbol} rewards to the pool. These funds will be distributed to delegators based on their pool share.`,
  amountLabel: 'Amount',
} as const;

// Withdraw Dialog
export const WITHDRAW_DIALOG_TEXTS = {
  title: 'Withdraw from Pool',
  amountLabel: 'Amount',
  fields: {
    totalDelegation: 'Total Lock-up',
    yourDelegation: 'Your Lock-up',
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
} as const;

// Provide Dialog
export const PROVIDE_DIALOG_TEXTS = {
  title: 'Lock up to Pool',
  sourceLabel: 'Source',
  amountLabel: 'Amount',
  fields: {
    totalDelegation: 'Total Lock-up',
    yourDelegation: 'Your Lock-up',
    expectedMonthlyPayout: {
      label: 'Expected Monthly Payout',
      tooltip: 'Estimated monthly rewards based on your share of the pool at current APY.',
    },
  },
  alerts: {
    collecting:
      'Pool is collecting lock-ups to activate. Your lock-up is locked until the pool activates or the lock-up window closes. If activation fails, you can withdraw in full.',
    idle: 'Pool is paused due to low liquidity. Rewards are not being distributed.',
    poolFull: 'Pool is at maximum capacity. No more lock-ups accepted.',
    userAtLimit: (amount: string) => `You have reached the maximum lock-up limit of ${amount}.`,
  },
  tooltips: {
    poolAtCapacity: 'Pool is at maximum capacity',
    notWhitelisted: 'You are not whitelisted for this pool',
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

// Activity Tab
export const ACTIVITY_TEXTS = {
  title: 'Activity',
  table: {
    account: 'Account',
    type: 'Type',
    amount: 'Amount',
    time: 'Time',
    txn: 'Txn',
  },
  eventTypes: {
    deposit: 'Deposit',
    withdrawal: 'Withdrawal',
    exit: 'Exit',
  },
  noActivity: 'No activity yet',
} as const;

// Top Ups Tab
export const TOP_UPS_TEXTS = {
  title: 'Top Ups',
  table: {
    amount: 'Amount',
    time: 'Time',
    txn: 'Txn',
  },
  noTopUps: 'No top-ups yet',
} as const;
