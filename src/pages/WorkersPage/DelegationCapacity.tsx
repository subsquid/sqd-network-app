import { percentFormatter } from '@lib/formatters/formatters';
import { Box, styled } from '@mui/material';
import classNames from 'classnames';

import { StyledBar } from './StatusBar';

export const BarWrapper = styled(Box)(({ theme }) => ({
  display: 'inline-flex',
  verticalAlign: '-25%', // Adjust vertical position to align better with text center
  gap: theme.spacing(0.5),
  marginRight: theme.spacing(1),
}));

const BARS_COUNT = 5;
const RANGES = Array.from({ length: BARS_COUNT }, (_, i) => (i * 100) / BARS_COUNT);

export function DelegationCapacity({ worker }: { worker: { delegationCapacity: number } }) {
  const delegationCapacity = worker.delegationCapacity || 0;
  const color =
    delegationCapacity >= 80 ? 'error' : delegationCapacity >= 40 ? 'warning' : 'success';

  return (
    <>
      <BarWrapper>
        {RANGES.map((v, i) => (
          <StyledBar
            key={i}
            className={classNames(v < delegationCapacity || i === 0 ? color : undefined)}
          />
        ))}
      </BarWrapper>
      {percentFormatter(delegationCapacity)}
    </>
  );
}
