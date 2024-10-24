import { useState } from 'react';

import { peerIdToHex } from '@lib/network';
import { LoadingButton } from '@mui/lab';
import { SxProps } from '@mui/material';
import toast from 'react-hot-toast';
import { useClient } from 'wagmi';

import { gatewayRegistryAbi } from '@api/contracts';
import { useWriteSQDTransaction } from '@api/contracts/useWriteTransaction';
import { errorMessage } from '@api/contracts/utils';
import { Gateway } from '@api/subsquid-network-squid';
import { ContractCallDialog } from '@components/ContractCallDialog';
import { useSquidHeight } from '@hooks/useSquidNetworkHeightHooks';
import { useContracts } from '@network/useContracts';

export function GatewayUnregisterButton({
  gateway,
  sx,
}: {
  gateway: Pick<Gateway, 'id'>;
  sx?: SxProps;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <LoadingButton
        // startIcon={<Remove />}
        sx={sx}
        loading={open}
        onClick={() => setOpen(true)}
        variant="outlined"
        color="error"
      >
        DELETE
      </LoadingButton>
      <GatewayUnregisterDialog open={open} onClose={() => setOpen(false)} gateway={gateway} />
    </>
  );
}

export function GatewayUnregisterDialog({
  open,
  onClose,
  gateway,
}: {
  open: boolean;
  onClose: () => void;
  gateway: Pick<Gateway, 'id'>;
}) {
  const client = useClient();
  const { setWaitHeight } = useSquidHeight();

  const contracts = useContracts();
  const gatewayRegistryContract = useWriteSQDTransaction();

  const handleSubmit = async () => {
    if (!client) return;

    try {
      const receipt = await gatewayRegistryContract.writeTransactionAsync({
        address: contracts.GATEWAY_REGISTRATION,
        abi: gatewayRegistryAbi,
        functionName: 'unregister',
        args: [peerIdToHex(gateway.id)],
      });
      setWaitHeight(receipt.blockNumber, []);

      onClose();
    } catch (e: unknown) {
      toast.error(errorMessage(e));
    }
  };

  return (
    <ContractCallDialog
      title="Unregister gateway?"
      open={open}
      onResult={confirmed => {
        if (!confirmed) return onClose();

        handleSubmit();
      }}
      loading={gatewayRegistryContract.isPending}
      hideCancelButton={false}
    >
      Are you sure you want to unregister this gateway? This will disable the gateway, but you can
      re-register it later.
    </ContractCallDialog>
  );
}
