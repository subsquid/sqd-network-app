import { useMemo, useRef } from 'react';

import { AccountBalanceWalletOutlined, ExpandMore } from '@mui/icons-material';
import { Button, Menu, Typography, styled } from '@mui/material';
import { bindMenu, bindTrigger, usePopupState } from 'material-ui-popup-state/hooks';
import { useAccount } from 'wagmi';

import { ConnectButton } from '@components/Button';
import { addressFormatter } from '@lib/formatters/formatters';

import { LogoutMenuItem } from './LogoutMenuItem';

export const UserMenuStyled = styled(Menu, {
  name: 'UserMenuStyled',
})(({ theme }) => ({
  minWidth: '100%',
}));

export const Dropdown = styled(Button)(({ theme }) => ({
  color: theme.palette.primary.contrastText,
  cursor: 'pointer',
  textAlign: 'left',
}));

export function UserMenu() {
  const { address, isConnected } = useAccount();
  const ref = useRef<HTMLButtonElement | null>(null);
  const popupState = usePopupState({
    variant: 'popover',
    popupId: 'filter',
    disableAutoFocus: true,
  });

  const maskedAddress = useMemo(() => {
    return address ? addressFormatter(address, true) : '';
  }, [address]);

  if (!address || !isConnected) {
    return <ConnectButton />;
  }

  return (
    <>
      <Dropdown
        {...bindTrigger(popupState)}
        ref={ref}
        color="primary"
        variant="contained"
        startIcon={<AccountBalanceWalletOutlined />}
        endIcon={
          <ExpandMore
            sx={{
              transition: 'transform 300ms ease-out',
              transform: popupState.isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
              color: 'primary.contrastText',
              // opacity: 0.2,
              width: 20,
              height: 20,
            }}
          />
        }
      >
        <Typography variant="body2">{maskedAddress}</Typography>
      </Dropdown>
      <UserMenuStyled
        {...bindMenu(popupState)}
        anchorEl={ref.current}
        disableEscapeKeyDown
        slotProps={{
          paper: {
            sx: {
              overflow: 'visible',
              width: 192,
              pl: 1,
              pr: 1,
              pt: 0.5,
              pb: 0.5,
            },
          },
        }}
        transformOrigin={{
          horizontal: 'right',
          vertical: 'top',
        }}
        anchorOrigin={{
          horizontal: 'right',
          vertical: 'bottom',
        }}
      >
        <LogoutMenuItem />
      </UserMenuStyled>
    </>
  );
}
