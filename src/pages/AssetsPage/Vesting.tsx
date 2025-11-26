import { dateFormat } from '@i18n';
import { addressFormatter, percentFormatter, tokenFormatter } from '@lib/formatters/formatters';
import { fromSqd, unwrapMulticallResult } from '@lib/network/utils';
import { Divider, Stack, styled } from '@mui/material';
import { Box } from '@mui/system';
import { keepPreviousData } from '@tanstack/react-query';
import { useParams, useSearchParams } from 'react-router-dom';
import { useReadContracts } from 'wagmi';

import { sqdAbi, vestingAbi } from '@api/contracts';
import { useVestingByAddress } from '@api/subsquid-network-squid';
import { Card } from '@components/Card';
import { SquaredChip } from '@components/Chip';
import { CopyToClipboard } from '@components/CopyToClipboard';
import { Loader } from '@components/Loader';
import { NotFound } from '@components/NotFound';
import { CenteredPageWrapper, NetworkPageTitle } from '@layouts/NetworkLayout';
import { useContracts } from '@network/useContracts';

import { ReleaseButton } from './ReleaseButton';
import BigNumber from 'bignumber.js';

export const DescLabel = styled(Box, {
  name: 'DescLabel',
})(({ theme }) => ({
  flex: 0.5,
  color: theme.palette.text.secondary,
  whiteSpace: 'balance',
  maxWidth: theme.spacing(25),
}));

export const DescValue = styled(Box, {
  name: 'DescValue',
})(({ theme }) => ({
  flex: 1,
  marginLeft: theme.spacing(2),
  overflowWrap: 'anywhere',
}));

export const VestingAddress = styled(Box, {
  name: 'VestingAddress',
})(({}) => ({
  overflowWrap: 'anywhere',
}));

export const Title = styled(SquaredChip)(({ theme }) => ({
  marginBottom: theme.spacing(3),
}));

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

  const [searchParams] = useSearchParams();

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
    <CenteredPageWrapper className="wide">
      <NetworkPageTitle
        backPath={searchParams.get('backPath') || backPath}
        endAdornment={
          vesting?.isOwn() ? (
            <Stack>
              <ReleaseButton vesting={vesting} />
            </Stack>
          ) : null
        }
      />
      <Card variant="outlined">
        <Stack spacing={3} divider={<Divider orientation="horizontal" flexItem />}>
          <Box>
            <Title label="Info" />
            <Stack spacing={2} direction="column">
              <Stack direction="row">
                <DescLabel>Contract</DescLabel>
                <DescValue>
                  <VestingAddress>
                    <CopyToClipboard text={address} content={addressFormatter(address)} />
                  </VestingAddress>
                </DescValue>
              </Stack>
              <Stack direction="row">
                <DescLabel>Balance</DescLabel>
                <DescValue>{tokenFormatter(fromSqd(vestingInfo?.balance), SQD_TOKEN, 8)}</DescValue>
              </Stack>
              <Stack direction="row">
                <DescLabel>Deposited</DescLabel>
                <DescValue>
                  {tokenFormatter(fromSqd(vestingInfo?.deposited), SQD_TOKEN, 8)}
                </DescValue>
              </Stack>
              <Stack direction="row">
                <DescLabel>Releasable</DescLabel>
                <DescValue>
                  {tokenFormatter(releasableAmount, SQD_TOKEN, 8)}{' '}
                  <Box display="inline" title="Including deposited">
                    ({tokenFormatter(totalVestedMinusReleased, SQD_TOKEN, 3)})
                  </Box>
                </DescValue>
              </Stack>
              <Stack direction="row">
                <DescLabel>Released</DescLabel>
                <DescValue>
                  {tokenFormatter(fromSqd(vestingInfo?.released), SQD_TOKEN, 8)}
                </DescValue>
              </Stack>
            </Stack>
          </Box>
          <Box>
            <Title label="Lock Period" />
            <Stack spacing={2} direction="column">
              <Stack direction="row">
                <DescLabel>Start</DescLabel>
                <DescValue>
                  {vestingInfo?.start ? dateFormat(vestingInfo?.start, 'dateTime') : '-'}
                </DescValue>
              </Stack>
              <Stack direction="row">
                <DescLabel>End</DescLabel>
                <DescValue>
                  {vestingInfo?.end ? dateFormat(vestingInfo?.end, 'dateTime') : '-'}
                </DescValue>
              </Stack>
              <Stack direction="row">
                <DescLabel>Initial release</DescLabel>
                <DescValue>{`${tokenFormatter(
                  fromSqd(vestingInfo?.expectedTotal)
                    .times(vestingInfo?.initialRelease ?? 0)
                    .div(100),
                  SQD_TOKEN,
                  8,
                )} (${percentFormatter(vestingInfo?.initialRelease)})`}</DescValue>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </Card>
    </CenteredPageWrapper>
  );
}
