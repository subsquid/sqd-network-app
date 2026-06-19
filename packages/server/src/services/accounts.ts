import {
  AccountType,
  AccountsByOwnerDocument,
  type AccountsByOwnerQuery,
  AdminHoldingsDocument,
  type AdminHoldingsQuery,
} from '../generated/token-squid/graphql.js';
import { queryTokenSquid } from './graphql.js';

export type AccountInfo = AccountsByOwnerQuery['accounts'][number];

/**
 * TEMPORARY: workaround for a token-squid indexer bug.
 *
 * When a TemporaryHolding contract unlocks, the indexer is supposed to flip the
 * holding `Account.owner` from the beneficiary to the admin
 * (see squid-subsquid-network processTemporaryHoldingUnlockQueue), so the admin
 * wallet can see/manage the holding's workers after unlock. That flip is broken
 * and runs unreliably, leaving the holding owned by the beneficiary in the squid.
 *
 * As a result `accountsByOwner` (which matches on `owner.id`) never returns these
 * holdings for the admin wallet, so the admin sees no workers and can't claim.
 *
 * Until the indexer is fixed and re-synced, we additionally pull the unlocked,
 * admin-controlled holdings straight from the `temporaryHoldings` entity (whose
 * `admin`/`locked` fields are correct) and inject them as accounts owned by the
 * connected (admin) wallet. Overriding `ownerId` to `address` makes `isOwned()`
 * pass on the client and routes management calls through `holding.execute(...)`,
 * which the admin is authorized to call post-unlock (`_canExecute(admin)`).
 *
 * The `locked: false` filter guarantees we only ever surface holdings where the
 * admin is actually authorized, so no `execute(...)` call can revert.
 *
 * Remove this once the owner-flip-on-unlock indexer bug is fixed.
 */
async function resolveAdminHoldings(address: string): Promise<AccountInfo[]> {
  const data = await queryTokenSquid<AdminHoldingsQuery>(AdminHoldingsDocument, { address });
  return data.temporaryHoldings.map(holding => ({
    id: holding.id,
    type: AccountType.TemporaryHolding,
    balance: '0',
    ownerId: address,
  }));
}

function mergeAdminHoldings(accounts: AccountInfo[], adminHoldings: AccountInfo[]): AccountInfo[] {
  const seen = new Set(accounts.map(a => a.id.toLowerCase()));
  const extra = adminHoldings.filter(h => !seen.has(h.id.toLowerCase()));
  return extra.length ? [...accounts, ...extra] : accounts;
}

export async function resolveAccountIds(address: string): Promise<string[]> {
  const accounts = await resolveAccounts(address);
  return accounts.map(a => a.id);
}

export async function resolveAccounts(address: string): Promise<AccountInfo[]> {
  const [data, adminHoldings] = await Promise.all([
    queryTokenSquid<AccountsByOwnerQuery>(AccountsByOwnerDocument, { address }),
    resolveAdminHoldings(address),
  ]);
  return mergeAdminHoldings(data.accounts, adminHoldings);
}

export type AccountTypeValue = 'USER' | 'VESTING' | 'TEMPORARY_HOLDING';

export type OwnerRef = {
  id: string;
  type: AccountTypeValue;
  owner?: { id: string } | null;
};

export function buildOwnerMap(accounts: AccountInfo[]): Map<string, OwnerRef> {
  const map = new Map<string, OwnerRef>();
  for (const account of accounts) {
    map.set(account.id.toLowerCase(), {
      id: account.id,
      type: account.type,
      owner: account.ownerId ? { id: account.ownerId } : null,
    });
  }
  return map;
}

export function reconstructOwner(ownerId: string, ownerMap: Map<string, OwnerRef>): OwnerRef {
  return ownerMap.get(ownerId.toLowerCase()) ?? { id: ownerId, type: 'USER' as const, owner: null };
}
