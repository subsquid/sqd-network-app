/**
 * TS deploy harness for the mock stack.
 *
 * Deploys the contracts the app reads in mock mode, seeds persona ETH/SQD
 * balances, and writes:
 *   - `.deployments.json`  → name → address map.
 *   - `.anvil-state.json`  → anvil state dump (consumed by `--load-state` so
 *                            subsequent boots skip the deploy step entirely).
 *
 * Scope is **incremental**: Phase 6 ships a minimal mock-only deploy (tokens
 * + Multicall3 + V3 router) so consumers can build against the harness while
 * the network/portal contract submodules' deploys land in follow-up commits.
 */
import fs from 'node:fs';

import {
  type Address,
  type Hex,
  type PublicClient,
  type WalletClient,
  createPublicClient,
  createWalletClient,
  encodeFunctionData,
  http,
  keccak256,
  parseEther,
  toBytes,
} from 'viem';
import { privateKeyToAccount } from 'viem/accounts';

import { localArtifact, networkArtifact, portalArtifact } from './artifacts';
import { EPOCH_LENGTH_BLOCKS } from './config';
import { type AddressMap } from './deployments';
import { DEPLOYER_PRIVATE_KEY } from './personas';
import { seedPersonas } from './seed';

/** Minimal viem chain — chain id is the only field we use. */
export function chainFor(chainId: number) {
  return {
    id: chainId,
    name: chainId === 421614 ? 'arbitrum-sepolia-mock' : 'arbitrum-mock',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: { default: { http: ['http://localhost:8545'] } },
  } as const;
}

export interface DeployOpts {
  rpcUrl: string;
  chainId: number;
}

export interface DeployResult {
  deployments: AddressMap;
  /** Block number at which all setup completed — useful for indexer fromBlock. */
  bootBlock: bigint;
}

/** Run the full deploy sequence + persona seeding. */
export async function runDeploy(opts: DeployOpts): Promise<DeployResult> {
  const chain = chainFor(opts.chainId);
  const account = privateKeyToAccount(DEPLOYER_PRIVATE_KEY);
  const wallet = createWalletClient({ account, chain, transport: http(opts.rpcUrl) });
  const publicClient = createPublicClient({ chain, transport: http(opts.rpcUrl) });

  const deployments: AddressMap = {};

  // 1. Mock tokens + Multicall3 + V3 router.
  deployments.MULTICALL = await deployLocal(wallet, publicClient, 'Multicall3', []);
  deployments.SQD = await deployLocal(wallet, publicClient, 'MockSQD', []);
  deployments.USDC = await deployLocal(wallet, publicClient, 'MockUSDC', []);
  deployments.WETH = await deployLocal(wallet, publicClient, 'MockWETH', []);
  deployments.V3_ROUTER = await deployLocal(wallet, publicClient, 'MockV3Router', []);

  // 2. Network contracts (subset of sqd-network-contracts/Deploy.s.sol).
  //
  // Order is constrained by constructor dependencies: Router is deployed as
  // an upgradeable proxy first (with placeholder impl), then network +
  // staking + worker registration etc. take it via constructor; finally
  // Router.initialize() is called once all referenced contracts exist.
  await deployNetworkContracts(wallet, publicClient, deployments, account.address);

  // 3. Portal contracts (subset of sqd-portal-contracts/Deploy.s.sol's
  //    DeployArbitrum mainnet flow — no FeeRouterV2 buyback).
  await deployPortalContracts(wallet, publicClient, deployments);

  // 4. Seed personas with realistic on-chain state.
  await seedPersonas(opts, deployments);

  const bootBlock = await publicClient.getBlockNumber();
  return { deployments, bootBlock };
}

/** Deploy a contract from the local mock-stack `out/` artefacts. */
async function deployLocal(
  wallet: WalletClient,
  publicClient: PublicClient,
  contractName: string,
  args: readonly unknown[],
): Promise<Address> {
  return deployRaw(wallet, publicClient, contractName, localArtifact(contractName), args);
}

