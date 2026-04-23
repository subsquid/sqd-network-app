import { useMemo } from 'react';

import { CircleRounded } from '@mui/icons-material';
import { Box, Grid, Stack, Typography, useTheme } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { Group } from '@visx/group';
import { Pie } from '@visx/shape';
import BigNumber from 'bignumber.js';
import { useAccount } from 'wagmi';

import { trpc } from '@api/trpc';
import { Card } from '@components/Card/Card';
import { HelpTooltip } from '@components/HelpTooltip';
import { Property, PropertyList } from '@components/Property';
import { demoFeaturesEnabled } from '@hooks/demoFeaturesEnabled';
import { useContracts } from '@hooks/network/useContracts';
import { dollarFormatter, tokenFormatter } from '@lib/formatters/formatters';
import { fromSqd } from '@lib/network/utils';

import { ClaimButton } from './ClaimButton';

type TokenBalance = {
  name: string;
  value: BigNumber;
  color: string;
  background: string;
  tip?: string;
};

function TokenBalance({ balance }: { balance?: TokenBalance }) {
  const { SQD_TOKEN } = useContracts();

  const label = (
    <Box display="flex" alignItems="center" gap={0.5} sx={{ cursor: 'default' }}>
      <CircleRounded sx={{ fontSize: 11, color: balance?.color }} />
      <Typography>{balance?.name}</Typography>
      <HelpTooltip title={balance?.tip} />
    </Box>
  );

  const value = <Typography>{tokenFormatter(fromSqd(balance?.value), SQD_TOKEN, 3)}</Typography>;

  return <Property label={label} value={value} />;
}

function PieChart({ balances }: { balances: TokenBalance[] }) {
  const filteredBalances = useMemo(() => balances.filter(b => !b.value.isZero()), [balances]);

  return (
    <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center">
      <svg width={192} height={192}>
        <Group top={96} left={96}>
          <Pie
            data={filteredBalances}
            pieValue={d => d.value.toNumber()}
            outerRadius={96}
            innerRadius={48}
            padAngle={0.02}
            cornerRadius={4}
          >
            {pie => {
              return pie.arcs.map((arc, i) => {
                return (
                  <g key={`arc-${i}`}>
                    <path d={pie.path(arc) || ''} fill={arc.data.color} />
                  </g>
                );
              });
            }}
          </Pie>
        </Group>
      </svg>
    </Box>
  );
}

// Helper function to create a token balance object
function createTokenBalance(
  name: string,
  color: string,
  background: string,
  tip: string,
): TokenBalance {
  return {
    name,
    value: BigNumber(0),
    color,
    background,
    tip,
  };
}

function useAssetsSummaryData(address: string | undefined) {
  return useQuery(
    trpc.account.assetsSummary.queryOptions({ address: address || '0x' }, { enabled: !!address }),
  );
}

function useTokenBalances(
  serverBalances:
    | {
        transferable: string;
        vesting: string;
        delegated: string;
        claimable: string;
        bonded: string;
        lockedPortal: string;
        portalPool: string;
      }
    | undefined,
) {
  const theme = useTheme();

  return useMemo((): TokenBalance[] => {
    return [
      {
        ...createTokenBalance(
          'Transferable',
          theme.palette.success.main,
          theme.palette.success.main,
          'Liquid tokens, can be freely transferred to external addresses',
        ),
        value: BigNumber(serverBalances?.transferable || 0),
      },
      {
        ...createTokenBalance(
          'Vesting',
          theme.palette.warning.main,
          theme.palette.warning.main,
          'Tokens locked in the vesting contracts owned by the wallet. Can be used for bonding (running a worker) and/or delegation',
        ),
        value: BigNumber(serverBalances?.vesting || 0),
      },
      {
        ...createTokenBalance(
          'Claimable',
          theme.palette.info.main,
          theme.palette.info.main,
          'Earned but not yet claimed token rewards, aggregated across all workers and delegations. Read directly from the rewards distribution contract on-chain, so it always matches what `Claim` will transfer. Note: per-worker and per-delegation reward figures shown elsewhere come from the indexer and may briefly diverge from this on-chain total.',
        ),
        value: BigNumber(serverBalances?.claimable || 0),
      },
      {
        ...createTokenBalance(
          'Workers',
          theme.palette.primary.contrastText,
          theme.palette.primary.main,
          'Tokens bonded in the worker registry contract',
        ),
        value: BigNumber(serverBalances?.bonded || 0),
      },
      {
        ...createTokenBalance(
          'Delegations',
          theme.palette.secondary.contrastText,
          theme.palette.secondary.main,
          'Tokens delegated to workers',
        ),
        value: BigNumber(serverBalances?.delegated || 0),
      },
      {
        ...createTokenBalance(
          'Portals',
          theme.palette.text.primary,
          theme.palette.text.primary,
          'Tokens locked in Portal stake',
        ),
        value: BigNumber(serverBalances?.lockedPortal || 0),
      },
      {
        ...createTokenBalance(
          'Portal Pools',
          theme.palette.error.main,
          theme.palette.error.main,
          'Tokens deposited into Portal Pools as liquidity',
        ),
        value: BigNumber(serverBalances?.portalPool || 0),
      },
    ];
  }, [serverBalances, theme.palette]);
}

