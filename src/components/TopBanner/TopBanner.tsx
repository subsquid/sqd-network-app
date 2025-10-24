import { Box, styled } from '@mui/material';

export function useBannerHeight() {
  return 0;
}

const TopBannerWrapper = styled(Box, {
  name: 'TopBannerWrapper',
})(({ theme }) => {
  const height = useBannerHeight();

  return {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: theme.palette.background.paper,
    color: theme.palette.text.primary,
    fontSize: '0.875rem',
    lineHeight: 1,
    gap: theme.spacing(2),
    height,

    '& .description': {},

    '& a': {
      fontSize: '0.875rem',
      lineHeight: 1,
      fontWeight: 500,
      cursor: 'pointer',
    },

    [theme.breakpoints.down('xs')]: {
      alignItems: 'flex-start',
      padding: theme.spacing(1.25, 0),

      '& .description': {
        flexFlow: 'column',
        gap: 0,

        '& div': {
          marginTop: 2,
          marginBottom: 6,
        },
      },
    },
  };
});

export const TopBanner = () => {
  const height = useBannerHeight();
  if (height === 0) return null;

  return <TopBannerWrapper />;
};
