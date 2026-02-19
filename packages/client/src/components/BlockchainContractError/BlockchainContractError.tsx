import { styled } from '@mui/material';

const Alert = styled('div')(({ theme }) => ({
  color: theme.palette.error.main,
  margin: theme.spacing(2, 0),
}));

export function BlockchainContractError({ error }: { error?: string | null }) {
  if (!error) return null;

  const message = error.toLowerCase();
  if (message.includes('user rejected the request')) return null;

  return <Alert>{error}</Alert>;
}
