import { styled } from '@mui/material';

export const CenteredPageWrapper = styled('div', {
  name: 'CenteredPageWrapper',
})(({ theme: { breakpoints, spacing } }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: spacing(2),
  width: '100%',
  maxWidth: '1336px',
  margin: '0 auto',
}));
