import { PropsWithChildren, useEffect, useMemo, useState } from 'react';

import {
  bytesFormatter,
  numberCompactFormatter,
  percentFormatter,
  tokenFormatter,
} from '@lib/formatters/formatters';
import { fromSqd } from '@lib/network';
import { Box, Divider, Stack, Typography, useTheme } from '@mui/material';
import { Grid } from '@mui/material';

import { useNetworkStats } from '@api/subsquid-network-squid';
import { useCurrentEpoch } from '@api/subsquid-network-squid';
import { SquaredChip } from '@components/Chip';
import { HelpTooltip } from '@components/HelpTooltip';
import { useCountdown } from '@hooks/useCountdown';
import { useContracts } from '@network/useContracts';
import { Card } from '@components/Card/Card';

export function ColumnLabel({ children, color }: PropsWithChildren<{ color?: string }>) {
  return (
    <Typography variant="h4" mb={1} mt={1} color={color}>
      {children}
    </Typography>
  );
}

export function ColumnValue({ children }: PropsWithChildren) {
  return <Typography variant="h2">{children}</Typography>;
}

function OnlineInfo() {
  const { data, isLoading } = useNetworkStats();

  return (
    <Card
      sx={{ height: 1 }}
      loading={isLoading}
      title="Workers Online"
      action={
        !isLoading && (
          <Stack direction="row" spacing={1}>
            <span>Data</span>
            <SquaredChip
              label={
                <Typography variant="subtitle1">{bytesFormatter(data?.storedData)}</Typography>
              }
              color="info"
            />
          </Stack>
        )
      }
    >
      <Box height={1} display="flex" alignItems="flex-end">
        <Typography variant="h1" display="flex" alignItems="flex-end">
          {data?.onlineWorkersCount || 0}
        </Typography>
        <Typography variant="h2" display="flex" alignItems="flex-end" color="text.disabled">
          /{data?.workersCount || 0}
        </Typography>
      </Box>
    </Card>
  );
}

function CurrentEpochEstimation({ epochEnd }: { epochEnd: number }) {
  const timeLeft = useCountdown({ timestamp: epochEnd });

  return (
    <Stack direction="row" spacing={1}>
      <span>Ends in</span>
      <SquaredChip
        label={<Typography variant="subtitle1">{timeLeft}</Typography>}
        color="warning"
      />
    </Stack>
  );
}

function CurrentEpoch() {
  const { data, isLoading } = useCurrentEpoch();
  const [epochEnd, setEpochEnd] = useState<number>(Date.now());

  useEffect(() => {
    if (!data || !data.epoch) return;

    const newEpochEnd =
      (data.epoch.end - data.lastBlockL1 + 1) * data.blockTimeL1 +
      new Date(data.lastBlockTimestampL1).getTime();

    setEpochEnd(newEpochEnd);
  }, [data]);

  return (
    <Card
      sx={{ height: 1 }}
      loading={isLoading}
      title="Current epoch"
      action={!isLoading && <CurrentEpochEstimation epochEnd={epochEnd} />}
    >
      <Box height={1} display="flex" alignItems="flex-end">
        <Typography variant="h1">{data?.epoch?.number || 0}</Typography>
      </Box>
    </Card>
  );
}

function Stats() {
  const { data, isLoading } = useNetworkStats();
  const { SQD_TOKEN } = useContracts();

  return (
    <Card sx={{ height: 1 }} loading={isLoading} title="Other Data">
      <Box height={1} display="flex" alignItems="flex-end">
        <Stack divider={<Divider />} spacing={1} flex={1}>
          <Box>
            <ColumnLabel>Total locked value</ColumnLabel>
            <ColumnValue>
              {tokenFormatter(
                fromSqd(data?.totalBond)
                  .plus(fromSqd(data?.totalDelegation))
                  .plus(fromSqd(data?.totalPortalLock)),
                SQD_TOKEN,
                0,
              )}
            </ColumnValue>
          </Box>
          <Box>
            <ColumnLabel>Queries, 24h/90d</ColumnLabel>
            <ColumnValue>
              {numberCompactFormatter(data?.queries24Hours)}/
              {numberCompactFormatter(data?.queries90Days)}
            </ColumnValue>
          </Box>
          <Box>
            <ColumnLabel>Data served, 24h/90d</ColumnLabel>
            <ColumnValue>
              {bytesFormatter(data?.servedData24Hours)}/{bytesFormatter(data?.servedData90Days)}
            </ColumnValue>
          </Box>
        </Stack>
      </Box>
    </Card>
  );
}

function WorkersApr({ length }: { length?: number }) {
  const { data, isLoading } = useNetworkStats();

  const aprs = useMemo(() => {
    if (!data?.aprs || !data?.workerApr) return 0;

    return (
      data.aprs
        .slice(length ? -length : 0)

        .reduce(
          (acc, v, i) =>
            acc + (i === data.aprs.length - 1 ? (v.workerApr + data.workerApr) / 2 : v.workerApr),
          0,
        ) / data.aprs.length
    );
  }, [data?.aprs, data?.workerApr, length]);

  return (
    <Card
      loading={isLoading}
      sx={{ height: 1, overflow: 'visible' }}
      title="Worker APR"
      action={
        !isLoading && (
          <HelpTooltip title="Median value">
            <span>{`Last ${data?.aprs?.length ?? 0} days`}</span>
          </HelpTooltip>
        )
      }
    >
      <Box height={1} display="flex" alignItems="flex-end">
        <Typography variant="h1">{percentFormatter(aprs)}</Typography>
      </Box>
    </Card>
  );
}

function DelegatorsApr({ length }: { length?: number }) {
  const { data, isLoading } = useNetworkStats();

  const aprs = useMemo(() => {
    if (!data?.aprs || !data?.stakerApr) return 0;

    return (
      data.aprs
        .slice(length ? -length : 0)

        .reduce(
          (acc, v, i) =>
            acc + (i === data.aprs.length - 1 ? (v.stakerApr + data.stakerApr) / 2 : v.stakerApr),
          0,
        ) / data.aprs.length
    );
  }, [data?.aprs, data?.stakerApr, length]);

  return (
    <Card
      loading={isLoading}
      sx={{ height: 1, overflow: 'visible' }}
      title="Delegator APR"
      action={
        !isLoading && (
          <Stack direction="row" alignItems="center" spacing={0.5}>
            <Typography>{`Last ${data?.aprs?.length ?? 0} days`}</Typography>
            <HelpTooltip title="Median value" />
          </Stack>
        )
      }
    >
      <Box height={1} display="flex" alignItems="flex-end">
        <Typography variant="h1">{percentFormatter(aprs)}</Typography>
      </Box>
    </Card>
  );
}

export function NetworkSummary() {
  const theme = useTheme();

  const size = { minHeight: 128, height: { xs: 'auto', md: 0.5 } };

  return (
    <Box minHeight={360} mb={2} display="flex">
      <Grid container spacing={2} flex={1}>
        {/* FIXME: some wtf hack with mb */}
        <Grid container size={{ xs: 12, sm: 12, md: 8 }} mb={{ xs: 0, md: 2 }}>
          <Grid size={{ xs: 12, sm: 6 }} sx={{ ...size }}>
            <OnlineInfo />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }} sx={{ ...size }}>
            <CurrentEpoch />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }} sx={{ ...size }}>
            <WorkersApr />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }} sx={{ ...size }}>
            <DelegatorsApr />
          </Grid>
        </Grid>
        <Grid size={{ xs: 12, sm: 12, md: 4 }}>
          <Stats />
        </Grid>
      </Grid>
    </Box>
  );
}
