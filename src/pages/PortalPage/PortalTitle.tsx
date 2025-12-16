import { CopyToClipboard } from '@components/CopyToClipboard';
import { Stack, Typography, useTheme } from '@mui/material';
import { MockPortal } from '@api/portal-pools';

export function PortalTitle({ portal }: { portal: MockPortal }) {
  const theme = useTheme();

  return (
    <Stack spacing={0.5}>
      <Stack direction="row" alignItems="center" spacing={0.5}>
        <Typography variant="h4" sx={{ overflowWrap: 'anywhere' }}>
          {portal.name}
        </Typography>
      </Stack>
      <Typography
        variant="body2"
        component="span"
        sx={{ overflowWrap: 'anywhere', color: theme.palette.text.secondary }}
      >
        <CopyToClipboard text={portal.address} content={<span>{portal.address}</span>} />
      </Typography>
    </Stack>
  );
}
