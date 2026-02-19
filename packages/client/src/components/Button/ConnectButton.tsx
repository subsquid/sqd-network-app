import { LoginOutlined } from '@mui/icons-material';
import { Button, ButtonProps } from '@mui/material';
import { useConnectModal } from '@rainbow-me/rainbowkit';

interface ConnectButtonProps extends Omit<ButtonProps, 'onClick' | 'loading'> {
  className?: string;
  label?: string;
}

export const ConnectButton = ({
  className,
  label = 'CONNECT WALLET',
  ...props
}: ConnectButtonProps) => {
  const { openConnectModal, connectModalOpen } = useConnectModal();

  const handleConnect = () => {
    openConnectModal?.();
  };

  return (
    <Button
      className={className}
      loading={connectModalOpen}
      startIcon={<LoginOutlined />}
      onClick={handleConnect}
      variant="contained"
      color="info"
      {...props}
    >
      {label}
    </Button>
  );
};
