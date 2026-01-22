import React, { PropsWithChildren } from 'react';

import { Box, Button, SwipeableDrawer, IconButton, styled } from '@mui/material';

import { SquaredChip } from '@components/Chip';
import { CloseOutlined } from '@mui/icons-material';

export const ConfirmDrawerWrapper = styled(Box, {
  name: 'ConfirmDrawerWrapper',
})(({}) => ({}));

export const ConfirmDrawerTitle = styled(Box, {
  name: 'ConfirmDrawerTitle',
})(({ theme: { spacing } }) => ({
  margin: spacing(3, 3, 2),
  padding: 0,
  fontWeight: 500,
  fontSize: '1rem',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
}));

export const CloseIconButton = styled(IconButton, {
  name: 'CloseIconButton',
})(({ theme }) => ({
  padding: 2,
  border: `1px solid ${theme.palette.secondary.main}`,
}));

export const Content = styled(Box)(({ theme: { spacing } }) => ({
  padding: spacing(0, 3, 2),
  overflowY: 'auto',
}));

export const Actions = styled(Box)(({ theme: { spacing } }) => ({
  padding: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: spacing(2),
  margin: spacing(3, 3),
  '& > *': {
    width: '100%',
  },
}));

interface ConfirmDrawerProps extends PropsWithChildren {
  title: string;
  open: boolean;
  confirmColor?: 'primary' | 'error' | 'success' | 'info';
  confirmButtonText?: string;
  cancelButtonText?: string;
  disableBackdropClick?: boolean;
  disableConfirmButton?: boolean;
  hideCancelButton?: boolean;
  hideConfirmButton?: boolean;
  onResult?: (confirmed: boolean) => unknown;
  onApprove?: () => unknown;
  loading?: boolean;
}

export const ConfirmDrawer = ({
  title,
  children,
  open,
  confirmColor = 'info',
  confirmButtonText = 'CONFIRM',
  cancelButtonText = 'CANCEL',
  disableBackdropClick = false,
  disableConfirmButton = false,
  hideCancelButton = false,
  hideConfirmButton = false,
  loading = false,
  onResult,
  onApprove,
}: ConfirmDrawerProps) => {
  const handleReject = () => {
    onResult?.(false);
  };

  const handleClose = () => {
    if (!disableBackdropClick) {
      onResult?.(false);
    }
  };

  const handleOpen = () => {
    // Required by SwipeableDrawer but we control open state externally
  };

  const handleApprove = () => {
    onApprove?.();
    onResult?.(true);
  };

  return (
    <SwipeableDrawer
      anchor="bottom"
      open={open}
      onClose={handleClose}
      onOpen={handleOpen}
      disableSwipeToOpen
      slotProps={{
        backdrop: {
          sx: {
            backdropFilter: 'blur(0.5px)',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
      }}
      PaperProps={{
        sx: {
          backgroundColor: 'white',
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
          maxHeight: '90vh',
        },
      }}
    >
      <ConfirmDrawerWrapper>
        <ConfirmDrawerTitle>
          <SquaredChip label={title} color="primary" />
          <CloseIconButton size="small" onClick={handleReject}>
            <CloseOutlined fontSize="small" />
          </CloseIconButton>
        </ConfirmDrawerTitle>
        <Content>
          <Box id="drawer-description">{children}</Box>
        </Content>
        <Actions>
          {!hideCancelButton && (
            <Button onClick={handleReject} variant="contained" color="primary">
              {cancelButtonText}
            </Button>
          )}
          {!hideConfirmButton && (
            <Button
              onClick={handleApprove}
              disabled={disableConfirmButton}
              loading={loading}
              color={confirmColor}
              variant="contained"
            >
              {confirmButtonText}
            </Button>
          )}
        </Actions>
      </ConfirmDrawerWrapper>
    </SwipeableDrawer>
  );
};
