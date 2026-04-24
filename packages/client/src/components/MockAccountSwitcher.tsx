import { useState } from 'react';

import { SwitchAccountOutlined } from '@mui/icons-material';
import {
  Box,
  Button,
  Divider,
  ListItemIcon,
  MenuItem,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { isAddress } from 'viem';

import { mockWalletAddress } from '../config';

const MOCK_ADDRESS_KEY = 'mock:wallet:address';

/** Well-known Hardhat accounts for quick switching. */
const PRESET_ACCOUNTS: { label: string; address: string }[] = [
  { label: 'Hardhat #0', address: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266' },
  { label: 'Hardhat #1', address: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8' },
  { label: 'Hardhat #2', address: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC' },
  { label: 'Hardhat #3', address: '0x90F79bf6EB2c4f870365E785982E1f101E93b906' },
];

/**
 * Reads the persisted mock address from localStorage.
 * Falls back to the build-time env var address.
 */
export function getActiveMockAddress(): string {
  return localStorage.getItem(MOCK_ADDRESS_KEY) || mockWalletAddress;
}

/**
 * Persists a new mock address and reloads the page so wagmi picks it up.
 */
function switchTo(address: string) {
  localStorage.setItem(MOCK_ADDRESS_KEY, address);
  window.location.reload();
}

/**
 * Rendered inside the UserMenu dropdown when the app is running with a mock
 * wallet (MOCK_WALLET_ADDRESS is set).  Shows a text field and quick-pick
 * preset addresses for fast account switching during development and testing.
 */
export function MockAccountSwitcher() {
  const [input, setInput] = useState('');
  const isValid = isAddress(input);

  return (
    <>
      <Divider sx={{ my: 0.5 }} />
      <Box sx={{ px: 1.5, py: 1 }}>
        <Typography
          variant="caption"
          sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1, color: 'warning.main' }}
        >
          <SwitchAccountOutlined sx={{ fontSize: 14 }} />
          Mock account switcher
        </Typography>

        {PRESET_ACCOUNTS.map(({ label, address }) => (
          <MenuItem
            key={address}
            dense
            onClick={() => switchTo(address)}
            sx={{
              borderRadius: 1,
              px: 1,
              py: 0.25,
              typography: 'caption',
              fontFamily: 'monospace',
            }}
          >
            <ListItemIcon sx={{ minWidth: 28 }}>
              <SwitchAccountOutlined sx={{ fontSize: 14 }} />
            </ListItemIcon>
            <Box>
              <Typography variant="caption" display="block" fontWeight={600}>
                {label}
              </Typography>
              <Typography
                variant="caption"
                display="block"
                sx={{ opacity: 0.6, fontSize: '0.65rem' }}
              >
                {address.slice(0, 10)}…{address.slice(-8)}
              </Typography>
            </Box>
          </MenuItem>
        ))}

        <Box sx={{ mt: 1, display: 'flex', gap: 0.5 }}>
          <TextField
            size="small"
            placeholder="0x… custom address"
            value={input}
            onChange={e => setInput(e.target.value)}
            slotProps={{ htmlInput: { style: { fontFamily: 'monospace', fontSize: '0.7rem' } } }}
            sx={{ flex: 1 }}
            error={input.length > 0 && !isValid}
          />
          <Tooltip title={isValid ? `Switch to ${input}` : 'Enter a valid 0x address'}>
            <span>
              <Button
                size="small"
                variant="contained"
                disabled={!isValid}
                onClick={() => switchTo(input)}
                sx={{ minWidth: 0, px: 1 }}
              >
                Go
              </Button>
            </span>
          </Tooltip>
        </Box>
      </Box>
    </>
  );
}
