import {
  AccountsByOwnerDocument,
  type AccountsByOwnerQuery,
} from '../generated/token-squid/graphql.js';
import { queryTokenSquid } from './graphql.js';

export type AccountInfo = AccountsByOwnerQuery['accounts'][number];

export async function resolveAccountIds(address: string): Promise<string[]> {
  const data = await queryTokenSquid<AccountsByOwnerQuery>(AccountsByOwnerDocument, { address });
  return data.accounts.map(a => a.id);
}

export async function resolveAccounts(address: string): Promise<AccountInfo[]> {
  const data = await queryTokenSquid<AccountsByOwnerQuery>(AccountsByOwnerDocument, { address });
  return data.accounts;
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
