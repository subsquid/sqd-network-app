import { LoginOutlined } from '@mui/icons-material';
import { Button, ButtonProps } from '@mui/material';
import { useConnectModal } from '@rainbow-me/rainbowkit';

interface ConnectButtonProps extends Omit<ButtonProps, 'onClick' | 'loading'> {
  className?: string;
  label?: string;
}

/**
 * Connect-wallet button — opens the RainbowKit modal in both live and mock
 * mode. In mock mode the modal includes a "Mock Personas" group at the top
 * (see `createAppWagmiConfig` in src/config.ts) so contributors pick a
 * fixture wallet without leaving the standard RainbowKit UX.
 */
export function ConnectButton({
  className,
  label = 'CONNECT WALLET',
  ...props
}: ConnectButtonProps) {
  const { openConnectModal, connectModalOpen } = useConnectModal();

  return (
    <Button
      className={className}
      loading={connectModalOpen}
      startIcon={<LoginOutlined />}
      onClick={() => openConnectModal?.()}
      variant="contained"
      color="info"
      {...props}
    >
      {label}
    </Button>
  );
}
