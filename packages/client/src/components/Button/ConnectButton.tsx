import { LoginOutlined } from '@mui/icons-material';
import { Button, ButtonProps } from '@mui/material';
import { useConnectModal } from '@rainbow-me/rainbowkit';

import { MockConnectButton } from '@components/MockConnectDialog';

import { isMockMode } from '../../config';

interface ConnectButtonProps extends Omit<ButtonProps, 'onClick' | 'loading'> {
  className?: string;
  label?: string;
}

function RainbowConnectButton({
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

/**
 * Renders the mock connect button when MOCK_WALLET=true (build-time constant),
 * otherwise renders the real RainbowKit connect button.
 * The split into two components keeps React hook rules satisfied.
 */
export const ConnectButton = (props: ConnectButtonProps) => {
  if (isMockMode) {
    return <MockConnectButton label={props.label} />;
  }
  return <RainbowConnectButton {...props} />;
};
