import { useEffect, useMemo, useRef, useState } from 'react';

import { logger } from '@logger';
import BigNumber from 'bignumber.js';
import { encodeFunctionData } from 'viem';
import { waitForTransactionReceipt } from 'viem/actions';
import {
  useClient,
  usePublicClient,
  useReadContract,
  useReadContracts,
  useWriteContract,
} from 'wagmi';

import { useApproveSqd } from '@api/contracts/sqd';
import { AccountType, SourceWallet, Worker } from '@api/subsquid-network-squid';
import { useSquidHeight } from '@hooks/useSquidNetworkHeightHooks';
import { calculateDelegationCapacity } from '@lib/network';
import { useAccount } from '@network/useAccount';
import { useContracts } from '@network/useContracts.ts';
import { getChain } from '@network/useSubsquidNetwork';

import { softCapAbi, stakingAbi, vestingAbi } from './subsquid.generated';
import { TxResult, WriteContractRes, errorMessage, isApproveRequiredError } from './utils';

type WorkerDepositRequest = {
  worker: Pick<Worker, 'id'>;
  amount: string;
  wallet: Pick<SourceWallet, 'id' | 'type'>;
};

function useDelegateFromWallet() {
  const contracts = useContracts();
  const { writeContractAsync } = useWriteContract({});

  const [approveSqd] = useApproveSqd();

  const tryCallContract = async ({ worker, amount }: WorkerDepositRequest) => {
    try {
      return {
        tx: await writeContractAsync({
          address: contracts.STAKING,
          abi: stakingAbi,
          functionName: 'deposit',
          args: [BigInt(worker.id), BigInt(amount)],
        }),
      };
    } catch (e) {
      return { error: errorMessage(e) };
    }
  };

  return async (req: WorkerDepositRequest): Promise<TxResult> => {
    logger.debug(`deposit to worker via worker contract...`);

    const res = await tryCallContract(req);
    // Try to approve SQD
    if (isApproveRequiredError(res.error)) {
      const approveRes = await approveSqd({
        contractAddress: contracts.STAKING,
        amount: req.amount,
      });
      if (!approveRes.success) {
        return { error: approveRes.failedReason };
      }

      logger.debug(`approved SQD successfully, now trying to register one more time...`);

      return tryCallContract(req);
    }

    return res;
  };
}

function useDepositFromVestingContract() {
  const contracts = useContracts();
  const { address: account } = useAccount();
  const { writeContractAsync } = useWriteContract({});

  return async ({ worker, amount, wallet }: WorkerDepositRequest): Promise<TxResult> => {
    try {
      const data = encodeFunctionData({
        abi: stakingAbi,
        functionName: 'deposit',
        args: [BigInt(worker.id), BigInt(amount)],
      });

      return {
        tx: await writeContractAsync({
          account,
          address: wallet.id as `0x${string}`,
          abi: vestingAbi,
          functionName: 'execute',
          args: [contracts.STAKING, data, BigInt(amount)],
        }),
      };
    } catch (e: unknown) {
      return { error: errorMessage(e) };
    }
  };
}