/** Deploy a contract from the `sqd-network-contracts` submodule's artefacts. */
async function deployNetwork(
  wallet: WalletClient,
  publicClient: PublicClient,
  contractFile: string,
  contractName: string,
  args: readonly unknown[],
): Promise<Address> {
  return deployRaw(
    wallet,
    publicClient,
    contractName,
    networkArtifact(contractFile, contractName),
    args,
  );
}

async function deployRaw(
  wallet: WalletClient,
  publicClient: PublicClient,
  label: string,
  artifact: { abi: ContractAbi; bytecode: `0x${string}` },
  args: readonly unknown[],
): Promise<Address> {
  const hash = await wallet.deployContract({
    abi: artifact.abi,
    bytecode: artifact.bytecode,
    args: args as readonly unknown[],
    account: wallet.account!,
    chain: wallet.chain,
  });
  const receipt = await publicClient.waitForTransactionReceipt({ hash });
  if (!receipt.contractAddress) {
    throw new Error(`Deploy of ${label} produced no contractAddress`);
  }
  // biome-ignore lint/suspicious/noConsole: deploy progress
  console.log(`[mock-stack] deployed ${label} at ${receipt.contractAddress}`);
  return receipt.contractAddress;
}

/**
 * Deploy the subsquid-network-contracts subset that the app actually
 * reads in mock mode.
 *
 * Order mirrors `script/Deploy.s.sol` from the network-contracts submodule
 * with the gateway strategies + AllocationsViewer + portal contracts
 * skipped (not consumed by current mock-mode flows).
 */
