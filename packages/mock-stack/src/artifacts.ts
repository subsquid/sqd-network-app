/**
 * Read Foundry-produced artifacts (`*.sol/<Contract>.json`) from disk.
 *
 * Each artifact bundles ABI + bytecode in the shape `forge build` emits. We
 * only consume the bare minimum (`abi`, `bytecode.object`) — the rest is
 * ignored.
 */
import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';

import type { Abi, Hex } from 'viem';

export interface ContractArtifact {
  abi: Abi;
  bytecode: Hex;
}

export interface RawArtifact {
  abi: Abi;
  bytecode: { object: string };
}

/**
 * Resolve an artifact JSON to `{ abi, bytecode }`.
 *
 * Path is resolved relative to the package root unless absolute. Throws with
 * a clear error if the file does not exist or doesn't contain bytecode (e.g.
 * pure interface contracts).
 */
export function readArtifact(artifactPath: string): ContractArtifact {
  const abs = path.isAbsolute(artifactPath)
    ? artifactPath
    : path.resolve(packageRoot(), artifactPath);
  if (!fs.existsSync(abs)) {
    throw new Error(`Foundry artifact not found: ${abs}`);
  }
  const raw = JSON.parse(fs.readFileSync(abs, 'utf-8')) as RawArtifact;
  const bytecode = raw.bytecode?.object;
  if (!bytecode || bytecode === '0x') {
    throw new Error(`Artifact ${abs} has no bytecode — likely an interface or abstract contract.`);
  }
  return {
    abi: raw.abi,
    bytecode: bytecode as Hex,
  };
}

let cachedRoot: string | undefined;

/** Resolve the absolute path to the @subsquid/mock-stack package root. */
export function packageRoot(): string {
  if (cachedRoot) return cachedRoot;
  // import.meta.url is `<root>/src/artifacts.ts` (or `<root>/dist/...`); the
  // package root is two levels up.
  const here = url.fileURLToPath(import.meta.url);
  cachedRoot = path.resolve(path.dirname(here), '..');
  return cachedRoot;
}

/** Path to one of the mock contracts compiled in `packages/mock-stack/out`. */
export function localArtifact(contractName: string): ContractArtifact {
  // Foundry layout: `out/<File>.sol/<Contract>.json`. Our mock contracts live
  // in MockERC20.sol (SQD/USDC/WETH), MockV3Router.sol, Multicall3.sol — try
  // a small set of likely files in turn.
  const candidates = [
    `out/MockERC20.sol/${contractName}.json`,
    `out/MockV3Router.sol/${contractName}.json`,
    `out/Multicall3.sol/${contractName}.json`,
    `out/${contractName}.sol/${contractName}.json`,
  ];
  for (const c of candidates) {
    const abs = path.resolve(packageRoot(), c);
    if (fs.existsSync(abs)) return readArtifact(abs);
  }
  throw new Error(
    `Could not locate local artifact for ${contractName} — did you run \`forge build\` in packages/mock-stack?`,
  );
}

/** Path to a Foundry artifact in the network-contracts submodule. */
export function networkArtifact(contractFile: string, contractName?: string): ContractArtifact {
  const file = contractFile.endsWith('.sol') ? contractFile : `${contractFile}.sol`;
  const cn = contractName ?? contractFile.replace(/\.sol$/, '');
  return readArtifact(
    path.resolve(
      packageRoot(),
      `../../sqd-network-contracts/packages/contracts/artifacts/${file}/${cn}.json`,
    ),
  );
}

/** Path to a Foundry artifact in the portal-contracts submodule. */
export function portalArtifact(contractFile: string, contractName?: string): ContractArtifact {
  const file = contractFile.endsWith('.sol') ? contractFile : `${contractFile}.sol`;
  const cn = contractName ?? contractFile.replace(/\.sol$/, '');
  return readArtifact(
    path.resolve(packageRoot(), `../../sqd-portal-contracts/out/${file}/${cn}.json`),
  );
}
