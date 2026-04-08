import * as Sentry from '@sentry/react';
import { useMutation } from '@tanstack/react-query';
import {
  getPublicClient,
  readContract,
  waitForTransactionReceipt,
  writeContract,
} from '@wagmi/core';
import toast from 'react-hot-toast';
import {
  type Abi,
  type Address,
  type ContractFunctionArgs,
  ContractFunctionExecutionError,
  type ContractFunctionName,
  type TransactionReceipt,
  createPublicClient,
  encodeFunctionData,
  erc20Abi,
  http,
} from 'viem';
import { useAccount, useConfig, useWriteContract } from 'wagmi';
import { arbitrum } from 'wagmi/chains';

import { useContracts } from '@hooks/network/useContracts';
import { NetworkName, getSubsquidNetwork } from '@hooks/network/useSubsquidNetwork';

import { vestingAbi } from './subsquid.generated';
import { errorMessage, isUserRejection } from './utils';

type WriteTransactionParams<TAbi extends Abi, TFunctionName extends ContractFunctionName<TAbi>> = {
  abi: TAbi;
  address: Address;
  functionName: TFunctionName;
  args?: ContractFunctionArgs<TAbi, 'nonpayable' | 'payable', TFunctionName>;
  approve?: bigint;
  approveToken?: Address;
  vesting?: Address;
};

type WriteTransactionResult = {
  isPending: boolean;
  error: Error | null;
  isError: boolean;
  writeTransactionAsync: <TAbi extends Abi, TFunctionName extends ContractFunctionName<TAbi>>(
    params: WriteTransactionParams<TAbi, TFunctionName>,
  ) => Promise<TransactionReceipt>;
};

export function useWriteSQDTransaction({}: object = {}): WriteTransactionResult {
  const config = useConfig();
  const { writeContractAsync, ...result } = useWriteContract();
  const { SQD } = useContracts();
  const account = useAccount();
  const mutation = useMutation<
    TransactionReceipt,
    Error,
    WriteTransactionParams<Abi, ContractFunctionName<Abi>>
  >({
    mutationFn: async params => {
      try {
        let hash: `0x${string}`;
        if (params.vesting) {
          const encodedFunctionData = encodeFunctionData({
            abi: params.abi,
            functionName: params.functionName,
            args: params.args,
          } as Parameters<typeof encodeFunctionData>[0]);

          hash = await writeContractAsync({
            address: params.vesting,
            abi: vestingAbi,
            functionName: 'execute',
            args: params.approve
              ? [params.address, encodedFunctionData, params.approve]
              : [params.address, encodedFunctionData],
          } as Parameters<typeof writeContractAsync>[0]);
        } else {
          if (params.approve) {
            const tokenAddress = params.approveToken || SQD;
            const allowance = await readContract(config, {
              abi: erc20Abi,
              functionName: 'allowance',
              address: tokenAddress,
              args: [account.address!, params.address],
            });

            if (allowance < params.approve) {
              simulateTenderly({
                sender: account.address!,
                contractAddress: tokenAddress,
                params: {
                  abi: erc20Abi,
                  functionName: 'approve',
                  args: [params.address, params.approve],
                },
              });

              const hash = await writeContract(config, {
                abi: erc20Abi,
                functionName: 'approve',
                address: tokenAddress,
                args: [params.address, params.approve],
              });
              await waitForTransactionReceipt(config, { hash });
            }
          }

          simulateTenderly({
            sender: account.address,
            contractAddress: params.address,
            params: {
              abi: params.abi,
              functionName: params.functionName,
              args: params.args,
            },
          });

          // FIXME: this is a workaround for wagmi types,
          // probably makes sense to do it in a different way
          hash = await writeContractAsync({
            abi: params.abi,
            functionName: params.functionName,
            address: params.address,
            args: params.args,
          } as Parameters<typeof writeContractAsync>[0]);
        }

        const receipt = await waitForTransactionReceipt(config, { hash });

        if (receipt.status === 'reverted') {
          await replayRevertedCall(config, params, account.address!, receipt);
          throw new Error('Transaction reverted');
        }

        return receipt;
      } catch (e) {
        if (isUserRejection(e)) {
          throw e;
        }

        if (e instanceof Error) {
          let extra: Record<string, unknown> | undefined;

          if (e instanceof ContractFunctionExecutionError) {
            const { abi, functionName, args } = e;
            extra = { abi, functionName, args };
          }

          Sentry.captureException(e, {
            extra: {
              args: extra,
              connections: JSON.stringify(
                Array.from(config.state.connections.values()).map(c => ({
                  accounts: c.accounts,
                  chainId: c.chainId,
                  connector: {
                    id: c.connector.id,
                    name: c.connector.name,
                    type: c.connector.type,
                    transport: c.connector.transport,
                  },
                })),
              ),
            },
          });
        }

        const message = errorMessage(e, [params.abi]);

        toast.error(message);

        throw new Error(message);
      }
    },
  });

  return {
    ...result,
    isPending: mutation.isPending,
    error: mutation.error ?? null,
    isError: mutation.isError,
    writeTransactionAsync: async <
      TAbi extends Abi,
      TFunctionName extends ContractFunctionName<TAbi>,
    >(
      params: WriteTransactionParams<TAbi, TFunctionName>,
    ) => mutation.mutateAsync(params as WriteTransactionParams<Abi, ContractFunctionName<Abi>>),
  };
}

function simulateTenderly(opts: any) {
  if (process.env.NODE_ENV === 'production' && getSubsquidNetwork() === NetworkName.Mainnet) {
    const client = createPublicClient({
      chain: arbitrum,
      transport: http(`${window.location.origin}/rpc/arbitrum-one-tenderly`),
    });

    const data = encodeFunctionData(opts.params);
    // NOTE: we do not really care about the result
    client
      .request({
        method: 'tenderly_simulateTransaction',
        params: [
          {
            from: opts.sender,
            to: opts.contractAddress,
            value: '0x0',
            data,
          },
          'latest',
        ],
      } as any)
      .catch(() => {});
  }
}

/**
 * Re-simulate a reverted transaction at the block it failed to extract
 * the actual revert reason. The simulation error (if any) is thrown so it
 * can be decoded by `errorMessage`.
 */
async function replayRevertedCall(
  config: ReturnType<typeof useConfig>,
  params: WriteTransactionParams<Abi, ContractFunctionName<Abi>>,
  sender: Address,
  receipt: TransactionReceipt,
) {
  try {
    const client = getPublicClient(config);
    if (!client) return;

    const data = encodeFunctionData({
      abi: params.abi,
      functionName: params.functionName,
      args: params.args,
    } as Parameters<typeof encodeFunctionData>[0]);

    await client.call({
      account: sender,
      to: params.address,
      data,
      blockNumber: receipt.blockNumber,
    });
  } catch (revertError) {
    throw revertError;
  }
}

const empty = {
  blockNumber: 0n,
  blockHash: '0x0',
  contractAddress: '0x0',
  gasUsed: 0n,
  cumulativeGasUsed: 0n,
  effectiveGasPrice: 0n,
  logs: [],
  logsBloom: '0x0',
  status: 'success',
  to: '0x0',
  transactionHash: '0x0',
  transactionIndex: 0,
  type: '0x0',
  from: '0x0',
} satisfies TransactionReceipt;
