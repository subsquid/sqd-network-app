import React, { PropsWithChildren } from 'react';

import { Box, Card as MuiCard, styled, Theme, CardProps as MuiCardProps } from '@mui/material';
import { SxProps } from '@mui/system/styleFunctionSx';
import { Loader } from '@components/Loader';
import { SectionHeader } from '@components/SectionHeader';

export interface CardProps extends Omit<MuiCardProps, 'title'> {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  tooltip?: string;
  tooltipPlacement?: 'top' | 'bottom' | 'left' | 'right';
  sx?: SxProps<Theme>;
  loading?: boolean;
  action?: React.ReactNode;
  className?: string;
}

const CardContent = styled(Box, {
  name: 'CardContent',
})(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  height: '100%',
}));

export function Card({
  children,
  title,
  subtitle,
  tooltip,
  sx,
  action,
  className,
  loading,
  ...props
}: PropsWithChildren<CardProps>) {
  const hasHeader = !!(title || subtitle || action);

  return (
    <MuiCard className={className} sx={sx} {...props}>
      <CardContent>
        {hasHeader && (
          <SectionHeader title={title} subtitle={subtitle} tooltip={tooltip} action={action} sx={{ mb: 2 }} />
        )}
        {loading ? (
          <Box height={1} width={1}>
            <Loader />
          </Box>
        ) : (
          children
        )}
      </CardContent>
    </MuiCard>
  );
}
