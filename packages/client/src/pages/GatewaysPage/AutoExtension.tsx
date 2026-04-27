import { Box, FormControlLabel, FormGroup, Switch, Typography } from '@mui/material';
import { usePublicClient } from 'wagmi';

import { gatewayRegistryAbi } from '@api/contracts';
import { useWriteSQDTransaction } from '@api/contracts/useWriteTransaction';
import { useContracts } from '@hooks/network/useContracts';
import { useSquidHeight } from '@hooks/useSquidNetworkHeightHooks';

export function AutoExtension({ value, disabled }: { value?: boolean; disabled?: boolean }) {
  const client = usePublicClient();
  const { setWaitHeight } = useSquidHeight();
  const contracts = useContracts();
  const { writeTransactionAsync } = useWriteSQDTransaction({});

  const handleChange = async () => {
    if (!client) return;

    const receipt = value
      ? await writeTransactionAsync({
          address: contracts.GATEWAY_REGISTRATION,
          abi: gatewayRegistryAbi,
          functionName: 'disableAutoExtension',
          args: [],
        })
      : await writeTransactionAsync({
          address: contracts.GATEWAY_REGISTRATION,
          abi: gatewayRegistryAbi,
          functionName: 'enableAutoExtension',
          args: [],
        });

    setWaitHeight(receipt.blockNumber, []);
  };

  return (
    <Box pl={0.5} pr={0.5}>
      <FormGroup>
        <FormControlLabel
          disabled={disabled}
          checked={value}
          control={<Switch onChange={handleChange} />}
          label={
            <Typography component="span" variant="body2">
              Auto Extension
            </Typography>
          }
          labelPlacement="start"
        />
      </FormGroup>
    </Box>
  );
}
