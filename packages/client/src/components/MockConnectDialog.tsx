import { useState } from 'react';

import { AccountBalanceWalletOutlined, BugReportOutlined } from '@mui/icons-material';
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  List,
  ListItemButton,
  ListItemText,
  Typography,
} from '@mui/material';

import { addressFormatter } from '@lib/formatters/formatters';

import { MOCK_FIXTURE_ACCOUNTS, setMockAccountIndex } from '../config';

/**
 * Account selection dialog for mock mode.
 *
 * When the user picks an account:
 *   1. The selected index is stored in sessionStorage.
 *   2. The page reloads — on the next mount, buildMockConfig() reads the
 *      index and creates the mock connector with defaultConnected=true and
 *      only that account in its accounts list, so wagmi immediately sees a
 *      connected state with the right address.
 *
 * This approach sidesteps the limitation that wagmi's mock connector hardcodes
 * eth_requestAccounts to return the compile-time accounts array.
 *
 * To switch accounts: disconnect (clears sessionStorage) → connect → pick.
 * State resets when the dev server restarts.
 */
export function MockConnectDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [connecting, setConnecting] = useState<number | null>(null);

  function handleSelect(index: number) {
    setConnecting(index);
    setMockAccountIndex(index);
    // Reload so WagmiProvider remounts with the new config
    window.location.reload();
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <BugReportOutlined color="warning" />
        Select mock account
        <Chip label="DEV" size="small" color="warning" sx={{ ml: 'auto', fontWeight: 700 }} />
      </DialogTitle>
      <DialogContent sx={{ pt: 0 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
          Choose a fixture persona. State changes (balances, transactions) are kept in memory and
          reset when the dev server restarts. Switch accounts by disconnecting then reconnecting.
        </Typography>
        <List disablePadding>
          {MOCK_FIXTURE_ACCOUNTS.map((account, index) => (
            <ListItemButton
              key={account.address}
              onClick={() => handleSelect(index)}
              disabled={connecting !== null}
              sx={{
                borderRadius: 1,
                mb: 0.5,
                border: '1px solid',
                borderColor: 'divider',
                '&:hover': { borderColor: 'primary.main' },
              }}
            >
              <AccountBalanceWalletOutlined
                sx={{ mr: 1.5, color: 'primary.main', flexShrink: 0 }}
              />
              <ListItemText
                primary={account.label}
                secondary={
                  <Box component="span">
                    <Box component="span" sx={{ fontFamily: 'monospace', fontSize: '0.7rem' }}>
                      {addressFormatter(account.address, true)}
                    </Box>
                    <Box component="span" sx={{ display: 'block', mt: 0.25 }}>
                      {account.description}
                    </Box>
                  </Box>
                }
                slotProps={{
                  primary: { fontWeight: 600 },
                  secondary: { component: 'span' },
                }}
              />
            </ListItemButton>
          ))}
        </List>
      </DialogContent>
    </Dialog>
  );
}

/**
 * "Connect Wallet" trigger button for mock mode.
 */
export function MockConnectButton({ label = 'CONNECT WALLET' }: { label?: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant="contained"
        color="info"
        startIcon={<AccountBalanceWalletOutlined />}
        onClick={() => setOpen(true)}
      >
        {label}
      </Button>
      <MockConnectDialog open={open} onClose={() => setOpen(false)} />
    </>
  );
}
