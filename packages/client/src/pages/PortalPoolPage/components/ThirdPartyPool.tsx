import { Alert, Chip, Tooltip } from '@mui/material';
import { type NetworkName, isSqdOperatedPool } from '@subsquid/common';

import { getSubsquidNetwork } from '@hooks/network/useSubsquidNetwork';

export const THIRD_PARTY_POOL_DISCLAIMER =
  'This pool is operated by a third party, not by SQD. SQD does not guarantee its rewards. ' +
  'The operator sets and funds the rewards and can change the rate at any time.';

export function isThirdPartyPool(poolId: string): boolean {
  return !isSqdOperatedPool(getSubsquidNetwork() as NetworkName, poolId);
}

export function ThirdPartyPoolChip({ poolId }: { poolId: string }) {
  if (!isThirdPartyPool(poolId)) return null;
  return (
    <Tooltip title={THIRD_PARTY_POOL_DISCLAIMER}>
      <Chip label="Third-party" size="small" variant="outlined" color="warning" />
    </Tooltip>
  );
}

export function ThirdPartyPoolAlert({ poolId }: { poolId: string }) {
  if (!isThirdPartyPool(poolId)) return null;
  return <Alert severity="warning">{THIRD_PARTY_POOL_DISCLAIMER}</Alert>;
}