async function deployNetworkContracts(
  wallet: WalletClient,
  publicClient: PublicClient,
  deployments: AddressMap,
  deployer: Address,
): Promise<void> {
  const sqd = deployments.SQD;

  // Router behind a transparent proxy. Initialise after dependencies exist.
  const routerImpl = await deployNetwork(wallet, publicClient, 'Router', 'Router', []);
  const routerProxy = await deployNetwork(
    wallet,
    publicClient,
    'TransparentUpgradeableProxy',
    'TransparentUpgradeableProxy',
    [routerImpl, deployer, '0x'],
  );
  deployments.ROUTER = routerProxy;

  // NetworkController: workerEpochLength (blocks; deliberately small so workers
  // become active after a single anvil_mine call), firstEpoch=0,
  // epochCheckpoint=0, bondAmount=100_000 SQD, allowedVestedTargets=[]
  // (filled via setters below).
  deployments.NETWORK_CONTROLLER = await deployNetwork(
    wallet,
    publicClient,
    'NetworkController',
    'NetworkController',
    [BigInt(EPOCH_LENGTH_BLOCKS), 0n, 0n, 100_000n * 10n ** 18n, []],
  );

  deployments.STAKING = await deployNetwork(wallet, publicClient, 'Staking', 'Staking', [
    sqd,
    routerProxy,
  ]);
  deployments.WORKER_REGISTRATION = await deployNetwork(
    wallet,
    publicClient,
    'WorkerRegistration',
    'WorkerRegistration',
    [sqd, routerProxy],
  );
  deployments.REWARD_TREASURY = await deployNetwork(
    wallet,
    publicClient,
    'RewardTreasury',
    'RewardTreasury',
    [sqd],
  );
  deployments.SOFT_CAP = await deployNetwork(wallet, publicClient, 'SoftCap', 'SoftCap', [
    routerProxy,
  ]);
  deployments.REWARD_DISTRIBUTION = await deployNetwork(
    wallet,
    publicClient,
    'DistributedRewardDistribution',
    'DistributedRewardsDistribution',
    [routerProxy],
  );
  deployments.REWARD_CALCULATION = await deployNetwork(
    wallet,
    publicClient,
    'RewardCalculation',
    'RewardCalculation',
    [routerProxy, deployments.SOFT_CAP],
  );

  // GatewayRegistry behind a proxy.
  const gatewayImpl = await deployNetwork(
    wallet,
    publicClient,
    'GatewayRegistry',
    'GatewayRegistry',
    [],
  );
  deployments.GATEWAY_REGISTRATION = await deployNetwork(
    wallet,
    publicClient,
    'TransparentUpgradeableProxy',
    'TransparentUpgradeableProxy',
    [gatewayImpl, deployer, '0x'],
  );

  // VestingFactory(token, router).
  deployments.VESTING_FACTORY = await deployNetwork(
    wallet,
    publicClient,
    'VestingFactory',
    'VestingFactory',
    [sqd, routerProxy],
  );

  // Wire roles + Router.initialize.
  const routerAbi = networkArtifact('Router').abi;
  const stakingAbi = networkArtifact('Staking').abi;
  const treasuryAbi = networkArtifact('RewardTreasury').abi;
  const distributorAbi = networkArtifact(
    'DistributedRewardDistribution',
    'DistributedRewardsDistribution',
  ).abi;
  const gatewayAbi = networkArtifact('GatewayRegistry').abi;
  const networkAbi = networkArtifact('NetworkController').abi;

  await sendTx(wallet, publicClient, {
    abi: routerAbi,
    address: routerProxy,
    functionName: 'initialize',
    args: [
      deployments.WORKER_REGISTRATION,
      deployments.STAKING,
      deployments.REWARD_TREASURY,
      deployments.NETWORK_CONTROLLER,
      deployments.REWARD_CALCULATION,
    ],
  });

  await sendTx(wallet, publicClient, {
    abi: gatewayAbi,
    address: deployments.GATEWAY_REGISTRATION,
    functionName: 'initialize',
    args: [sqd, routerProxy],
  });

  // Roles: Staking grants REWARDS_DISTRIBUTOR_ROLE to the Distributor;
  // Treasury whitelists the distributor; Distributor grants
  // REWARDS_TREASURY_ROLE to the treasury.
  const REWARDS_DISTRIBUTOR_ROLE = roleHash('REWARDS_DISTRIBUTOR_ROLE');
  const REWARDS_TREASURY_ROLE = roleHash('REWARDS_TREASURY_ROLE');

  await sendTx(wallet, publicClient, {
    abi: stakingAbi,
    address: deployments.STAKING,
    functionName: 'grantRole',
    args: [REWARDS_DISTRIBUTOR_ROLE, deployments.REWARD_DISTRIBUTION],
  });
  await sendTx(wallet, publicClient, {
    abi: treasuryAbi,
    address: deployments.REWARD_TREASURY,
    functionName: 'setWhitelistedDistributor',
    args: [deployments.REWARD_DISTRIBUTION, true],
  });
  await sendTx(wallet, publicClient, {
    abi: distributorAbi,
    address: deployments.REWARD_DISTRIBUTION,
    functionName: 'grantRole',
    args: [REWARDS_TREASURY_ROLE, deployments.REWARD_TREASURY],
  });

  // Whitelist the deployer as the single rewards committer. requiredApproves
  // defaults to 1, so a single commit() triggers immediate distribute().
  // The seed step in seed.ts runs one fixed-amount commit after delegations
  // are placed so personas have non-zero claimable rewards out of the box.
  await sendTx(wallet, publicClient, {
    abi: distributorAbi,
    address: deployments.REWARD_DISTRIBUTION,
    functionName: 'addDistributor',
    args: [deployer],
  });

  // Pre-fund the treasury so RewardTreasury._claim can transfer SQD to
  // claimers. 10M SQD is comfortably more than ~500 fixed-reward cycles
  // worth of distributions.
  const sqdAbi = localArtifact('MockSQD').abi;
  await sendTx(wallet, publicClient, {
    abi: sqdAbi,
    address: sqd,
    functionName: 'mint',
    args: [deployments.REWARD_TREASURY, 10_000_000n * 10n ** 18n],
  });

  for (const target of [
    deployments.WORKER_REGISTRATION,
    deployments.STAKING,
    deployments.GATEWAY_REGISTRATION,
    deployments.REWARD_TREASURY,
  ]) {
    await sendTx(wallet, publicClient, {
      abi: networkAbi,
      address: deployments.NETWORK_CONTROLLER,
      functionName: 'setAllowedVestedTarget',
      args: [target, true],
    });
  }
}

