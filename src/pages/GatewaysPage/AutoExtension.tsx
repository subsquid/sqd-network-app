import { gatewayRegistryAbi } from '@api/contracts';
import { useWriteSQDTransaction } from '@api/contracts/useWriteTransaction';
import { errorMessage } from '@api/contracts/utils';
import { useSquidHeight } from '@hooks/useSquidNetworkHeightHooks';
import { Box, FormControlLabel, FormGroup, Switch, Typography } from '@mui/material';
import { useContracts } from '@network/useContracts';
import toast from 'react-hot-toast';
import { usePublicClient } from 'wagmi';

export function AutoExtension({ value, disabled }: { value?: boolean; disabled?: boolean }) {
  const client = usePublicClient();
  const { setWaitHeight } = useSquidHeight();
  const contracts = useContracts();
  const { writeTransactionAsync } = useWriteSQDTransaction({});

  const handleChange = async () => {
    if (!client) return;

    try {
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
    } catch (e) {
      toast.error(errorMessage(e));
    }
  };

  return (
    <Box pl={0.5} pr={0.5}>
      <FormGroup>
        <FormControlLabel
          disabled={disabled}
          checked={value}
          control={<Switch onChange={handleChange} />}
          label={<Typography variant="body2">Auto Extension</Typography>}
          labelPlacement="start"
        />
      </FormGroup>
    </Box>
  );
}
