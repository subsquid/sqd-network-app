/**
 * In-process mock Ethereum JSON-RPC server for local development and testing.
 *
 * Started automatically when MOCK_WALLET=true.  Listens on MOCK_RPC_PORT
 * (default 8545) and exposes a minimal EIP-1193 / JSON-RPC 2.0 interface
 * that is enough for wagmi to:
 *   - read balances, nonces, and contract storage
 *   - submit transactions that are immediately "mined" in-memory
 *   - receive receipts with status "success"
 *   - resolve eth_call for ERC-20 and Subsquid contract read functions
 *
 * State is stored in plain JS Maps and resets whenever the dev server
 * process restarts — no persistence.
 *
 * NOT a real EVM. eth_call is handled by a pre-registered ABI decoder /
 * fixture map. For any unrecognised call it returns `0x` so the UI
 * gracefully shows zeros rather than crashing.
 */

import http from 'node:http';

import { type Address, encodeFunctionResult, erc20Abi, keccak256, toBytes, toHex } from 'viem';

export const MOCK_RPC_PORT = Number(process.env.MOCK_RPC_PORT ?? 8545);
export const MOCK_RPC_URL = `http://localhost:${MOCK_RPC_PORT}`;

// ---------------------------------------------------------------------------
// Chain — we mirror whatever NETWORK the server is running
// ---------------------------------------------------------------------------
const CHAIN_ID = process.env.NETWORK === 'tethys' ? 421614 : 42161; // arbitrumSepolia : arbitrum

// ---------------------------------------------------------------------------
// Fixture accounts — exported so client config can reference them too
// ---------------------------------------------------------------------------
export interface MockAccount {
  address: Address;
  label: string;
  description: string;
  /** ETH balance in wei (hex) */
  ethBalance: bigint;
  /** SQD token balance in wei */
  sqdBalance: bigint;
}

// Hardhat-derived deterministic private keys (well-known test addresses)
export const MOCK_ACCOUNTS: readonly MockAccount[] = [
  {
    address: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
    label: 'Alice (empty)',
    description: 'Fresh account — no SQD, no delegations, no workers',
    ethBalance: 10n * 10n ** 18n,
    sqdBalance: 0n,
  },
  {
    address: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
    label: 'Bob (delegator)',
    description: 'Has 50 000 SQD delegated to a worker',
    ethBalance: 10n * 10n ** 18n,
    sqdBalance: 200_000n * 10n ** 18n,
  },
  {
    address: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
    label: 'Carol (worker operator)',
    description: 'Owns 2 registered workers, 100 000 SQD bonded',
    ethBalance: 10n * 10n ** 18n,
    sqdBalance: 500_000n * 10n ** 18n,
  },
  {
    address: '0x90F79bf6EB2c4f870365E785982E1f101E93b906',
    label: 'Dave (vesting)',
    description: 'Has 1 000 000 SQD in a vesting contract',
    ethBalance: 10n * 10n ** 18n,
    sqdBalance: 50_000n * 10n ** 18n,
  },
] as const;

// ---------------------------------------------------------------------------
// In-memory state
// ---------------------------------------------------------------------------

/** ETH balances keyed by lower-cased address */
const ethBalances = new Map<string, bigint>(
  MOCK_ACCOUNTS.map(a => [a.address.toLowerCase(), a.ethBalance]),
);

/** SQD token balances keyed by lower-cased address */
const sqdBalances = new Map<string, bigint>(
  MOCK_ACCOUNTS.map(a => [a.address.toLowerCase(), a.sqdBalance]),
);

/** ERC-20 allowances: `${owner.toLowerCase()}-${spender.toLowerCase()}` → amount */
const erc20Allowances = new Map<string, bigint>();

/** The currently selected account index (0-based into MOCK_ACCOUNTS).
 * Set via mock_selectAccount so eth_requestAccounts returns only the chosen address. */
let selectedAccountIndex = 0;

/** Transaction counter (nonce) per address */
const nonces = new Map<string, number>(MOCK_ACCOUNTS.map(a => [a.address.toLowerCase(), 0]));

