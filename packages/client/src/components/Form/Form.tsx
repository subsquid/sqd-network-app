import { FormEvent, PropsWithChildren } from 'react';

import { Box, SxProps } from '@mui/material';

interface FormProps {
  maxWidth?: number;
  onSubmit?: (event: FormEvent<HTMLFormElement>) => void;
  sx?: SxProps;
}

export function Form({ children, maxWidth, onSubmit, sx }: PropsWithChildren<FormProps>) {
  return (
    <Box component="form" onSubmit={onSubmit} sx={{ maxWidth, ...sx }}>
      {children}
    </Box>
  );
}
