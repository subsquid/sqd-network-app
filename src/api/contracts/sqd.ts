import { logger } from '@logger';
import { erc20Abi } from 'viem';
import { waitForTransactionReceipt } from 'viem/actions';
import { useClient, useWriteContract } from 'wagmi';
import { WriteContractData } from 'wagmi/query';

import { useContracts } from '@hooks/network/useContracts';

import { WriteContractRes, errorMessage } from './utils';

export function useApproveSqd() {
  const client = useClient();
  const contracts = useContracts();
  const { writeContractAsync } = useWriteContract();

  async function approve({
    contractAddress,
    amount,
  }: {
    contractAddress: `0x${string}`;
    amount: string;
  }): Promise<WriteContractRes> {
    let tx: WriteContractData;
    logger.debug(`approving SQD to ${contracts.WORKER_REGISTRATION}...`);
    try {
      tx = await writeContractAsync({
        address: contracts.SQD,
        abi: erc20Abi,
        functionName: 'approve',
        args: [contractAddress, BigInt(amount)],
      });
    } catch (e) {
      const error = errorMessage(e);

      return { success: false, failedReason: error };
    }

    if (!tx) {
      logger.debug(`SQF approve failed with unknown error`);
      return { success: false, failedReason: 'unknown error' };
    }

    logger.debug(`waiting confirm of SQD approving tx ${tx}`);
    await waitForTransactionReceipt(client!, { hash: tx });
    logger.info(`SQD approved, tx ${tx}, completed!`);

    return { success: true };
  }

  return [approve];
}
