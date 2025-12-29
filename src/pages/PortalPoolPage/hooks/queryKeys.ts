export const poolQueryKeys = {
  pool: (poolId?: string) => ['portalPool', poolId] as const,
  user: (poolId?: string, address?: string) => ['portalPoolUser', poolId, address] as const,
  withdrawals: (poolId?: string, address?: string) =>
    ['portalPoolWithdrawals', poolId, address] as const,
  isPortal: (poolId?: string) => ['isPortal', poolId] as const,
  lpTokenSymbol: (tokenAddress?: string) => ['lpTokenSymbol', tokenAddress] as const,
};

