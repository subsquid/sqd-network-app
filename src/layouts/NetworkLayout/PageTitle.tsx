import { PropsWithChildren } from 'react';

import { Box, styled, Typography } from '@mui/material';
import { SxProps } from '@mui/system/styleFunctionSx';

import { BackButton } from '@components/BackButton';

const PageTitleWrapper = styled('div', {
  name: 'PageTitleWrapper',
})(({ theme }) => ({
  marginBottom: theme.spacing(3),

  '& .title': {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2),
  },

  [theme.breakpoints.down('xs')]: {
    marginBottom: theme.spacing(2),
  },
}));

const PageDescription = styled(Typography)(({ theme }) => ({
  fontSize: '1.125rem',
  color: theme.palette.text.secondary,
  lineHeight: 1.6,
  // maxWidth: 600,
}));

export function PageTitle({
  backPath,
  children,
  sx,
  title,
}: PropsWithChildren<{
  backPath?: string;
  sx?: SxProps;
  title?: string;
}>) {
  return (
    <PageTitleWrapper sx={sx}>
      <Typography variant="h4">
        <div className="title">
          <BackButton path={backPath} />
          <Box color="text.primary">{title}</Box>
        </div>
      </Typography>
      {children ? <PageDescription>{children}</PageDescription> : null}
    </PageTitleWrapper>
  );
}