function useTotalBalance(serverTotal: string | undefined) {
  return useMemo(() => BigNumber(serverTotal || 0), [serverTotal]);
}

export function MyAssets() {
  const { SQD_TOKEN, SQD } = useContracts();
  const account = useAccount();

  // Data fetching
  const { data: summary, isLoading: isSourcesLoading } = useAssetsSummaryData(account.address);
  const { data: price, isLoading: isPriceLoading } = useQuery(
    trpc.price.current.queryOptions(undefined, { enabled: !!SQD }),
  );

  // Computed data
  const balances = useTokenBalances(summary?.balances);
  const totalBalance = useTotalBalance(summary?.totalBalance);
  const rewardsBalance = balances[2]?.value || BigNumber(0);
  const claimableSources = summary?.claimableSources;
  const hasAvailableClaims = !!claimableSources?.some(source => source.balance !== '0');

  const isLoading = isSourcesLoading || isPriceLoading;

  const showDemoPortals = demoFeaturesEnabled();
  const breakdownBalances = useMemo(() => {
    const items: TokenBalance[] = [
      balances[0]!,
      balances[1]!,
      balances[3]!,
      balances[4]!,
      ...(showDemoPortals ? [balances[5]!] : []),
      balances[6]!,
    ];
    return [...items].sort((a, b) => b.value.comparedTo(a.value) ?? 0);
  }, [balances, showDemoPortals]);

  const pieBalances = useMemo(() => balances.filter(b => b.name !== 'Claimable'), [balances]);

  return (
    <Grid container spacing={2}>
      <Grid container spacing={2} size={{ xs: 12, xl: 4.5 }}>
        <Grid size={{ xs: 12, sm: 7.5, xl: 12 }} sx={{ display: 'flex' }}>
          <Card sx={{ width: 1, height: 1 }} title="Total balance" loading={isLoading}>
            <Box display="flex" flexDirection="column" gap={0.5} mt="auto">
              <Typography variant="h2">
                {tokenFormatter(fromSqd(totalBalance), SQD_TOKEN, 3)}
              </Typography>
              <Typography variant="h4" color="text.disabled">
                ~{dollarFormatter(fromSqd(totalBalance).multipliedBy(price || 0))}
              </Typography>
            </Box>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 4.5, xl: 12 }} sx={{ display: 'flex' }}>
          <Card
            sx={{ width: 1, height: 1 }}
            title="Rewards"
            loading={isLoading}
            action={
              <Stack direction="row" spacing={1}>
                <ClaimButton
                  disabled={isLoading || !hasAvailableClaims}
                  sources={claimableSources}
                />
              </Stack>
            }
          >
            <Box display="flex" flexDirection="column" gap={0.5} mt="auto">
              <Typography variant="h2">
                {tokenFormatter(fromSqd(rewardsBalance), SQD_TOKEN, 3)}
              </Typography>
              <Typography variant="h4" color="text.disabled">
                ~{dollarFormatter(fromSqd(rewardsBalance).multipliedBy(price || 0))}
              </Typography>
            </Box>
          </Card>
        </Grid>
      </Grid>
      <Grid size={{ xs: 12, xl: 7.5 }} sx={{ display: 'flex' }}>
        <Card sx={{ width: 1, height: 1 }} title="Breakdown" loading={isLoading}>
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              flex: 1,
              justifyContent: 'space-between',
              alignItems: 'flex-end',
            }}
            mt="auto"
          >
            <Box flex={1}>
              <PropertyList>
                {breakdownBalances.map(balance => (
                  <TokenBalance key={balance.name} balance={balance} />
                ))}
              </PropertyList>
            </Box>
            {/* Only render PieChart on md screens and up (1000px+) */}
            <Box
              sx={theme => ({
                display: 'none',
                [theme.breakpoints.up('sm')]: {
                  display: 'block',
                },
              })}
            >
              <PieChart balances={pieBalances} />
            </Box>
          </Box>
        </Card>
      </Grid>
    </Grid>
  );
}
