import React from 'react';

import { LoadingButton } from '@mui/lab';
import { toast } from 'react-hot-toast';
import * as yup from 'yup';

import { vestingAbi } from '@api/contracts';
import { useWriteSQDTransaction } from '@api/contracts/useWriteTransaction';
import { errorMessage } from '@api/contracts/utils';
import { SourceWallet } from '@api/subsquid-network-squid';
import { useSquidHeight } from '@hooks/useSquidNetworkHeightHooks';
import { useContracts } from '@network/useContracts';

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
    try {
      const receipt = await writeTransactionAsync({
        abi: vestingAbi,
        functionName: 'release',
        args: [SQD],
        address: vesting.id as `0x${string}`,
      });
      setWaitHeight(receipt.blockNumber, []);
    } catch (e: unknown) {
      toast.error(errorMessage(e));
    }
  };

  return (
    <>
      <LoadingButton
        loading={isPending}
        onClick={onClick}
        variant="outlined"
        color="secondary"
        disabled={disabled}
      >
        RELEASE
      </LoadingButton>
    </>
  );
}
