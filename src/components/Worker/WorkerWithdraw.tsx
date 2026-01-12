import { useMemo, useState } from 'react';

import { dateFormat } from '@i18n';
import { Lock } from '@mui/icons-material';
import { Box, Button, SxProps, Tooltip } from '@mui/material';
import toast from 'react-hot-toast';
import { useClient } from 'wagmi';

import { useReadRouterWorkerRegistration, workerRegistryAbi } from '@api/contracts';
import { useWriteSQDTransaction } from '@api/contracts/useWriteTransaction';
import { errorMessage } from '@api/contracts/utils';
import { AccountType, SourceWallet, Worker, useCurrentEpoch } from '@api/subsquid-network-squid';
import { ContractCallDialog } from '@components/ContractCallDialog';
import { useCountdown } from '@hooks/useCountdown';
import { useSquidHeight } from '@hooks/useSquidNetworkHeightHooks';
import { peerIdToHex } from '@lib/network';
import { useAccount } from '@network/useAccount';
import { useContracts } from '@network/useContracts';

function UnlocksTooltip({ timestamp }: { timestamp?: number }) {
  const timeLeft = useCountdown({ timestamp });

  return <span>{`Unlocks in ${timeLeft} (${dateFormat(timestamp, 'dateTime')})`}</span>;
}

export function WorkerWithdrawButton({
  worker,
  source,
  disabled,
  sx,
}: {
  sx?: SxProps;
  worker: Pick<Worker, 'id' | 'status' | 'peerId'>;
  source: SourceWallet & {
    locked: boolean;
    lockEnd?: number;
  };
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);

  const { data: currentEpoch } = useCurrentEpoch();
  const unlockTimestamp = useMemo(() => {
    if (!currentEpoch || !source.lockEnd) return;

    return (
      (source.lockEnd - currentEpoch.lastBlockL1 + 1) * currentEpoch.blockTimeL1 +
      new Date(currentEpoch.lastBlockTimestampL1).getTime()
    );
  }, [currentEpoch, source.lockEnd]);

  return (
    <>
      <Tooltip
        title={
          !disabled &&
          source.locked &&
          unlockTimestamp && <UnlocksTooltip timestamp={unlockTimestamp} />
        }
        placement="top"
      >
        <Box sx={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
          <Button
            loading={open}
            onClick={() => setOpen(true)}
            variant="outlined"
            color="error"
            disabled={disabled || source.locked}
          >
            WITHDRAW
            {source.locked && !disabled && (
              <Lock
                fontSize="small"
                sx={{
                  color: 'action.active',
                  position: 'absolute',
                  top: '0px',
                  right: '0px',
                  transform: 'translate(0%, -25%)',
                  zIndex: 1,
                }}
              />
            )}
          </Button>
        </Box>
      </Tooltip>
      <WorkerWithdrawDialog
        open={open}
        onClose={() => setOpen(false)}
        worker={worker}
        source={source}
      />
    </>
  );
}

export function WorkerWithdrawDialog({
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
    if (!client) return;
    if (!account.address || !registrationAddress) return;

    try {
      const peerIdHex = peerIdToHex(worker.peerId);

      const receipt = await contractWriter.writeTransactionAsync({
        address: registrationAddress,
        abi: workerRegistryAbi,
        functionName: 'withdraw',
        args: [peerIdHex],
        vesting: source.type === AccountType.User ? undefined : (source.id as `0x${string}`),
      });
      setWaitHeight(receipt.blockNumber, []);

      onClose();
    } catch (e: unknown) {
      toast.error(errorMessage(e));
    }
  };

  return (
    <ContractCallDialog
      title="Withdraw worker?"
      open={open}
      onResult={confirmed => {
        if (!confirmed) return onClose();

        handleSubmit();
      }}
      loading={contractWriter.isPending}
      hideCancelButton={false}
    >
      Are you sure you want to withdraw your tokens from this worker?
    </ContractCallDialog>
  );
}