export function useWorkerDelegate() {
  const client = useClient();
  const { setWaitHeight } = useSquidHeight();
  const [isPending, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const depositFromWallet = useDelegateFromWallet();
  const depositFromVestingContract = useDepositFromVestingContract();

  const delegateToWorker = async ({
    worker,
    amount,
    wallet,
  }: WorkerDepositRequest): Promise<WriteContractRes> => {
    setLoading(true);

    const res =
      wallet.type === AccountType.User
        ? await depositFromWallet({ worker, amount, wallet })
        : await depositFromVestingContract({ worker, amount, wallet });

    if (!res.tx) {
      setLoading(false);
      setError(res.error);

      return { success: false, failedReason: res.error };
    }

    const receipt = await waitForTransactionReceipt(client!, { hash: res.tx });
    setWaitHeight(receipt.blockNumber, []);

    setLoading(false);

    return { success: true };
  };

  return {
    delegateToWorker,
    isPending,
    error,
  };
}

function useUndelegateFromWallet() {
  const contracts = useContracts();
  const { writeContractAsync } = useWriteContract({});

  return async ({ worker, amount }: WorkerDepositRequest): Promise<TxResult> => {
    try {
      return {
        tx: await writeContractAsync({
          address: contracts.STAKING,
          abi: stakingAbi,
          functionName: 'withdraw',
          args: [BigInt(worker.id), BigInt(amount)],
        }),
      };
    } catch (e) {
      return { error: errorMessage(e) };
    }
  };
}

function useUndelegateFromVestingContract() {
  const contracts = useContracts();
  const { address: account } = useAccount();
  const { writeContractAsync } = useWriteContract({});

  return async ({ worker, amount, wallet }: WorkerDepositRequest): Promise<TxResult> => {
    try {
      const data = encodeFunctionData({
        abi: stakingAbi,
        functionName: 'withdraw',
        args: [BigInt(worker.id), BigInt(amount)],
      });

      return {
        tx: await writeContractAsync({
          account,
          address: wallet.id as `0x${string}`,
          abi: vestingAbi,
          functionName: 'execute',
          args: [contracts.STAKING, data, BigInt(amount)],
        }),
      };
    } catch (e: unknown) {
      return { error: errorMessage(e) };
    }
  };
}

export function useWorkerUndelegate() {
  const client = usePublicClient();
  const { setWaitHeight } = useSquidHeight();
  const [isPending, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const undelegateFromWallet = useUndelegateFromWallet();
  const undelegateFromVestingContract = useUndelegateFromVestingContract();

  const undelegateFromWorker = async ({
    worker,
    amount,
    wallet,
  }: WorkerDepositRequest): Promise<WriteContractRes> => {
    setLoading(true);

    const res =
      wallet.type === AccountType.User
        ? await undelegateFromWallet({ worker, amount, wallet })
        : await undelegateFromVestingContract({ worker, amount, wallet });

    if (!res.tx) {
      setLoading(false);
      setError(res.error);

      return { success: false, failedReason: res.error };
    }

    const receipt = await waitForTransactionReceipt(client!, { hash: res.tx });
    setWaitHeight(receipt.blockNumber, []);

    setLoading(false);

    return { success: true };
  };

  return {
    undelegateFromWorker,
    isPending,
    error,
  };
}

export function useCapedStake({ workerId }: { workerId?: string }) {
  const contracts = useContracts();
  const { currentHeight, isLoading: isHeightLoading } = useSquidHeight();

  const { data, isLoading } = useReadContract({
    address: contracts.SOFT_CAP,
    abi: softCapAbi,
    functionName: 'capedStake',
    args: [BigInt(workerId || -1)],
    blockNumber: BigInt(currentHeight),
    query: {
      enabled: !!workerId && !isHeightLoading,
    },
  });

  const res = useRef<string | undefined>(undefined);
  useEffect(() => {
    if (!isLoading) res.current = data?.toString();
  }, [data, isLoading]);

  return {
    data: res.current,
    isLoading: !res.current,
  };
}

export function useCapedStakeAfterDelegation({
  workerId,
  amount,
  undelegate,
  enabled,
}: {
  workerId: string;
  amount: string;
  undelegate?: boolean;
  enabled?: boolean;
}) {
  const contracts = useContracts();

  const { data, isPending } = useReadContracts({
    contracts: [
      {
        address: contracts.SOFT_CAP,
        abi: softCapAbi,
        functionName: 'capedStakeAfterDelegation',
        args: [BigInt(workerId), BigInt(amount || 0n) * (undelegate ? -1n : 1n)],
        chainId: getChain().id,
      },
      {
        address: contracts.STAKING,
        abi: stakingAbi,
        functionName: 'delegated',
        args: [BigInt(workerId)],
        chainId: getChain().id,
      },
    ],
    allowFailure: false,
    query: {
      enabled: !!workerId && enabled !== false,
      select: res => {
        return {
          capedDelegation: res[0].toString(),
          totalDelegation: res[1].toString(),
        };
      },
    },
  });

  const res = useMemo(() => {
    const capedDelegation = data?.capedDelegation || '0';

    let td = BigNumber(data?.totalDelegation || '0');
    if (undelegate) {
      td = td.minus(amount);
    } else {
      td = td.plus(amount);
    }
    const totalDelegation = td.lt(0) ? '0' : td.toFixed();

    const delegationCapacity = calculateDelegationCapacity({
      capedDelegation,
      totalDelegation,
    });

    return {
      capedDelegation,
      totalDelegation,
      delegationCapacity,
    };
  }, [amount, data?.capedDelegation, data?.totalDelegation, undelegate]);

  return {
    data: res,
    isPending: isPending,
  };
}
