import React, { PropsWithChildren } from 'react';

import { Box, CircularProgress, useTheme } from '@mui/material';

export const Loader = ({ loading = true, children }: PropsWithChildren<{ loading?: boolean }>) => {
  const theme = useTheme();

  if (loading) {
    return (
      <Box
        sx={{
          height: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flex: 1,
        }}
      >
        <CircularProgress color="secondary" size={40} thickness={4} />
      </Box>
    );
  }

  return <>{children}</>;
};
