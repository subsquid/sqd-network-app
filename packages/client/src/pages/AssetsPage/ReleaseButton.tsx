import { Button } from '@mui/material';
import * as yup from 'yup';

import { vestingAbi } from '@api/contracts';
import { useWriteSQDTransaction } from '@api/contracts/useWriteTransaction';
import { SourceWallet } from '@api/subsquid-network-squid';
import { useContracts } from '@hooks/network/useContracts';
import { useSquidHeight } from '@hooks/useSquidNetworkHeightHooks';

export const claimSchema = yup.object({
  source: yup.string().label('Source').trim().required('Source is required'),
});

export function ReleaseButton({
  vesting,
  disabled,
}: {
  vesting: SourceWallet;
  disabled?: boolean;
}) {
  const { setWaitHeight } = useSquidHeight();
  const { SQD } = useContracts();

  const { writeTransactionAsync, isPending } = useWriteSQDTransaction({});

  const onClick = async () => {
    const receipt = await writeTransactionAsync({
      abi: vestingAbi,
      functionName: 'release',
      args: [SQD],
      address: vesting.id as `0x${string}`,
    });
    setWaitHeight(receipt.blockNumber, []);
  };

  return (
    <>
      <Button
        loading={isPending}
        onClick={onClick}
        variant="outlined"
        color="secondary"
        disabled={disabled}
      >
        RELEASE
      </Button>
    </>
  );
}
