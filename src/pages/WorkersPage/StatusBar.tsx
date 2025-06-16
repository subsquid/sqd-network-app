import { nonNullable } from '@lib/array';
import { percentFormatter } from '@lib/formatters/formatters.ts';
import { Box, Palette, styled, useTheme } from '@mui/material';

import { StyledTooltip } from '@components/StyledTooltip';

interface UptimeItem {
  tooltipText: string;
  backgroundColor: string;
}

export const StyledBar = styled(Box)(({ theme }) => ({
  width: theme.spacing(0.75),
  height: theme.spacing(3),
  borderRadius: 360,
  background: theme.palette.background.default,

  '&.error': {
    background: theme.palette.error.main,
  },

  '&.warning': {
    background: theme.palette.warning.main,
  },

  '&.success': {
    background: theme.palette.success.main,
  },
}));

const setUptimeItem = (palette: Palette, uptime?: number): UptimeItem => {
  if (!nonNullable(uptime)) {
    return {
      tooltipText: 'No data available for this period.',
      backgroundColor: palette.primary.main,
    };
  }

  if (uptime >= 99) {
    return {
      tooltipText: `Uptime ${percentFormatter(uptime)}`,
      backgroundColor: palette.success.main,
    };
  }

  if (uptime >= 90) {
    return {
      tooltipText: `Uptime ${percentFormatter(uptime)}`,
      backgroundColor: palette.warning.main,
    };
  }

  return {
    tooltipText: `Uptime ${percentFormatter(uptime)}`,
    backgroundColor: palette.error.main,
  };
};

const PopperProps = {
  modifiers: [
    {
      name: 'offset',
      options: {
        offset: [0, -8],
      },
    },
  ],
};

export const StatusBar = ({ dayUptime }: { dayUptime: { date: string; uptime?: number } }) => {
  const { palette } = useTheme();

  const uptimeItem = setUptimeItem(palette, dayUptime.uptime);
  const tooltipContent = (
    <Box>
      {dayUptime.date ? <Box sx={{ fontWeight: '500' }}>{dayUptime.date}</Box> : null}
      <Box>{uptimeItem.tooltipText}</Box>
    </Box>
  );

  return (
    <StyledTooltip
      title={tooltipContent}
      enterTouchDelay={100}
      leaveTouchDelay={3000}
      PopperProps={PopperProps}
    >
      <StyledBar sx={{ background: uptimeItem.backgroundColor }} />
    </StyledTooltip>
  );
};
