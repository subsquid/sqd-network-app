import React from 'react';

import { ErrorOutlineOutlined } from '@mui/icons-material';
import { Box, Stack, SxProps, Typography } from '@mui/material';

interface NoItemsProps extends React.PropsWithChildren {
  sx?: SxProps;
  icon?: React.ReactNode;
  message?: string;
  colSpan?: number;
  height?: string | number;
  minHeight?: string | number;
}

export const NoItems = ({
  sx,
  children,
  icon = <ErrorOutlineOutlined />,
  message = 'No items to show',
  colSpan = 100,
  height = '96px',
  minHeight = '96px',
}: NoItemsProps) => (
  <tr>
    <td colSpan={colSpan} style={{ borderBottom: 'none', height }}>
      <Box
        className="no-items"
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100%"
        minHeight={minHeight}
        sx={sx}
        flexDirection="column"
      >
        <Stack spacing={1} direction="row" alignItems="center">
          {icon}
          <Typography variant="body1">{children || <span>{message}</span>}</Typography>
        </Stack>
      </Box>
    </td>
  </tr>
);
