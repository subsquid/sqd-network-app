import React, { PropsWithChildren } from 'react';

import { Box, Paper, styled, Theme, Typography } from '@mui/material';
import { SxProps } from '@mui/system/styleFunctionSx';
import classNames from 'classnames';
import { Loader } from '@components/Loader';

export interface CardProps {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  sx?: SxProps<Theme>;
  noPadding?: boolean;
  outlined?: boolean;
  noShadow?: boolean;
  loading?: boolean;
  action?: React.ReactNode;
  disabled?: boolean;
  className?: string;
}

export const CardWrapper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  boxShadow: '0 1px 2px rgba(0, 0, 0, 0.04), 0 1px 3px rgba(0, 0, 0, 0.06)',
  transition: 'all 200ms ease-out',
  borderRadius: theme.spacing(1.5),

  '&.disabled': {
    color: theme.palette.text.secondary,
    textAlign: 'center',
    opacity: 0.5,
    pointerEvents: 'none',
  },

  '&.noPadding': {
    padding: 0,
  },

  '&.outlined': {
    background: theme.palette.background.default,
    borderColor: theme.palette.divider,
    borderWidth: 1,
    borderStyle: 'solid',
    boxShadow: 'none',
  },

  '&.noShadow': {
    boxShadow: 'none',
  },
}));

export const Card = ({
  children,
  title,
  subtitle,
  noShadow,
  noPadding,
  outlined,
  sx,
  action,
  disabled,
  className,
  loading,
}: PropsWithChildren<CardProps>) => {
  return (
    <CardWrapper
      className={classNames(className, {
        noShadow,
        noPadding,
        outlined,
        disabled,
      })}
      sx={sx}
    >
      <Box
        sx={{
          flex: 1,
          flexDirection: 'column',
          display: 'flex',
          justifyItems: 'flex-end',
          height: 1,
        }}
      >
        {title || subtitle || action ? (
          <Box display="flex" justifyContent="space-between" mb={2.5}>
            <Box>
              {typeof title === 'string' ? (
                <Typography variant="h6" fontWeight={600} color="text.primary">
                  {title}
                </Typography>
              ) : (
                <Box>{title}</Box>
              )}
              {subtitle && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75 }}>
                  {subtitle}
                </Typography>
              )}
            </Box>
            <Box>{action}</Box>
          </Box>
        ) : null}
        <Box display="flex" sx={{ flex: 1 }}>
          <Box sx={{ height: 1, width: 1 }}>{loading ? <Loader /> : children}</Box>
        </Box>
      </Box>
    </CardWrapper>
  );
};
