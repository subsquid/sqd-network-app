import { useState } from 'react';

import * as Sentry from '@sentry/react';
import { readContract, waitForTransactionReceipt, writeContract } from '@wagmi/core';
import { ContractFunctionExecutionError, createPublicClient, erc20Abi, http } from 'viem';
import {
  Abi,
  Address,
  ContractFunctionArgs,
  ContractFunctionName,
  TransactionReceipt,
  encodeFunctionData,
} from 'viem';
import { useConfig, useWriteContract } from 'wagmi';
import { arbitrum } from 'wagmi/chains';

import { useAccount } from '@network/useAccount';
import { useContracts } from '@network/useContracts';
import { getSubsquidNetwork, NetworkName } from '@network/useSubsquidNetwork';

import { vestingAbi } from './subsquid.generated';

type WriteTransactionParams<TAbi extends Abi, TFunctionName extends ContractFunctionName<TAbi>> = {
  abi: TAbi;
  address: Address;
  functionName: TFunctionName;
  args?: ContractFunctionArgs<TAbi, 'nonpayable' | 'payable', TFunctionName>;
  approve?: bigint;
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
  const [isPending, setPending] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const { SQD } = useContracts();
  const account = useAccount();

  return {
    ...result,
    isPending,
    error,
    isError: !!error,
    writeTransactionAsync: async <
      TAbi extends Abi,
      TFunctionName extends ContractFunctionName<TAbi>,
    >(
      params: WriteTransactionParams<TAbi, TFunctionName>,
    ) => {
      setPending(true);
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
            const allowance = await readContract(config, {
              abi: erc20Abi,
              functionName: 'allowance',
              address: SQD,
              args: [account.address!, params.address],
            });

            if (allowance < params.approve) {
              simulateTenderly({
                sender: account.address!,
                contractAddress: SQD,
                params: {
                  abi: erc20Abi,
                  functionName: 'approve',
                  args: [params.address, params.approve],
                },
              });

              const hash = await writeContract(config, {
                abi: erc20Abi,
                functionName: 'approve',
                address: SQD,
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

        return await waitForTransactionReceipt(config, { hash });
      } catch (e) {
        if (e instanceof Error && !/rejected/i.test(e.message)) {
          let params: any;

          if (e instanceof ContractFunctionExecutionError) {
            const { abi, functionName, args } = e;
            params = { abi, functionName, args };
          }

          Sentry.captureException(e, {
            extra: {
              args: params,
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

        // biome-ignore lint/suspicious/noConsole: <explanation>
        console.error(e);
        setError(e as Error);
        throw e;
      } finally {
        setPending(false);
      }
    },
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