/** Compute keccak256(role) — used for AccessControl role hashes. */
function roleHash(role: string): `0x${string}` {
  return keccak256(toBytes(role));
}

/**
 * Deploy the portal-contracts subset that the app reads. Mirrors the
 * `DeployArbitrum` flow from sqd-portal-contracts/script/Deploy.s.sol —
 * upgradable PortalRegistry + FeeRouterModule + PortalPoolImplementation
 * + PortalPoolFactory (proxy). Skips the gateway whitelist + the second
 * pool deployer role grants (single-deployer test stack).
 */
async function deployPortalContracts(
  wallet: WalletClient,
  publicClient: PublicClient,
  deployments: AddressMap,
): Promise<void> {
  const sqd = deployments.SQD;
  // PortalRegistry: needs an initialize(SQD, minStakeThreshold, mana) call
  // delegated through ERC1967Proxy.
  const minStakeThreshold = 100_000n * 10n ** 18n;
  const mana = 1_000n;
  const maxStakePerWallet = 100_000n * 10n ** 18n;
  const workerEpochLength = 100n;

  // 1. PortalRegistry: impl + ERC1967Proxy initialised via initialize(SQD, minStakeThreshold, mana).
  const registryImpl = await deployRaw(
    wallet,
    publicClient,
    'PortalRegistry-impl',
    portalArtifact('PortalRegistry'),
    [],
  );
  const registryAbi = portalArtifact('PortalRegistry').abi;
  const registryInitData = encodeFunctionData({
    abi: registryAbi,
    functionName: 'initialize',
    args: [sqd, minStakeThreshold, mana],
  });
  deployments.PORTAL_REGISTRY = await deployRaw(
    wallet,
    publicClient,
    'PortalRegistry',
    portalArtifact('ERC1967Proxy'),
    [registryImpl, registryInitData],
  );

  // 2. FeeRouterModule (v1): no constructor args.
  deployments.FEE_ROUTER = await deployRaw(
    wallet,
    publicClient,
    'FeeRouterModule',
    portalArtifact('FeeRouterModule'),
    [],
  );

  // 3. PortalPoolImplementation (used as the beacon impl for cloned pools).
  const portalPoolImpl = await deployRaw(
    wallet,
    publicClient,
    'PortalPoolImplementation',
    portalArtifact('PortalPoolImplementation'),
    [],
  );
  deployments.PORTAL_POOL_IMPL = portalPoolImpl;

  // 4. PortalPoolFactory: impl + ERC1967Proxy init with the
  //    initialize(impl, registry, feeRouter, sqd, maxStakePerWallet,
  //              minStakeThreshold, workerEpochLength) selector.
  const factoryImpl = await deployRaw(
    wallet,
    publicClient,
    'PortalPoolFactory-impl',
    portalArtifact('PortalPoolFactory'),
    [],
  );
  const factoryAbi = portalArtifact('PortalPoolFactory').abi;
  const factoryInitData = encodeFunctionData({
    abi: factoryAbi,
    functionName: 'initialize',
    args: [
      portalPoolImpl,
      deployments.PORTAL_REGISTRY,
      deployments.FEE_ROUTER,
      sqd,
      maxStakePerWallet,
      minStakeThreshold,
      workerEpochLength,
    ],
  });
  deployments.PORTAL_POOL_FACTORY = await deployRaw(
    wallet,
    publicClient,
    'PortalPoolFactory',
    portalArtifact('ERC1967Proxy'),
    [factoryImpl, factoryInitData],
  );

  // Read out the beacon address (the factory deploys it during initialize).
  try {
    const beacon = (await publicClient.readContract({
      abi: factoryAbi,
      address: deployments.PORTAL_POOL_FACTORY,
      functionName: 'beacon',
    })) as Address;
    deployments.PORTAL_POOL_BEACON = beacon;
  } catch {
    // Optional — beacon read isn't critical for resolvers.
  }

  // 5. Wire registry → factory + add USDC as payment token + worker pool addr.
  await sendTx(wallet, publicClient, {
    abi: registryAbi,
    address: deployments.PORTAL_REGISTRY,
    functionName: 'setFactory',
    args: [deployments.PORTAL_POOL_FACTORY],
  });
  await sendTx(wallet, publicClient, {
    abi: factoryAbi,
    address: deployments.PORTAL_POOL_FACTORY,
    functionName: 'addPaymentToken',
    args: [deployments.USDC],
  });
  const feeRouterAbi = portalArtifact('FeeRouterModule').abi;
  // Use the staking address as a stand-in worker pool — fee router only
  // needs a non-zero address; no SQD ever moves through it in mock mode.
  await sendTx(wallet, publicClient, {
    abi: feeRouterAbi,
    address: deployments.FEE_ROUTER,
    functionName: 'setWorkerPoolAddress',
    args: [deployments.STAKING],
  });
  // Open the factory so any persona can `createPortalPool` (we don't bother
  // with the role-grant ceremony for a single-tenant test stack).
  await sendTx(wallet, publicClient, {
    abi: factoryAbi,
    address: deployments.PORTAL_POOL_FACTORY,
    functionName: 'setPoolDeploymentOpen',
    args: [true],
  });
  // Disable default whitelist so personas can deposit without being on a
  // per-pool allow-list (defaultWhitelistEnabled defaults to true).
  await sendTx(wallet, publicClient, {
    abi: factoryAbi,
    address: deployments.PORTAL_POOL_FACTORY,
    functionName: 'setDefaultWhitelistEnabled',
    args: [false],
  });
}

