import { ChipProps, Chip as MaterialChip } from '@mui/material';

export const SquaredChip = (props: ChipProps) => (
  <MaterialChip {...props} className={`squared ${props.className || ''}`} />
);
