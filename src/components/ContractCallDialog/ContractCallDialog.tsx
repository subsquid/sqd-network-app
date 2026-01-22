import React from 'react';

import { Box, useTheme, useMediaQuery } from '@mui/material';
import { useAccount } from 'wagmi';

import { ConnectButton } from '@components/Button';
import { ConfirmDialog } from '@components/ConfirmDialog';
import { ConfirmDrawer } from '@components/ConfirmDrawer';

interface ContractCallDialogProps {
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
  children: React.ReactNode;
}

export const ContractCallDialog = ({
  title,
  children,
  open,
  maxWidth,
  minWidth = 600,
  confirmColor = 'info',
  confirmButtonText = 'CONFIRM',
  cancelButtonText = 'CANCEL',
  hideCancelButton = true,
  disableBackdropClick = false,
  disableConfirmButton = false,
  loading = false,
  onResult,
  onApprove,
}: ContractCallDialogProps) => {
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { isConnected } = useAccount();

  const connectWalletContent = (
    <Box
      sx={{
        height: '300px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Box sx={{ textAlign: 'center' }}>
        <Box sx={{ mb: 2 }}>Connect your wallet to proceed</Box>
        <ConnectButton />
      </Box>
    </Box>
  );

  if (!isConnected) {
    if (mobile) {
      return (
        <ConfirmDrawer
          title="Connect wallet"
          open={open}
          loading={loading}
          hideCancelButton
          hideConfirmButton
          onResult={onResult}
        >
          {connectWalletContent}
        </ConfirmDrawer>
      );
    }

    return (
      <ConfirmDialog
        title={'Connect wallet'}
        maxWidth={maxWidth}
        minWidth={minWidth}
        open={open}
        loading={loading}
        hideCancelButton
        hideConfirmButton
        onResult={onResult}
      >
        {connectWalletContent}
      </ConfirmDialog>
    );
  }

  if (mobile) {
    return (
      <ConfirmDrawer
        title={title}
        open={open}
        onResult={onResult}
        loading={loading}
        confirmColor={confirmColor}
        confirmButtonText={confirmButtonText}
        hideCancelButton={hideCancelButton}
        disableBackdropClick={disableBackdropClick}
        disableConfirmButton={disableConfirmButton}
        onApprove={onApprove}
        cancelButtonText={cancelButtonText}
      >
        {children}
      </ConfirmDrawer>
    );
  }

  return (
    <ConfirmDialog
      title={title}
      maxWidth={maxWidth}
      minWidth={minWidth}
      open={open}
      onResult={onResult}
      loading={loading}
      confirmColor={confirmColor}
      confirmButtonText={confirmButtonText}
      hideCancelButton={hideCancelButton}
      disableBackdropClick={disableBackdropClick}
      disableConfirmButton={disableConfirmButton}
      onApprove={onApprove}
      cancelButtonText={cancelButtonText}
    >
      <div>{children}</div>
    </ConfirmDialog>
  );
};
