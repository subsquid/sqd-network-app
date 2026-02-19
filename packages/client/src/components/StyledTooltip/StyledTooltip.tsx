import { Tooltip, TooltipProps } from '@mui/material';

export const StyledTooltip = (props: TooltipProps) => (
  <Tooltip {...props} componentsProps={{ tooltip: { className: 'styled' } }} />
);
