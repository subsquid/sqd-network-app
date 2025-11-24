import { PropsWithChildren, ReactNode } from 'react';

import { Box, styled, Typography } from '@mui/material';
import { SxProps } from '@mui/system/styleFunctionSx';

import { BackButton } from '@components/BackButton';

const PageTitleWrapper = styled('div', {
  name: 'PageTitleWrapper',
})(({ theme }) => ({
  minHeight: theme.spacing(5),

  '& .title': {
    display: 'flex',
    alignItems: 'start',
  },

  '& .endAdornment': {
    marginLeft: 'auto',
  },
}));

const PageDescription = styled(Typography)(({ theme }) => ({
  fontSize: '1.125rem',
  color: theme.palette.text.secondary,
  lineHeight: 1.6,
  // maxWidth: 600,
}));

export function NetworkPageTitle({
  backPath,
  children,
  endAdornment,
  sx,
  title,
}: PropsWithChildren<{
  backPath?: string;
  endAdornment?: ReactNode;
  sx?: SxProps;
  title?: string;
}>) {
  return (
    <PageTitleWrapper sx={sx}>
      <Typography variant="h1" sx={{ lineHeight: 1 }}>
        <div className="title">
          <BackButton />
          <Box color="text.primary">{title}</Box>
          {endAdornment ? <div className="endAdornment">{endAdornment}</div> : null}
        </div>
      </Typography>
      {children ? <PageDescription>{children}</PageDescription> : null}
    </PageTitleWrapper>
  );
}
