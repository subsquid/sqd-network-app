import { useMemo } from 'react';

import { Box, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import BigNumber from 'bignumber.js';
import chunk from 'lodash-es/chunk';
import { erc20Abi } from 'viem';
import { useAccount, useReadContracts } from 'wagmi';

import { vestingAbi } from '@api/contracts';
import { trpc } from '@api/trpc';
import { Card } from '@components/Card';
import { NameWithAvatar } from '@components/SourceWalletName';
import { ClickableTableRow, DashboardTable, InteractiveCell, NoItems } from '@components/Table';
import { useContracts } from '@hooks/network/useContracts';
import { addressFormatter, tokenFormatter } from '@lib/formatters/formatters';
import { fromSqd, unwrapMulticallResult } from '@lib/network/utils';

import { ReleaseButton } from './ReleaseButton';

export function MyVestings() {
  const account = useAccount();

  const { data: vestingsData, isLoading: isSourcesLoading } = useQuery(
    trpc.account.vestings.queryOptions(
      { address: (account.address as string) || '0x' },
      { enabled: !!account.address },
    ),
  );
  const { SQD_TOKEN, SQD } = useContracts();

  const { data: vestings, isLoading: isVestingsLoading } = useReadContracts({
    contracts: (vestingsData as any[])?.flatMap((s: any) => {
      const vestingContract = { abi: vestingAbi, address: s.id as `0x${string}` } as const;
      return [
        {
          ...vestingContract,
          functionName: 'depositedIntoProtocol',
        },
        {
          ...vestingContract,
          functionName: 'released',
          args: [SQD],
        },
        {
          ...vestingContract,
          functionName: 'vestedAmount',
          args: [SQD, Math.floor(Date.now() / 1000)],
        },
        {
          abi: erc20Abi,
          address: SQD,
          functionName: 'balanceOf',
          args: [s.id as `0x${string}`],
        },
      ] as const;
    }),
    allowFailure: true,
    query: {
      enabled: !!(vestingsData as any[])?.length,
      placeholderData: keepPreviousData,
      select: res => {
        if (res?.some(r => r.status === 'success')) {
          return chunk(res, 4).map(ch => ({
            deposited: unwrapMulticallResult(ch[0]),
            released: unwrapMulticallResult(ch[1]),
            vestedAmount: unwrapMulticallResult(ch[2]),
            balance: unwrapMulticallResult(ch[3]),
          }));
        } else if (res?.length === 0) {
          return [];
        }

        return undefined;
      },
    },
  });

  const isLoading = isSourcesLoading || isVestingsLoading;

  const data = useMemo(
    () =>
      (vestingsData as any[])?.map((vesting: any, i: number) => ({
        ...vesting,
        ...vestings?.[i],
      })) || [],
    [vestingsData, vestings],
  );

  return (
    <Card>
      <DashboardTable loading={isLoading || isVestingsLoading} sx={{ mx: -2, mb: -2, mt: -0.5 }}>
        <TableHead>
          <TableRow>
            <TableCell>Contract</TableCell>
            <TableCell>Balance</TableCell>
            <TableCell>Deposited</TableCell>
            <TableCell>Releasable</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data?.length ? (
            data.map(vesting => {
              const vestedAmount = fromSqd(vesting?.vestedAmount);
              const released = fromSqd(vesting?.released);
              const balance = fromSqd(vesting?.balance);
              const totalVestedMinusReleased = vestedAmount.minus(released);
              const releasableAmount = BigNumber.min(totalVestedMinusReleased, balance);

              return (
                <ClickableTableRow key={vesting.id} to={`/vesting/${vesting.id}`}>
                  <TableCell>
                    <NameWithAvatar
                      title={`${vesting.type
                        .split('_')
                        .map((word: string) => word[0]?.toUpperCase() + word.slice(1).toLowerCase())
                        .join(' ')} contract`}
                      subtitle={addressFormatter(vesting.id, true)}
                      avatarValue={vesting.id}
                      sx={{ width: { xs: 200, sm: 240 } }}
                    />
                  </TableCell>
                  <TableCell>{tokenFormatter(balance, SQD_TOKEN)}</TableCell>
                  <TableCell>{tokenFormatter(fromSqd(vesting?.deposited), SQD_TOKEN)}</TableCell>
                  <TableCell>
                    {tokenFormatter(releasableAmount, SQD_TOKEN)}{' '}
                    <Box display="inline" title="Including deposited">
                      ({tokenFormatter(totalVestedMinusReleased, SQD_TOKEN, 3)})
                    </Box>
                  </TableCell>
                  <InteractiveCell>
                    <Box display="flex" justifyContent="flex-end">
                      <ReleaseButton vesting={vesting} disabled={releasableAmount.isZero()} />
                    </Box>
                  </InteractiveCell>
                </ClickableTableRow>
              );
            })
          ) : (
            <NoItems>
              <span>No vesting was found</span>
            </NoItems>
          )}
        </TableBody>
      </DashboardTable>
    </Card>
  );
}
