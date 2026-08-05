import { useState } from 'react';

import { Box, Stack, Switch, Typography } from '@mui/material';
import toast from 'react-hot-toast';
import { useClient } from 'wagmi';

import { gatewayRegistryAbi } from '@api/contracts';
import { useWriteSQDTransaction } from '@api/contracts/useWriteTransaction';
import { ContractCallDialog } from '@components/ContractCallDialog';
import { useContracts } from '@hooks/network/useContracts';
import { useSquidHeight } from '@hooks/useSquidNetworkHeightHooks';

export function AutoExtension({ value, disabled }: { value?: boolean; disabled?: boolean }) {
  const client = useClient();
  const { setWaitHeight } = useSquidHeight();
  const contracts = useContracts();
  const { writeTransactionAsync, isPending } = useWriteSQDTransaction();

  const [open, setOpen] = useState(false);

  const handleConfirm = async () => {
    if (!client) return;

    const receipt = await writeTransactionAsync({
      address: contracts.GATEWAY_REGISTRATION,
      abi: gatewayRegistryAbi,
      functionName: value ? 'disableAutoExtension' : 'enableAutoExtension',
      args: [],
    });

    setWaitHeight(receipt.blockNumber, []);
    toast.success(value ? 'Auto extension disabled' : 'Auto extension enabled');
    setOpen(false);
  };

  return (
    <Box pl={0.5} pr={0.5} mb={1}>
      <Stack direction="row" alignItems="center" spacing={1}>
        <Typography variant="body2">Auto extension</Typography>
        <Switch
          checked={!!value}
          disabled={disabled}
          onChange={() => setOpen(true)}
          color="secondary"
        />
        <Typography
          variant="body2"
          fontWeight={600}
          color={value ? 'success.main' : 'text.secondary'}
        >
          {value ? 'Enabled' : 'Disabled'}
        </Typography>
      </Stack>

      <ContractCallDialog
        title={value ? 'Disable auto extension?' : 'Enable auto extension?'}
        open={open}
        loading={isPending}
        hideCancelButton={false}
        confirmColor={value ? 'error' : 'info'}
        confirmButtonText={value ? 'DISABLE' : 'ENABLE'}
        onResult={confirmed => {
          if (!confirmed) return setOpen(false);

          handleConfirm();
        }}
      >
        {value
          ? 'Your lock will stop auto-renewing. It will unlock at the end of the current lock period, after which the portal stops serving queries unless you lock again.'
          : 'Your lock will automatically renew for the same duration whenever it expires, keeping the portal running. Your funds stay locked until you disable auto extension.'}
      </ContractCallDialog>
    </Box>
  );
}
