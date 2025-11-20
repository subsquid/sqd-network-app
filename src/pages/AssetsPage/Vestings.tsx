import { addressFormatter, tokenFormatter } from '@lib/formatters/formatters';
import { fromSqd, unwrapMulticallResult } from '@lib/network/utils';
import { Box, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { keepPreviousData } from '@tanstack/react-query';
import chunk from 'lodash-es/chunk';
import { erc20Abi } from 'viem';
import { useReadContracts } from 'wagmi';

import { vestingAbi } from '@api/contracts';
import { DashboardTable, NoItems } from '@components/Table';
import { NameWithAvatar } from '@components/SourceWalletName';
import { useAccount } from '@network/useAccount';
import { useContracts } from '@network/useContracts';

import { ReleaseButton } from './ReleaseButton';
import { useMemo } from 'react';
import { CopyToClipboard } from '@components/CopyToClipboard';
import { Link } from 'react-router-dom';
import { SectionHeader } from '@components/SectionHeader';
import { useVestingsByAccountQuery } from '@api/subsquid-network-squid';
import BigNumber from 'bignumber.js';

export function MyVestings() {
  const account = useAccount();

  const { data: vestingsQuery, isLoading: isSourcesLoading } = useVestingsByAccountQuery({
    address: account.address as `0x${string}`,
  });
  const { SQD_TOKEN, SQD } = useContracts();

  const { data: vestings, isLoading: isVestingsLoading } = useReadContracts({
    contracts: vestingsQuery?.accounts?.flatMap(s => {
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
      enabled: !!vestingsQuery?.accounts?.length,
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
      vestingsQuery?.accounts?.map((vesting, i) => ({
        ...vesting,
        ...vestings?.[i],
      })) || [],
    [vestingsQuery?.accounts, vestings],
  );

  return (
    <>
      <SectionHeader title="My Vestings" sx={{ mb: 2 }} />
      <DashboardTable loading={isLoading || isVestingsLoading} sx={{ mb: 2 }}>
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
                <TableRow key={vesting.id}>
                  <TableCell>
                    <NameWithAvatar
                      title={`${vesting.type
                        .split('_')
                        .map(word => word[0]?.toUpperCase() + word.slice(1).toLowerCase())
                        .join(' ')} contract`}
                      subtitle={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <CopyToClipboard
                            text={vesting.id}
                            content={
                              <Link to={`/vesting/${vesting.id}`}>
                                {addressFormatter(vesting.id, true)}
                              </Link>
                            }
                          />
                        </Box>
                      }
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
                  <TableCell>
                    <Box display="flex" justifyContent="flex-end">
                      <ReleaseButton vesting={vesting} disabled={releasableAmount.isZero()}/>
                    </Box>
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <NoItems>
              <span>No vesting was found</span>
            </NoItems>
          )}
        </TableBody>
      </DashboardTable>
    </>
  );
}
