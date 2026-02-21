import { PropsWithChildren } from 'react';

import { Box, SxProps, Theme, Typography, styled } from '@mui/material';

import { BackButton } from '@components/BackButton';

const PageTitleWrapper = styled('div', {
  name: 'PageTitleWrapper',
})(({ theme }) => ({
  marginBottom: theme.spacing(1),

  '& .title': {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2),
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
  backButton = true,
}: PropsWithChildren<{
  backPath?: string;
  sx?: SxProps<Theme>;
  title?: React.ReactNode;
  backButton?: boolean;
}>) {
  return (
    <PageTitleWrapper sx={sx}>
      <div className="title">
        {backButton && <BackButton path={backPath} />}
        <Typography variant="h4" sx={{ textWrap: 'balance' }}>
          <Box color="text.primary">{title}</Box>
        </Typography>
      </div>
      {children ? <PageDescription>{children}</PageDescription> : null}
    </PageTitleWrapper>
  );
}
