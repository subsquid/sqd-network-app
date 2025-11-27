import { addressFormatter, tokenFormatter } from '@lib/formatters/formatters';
import { fromSqd, unwrapMulticallResult } from '@lib/network/utils';
import { Box, Chip, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { keepPreviousData } from '@tanstack/react-query';
import chunk from 'lodash-es/chunk';
import { erc20Abi } from 'viem';
import { useReadContracts } from 'wagmi';

import { vestingAbi } from '@api/contracts';
import { useTemporaryHoldingsByAccountQuery } from '@api/subsquid-network-squid';
import { DashboardTable, NoItems } from '@components/Table';
import { NameWithAvatar } from '@components/SourceWalletName';
import { useAccount } from '@network/useAccount';
import { useContracts } from '@network/useContracts';

import { useMemo } from 'react';
import { CopyToClipboard } from '@components/CopyToClipboard';
import { Link } from 'react-router-dom';

export function MyTemporaryHoldings() {
  const account = useAccount();

  const temporaryHoldingsQuery = useTemporaryHoldingsByAccountQuery({
    address: account.address as `0x${string}`,
  });
  const { SQD_TOKEN, SQD } = useContracts();

  const temporaryHoldingsData = useReadContracts({
    contracts: temporaryHoldingsQuery.data?.accounts?.flatMap(s => {
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
      enabled: !!temporaryHoldingsQuery.data?.accounts?.length,
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

  const isLoading = temporaryHoldingsQuery.isLoading || temporaryHoldingsData.isLoading;

  const data = useMemo(
    () =>
      temporaryHoldingsQuery.data?.accounts?.map((temporaryHolding, i) => ({
        ...temporaryHolding,
        ...temporaryHoldingsData.data?.[i],
      })) || [],
    [temporaryHoldingsQuery.data?.accounts, temporaryHoldingsData],
  );

  return (
    <>
      <DashboardTable loading={isLoading}>
        <TableHead>
          <TableRow>
            <TableCell>Contract</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Balance</TableCell>
            <TableCell>Deposited</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data?.length ? (
            data.map(temporaryHolding => (
              <TableRow key={temporaryHolding.id}>
                <TableCell>
                  <NameWithAvatar
                    title={`${temporaryHolding.type
                      .split('_')
                      .map(word => word[0]?.toUpperCase() + word.slice(1).toLowerCase())
                      .join(' ')} contract`}
                    subtitle={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CopyToClipboard
                          text={temporaryHolding.id}
                          content={
                            <Link to={`/assets/vestings/${temporaryHolding.id}`}>
                              {addressFormatter(temporaryHolding.id, true)}
                            </Link>
                          }
                        />
                      </Box>
                    }
                    avatarValue={temporaryHolding.id}
                    sx={{ width: { xs: 200, sm: 240 } }}
                  />
                </TableCell>
                <TableCell>
                  {temporaryHolding.temporaryHolding?.locked ? (
                    <Chip color="success" label="Active" variant="outlined" />
                  ) : (
                    <Chip color="error" label="Expired" variant="outlined" />
                  )}
                </TableCell>
                <TableCell>
                  {tokenFormatter(fromSqd(temporaryHolding?.balance), SQD_TOKEN)}
                </TableCell>
                <TableCell>
                  {tokenFormatter(fromSqd(temporaryHolding?.deposited), SQD_TOKEN)}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <NoItems>
              <span>No temporary holding was found</span>
            </NoItems>
          )}
        </TableBody>
      </DashboardTable>
    </>
  );
}
