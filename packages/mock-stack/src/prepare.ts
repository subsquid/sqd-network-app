/**
 * Library form of the `stack:prepare` flow — boots a temporary anvil,
 * runs the deploy harness, dumps state, and tears anvil down.
 *
 * Usable from:
 *   - `scripts/prepare.ts` (the Turbo task entrypoint)
 *   - `startMockStack({ autoPrepare: true })` when a state file is missing
 */
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

import { packageRoot } from './artifacts';
import { spawnAnvil } from './chain';
import { dumpAnvilState, runDeploy } from './deploy';
import { writeDeployments } from './deployments';

export interface RunPrepareOpts {
  /** RPC port for the temporary anvil (default: ephemeral). */
  port?: number;
  /** Chain id (default 42161). */
  chainId?: number;
  /** Override the output state file path (default `<package-root>/.anvil-state.json`). */
  stateFile?: string;
}

export interface RunPrepareResult {
  stateFile: string;
  bootBlock: bigint;
  deployments: Record<string, `0x${string}`>;
}

export async function runPrepare(opts: RunPrepareOpts = {}): Promise<RunPrepareResult> {
  const port = opts.port ?? 0;
  const chainId = opts.chainId ?? 42161;
  const stateFile = opts.stateFile ?? path.resolve(packageRoot(), '.anvil-state.json');

  ensureContractArtifacts();

  const anvil = await spawnAnvil({ port, chainId });
  try {
    const result = await runDeploy({ rpcUrl: anvil.url, chainId });
    writeDeployments(result.deployments);
    await dumpAnvilState(anvil.url, stateFile);
    return {
      stateFile,
      bootBlock: result.bootBlock,
      deployments: result.deployments,
    };
  } finally {
    await anvil.stop();
  }
}

/**
 * Make sure `out/MockERC20.sol/MockSQD.json` exists. If not, run
 * `forge build` once. Skipped when artefacts are already on disk so
 * cached CI runs stay fast.
 */
function ensureContractArtifacts(): void {
  const sentinel = path.resolve(packageRoot(), 'out/MockERC20.sol/MockSQD.json');
  if (fs.existsSync(sentinel)) return;
  const forge = resolveForgeBinary();
  // biome-ignore lint/suspicious/noConsole: progress
  console.log('[mock-stack] running `forge build` (artefacts missing)');
  const result = spawnSync(forge, ['build'], {
    cwd: packageRoot(),
    stdio: 'inherit',
  });
  if (result.status !== 0) {
    throw new Error('`forge build` in packages/mock-stack failed — is Foundry installed?');
  }
}

function resolveForgeBinary(): string {
  if (process.env.FOUNDRY_PATH) {
    return path.join(process.env.FOUNDRY_PATH, 'forge');
  }
  const homeBin = path.join(process.env.HOME ?? '/root', '.foundry', 'bin', 'forge');
  if (fs.existsSync(homeBin)) return homeBin;
  return 'forge';
}
