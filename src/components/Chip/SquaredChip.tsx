import { Chip as MaterialChip, ChipProps } from '@mui/material';

export const SquaredChip = (props: ChipProps) => (
  <MaterialChip {...props} className={`squared ${props.className || ''}`} />
);
