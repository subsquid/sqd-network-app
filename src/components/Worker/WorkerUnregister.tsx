import { useState } from 'react';

import { Button, SxProps } from '@mui/material';
import toast from 'react-hot-toast';
import { useClient } from 'wagmi';

import { useReadRouterWorkerRegistration, workerRegistryAbi } from '@api/contracts';
import { useWriteSQDTransaction } from '@api/contracts/useWriteTransaction';
import { errorMessage } from '@api/contracts/utils';
import { AccountType, SourceWallet, Worker } from '@api/subsquid-network-squid';
import { ContractCallDialog } from '@components/ContractCallDialog';
import { useSquidHeight } from '@hooks/useSquidNetworkHeightHooks';
import { peerIdToHex } from '@lib/network';
import { useAccount } from '@hooks/network/useAccount';
import { useContracts } from '@hooks/network/useContracts';

export function WorkerUnregisterButton({
  worker,
  source,
  disabled,
  sx,
}: {
  sx?: SxProps;
  worker: Pick<Worker, 'id' | 'status' | 'peerId'>;
  source: SourceWallet;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        // startIcon={<Remove />}
        sx={sx}
        loading={open}
        onClick={() => setOpen(true)}
        variant="outlined"
        color="error"
        disabled={disabled}
      >
        REMOVE
      </Button>
      <WorkerUnregisterDialog
        open={open}
        onClose={() => setOpen(false)}
        worker={worker}
        source={source}
      />
    </>
  );
}

export function WorkerUnregisterDialog({
  open,
  onClose,
  worker,
  source,
}: {
  open: boolean;
  onClose: () => void;
  worker: Pick<Worker, 'id' | 'status' | 'peerId'>;
  source: SourceWallet;
}) {
  const client = useClient();
  const account = useAccount();

  const { setWaitHeight } = useSquidHeight();

  const contracts = useContracts();
  const contractWriter = useWriteSQDTransaction();

  const { data: registrationAddress } = useReadRouterWorkerRegistration({
    address: contracts.ROUTER,
  });

  const handleSubmit = async () => {
    if (!client || !account.address || !registrationAddress) return;

    try {
      const peerIdHex = peerIdToHex(worker.peerId);

      const receipt = await contractWriter.writeTransactionAsync({
        address: registrationAddress,
        abi: workerRegistryAbi,
        functionName: 'deregister',
        args: [peerIdHex],
        vesting: source.type === AccountType.User ? undefined : (source.id as `0x${string}`),
      });
      setWaitHeight(receipt.blockNumber, []);

      onClose();
    } catch (error) {
      toast.error(errorMessage(error));
    }
  };

  return (
    <ContractCallDialog
      title="Unregister worker?"
      open={open}
      onResult={confirmed => {
        if (!confirmed) return onClose();
        handleSubmit();
      }}
      loading={contractWriter.isPending}
      hideCancelButton={false}
    >
      Are you sure you want to unregister this worker? This will disable the worker. You will be
      able to withdraw your tokens after the end of the lock period.
    </ContractCallDialog>
  );
}
