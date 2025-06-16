import React, { PropsWithChildren } from 'react';

import { Box, Paper, styled, Theme } from '@mui/material';
import { SxProps } from '@mui/system/styleFunctionSx';
import classNames from 'classnames';
import { Loader } from '@components/Loader';

export interface CardProps {
  title?: React.ReactNode;
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
  padding: theme.spacing(1.5),
  boxShadow: 'none',
  transition: 'all 300ms ease-out',

  '&.disabled': {
    color: theme.palette.text.secondary,
    textAlign: 'center',
    opacity: 0.7,
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
  },

  '&.noShadow': {
    boxShadow: 'none',
  },
}));

export const Card = ({
  children,
  title,
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
        {title || action ? (
          <Box display="flex" justifyContent="space-between" mb={2}>
            <Box>{title}</Box>
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
