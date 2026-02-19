import { Box, SxProps, Theme, Typography } from '@mui/material';
import { upperFirst } from 'lodash-es';

import { BackButton } from '@components/BackButton';

export interface NotFoundProps {
  /** The ID of the item that was not found */
  id?: string;
  /** The type of item that was not found (e.g. "worker", "gateway", "vesting") */
  item?: string;
  /** Custom message to display instead of the default "not found" message */
  message?: string;
  /** Custom styles for the container */
  sx?: SxProps<Theme>;
  /** Custom styles for the message text */
  messageSx?: SxProps<Theme>;
  /** Custom styles for the ID text */
  idSx?: SxProps<Theme>;
  /** Whether to show a back button */
  showBackButton?: boolean;
  /** Custom back button path */
  backPath?: string;
}

export function NotFound({
  id,
  item,
  message,
  sx,
  messageSx,
  idSx,
  showBackButton = false,
  backPath,
}: NotFoundProps) {
  const defaultMessage =
    item || id ? (
      <>
        {item ? upperFirst(item) : null}{' '}
        {id ? (
          <Typography component="b" sx={idSx}>
            {id}
          </Typography>
        ) : null}{' '}
        not found
      </>
    ) : (
      'Not found'
    );

  return (
    <Box
      sx={{
        height: 'calc(100vh - 300px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...sx,
      }}
    >
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="body1" sx={messageSx}>
          {message || defaultMessage}
        </Typography>
        {showBackButton && backPath && (
          <Box sx={{ mt: 2 }}>
            <BackButton path={backPath} />
          </Box>
        )}
      </Box>
    </Box>
  );
}
