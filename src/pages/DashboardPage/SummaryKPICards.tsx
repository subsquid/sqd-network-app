import React, { useMemo } from 'react';
import { Box, Grid, Paper, Skeleton, Typography, useTheme } from '@mui/material';
import WorkIcon from '@mui/icons-material/Work';
import LockIcon from '@mui/icons-material/Lock';
import PercentIcon from '@mui/icons-material/Percent';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import {
  useActiveWorkersTimeseriesQuery,
  useLockedValueTimeseriesQuery,
  useAprTimeseriesQuery,
  useQueriesCountTimeseriesQuery,
} from '@api/subsquid-network-squid';
import { fromSqd } from '@lib/network';
import { toCompact, tokenFormatter, percentFormatter } from '@lib/formatters/formatters';

interface KPICardProps {
  title: string;
  icon: React.ReactNode;
  currentValue: string;
  isLoading: boolean;
  color: string;
}

function KPICard({ title, icon, currentValue, isLoading, color }: KPICardProps) {
  const theme = useTheme();

  if (isLoading) {
    return (
      <Paper 
        elevation={0} 
        sx={{ 
          p: 3, 
          height: '100%',
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Skeleton width="60%" height={20} sx={{ mb: 2 }} />
        <Skeleton width="80%" height={48} />
      </Paper>
    );
  }

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        height: '100%',
        border: '1px solid',
        borderColor: 'divider',
        borderTop: `2px solid ${color}`,
        transition: 'border-color 0.2s',
        '&:hover': {
          borderColor: color,
        },
      }}
    >
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
        <Typography
          variant="caption"
          color="text.secondary"
          fontWeight={600}
          textTransform="uppercase"
          letterSpacing={0.8}
          fontSize={11}
        >
          {title}
        </Typography>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'text.disabled',
          }}
        >
          {icon}
        </Box>
      </Box>
      <Typography variant="h3" fontWeight={700} color="text.primary">
        {currentValue}
      </Typography>
    </Paper>
  );
}

interface SummaryKPICardsProps {
  range: { from: Date; to: Date };
  step?: string;
}

export function SummaryKPICards({ range, step }: SummaryKPICardsProps) {
  const theme = useTheme();

  const queryVars = useMemo(
    () => ({
      from: range.from.toISOString(),
      to: range.to.toISOString(),
      step: !step || step === 'auto' ? undefined : step,
    }),
    [range, step],
  );

  const { data: workersData, isLoading: workersLoading } = useActiveWorkersTimeseriesQuery(queryVars);
  const { data: tvlData, isLoading: tvlLoading } = useLockedValueTimeseriesQuery(queryVars);
  const { data: aprData, isLoading: aprLoading } = useAprTimeseriesQuery(queryVars);
  const { data: queriesData, isLoading: queriesLoading } = useQueriesCountTimeseriesQuery(queryVars);

  const workersKPI = useMemo(() => {
    const data = workersData?.activeWorkersTimeseries || [];
    if (data.length === 0) return { currentValue: '0' };

    const current = data[data.length - 1]?.value || 0;

    return {
      currentValue: new Intl.NumberFormat('en-US', {
        maximumFractionDigits: 0,
      }).format(current),
    };
  }, [workersData]);

  const tvlKPI = useMemo(() => {
    const data = tvlData?.lockedValueTimeseries || [];
    if (data.length === 0) return { currentValue: '0 SQD' };

    const current = fromSqd(data[data.length - 1]?.value || 0).toNumber();

    return {
      currentValue: tokenFormatter(current, 'SQD', 0),
    };
  }, [tvlData]);

  const aprKPI = useMemo(() => {
    const data = aprData?.aprTimeseries || [];
    if (data.length === 0) return { currentValue: '0%' };

    const currentWorkerApr = data[data.length - 1]?.value?.workerApr || 0;

    return {
      currentValue: percentFormatter(currentWorkerApr),
    };
  }, [aprData]);

  const queriesKPI = useMemo(() => {
    const data = queriesData?.queriesCountTimeseries || [];
    if (data.length === 0) return { currentValue: '0' };

    // For queries, we sum the period
    const total = data.reduce((sum, d) => sum + (d.value || 0), 0);

    return {
      currentValue: new Intl.NumberFormat('en-US', {
        notation: 'compact',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(total),
    };
  }, [queriesData]);

  const kpis = [
    {
      title: 'Active Workers',
      icon: <WorkIcon sx={{ fontSize: 20 }} />,
      color: '#10B981',
      ...workersKPI,
      isLoading: workersLoading,
    },
    {
      title: 'Total Value Locked',
      icon: <LockIcon sx={{ fontSize: 20 }} />,
      color: '#4A90E2',
      ...tvlKPI,
      isLoading: tvlLoading,
    },
    {
      title: 'Worker APR',
      icon: <PercentIcon sx={{ fontSize: 20 }} />,
      color: '#F59E0B',
      ...aprKPI,
      isLoading: aprLoading,
    },
    {
      title: 'Total Queries',
      icon: <QueryStatsIcon sx={{ fontSize: 20 }} />,
      color: '#8B5CF6',
      ...queriesKPI,
      isLoading: queriesLoading,
    },
  ];

  return (
    <Box sx={{ mb: 4 }}>
      <Grid container spacing={3}>
        {kpis.map(kpi => (
          <Grid key={kpi.title} size={{ xs: 12, sm: 6, md: 3 }}>
            <KPICard {...kpi} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

