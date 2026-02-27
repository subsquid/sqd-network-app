import { PropsWithChildren } from 'react';

import { Box } from '@mui/material';
import { useAccount } from 'wagmi';

import { ConnectButton } from '@components/Button';

export function ConnectedWalletRequired({ children }: PropsWithChildren) {
  const { isConnected } = useAccount();

  if (!isConnected) {
    return (
      <Box
        sx={{
          height: 'calc(100vh - 300px)',
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
  }

  return children;
}
