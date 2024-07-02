import React from 'react';

import { Box, styled, useMediaQuery, useTheme } from '@mui/material';

import { getSubsquidNetwork } from '@network/useSubsquidNetwork';
import upperFirst from 'lodash-es/upperFirst';

export const LogoWrapper = styled('div', {
  name: 'LogoWrapper',
})(() => ({
  display: 'flex',
  alignItems: 'center',
  '& img': {
    display: 'block',
    marginRight: 2,
  },
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
  // fontStyle: 'italic',
}));

export function Logo({ color = '#fff' }: { color?: string }) {
  const theme = useTheme();
  const narrow = useMediaQuery(theme.breakpoints.down('lg'));

  const network = getSubsquidNetwork();
  const size = 20;

  return (
    <LogoWrapper>
      <svg height={size} viewBox="0 0 261 90" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M210.593 46.8411C210.593 31.7224 219.248 20.9848 234.36 20.9848C240.824 20.9848 246.69 23.8674 249.674 28.0469V0H260.512V71.8979H249.674V65.5346C247.288 69.7141 241.221 72.6975 234.555 72.6975C219.241 72.6975 210.587 61.9598 210.587 46.8411H210.593ZM250.473 46.8411C250.473 36.8964 244.708 30.4323 235.952 30.4323C227.197 30.4323 221.432 36.8964 221.432 46.8411C221.432 56.7859 227.197 63.25 235.952 63.25C244.708 63.25 250.473 56.6851 250.473 46.8411ZM116.817 54.1988L107.867 57.9751L107.86 57.9819C110.151 65.1381 117.113 72.6974 129.342 72.6974C140.678 72.6974 148.237 66.0385 148.237 57.3838C148.237 45.1623 138.321 42.7907 130.261 40.8632C124.744 39.5436 120.096 38.4322 120.096 34.5109C120.096 31.2251 123.275 29.3369 127.85 29.3369C132.426 29.3369 137.103 32.1188 138.393 37.0912L147.344 33.3148C145.16 25.9571 137.204 20.9847 127.756 20.9847C116.918 20.9847 110.057 26.8508 110.057 34.7058C110.057 45.5274 119.127 47.8922 126.933 49.9274C132.829 51.4647 138.003 52.8139 138.003 57.4779C138.003 61.0594 134.523 64.0428 129.349 64.0428C122.388 64.0428 118.51 59.5676 116.817 54.1988ZM192.693 66.1325V89.9999H203.531V21.7843H192.693V28.1476C189.904 24.0689 184.038 20.9847 177.077 20.9847C162.261 20.9847 153.512 31.7223 153.512 46.8411C153.512 61.9598 162.657 72.6974 177.675 72.6974C183.743 72.6974 189.609 70.1104 192.693 66.1325ZM178.871 30.4322C187.626 30.4322 193.392 36.8963 193.392 46.8411C193.392 56.685 187.626 63.2499 178.871 63.2499C170.116 63.2499 164.35 56.7858 164.35 46.8411C164.35 36.8963 170.116 30.4322 178.871 30.4322ZM0 29.4579C1.98223 29.72 3.99134 29.8678 6.04076 29.8678L6.03405 29.8611C22.1607 29.8611 36.3723 21.5424 44.6237 8.97711H71.7904V26.4879C68.9144 25.9302 65.7093 25.6077 62.0539 25.6077C46.9822 25.6077 39.4162 31.0504 32.1054 36.3185L32.1007 36.3219C25.3561 41.1788 18.9861 45.766 6.07436 45.766C3.87039 45.766 1.85456 45.6316 0 45.383V29.4579ZM0.00675763 22.6983C1.97555 23.0007 3.99138 23.162 6.04752 23.162C18.1895 23.162 29.0616 17.6453 36.2984 8.99071H0.00675763V22.6983ZM36.0344 41.7648C42.7789 36.9079 49.149 32.3207 62.0607 32.3207C65.7967 32.3207 68.9884 32.7037 71.7971 33.3689V80.7745H0.00675763V52.1497C1.89492 52.3647 3.90403 52.479 6.08112 52.479C21.1595 52.479 28.7189 47.0362 36.0296 41.7682L36.0344 41.7648Z"
          fill={color}
        />
      </svg>
      <LogoSecondary sx={{ color }}>{upperFirst(network)}</LogoSecondary>
      {/* <img width={size} height={size} src="/logo.png" />
      {!narrow ? (
        <>
          <LogoPrimary sx={{ color }}>SUBSQUID</LogoPrimary>
          </>
          ) : null} */}
    </LogoWrapper>
  );
}
