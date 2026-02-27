import { fromSqd } from './utils';

export * from './utils';

export function calculateDelegationCapacity({
  totalDelegation,
}: {
  capedDelegation: string;
  totalDelegation: string;
}) {
  return fromSqd(totalDelegation).div(20_000).times(100).toNumber();
}
