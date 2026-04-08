import { useCallback, useMemo } from 'react';

import {
  Alert,
  Box,
  InputAdornment,
  OutlinedInput,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
} from '@mui/material';

import { HelpTooltip } from '@components/HelpTooltip';

import { formatTopUpAmountLine } from '../utils/topUpRewardsFormat';

const SLIPPAGE_PRESETS = [0.5, 1, 2, 5] as const;

const HIGH_SLIPPAGE_THRESHOLD = 5;
const LOW_SLIPPAGE_THRESHOLD = 0.05;

export interface SlippageSelectorProps {
  isAuto: boolean;
  slippagePct: string;
  isStableToken: boolean;
  minSqdReceived: bigint | null;
  minSqdBlocked: string | null;
  sqdSymbol: string;
  onChange: (isAuto: boolean, pct: string) => void;
}

export function SlippageSelector({
  isAuto,
  slippagePct,
  isStableToken,
  minSqdReceived,
  minSqdBlocked,
  sqdSymbol,
  onChange,
}: SlippageSelectorProps) {
  const presetStrings = useMemo(() => SLIPPAGE_PRESETS.map(String), []);

  const toggleValue = useMemo(() => {
    if (isAuto) return 'auto';
    if (presetStrings.includes(slippagePct)) return slippagePct;
    return 'custom';
  }, [isAuto, slippagePct, presetStrings]);

  const handleToggleChange = useCallback(
    (_: React.MouseEvent, value: string | null) => {
      if (!value) return;
      if (value === 'auto') {
        onChange(true, slippagePct);
      } else {
        onChange(false, value);
      }
    },
    [onChange, slippagePct],
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(false, e.target.value);
    },
    [onChange],
  );

  const pctNum = parseFloat(slippagePct);
  const showHighWarning = !isAuto && !isNaN(pctNum) && pctNum > HIGH_SLIPPAGE_THRESHOLD;
  const showLowWarning = !isAuto && !isNaN(pctNum) && pctNum > 0 && pctNum < LOW_SLIPPAGE_THRESHOLD;

  const minReceivedText = useMemo(() => {
    if (isAuto || minSqdReceived == null) return null;
    return `Min. received: ~${formatTopUpAmountLine(minSqdReceived, 18, sqdSymbol)}`;
  }, [isAuto, minSqdReceived, sqdSymbol]);

  return (
    <Stack spacing={1}>
      <HelpTooltip title="Maximum price movement you accept. If the buyback returns less SQD than the computed minimum, the transaction reverts.">
        <Typography component="span" variant="subtitle2" sx={{ fontWeight: 600 }}>
          Max. slippage
        </Typography>
      </HelpTooltip>

      {!isStableToken && (
        <Typography variant="caption" color="text.secondary">
          Percentage-based slippage protection is only available for USD-pegged reward tokens. Using
          Auto mode.
        </Typography>
      )}

      <Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap" useFlexGap>
        <ToggleButtonGroup
          value={toggleValue}
          exclusive
          onChange={handleToggleChange}
          size="small"
          disabled={!isStableToken}
        >
          <ToggleButton value="auto">Auto</ToggleButton>
          {SLIPPAGE_PRESETS.map(p => (
            <ToggleButton key={p} value={String(p)}>
              {p}%
            </ToggleButton>
          ))}
        </ToggleButtonGroup>

        {isStableToken && !isAuto && (
          <Tooltip title="Maximum price movement you accept. If the buyback returns less SQD than the computed minimum, the transaction reverts.">
            <OutlinedInput
              value={slippagePct}
              onChange={handleInputChange}
              size="small"
              inputProps={{ inputMode: 'decimal' }}
              sx={{ width: 'auto', '& input': { width: '4ch', py: 0.75, px: 0.75 } }}
              endAdornment={
                <InputAdornment position="end" sx={{ ml: 0 }}>
                  <Typography variant="body2">%</Typography>
                </InputAdornment>
              }
            />
          </Tooltip>
        )}
      </Stack>

      {showHighWarning && (
        <Alert severity="warning" variant="standard" sx={{ py: 0 }}>
          High slippage — your transaction may be frontrun.
        </Alert>
      )}
      {showLowWarning && (
        <Alert severity="warning" variant="standard" sx={{ py: 0 }}>
          Very low slippage — your transaction is likely to fail.
        </Alert>
      )}

      {!isAuto && minSqdBlocked && isStableToken && (
        <Typography variant="caption" color="text.secondary">
          {minSqdBlocked}
        </Typography>
      )}

      {minReceivedText && !minSqdBlocked && (
        <HelpTooltip title="Minimum SQD the contract will accept from the buyback. Computed from spot price minus your slippage tolerance.">
          <Typography
            component="span"
            variant="caption"
            color="text.secondary"
            sx={{ width: 'fit-content' }}
          >
            {minReceivedText}
          </Typography>
        </HelpTooltip>
      )}

      {isAuto && <Box sx={{ minHeight: 16 }} />}
    </Stack>
  );
}
