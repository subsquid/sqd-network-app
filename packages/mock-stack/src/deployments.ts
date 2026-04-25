/**
 * Read/write the `.deployments.json` file produced by the deploy harness.
 *
 * The file is consumed by:
 *   - `startMockStack()` — to know which addresses the mini-indexer should
 *     subscribe to.
 *   - `getContractAddresses({ override })` from `@subsquid/common` — when
 *     the app is running in mock mode (Phase 6 wires this into `env.ts`).
 */
import fs from 'node:fs';
import path from 'node:path';

import type { Address } from 'viem';

import { packageRoot } from './artifacts';

export type AddressMap = Record<string, Address>;

/** Resolves to `<package-root>/.deployments.json`. */
export function deploymentsPath(): string {
  return path.resolve(packageRoot(), '.deployments.json');
}

/** Read the deployments file. Returns `null` if it doesn't exist. */
export function readDeployments(): AddressMap | null {
  const p = deploymentsPath();
  if (!fs.existsSync(p)) return null;
  return JSON.parse(fs.readFileSync(p, 'utf-8')) as AddressMap;
}

/** Write the deployments file (pretty-printed for human review). */
export function writeDeployments(map: AddressMap): void {
  fs.writeFileSync(deploymentsPath(), `${JSON.stringify(map, null, 2)}\n`);
}
