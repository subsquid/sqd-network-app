import { useMemo } from 'react';

import { UseQueryOptions } from '@tanstack/react-query';

import { useAccount } from '@network/useAccount';

import { useSquid } from './datasource';
import {
  AccountType,
  VestingFragmentFragment,
  useSourcesQuery,
  useVestingByAddressQuery,
} from './graphql';

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
  select?: UseQueryOptions<SourceWalletWithBalance[], unknown, TData>['select'];
} = {}) {
  const squid = useSquid();
  const { address } = useAccount();

  const { data: sourcesQuery, isLoading } = useSourcesQuery(
    { address: address || '0x' },
    { enabled },
  );

  const data: SourceWalletWithBalance[] = useMemo(
    () =>
      !sourcesQuery?.accounts?.length
        ? [
            {
              id: address || '0x',
              type: AccountType.User,
              balance: '0',
            },
          ]
        : sourcesQuery?.accounts,
    [address, sourcesQuery?.accounts],
  );

  const tData: TData = useMemo(() => select(data), [data, select]);

  return {
    data: tData,
    isLoading,
  };
}

export interface BlockchainApiVesting extends VestingFragmentFragment {}

export class BlockchainApiVesting {
  constructor(
    vesting: VestingFragmentFragment,
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

  const { data, isPending } = useVestingByAddressQuery(
    {
      address: address?.toLowerCase() || '',
    },
    {
      select: res => {
        if (!res.accountById) return undefined;
        if (res.accountById.type === AccountType.User) return undefined;

        return new BlockchainApiVesting(res.accountById, account.address);
      },
      enabled: !!address,
    },
  );

  return {
    data,
    isPending,
  };
}
