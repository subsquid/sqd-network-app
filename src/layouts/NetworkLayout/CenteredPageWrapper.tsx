import { styled } from '@mui/material';

export const CenteredPageWrapper = styled('div', {
  name: 'CenteredPageWrapper',
})(({ theme: { breakpoints, spacing } }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: spacing(2),
}));
