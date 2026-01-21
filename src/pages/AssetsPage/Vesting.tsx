import { dateFormat } from '@i18n';
import { CenteredPageWrapper, PageTitle } from '@layouts/NetworkLayout';
import { Box, Divider, Stack, Typography, useTheme } from '@mui/material';
import { keepPreviousData } from '@tanstack/react-query';
import BigNumber from 'bignumber.js';
import { useParams } from 'react-router-dom';
import { useReadContracts } from 'wagmi';

import { sqdAbi, vestingAbi } from '@api/contracts';
import { useVestingByAddress } from '@api/subsquid-network-squid';
import { Avatar } from '@components/Avatar';
import { Card } from '@components/Card';
import { CopyToClipboard } from '@components/CopyToClipboard';
import { Loader } from '@components/Loader';
import { NotFound } from '@components/NotFound';
import { Property, PropertyList } from '@components/Property';
import { addressFormatter, percentFormatter, tokenFormatter } from '@lib/formatters/formatters';
import { fromSqd, unwrapMulticallResult } from '@lib/network/utils';
import { useContracts } from '@hooks/network/useContracts';

import { ReleaseButton } from './ReleaseButton';

function VestingTitle({ address }: { address: `0x${string}` }) {
  const theme = useTheme();

  return (
    <Stack spacing={0.5}>
      <Typography variant="h4" sx={{ overflowWrap: 'anywhere' }}>
        Vesting
      </Typography>
      <Typography
        variant="body2"
        component="span"
        sx={{ overflowWrap: 'anywhere', color: theme.palette.text.secondary }}
      >
        <CopyToClipboard text={address} content={addressFormatter(address)} />
      </Typography>
    </Stack>
  );
}

export function Vesting({ backPath }: { backPath: string }) {
  const { SQD_TOKEN, SQD } = useContracts();

  const { address } = useParams<{ address: `0x${string}` }>();

  const vestingContract = { abi: vestingAbi, address } as const;
  const { data: vestingInfo, isLoading: isVestingInfoLoading } = useReadContracts({
    contracts: [
      {
        ...vestingContract,
        functionName: 'start',
      },
      {
        ...vestingContract,
        functionName: 'end',
      },
      {
        ...vestingContract,
        functionName: 'depositedIntoProtocol',
      },
      {
        ...vestingContract,
        functionName: 'vestedAmount',
        args: [SQD, BigInt(Math.floor(Date.now() / 1000))],
      },
      {
        ...vestingContract,
        functionName: 'released',
        args: [SQD],
      },
      {
        abi: sqdAbi,
        address: SQD,
        functionName: 'balanceOf',
        args: [address || '0x'],
      },
      {
        ...vestingContract,
        functionName: 'immediateReleaseBIP',
      },
      {
        ...vestingContract,
        functionName: 'expectedTotalAmount',
      },
    ] as const,
    query: {
      placeholderData: keepPreviousData,
      select: res => {
        if (res?.some(r => r.status === 'success')) {
          return {
            start: Number(unwrapMulticallResult(res[0])) * 1000,
            end: Number(unwrapMulticallResult(res[1])) * 1000,
            deposited: unwrapMulticallResult(res[2]),
            vestedAmount: unwrapMulticallResult(res[3]),
            released: unwrapMulticallResult(res[4]),
            balance: unwrapMulticallResult(res[5]),
            initialRelease: Number(unwrapMulticallResult(res[6]) || 0) / 100,
            expectedTotal: unwrapMulticallResult(res[7]),
          };
        }

        return undefined;
      },
    },
  });
  const { data: vesting, isPending: isVestingLoading } = useVestingByAddress({ address });

  const isLoading = isVestingLoading || isVestingInfoLoading;

  if (isLoading) return <Loader />;
  else if (!vesting || !address) {
    return <NotFound item="vesting" id={address} />;
  }

  const vestedAmount = fromSqd(vestingInfo?.vestedAmount);
  const released = fromSqd(vestingInfo?.released);
  const balance = fromSqd(vestingInfo?.balance);

  const totalVestedMinusReleased = vestedAmount.minus(released);
  const releasableAmount = BigNumber.min(totalVestedMinusReleased, balance);

  return (
    <CenteredPageWrapper>
      <PageTitle title="Vesting" />
      <Card
        title={
          <Stack spacing={2} direction="row" alignItems="center">
            <Avatar variant="circular" name={address} colorDiscriminator={address} size={56} />
            <VestingTitle address={address} />
          </Stack>
        }
        action={
          vesting?.isOwn() ? (
            <Stack direction="row" spacing={1}>
              <ReleaseButton vesting={vesting} />
            </Stack>
          ) : null
        }
      >
        <Stack spacing={2}>
          <Divider orientation="horizontal" flexItem />
          <PropertyList>
            <Property label="Balance" value={tokenFormatter(balance, SQD_TOKEN, 8)} />
            <Property
              label="Deposited"
              value={tokenFormatter(fromSqd(vestingInfo?.deposited), SQD_TOKEN, 8)}
            />
            <Property
              label="Releasable"
              value={
                <>
                  {tokenFormatter(releasableAmount, SQD_TOKEN, 8)}{' '}
                  <Box display="inline" title="Including deposited">
                    ({tokenFormatter(totalVestedMinusReleased, SQD_TOKEN, 3)})
                  </Box>
                </>
              }
            />
            <Property label="Released" value={tokenFormatter(released, SQD_TOKEN, 8)} />
          </PropertyList>
          <Divider orientation="horizontal" flexItem />
          <PropertyList>
            <Property
              label="Start"
              value={vestingInfo?.start ? dateFormat(vestingInfo?.start, 'dateTime') : '-'}
            />
            <Property
              label="End"
              value={vestingInfo?.end ? dateFormat(vestingInfo?.end, 'dateTime') : '-'}
            />
            <Property
              label="Initial release"
              value={`${tokenFormatter(
                fromSqd(vestingInfo?.expectedTotal)
                  .times(vestingInfo?.initialRelease ?? 0)
                  .div(100),
                SQD_TOKEN,
                8,
              )} (${percentFormatter(vestingInfo?.initialRelease)})`}
            />
          </PropertyList>
        </Stack>
      </Card>
    </CenteredPageWrapper>
  );
}
