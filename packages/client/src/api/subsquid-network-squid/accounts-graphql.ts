import { useMemo } from 'react';

import { useQuery } from '@tanstack/react-query';
import { useAccount } from 'wagmi';

import { trpc } from '@api/trpc';
import { AccountType, type Vesting } from '@api/types';

export type SourceWallet = {
  id: string;
  type: AccountType;
};

export type SourceWalletWithBalance = SourceWallet & {
  balance: string;
};

export function useMySources<TData = SourceWalletWithBalance[]>({
  enabled,
  select = data => data as TData,
}: {
  enabled?: boolean;
  select?: (data: SourceWalletWithBalance[]) => TData;
} = {}) {
  const { address } = useAccount();

  const { data: accountsRaw, isLoading } = useQuery(
    trpc.account.sources.queryOptions({ address: address || '0x' }, { enabled }),
  );

  const data: SourceWalletWithBalance[] = useMemo(
    () =>
      !accountsRaw?.length
        ? [
            {
              id: address || '0x',
              type: AccountType.User,
              balance: '0',
            },
          ]
        : (accountsRaw as SourceWalletWithBalance[]),
    [address, accountsRaw],
  );

  const tData: TData = useMemo(() => select(data), [data, select]);

  return {
    data: tData,
    isLoading,
  };
}

export interface BlockchainApiVesting extends Vesting {}

export class BlockchainApiVesting {
  constructor(
    vesting: Vesting,
    private address?: string,
  ) {
    Object.assign(this, vesting);
  }

  isOwn() {
    return this.owner?.id === this.address?.toLowerCase();
  }
}

export function useVestingByAddress({ address }: { address?: string }) {
  const account = useAccount();

  const { data: raw, isPending } = useQuery(
    trpc.account.vesting.queryOptions(
      { address: address?.toLowerCase() || '' },
      { enabled: !!address },
    ),
  );

  const data = useMemo(() => {
    if (!raw) return undefined;
    if (raw.type === AccountType.User) return undefined;

    return new BlockchainApiVesting(raw, account.address);
  }, [raw, account.address]);

  return {
    data,
    isPending,
  };
}
