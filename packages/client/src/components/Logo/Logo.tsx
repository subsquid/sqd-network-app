import { Box, SxProps, Theme, styled } from '@mui/material';
import { Link } from 'react-router-dom';

import { LogoCompact as LogoCompactSvg } from './LogoCompact';
import { LogoFull } from './LogoFull';

const LogoWrapper = styled(Box, {
  name: 'LogoWrapper',
})(() => ({
  display: 'flex',
  alignItems: 'center',
  userSelect: 'none',
}));

export interface LogoProps {
  compact?: boolean;
  sx?: SxProps<Theme>;
  clickable?: boolean;
  to?: string;
}

export function Logo({ compact = false, sx, clickable = true, to = '/dashboard' }: LogoProps) {
  const logoContent = (
    <LogoWrapper sx={sx}>
      {compact ? <LogoCompactSvg /> : <LogoFull />}
    </LogoWrapper>
  );

  if (clickable) {
    return (
      <Link
        to={to}
        style={{
          textDecoration: 'none',
          display: 'flex',
          alignItems: 'center',
          cursor: 'pointer',
        }}
      >
        {logoContent}
      </Link>
    );
  }

  return logoContent;
}
