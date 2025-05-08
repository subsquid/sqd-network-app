import { useState } from 'react';

import { dateFormat } from '@i18n';
import { Lock } from '@mui/icons-material';
import { Box, Button, SxProps, Tooltip } from '@mui/material';
import toast from 'react-hot-toast';
import { useClient } from 'wagmi';
import * as yup from 'yup';

import { gatewayRegistryAbi } from '@api/contracts';
import { useWriteSQDTransaction } from '@api/contracts/useWriteTransaction';
import { errorMessage } from '@api/contracts/utils';
import { ContractCallDialog } from '@components/ContractCallDialog';
import { useCountdown } from '@hooks/useCountdown';
import { useSquidHeight } from '@hooks/useSquidNetworkHeightHooks';
import { useContracts } from '@network/useContracts';

export const stakeSchema = yup.object({
  source: yup.string().label('Source').trim().required('Source is required'),
  // amount: yup
  //   .number()
  //   .label('Amount')
  //   .moreThan(0)
  //   .required('Amount is required')
  //   .max(yup.ref('max'), ({ max }) => `Amount should be less than ${formatSqd(max)} `),
});

function UnlocksTooltip({ timestamp }: { timestamp?: Date | string | number | undefined }) {
  const timeLeft = useCountdown({ timestamp });

  return `Unlocks in ${timeLeft} (${dateFormat(timestamp, 'dateTime')})`;
}

export function GatewayUnstakeButton({
  sx,
  disabled,
  source,
}: {
  sx?: SxProps;
  disabled?: boolean;
  source: {
    locked: boolean;
    unlockedAt?: string;
  };
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Tooltip
        hidden={disabled}
        title={
          !disabled &&
          source.locked &&
          (source.unlockedAt ? (
            <UnlocksTooltip timestamp={source.unlockedAt} />
          ) : (
            'Auto-extension is enabled'
          ))
        }
        placement="top"
      >
        <Box sx={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
          {source.locked && !disabled && (
            <Lock
              fontSize="small"
              // color="secondary"
              sx={{
                color: '#3e4a5c',
                position: 'absolute',
                top: '0px',
                right: '0px',
                transform: 'translate(0%, -25%)',
                zIndex: 1,
              }}
            />
          )}
          <Button
            // startIcon={<LockOpenIcon />}
            disabled={disabled || source.locked}
            loading={open}
            variant="contained"
            color="error"
            onClick={() => setOpen(true)}
            sx={sx}
          >
            WITHDRAW
          </Button>
        </Box>
      </Tooltip>
      <GatewayUnstakeDialog open={open} onClose={() => setOpen(false)} />
    </>
  );
}

export function GatewayUnstakeDialog({ onClose, open }: { onClose: () => void; open: boolean }) {
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
        functionName: 'unstake',
        args: [],
      });
      setWaitHeight(receipt.blockNumber, []);

      onClose();
    } catch (e: unknown) {
      toast.error(errorMessage(e));
    }
  };

  return (
    <ContractCallDialog
      title="Withdraw tokens?"
      open={open}
      onResult={confirmed => {
        if (!confirmed) return onClose();

        handleSubmit();
      }}
      loading={gatewayRegistryContract.isPending}
      hideCancelButton={false}
    >
      Are you sure you want to withdraw your tokens? This will return all previously locked tokens
      to your wallet.
    </ContractCallDialog>
  );
}