/** Submitted transactions: hash → receipt */
interface MockReceipt {
  transactionHash: `0x${string}`;
  blockHash: `0x${string}`;
  blockNumber: `0x${string}`;
  from: Address;
  to: Address | null;
  status: '0x1' | '0x0';
  gasUsed: `0x${string}`;
  cumulativeGasUsed: `0x${string}`;
  logs: unknown[];
  logsBloom: `0x${string}`;
  transactionIndex: `0x${string}`;
  type: `0x${string}`;
  effectiveGasPrice: `0x${string}`;
  contractAddress: Address | null;
}

const receipts = new Map<string, MockReceipt>();
let blockNumber = 0x115e6a0; // ~18 M (close to real Arbitrum block)

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function nextBlock(): `0x${string}` {
  blockNumber += 1;
  return `0x${blockNumber.toString(16)}`;
}

function makeTxHash(from: string, nonce: number): `0x${string}` {
  return keccak256(toBytes(`${from}:${nonce}:${Date.now()}`));
}

function hexBalance(wei: bigint): `0x${string}` {
  return `0x${wei.toString(16)}`;
}

// SQD contract address (both networks, same address)
const SQD_ADDRESS = '0x1337420ded5adb9980cfc35f8f2b054ea86f8ab1';

/**
 * Minimal eth_call handler.
 * Decodes the 4-byte function selector from `data` and dispatches to a
 * hand-written implementation.  Unknown selectors return '0x'.
 */
function handleEthCall(params: { to?: string; data?: string; from?: string }): string {
  const data = params.data ?? '';
  const selector = data.slice(0, 10).toLowerCase();
  const to = (params.to ?? '').toLowerCase();

  // ERC-20: balanceOf(address) → 0x70a08231
  if (selector === '0x70a08231') {
    const ownerHex = `0x${data.slice(34, 74)}`;
    const owner = ownerHex.toLowerCase();
    if (to === SQD_ADDRESS) {
      const bal = sqdBalances.get(owner) ?? 0n;
      return toHex(bal, { size: 32 });
    }
    return toHex(0n, { size: 32 });
  }

  // ERC-20: allowance(owner, spender) → 0xdd62ed3e
  if (selector === '0xdd62ed3e') {
    const owner = `0x${data.slice(34, 74)}`.toLowerCase();
    const spender = `0x${data.slice(98, 138)}`.toLowerCase();
    const key = `${owner}-${spender}`;
    const allowance = erc20Allowances.get(key) ?? 0n;
    return toHex(allowance, { size: 32 });
  }

  // ERC-20: symbol() → 0x95d89b41
  if (selector === '0x95d89b41' && to === SQD_ADDRESS) {
    return encodeFunctionResult({ abi: erc20Abi, functionName: 'symbol', result: 'SQD' });
  }

  // ERC-20: decimals() → 0x313ce567
  if (selector === '0x313ce567' && to === SQD_ADDRESS) {
    return encodeFunctionResult({ abi: erc20Abi, functionName: 'decimals', result: 18 });
  }

  // ERC-20: name() → 0x06fdde03
  if (selector === '0x06fdde03' && to === SQD_ADDRESS) {
    return encodeFunctionResult({
      abi: erc20Abi,
      functionName: 'name',
      result: 'Subsquid (Mock)',
    });
  }

  // Multicall3: aggregate3 → 0x82ad56cb — return empty results array
  // Most contract reads flow through multicall; returning empty makes hooks get undefined
  // which the UI handles gracefully (shows loading / zero).
  // We return a valid ABI-encoded empty result array.
  if (selector === '0x82ad56cb') {
    // aggregate3 returns (bool success, bytes returnData)[] — return empty array
    // ABI encoding of empty array: offset(32) + length(0)
    return (
      '0x' +
      '0000000000000000000000000000000000000000000000000000000000000020' +
      '0000000000000000000000000000000000000000000000000000000000000000'
    );
  }

  // Anything else — return 0x (unknown / unimplemented)
  return '0x';
}

/**
 * Processes a submitted transaction and updates in-memory state.
 * Returns the transaction hash.
 */
