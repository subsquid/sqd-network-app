import { Chip as MaterialChip, chipClasses, styled } from '@mui/material';

import { GatewayFragmentFragment } from '@api/subsquid-network-squid';

export const Chip = styled(MaterialChip)(({ theme: { spacing } }) => ({
  fontSize: '0.75rem',
  fontWeight: 500,
  lineHeight: 1,
  height: 24,

  [`& .${chipClasses.label}`]: {
    padding: spacing(0.5, 1),
  },

  [`&.${chipClasses.colorError}`]: {
    background: '#FFE6C0',
    color: '#FF6B35',
  },

  [`&.${chipClasses.colorSuccess}`]: {
    background: '#E3F7E0',
    color: '#55AD44',
  },
}));

export function GatewayStatus({ gateway }: { gateway: GatewayFragmentFragment }) {
  return (
    <Chip color="success" label="Active" />
    // <>
    //   {gateway?.stake?.locked ? (
    //   ) : (
    //     <Chip color="default" label="Idle" />
    //   )}
    // </>
  );
}
