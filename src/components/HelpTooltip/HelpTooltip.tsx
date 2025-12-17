import React from 'react';

import { InfoOutlined } from '@mui/icons-material';
import { Stack, Tooltip, SxProps, Theme } from '@mui/material';
import { Box } from '@mui/system';

// export const Help = styled(Box)(({ theme, color }) => ({
//   width: 15,
//   height: 15,
//   color: color === 'default' ? theme.palette.text.default : '#fff',
//   backgroundColor: color === 'default' ? theme.palette.text.disabled : '#000',
//   borderRadius: 8,
//   display: 'flex',
//   alignItems: 'center',
//   justifyContent: 'center',
//   fontSize: '0.725rem',
//   lineHeight: '15px',
//   fontWeight: 500,
//   cursor: 'help',
// }));

export interface HelpTooltipProps {
  /** The tooltip content */
  title: React.ReactNode;
  /** The content to be displayed alongside the tooltip */
  children?: React.ReactNode;
  /** Placement of the tooltip relative to the content */
  placement?: 'start' | 'end';
  /** Custom styles for the tooltip */
  sx?: SxProps<Theme>;
  /** Custom styles for the icon */
  iconSx?: SxProps<Theme>;
  /** Custom styles for the content */
  contentSx?: SxProps<Theme>;
  /** Whether to show an arrow on the tooltip */
  arrow?: boolean;
  /** Tooltip placement relative to the icon */
  tooltipPlacement?: 'top' | 'bottom' | 'left' | 'right';
  /** Delay in ms before showing the tooltip */
  enterDelay?: number;
  /** Delay in ms before hiding the tooltip */
  leaveDelay?: number;
}

export const HelpTooltip = ({
  title,
  children,
  placement = 'end',
  sx,
  iconSx,
  contentSx,
  arrow = true,
  tooltipPlacement = 'top',
  enterDelay = 0,
  leaveDelay = 0,
}: HelpTooltipProps) => {
  return (
    <Stack direction="row" spacing={0.5} alignItems="center" sx={sx}>
      {placement === 'end' && children && <Box>{children}</Box>}
      <Tooltip
        title={title}
        placement={tooltipPlacement}
        arrow={arrow}
        enterDelay={enterDelay}
        leaveDelay={leaveDelay}
      >
        <InfoOutlined fontSize="small" sx={{ transform: 'scale(1)', ...iconSx }} />
      </Tooltip>
      {placement === 'start' && children && <Box>{children}</Box>}
    </Stack>
  );
};
