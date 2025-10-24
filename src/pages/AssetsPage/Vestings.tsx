import { addressFormatter, tokenFormatter } from '@lib/formatters/formatters';
import { fromSqd, unwrapMulticallResult } from '@lib/network/utils';
import { Box, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { keepPreviousData } from '@tanstack/react-query';
import chunk from 'lodash-es/chunk';
import { erc20Abi } from 'viem';
import { useReadContracts } from 'wagmi';

import { vestingAbi } from '@api/contracts';
import { AccountType, useSourcesQuery, useSquid } from '@api/subsquid-network-squid';
import { DashboardTable, NoItems } from '@components/Table';
import { NameWithAvatar } from '@components/SourceWalletName';
import { useAccount } from '@network/useAccount';
import { useContracts } from '@network/useContracts';

import { ReleaseButton } from './ReleaseButton';
import { useMemo } from 'react';
import { CopyToClipboard } from '@components/CopyToClipboard';
import { Link } from 'react-router-dom';
import { SectionHeader } from '@components/SectionHeader';

export function MyVestings() {
  const account = useAccount();
  const squid = useSquid();

  const { data: sourcesQuery, isLoading: isSourcesLoading } = useSourcesQuery({
    address: account.address as `0x${string}`,
  });
  const { SQD_TOKEN, SQD } = useContracts();

  const vestingsQuery = {
    accounts: sourcesQuery?.accounts.filter(s => s.type !== AccountType.User),
  };

  const { data: vestings, isLoading: isVestingsLoading } = useReadContracts({
    contracts: vestingsQuery.accounts?.flatMap(s => {
      const vestingContract = { abi: vestingAbi, address: s.id as `0x${string}` } as const;
      return [
        {
          ...vestingContract,
          functionName: 'depositedIntoProtocol',
        },
        {
          ...vestingContract,
          functionName: 'releasable',
          args: [SQD],
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
      enabled: !!vestingsQuery.accounts?.length,
      placeholderData: keepPreviousData,
      select: res => {
        if (res?.some(r => r.status === 'success')) {
          return chunk(res, 3).map(ch => ({
            deposited: unwrapMulticallResult(ch[0]),
            releasable: unwrapMulticallResult(ch[1]),
            balance: unwrapMulticallResult(ch[2]),
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
      vestingsQuery.accounts?.map((vesting, i) => ({
        ...vesting,
        ...vestings?.[i],
      })) || [],
    [vestingsQuery.accounts, vestings],
  );

  return (
    <>
      <SectionHeader title="My Vestings" />
      <DashboardTable loading={isLoading || isVestingsLoading}>
        <TableHead>
          <TableRow>
            <TableCell>Vesting</TableCell>
            <TableCell>Balance</TableCell>
            <TableCell>Deposited</TableCell>
            <TableCell>Releasable</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data?.length ? (
            data.map(vesting => (
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
                            <Link to={`/assets/vestings/${vesting.id}`}>
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
                <TableCell>{tokenFormatter(fromSqd(vesting?.balance), SQD_TOKEN)}</TableCell>
                <TableCell>{tokenFormatter(fromSqd(vesting?.deposited), SQD_TOKEN)}</TableCell>
                <TableCell>{tokenFormatter(fromSqd(vesting?.releasable), SQD_TOKEN)}</TableCell>
                <TableCell>
                  <Box display="flex" justifyContent="flex-end">
                    <ReleaseButton vesting={vesting} disabled={!vesting?.releasable} />
                  </Box>
                </TableCell>
              </TableRow>
            ))
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
