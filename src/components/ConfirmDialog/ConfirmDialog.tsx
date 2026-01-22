import React, { PropsWithChildren, SyntheticEvent } from 'react';

import { CloseIcon } from '@icons/CloseIcon.tsx';
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  IconButton,
  styled,
  useMediaQuery,
  useTheme,
} from '@mui/material';

import { SquaredChip } from '@components/Chip';
import { CloseOutlined } from '@mui/icons-material';

export const ConfirmWrapper = styled(Box, {
  name: 'ConfirmWrapper',
})(({}) => ({}));

export const ConfirmDialogTitle = styled(Box, {
  name: 'ConfirmDialogTitle',
})(({ theme: { spacing, breakpoints } }) => ({
  margin: spacing(3.5, 4, 2.5, 4),
  padding: 0,
  fontWeight: 500,
  fontSize: '1.125rem',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  [breakpoints.down('sm')]: {
    margin: spacing(4, 3, 2, 3),
    fontSize: '1rem',
  },
}));

export const CloseIconButton = styled(IconButton, {
  name: 'CloseIconButton',
})(({ theme }) => ({
  padding: 2,
  border: `1px solid ${theme.palette.secondary.main}`,
}));

export const Content = styled(DialogContent)(({ theme: { spacing, breakpoints } }) => ({
  padding: 0,
  margin: spacing(1, 4, 4),
  overflowY: 'visible',
  [breakpoints.down('sm')]: {
    margin: spacing(1, 3, 3),
  },
}));

export const Actions = styled(Box)(({ theme: { spacing, breakpoints } }) => ({
  padding: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  gap: spacing(2),
  margin: spacing(4, 4),
  '* > :not(:first-of-type)': {
    marginLeft: 0,
  },
  [breakpoints.down('sm')]: {
    margin: spacing(3, 3),
    flexDirection: 'column',
    '& > *': {
      width: '100%',
    },
  },
}));

interface ConfirmDialogProps extends PropsWithChildren {
  title: string;
  open: boolean;
  maxWidth?: string | number;
  minWidth?: string | number;
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

export const ConfirmDialog = ({
  title,
  children,
  open,
  maxWidth = 440,
  minWidth = 440,
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
}: ConfirmDialogProps) => {
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleReject = (e: SyntheticEvent, reason?: 'backdropClick' | 'escapeKeyDown') => {
    if (disableBackdropClick && reason === 'backdropClick') return;
    onResult?.(false);
  };

  const handleApprove = () => {
    onApprove?.();
    onResult?.(true);
  };

  const handleClick = (event: React.UIEvent) => {
    event.stopPropagation();
  };

  return (
    <Dialog
      open={open}
      onClick={handleClick}
      onClose={handleReject}
      slotProps={{
        paper: {
          sx: {
            width: mobile ? '75%' : undefined,
            maxWidth: mobile ? '75%' : maxWidth,
            minWidth: mobile ? '75%' : minWidth,
            margin: 'auto',
            boxShadow: 'none',
            overflow: 'auto',
            maxHeight: 'calc(100% - 64px)',
          },
        },
        backdrop: {
          sx: {
            backdropFilter: 'blur(0.5px)',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
      }}
    >
      <ConfirmWrapper>
        <ConfirmDialogTitle>
          <SquaredChip label={title} color="primary" />
          <CloseIconButton size="small" onClick={handleReject}>
            <CloseOutlined fontSize="small" />
          </CloseIconButton>
        </ConfirmDialogTitle>
        <Content>
          <Box id="alert-dialog-description">{children}</Box>
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
      </ConfirmWrapper>
    </Dialog>
  );
};