function handleSendTransaction(tx: {
  from?: string;
  to?: string;
  data?: string;
  value?: string;
  gas?: string;
  gasPrice?: string;
  nonce?: string;
}): `0x${string}` {
  const from = (tx.from ?? MOCK_ACCOUNTS[0].address).toLowerCase();
  const to = (tx.to ?? '').toLowerCase();
  const data = tx.data ?? '0x';
  const value = tx.value ? BigInt(tx.value) : 0n;
  const nonce = nonces.get(from) ?? 0;

  nonces.set(from, nonce + 1);

  // Apply state changes based on selector
  const selector = data.slice(0, 10).toLowerCase();

  // ERC-20: approve(spender, amount) → 0x095ea7b3
  if (selector === '0x095ea7b3' && to === SQD_ADDRESS) {
    const spender = `0x${data.slice(34, 74)}`.toLowerCase();
    const amount = BigInt(`0x${data.slice(74, 138)}`);
    erc20Allowances.set(`${from}-${spender}`, amount);
  }

  // ERC-20: transfer(to, amount) → 0xa9059cbb
  if (selector === '0xa9059cbb' && to === SQD_ADDRESS) {
    const recipient = `0x${data.slice(34, 74)}`.toLowerCase();
    const amount = BigInt(`0x${data.slice(74, 138)}`);
    const fromBal = sqdBalances.get(from) ?? 0n;
    if (fromBal >= amount) {
      sqdBalances.set(from, fromBal - amount);
      sqdBalances.set(recipient, (sqdBalances.get(recipient) ?? 0n) + amount);
    }
  }

  // All other transactions: accept and record as successful no-op.
  // Real contract state changes (delegation, bonding, etc.) are tracked by
  // the Squid indexer in production. In mock mode the GraphQL server already
  // returns fixture data, so UI state is consistent without real EVM execution.

  const hash = makeTxHash(from, nonce);
  const blockNum = nextBlock();

  receipts.set(hash, {
    transactionHash: hash,
    blockHash: keccak256(toBytes(blockNum)),
    blockNumber: blockNum,
    from: from as Address,
    to: to ? (to as Address) : null,
    status: '0x1',
    gasUsed: '0x5208',
    cumulativeGasUsed: '0x5208',
    logs: [],
    logsBloom: `0x${'0'.repeat(512)}`,
    transactionIndex: '0x0',
    type: '0x2',
    effectiveGasPrice: '0x3b9aca00',
    contractAddress: null,
  });

  return hash;
}

// ---------------------------------------------------------------------------
// JSON-RPC dispatcher
// ---------------------------------------------------------------------------

interface RpcRequest {
  jsonrpc: '2.0';
  id: number | string | null;
  method: string;
  params?: unknown[];
}

interface RpcResponse {
  jsonrpc: '2.0';
  id: number | string | null;
  result?: unknown;
  error?: { code: number; message: string };
}

