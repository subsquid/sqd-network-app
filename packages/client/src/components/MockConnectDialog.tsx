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
import { useAccount, useConfig, useConnect } from 'wagmi';

import { addressFormatter } from '@lib/formatters/formatters';

import { MOCK_FIXTURE_ACCOUNTS, setMockAccountIndex } from '../config';

/**
 * Account selection dialog for mock mode.
 *
 * When the user picks an account:
 *   1. The selected index is persisted to sessionStorage (so reloads remember).
 *   2. If the wagmi mock connector is already connected, we emit a `change`
 *      event with the picked address hoisted to position 0 — `useAccount()`
 *      reactively updates everywhere, no page reload needed.
 *   3. If the connector is disconnected, we connect it. The first connect uses
 *      the freshly-built fixtureAccounts; we then immediately swap to the
 *      picked persona.
 *
 * This replaces the previous `window.location.reload()` flow. The reload
 * approach was needed when the connector treated `parameters.accounts` as
 * immutable at compile time and we rebuilt the config on every persona pick;
 * `connector.onAccountsChanged()` (an EIP-1193 hook the wagmi mock connector
 * exposes) lets us flip the connected address in-place, much faster and
 * with no React-tree teardown.
 */
export function MockConnectDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [busy, setBusy] = useState<number | null>(null);
  const config = useConfig();
  const { connect, connectors } = useConnect();
  const { isConnected } = useAccount();

  async function handleSelect(index: number) {
    setBusy(index);
    try {
      const persona = MOCK_FIXTURE_ACCOUNTS[index];
      const mockConnector = config.connectors.find(c => c.id === 'mock');
      if (!mockConnector) {
        // No mock connector configured — fall back to the legacy reload flow.
        setMockAccountIndex(index);
        window.location.reload();
        return;
      }

      // Persist for reload survivability (and so other modules that read
      // getMockAccountIndex() see the choice).
      setMockAccountIndex(index);

      if (!isConnected) {
        await connect({ connector: connectors.find(c => c.id === 'mock') ?? mockConnector });
      }

      // Hoist the picked persona to address[0]. The wagmi mock connector's
      // onAccountsChanged hook emits a `change` event that updates the
      // connection's account list reactively — useAccount() picks it up
      // without a remount.
      const reordered = [
        persona.address,
        ...MOCK_FIXTURE_ACCOUNTS.filter((_, i) => i !== index).map(p => p.address),
      ];
      // The mock connector exposes onAccountsChanged(accounts: Address[])
      // in its public interface. We call it directly because there's no
      // wagmi action that maps to "switch the connected address within a
      // single connector".
      const onChanged = (
        mockConnector as unknown as {
          onAccountsChanged?: (a: readonly `0x${string}`[]) => void;
        }
      ).onAccountsChanged;
      onChanged?.(reordered);

      onClose();
    } finally {
      setBusy(null);
    }
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
          reset when the dev server restarts. Switching personas is instant — no page reload.
        </Typography>
        <List disablePadding>
          {MOCK_FIXTURE_ACCOUNTS.map((account, index) => (
            <ListItemButton
              key={account.address}
              onClick={() => handleSelect(index)}
              disabled={busy !== null}
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
