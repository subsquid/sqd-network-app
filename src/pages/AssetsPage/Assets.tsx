import { useMemo } from 'react';

import { CircleRounded } from '@mui/icons-material';
import { Box, Grid, Stack, Typography, useTheme } from '@mui/material';
import { Group } from '@visx/group';
import { Pie } from '@visx/shape';
import BigNumber from 'bignumber.js';

import { useTokenPrice } from '@api/price';
import {
  AccountType,
  SourcesWithAssetsQuery,
  Worker,
  useSourcesWithAssetsQuery,
} from '@api/subsquid-network-squid';
import { Card } from '@components/Card/Card';
import { HelpTooltip } from '@components/HelpTooltip';
import { Property, PropertyList } from '@components/Property';
import { demoFeaturesEnabled } from '@hooks/demoFeaturesEnabled';
import { dollarFormatter, tokenFormatter } from '@lib/formatters/formatters';
import { fromSqd } from '@lib/network/utils';
import { useAccount } from '@hooks/network/useAccount';
import { useContracts } from '@hooks/network/useContracts';

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
    <Box display="flex" alignItems="center" gap={0.5}>
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

// Custom hook to compute token balances from source accounts
function useTokenBalances(accounts: SourcesWithAssetsQuery['accounts'] | undefined) {
  const theme = useTheme();

  return useMemo((): TokenBalance[] => {
    const balances = {
      transferable: createTokenBalance(
        'Transferable',
        theme.palette.success.main,
        theme.palette.success.main,
        'Liquid tokens, can be freely transferred to external addresses',
      ),
      vesting: createTokenBalance(
        'Vesting',
        theme.palette.warning.main,
        theme.palette.warning.main,
        'Tokens locked in the vesting contracts owned by the wallet. Can be used for bonding (running a worker) and/or delegation',
      ),
      claimable: createTokenBalance(
        'Claimable',
        theme.palette.info.main,
        theme.palette.info.main,
        'Earned but not yet claimed token rewards, aggregated across all workers and delegations',
      ),
      bonded: createTokenBalance(
        'Workers',
        theme.palette.primary.contrastText,
        theme.palette.primary.main,
        'Tokens bonded in the worker registry contract',
      ),
      delegated: createTokenBalance(
        'Delegations',
        theme.palette.secondary.contrastText,
        theme.palette.secondary.main,
        'Tokens delegated to workers',
      ),
      lockedPortal: createTokenBalance(
        'Portals',
        theme.palette.text.primary,
        theme.palette.text.primary,
        'Tokens locked in Portal stake',
      ),
    };

    accounts?.forEach(account => {
      // Account balance
      if (account.type === AccountType.User) {
        balances.transferable.value = balances.transferable.value.plus(account.balance);
      } else if (account.type === AccountType.Vesting) {
        balances.vesting.value = balances.vesting.value.plus(account.balance);
      }

      // Delegations
      account.delegations2.forEach(delegation => {
        balances.delegated.value = balances.delegated.value.plus(delegation.deposit);
        balances.claimable.value = balances.claimable.value.plus(delegation.claimableReward);
      });

      // Workers
      account.workers2.forEach(worker => {
        balances.bonded.value = balances.bonded.value.plus(worker.bond);
        balances.claimable.value = balances.claimable.value.plus(worker.claimableReward);
      });

      // Gateway stakes
      account.gatewayStakes.forEach(stake => {
        balances.lockedPortal.value = balances.lockedPortal.value.plus(stake.amount);
      });
    });

    return Object.values(balances);
  }, [accounts, theme.palette]);
}

// Custom hook to compute claimable sources
function useClaimableSources(accounts: SourcesWithAssetsQuery['accounts'] | undefined) {
  return useMemo(() => {
    if (!accounts) return;

    return accounts.map(account => {
      const claims: (Pick<Worker, 'id' | 'peerId' | 'name'> & {
        type: 'worker' | 'delegation';
        claimableReward: string;
      })[] = [];

      // Add delegation claims
      account.delegations2.forEach(delegation => {
        if (delegation.claimableReward === '0') return;

        claims.push({
          id: delegation.worker.id,
          peerId: delegation.worker.peerId,
          name: delegation.worker.name,
          claimableReward: delegation.claimableReward,
          type: 'delegation',
        });
      });

      // Add worker claims
      account.workers2.forEach(worker => {
        if (worker.claimableReward === '0') return;

        claims.push({
          id: worker.id,
          peerId: worker.peerId,
          name: worker.name,
          claimableReward: worker.claimableReward,
          type: 'worker',
        });
      });

      // Sort claims by reward amount (descending)
      const sortedClaims = claims.sort(
        (a, b) => BigNumber(b.claimableReward).comparedTo(a.claimableReward)!,
      );

      const totalClaimableBalance = claims.reduce(
        (total, claim) => total.plus(claim.claimableReward),
        BigNumber(0),
      );

      return {
        id: account.id,
        type: account.type,
        balance: totalClaimableBalance.toString(),
        claims: sortedClaims,
      };
    });
  }, [accounts]);
}

// Custom hook to calculate total balance (excluding claimable)
function useTotalBalance(balances: TokenBalance[]) {
  return useMemo(() => {
    return balances.reduce((total, balance, index) => {
      // Skip claimable (index 2)
      if (index === 2) return total;
      return total.plus(balance.value);
    }, BigNumber(0));
  }, [balances]);
}

export function MyAssets() {
  const { SQD_TOKEN, SQD } = useContracts();
  const account = useAccount();

  // Data fetching
  const { data: sourcesQuery, isLoading: isSourcesLoading } = useSourcesWithAssetsQuery({
    address: account.address || '0x',
  });
  const { data: price, isLoading: isPriceLoading } = useTokenPrice({ address: SQD });

  // Computed data
  const balances = useTokenBalances(sourcesQuery?.accounts);
  const totalBalance = useTotalBalance(balances);
  const rewardsBalance = balances[2]?.value || BigNumber(0);
  const claimableSources = useClaimableSources(sourcesQuery?.accounts);
  const hasAvailableClaims = !!claimableSources?.some(source => source.balance !== '0');

  const isLoading = isSourcesLoading || isPriceLoading;

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
                <TokenBalance balance={balances[0]} />
                <TokenBalance balance={balances[1]} />
                <TokenBalance balance={balances[3]} />
                <TokenBalance balance={balances[4]} />
                {demoFeaturesEnabled() && <TokenBalance balance={balances[5]} />}
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
              <PieChart balances={balances} />
            </Box>
          </Box>
        </Card>
      </Grid>
    </Grid>
  );
}