async function sendTx(
  wallet: WalletClient,
  publicClient: PublicClient,
  args: {
    abi: ContractAbi;
    address: Address;
    functionName: string;
    args: readonly unknown[];
  },
): Promise<void> {
  const hash = await wallet.writeContract({
    abi: args.abi,
    address: args.address,
    functionName: args.functionName,
    args: args.args,
    account: wallet.account!,
    chain: wallet.chain,
  });
  await publicClient.waitForTransactionReceipt({ hash });
}

type ContractAbi = ReturnType<typeof networkArtifact>['abi'];

/**
 * Dump anvil state to a file so subsequent boots can replay it via
 * `loadAnvilState()`.
 *
 * The dump is the hex-encoded, gzipped serialisation returned by
 * `anvil_dumpState`. It is **not** compatible with anvil's `--load-state`
 * flag (which expects an unframed JSON dump); always pair this with
 * `loadAnvilState()` post-spawn.
 */
export async function dumpAnvilState(rpcUrl: string, outFile: string): Promise<void> {
  const publicClient = createPublicClient({ transport: http(rpcUrl) });
  const dump = (await publicClient.request({
    // biome-ignore lint/suspicious/noExplicitAny: anvil cheatcode
    method: 'anvil_dumpState' as any,
    params: [] as never,
  })) as Hex;
  fs.writeFileSync(outFile, dump);
}

/** Load a previously-dumped anvil state via `anvil_loadState`. */
export async function loadAnvilState(rpcUrl: string, file: string): Promise<void> {
  if (!fs.existsSync(file)) {
    throw new Error(`Anvil state file not found: ${file}`);
  }
  const dump = fs.readFileSync(file, 'utf-8').trim() as Hex;
  const publicClient = createPublicClient({ transport: http(rpcUrl) });
  await publicClient.request({
    // biome-ignore lint/suspicious/noExplicitAny: anvil cheatcode
    method: 'anvil_loadState' as any,
    params: [dump] as never,
  });
}

// re-export for downstream consumers
export type { AddressMap };
export { parseEther };
