import { Box, SxProps, Theme, styled, useTheme } from '@mui/material';

import { LogoFull } from './LogoFull';

export const LogoWrapper = styled(Box, {
  name: 'LogoWrapper',
})(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  userSelect: 'none',
}));

export const LogoPrimary = styled(Box, {
  name: 'LogoPrimary',
})(({ theme }) => ({
  fontSize: '20px',
  fontWeight: 700,
  lineHeight: 1,
  letterSpacing: '0 em',
  marginLeft: theme.spacing(0.5),
}));

export const LogoSecondary = styled(Box, {
  name: 'LogoSecondary',
})(({ theme }) => ({
  fontSize: '16px',
  fontWeight: 500,
  lineHeight: 1,
  letterSpacing: '0 em',
  marginLeft: theme.spacing(0.5),
}));

export interface LogoProps {
  /** The color of the logo text */
  color?: string;
  /** Whether to show the network name */
  showNetwork?: boolean;
  /** The network name to display */
  network?: string;
  /** Custom styles for the logo wrapper */
  sx?: SxProps<Theme>;
  /** Custom styles for the primary text */
  primarySx?: SxProps<Theme>;
  /** Custom styles for the secondary text */
  secondarySx?: SxProps<Theme>;
}

export function Logo({
  color = '#fff',
  showNetwork = false,
  network = '',
  sx,
  primarySx,
  secondarySx,
}: LogoProps) {
  return (
    <LogoWrapper sx={sx}>
      <LogoFull />
      {showNetwork && (
        <>
          <LogoPrimary sx={{ color, ...primarySx }}>SUBSQUID</LogoPrimary>
          {network && <LogoSecondary sx={{ color, ...secondarySx }}>{network}</LogoSecondary>}
        </>
      )}
    </LogoWrapper>
  );
}