function dispatch(req: RpcRequest): RpcResponse {
  const { id, method, params = [] } = req;
  const ok = (result: unknown): RpcResponse => ({ jsonrpc: '2.0', id, result });
  const err = (code: number, message: string): RpcResponse => ({
    jsonrpc: '2.0',
    id,
    error: { code, message },
  });

  switch (method) {
    case 'eth_chainId':
      return ok(`0x${CHAIN_ID.toString(16)}`);

    case 'net_version':
      return ok(String(CHAIN_ID));

    case 'eth_blockNumber':
      return ok(`0x${blockNumber.toString(16)}`);

    case 'eth_getBlockByNumber':
      return ok({
        number: `0x${blockNumber.toString(16)}`,
        hash: `0x${'ab'.repeat(32)}`,
        parentHash: `0x${'00'.repeat(32)}`,
        nonce: '0x0000000000000000',
        timestamp: `0x${Math.floor(Date.now() / 1000).toString(16)}`,
        gasLimit: '0x1c9c380',
        gasUsed: '0x0',
        miner: '0x0000000000000000000000000000000000000000',
        transactions: [],
        baseFeePerGas: '0x3b9aca00',
      });

    case 'eth_gasPrice':
    case 'eth_maxPriorityFeePerGas':
      return ok('0x3b9aca00'); // 1 gwei

    case 'eth_estimateGas':
      return ok('0x5208'); // 21 000

    case 'eth_accounts':
    case 'eth_requestAccounts':
      // Return only the selected account so wagmi connects to the right address.
      return ok([MOCK_ACCOUNTS[selectedAccountIndex].address]);

    case 'eth_getBalance': {
      const address = ((params[0] as string) ?? '').toLowerCase();
      const bal = ethBalances.get(address) ?? 0n;
      return ok(hexBalance(bal));
    }

    case 'eth_getTransactionCount': {
      const address = ((params[0] as string) ?? '').toLowerCase();
      return ok(`0x${(nonces.get(address) ?? 0).toString(16)}`);
    }

    case 'eth_getCode':
      // Return non-empty for the SQD token and known contract addresses so
      // wagmi doesn't treat them as EOAs.
      return ok('0x60');

    case 'eth_call': {
      const callParams = (params[0] as { to?: string; data?: string; from?: string }) ?? {};
      return ok(handleEthCall(callParams));
    }

    case 'eth_sendTransaction':
    case 'eth_sendRawTransaction': {
      const txParams =
        method === 'eth_sendTransaction'
          ? ((params[0] as Record<string, string>) ?? {})
          : { from: MOCK_ACCOUNTS[0].address, data: (params[0] as string) ?? '0x' };
      const hash = handleSendTransaction(txParams);
      return ok(hash);
    }

    case 'eth_getTransactionByHash': {
      const hash = (params[0] as string) ?? '';
      const receipt = receipts.get(hash);
      if (!receipt) return ok(null);
      return ok({
        hash: receipt.transactionHash,
        blockNumber: receipt.blockNumber,
        blockHash: receipt.blockHash,
        from: receipt.from,
        to: receipt.to,
        value: '0x0',
        input: '0x',
        gas: '0x5208',
        gasPrice: '0x3b9aca00',
        nonce: '0x0',
        transactionIndex: '0x0',
        type: '0x2',
      });
    }

    case 'eth_getTransactionReceipt': {
      const hash = (params[0] as string) ?? '';
      const receipt = receipts.get(hash);
      return ok(receipt ?? null);
    }

    case 'eth_getLogs':
      return ok([]);

    case 'eth_getStorageAt':
      return ok(`0x${'0'.repeat(64)}`);

    case 'eth_feeHistory':
      return ok({
        oldestBlock: `0x${blockNumber.toString(16)}`,
        baseFeePerGas: ['0x3b9aca00', '0x3b9aca00'],
        gasUsedRatio: [0],
        reward: [['0x3b9aca00']],
      });

    case 'wallet_switchEthereumChain':
      // Accept chain switch silently
      return ok(null);

    // Allow reading mock account list from the client (for UI labels)
    case 'mock_getAccounts':
      return ok(MOCK_ACCOUNTS);

    // Set the active account by index before connect() is called
    case 'mock_selectAccount': {
      const idx = (params[0] as number) ?? 0;
      if (idx >= 0 && idx < MOCK_ACCOUNTS.length) {
        selectedAccountIndex = idx;
      }
      return ok(MOCK_ACCOUNTS[selectedAccountIndex].address);
    }

    default:
      // biome-ignore lint/suspicious/noConsole: mock RPC diagnostics
      console.warn(`[mock-rpc] Unhandled method: ${method}`);
      return err(-32601, `Method not found: ${method}`);
  }
}

// ---------------------------------------------------------------------------
// HTTP server
// ---------------------------------------------------------------------------

export function startMockRpcServer(): Promise<void> {
  return new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      };

      if (req.method === 'OPTIONS') {
        res.writeHead(204, corsHeaders);
        res.end();
        return;
      }

      if (req.method !== 'POST') {
        res.writeHead(405, corsHeaders);
        res.end();
        return;
      }

      let body = '';
      req.on('data', chunk => {
        body += chunk;
      });
      req.on('end', () => {
        let rpcReqs: RpcRequest[];
        try {
          const parsed = JSON.parse(body);
          rpcReqs = Array.isArray(parsed) ? parsed : [parsed];
        } catch {
          res.writeHead(400, corsHeaders);
          res.end(
            JSON.stringify({
              jsonrpc: '2.0',
              id: null,
              error: { code: -32700, message: 'Parse error' },
            }),
          );
          return;
        }

        const responses = rpcReqs.map(dispatch);
        const body_ = JSON.stringify(rpcReqs.length === 1 ? responses[0] : responses);
        res.writeHead(200, {
          ...corsHeaders,
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(body_),
        });
        res.end(body_);
      });
    });

    server.on('error', reject);
    server.listen(MOCK_RPC_PORT, '127.0.0.1', () => {
      // biome-ignore lint/suspicious/noConsole: startup diagnostic
      console.log(`[mock-rpc] EIP-1193 server listening on ${MOCK_RPC_URL}`);
      resolve();
    });
  });
}
