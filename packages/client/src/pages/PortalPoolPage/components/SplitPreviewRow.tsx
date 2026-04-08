import { Stack, Typography } from '@mui/material';

import { formatFeeBpsAsPercent } from '../utils/topUpRewardsFormat';

export interface SplitPreviewRowProps {
  label: string;
  feeBps?: number;
  value: string;
  bold?: boolean;
}

export function SplitPreviewRow({ label, feeBps, value, bold }: SplitPreviewRowProps) {
  return (
    <Stack direction="row" justifyContent="space-between" gap={1}>
      <Typography variant="body2" component="span" fontWeight={bold ? 600 : undefined}>
        {label}
        {feeBps != null && (
          <Typography component="span" variant="body2" color="text.secondary">
            {' '}
            ({formatFeeBpsAsPercent(feeBps)})
          </Typography>
        )}
      </Typography>
      <Typography variant="body2" sx={{ textAlign: 'right' }} fontWeight={bold ? 600 : undefined}>
        {value}
      </Typography>
    </Stack>
  );
}
