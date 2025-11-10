import React from 'react';

import { Box, SxProps, Theme, styled, Tooltip } from '@mui/material';

export interface OnlineCircleProps {
  /** Whether the indicator should show online status */
  online?: boolean;
  /** Custom styles for the circle */
  sx?: SxProps<Theme>;
  /** Size of the circle in pixels */
  size?: number;
  /** Whether to show an outline around the circle */
  showOutline?: boolean;
  /** Custom color for online state */
  onlineColor?: string;
  /** Custom color for offline state */
  offlineColor?: string;
  /** Custom color for the outline */
  outlineColor?: string;
  /** Custom className for the circle */
  className?: string;
}

export const OnlineCircle = styled(Box, {
  name: 'OnlineCircle',
})<OnlineCircleProps>(
  ({ theme, size = 8, showOutline = true, onlineColor, offlineColor, outlineColor }) => ({
    width: size,
    height: size,
    borderRadius: '100%',
    outline: showOutline ? `1px solid ${outlineColor || theme.palette.background.paper}` : 'none',
    transition: 'background-color 0.2s ease-in-out',

    '&.online': {
      background: onlineColor || theme.palette.success.main,
    },
    '&.offline': {
      background: offlineColor || theme.palette.error.main,
    },
  }),
);

export interface OnlineProps extends OnlineCircleProps {
  /** Custom component to use instead of OnlineCircle */
  Component?: React.ComponentType<OnlineCircleProps>;
  /** Whether to show a tooltip */
  showTooltip?: boolean;
  /** Custom tooltip text for online state */
  onlineTooltip?: string;
  /** Custom tooltip text for offline state */
  offlineTooltip?: string;
}

export function Online({
  online = true,
  Component = OnlineCircle,
  showTooltip = false,
  onlineTooltip = 'Online',
  offlineTooltip = 'Offline',
  ...props
}: OnlineProps) {
  const circle = <Component online={online} {...props} className={online ? 'online' : 'offline'} />;

  if (!showTooltip) {
    return circle;
  }

  return (
    <Tooltip title={online ? onlineTooltip : offlineTooltip} placement="top">
      {circle}
    </Tooltip>
  );
}
