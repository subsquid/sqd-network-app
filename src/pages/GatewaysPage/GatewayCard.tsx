import { EditIcon } from '@icons/EditIcon';
import { IconButton, Stack, Typography, styled, useTheme } from '@mui/material';
import { Box } from '@mui/system';
import { Link } from 'react-router-dom';

import { GatewayFragmentFragment } from '@api/subsquid-network-squid';
import { Avatar } from '@components/Avatar';
import { CopyToClipboard } from '@components/CopyToClipboard';

export const PeerIdRow = styled(Box, {
  name: 'PeerIdRow',
})(({ theme }) => ({
  marginTop: theme.spacing(0.5),
  marginBottom: theme.spacing(1.5),
  color: theme.palette.primary.main,
  fontSize: '0.875rem',
}));

export const GatewayDescription = styled(Box, {
  name: 'GatewayDescription',
})(({ theme }) => ({
  fontSize: '1rem',
  color: theme.palette.text.secondary,
  lineHeight: 1.8,
}));

function GatewayTitle({
  gateway,
  canEdit,
}: {
  gateway: GatewayFragmentFragment;
  canEdit: boolean;
}) {
  const theme = useTheme();

  return (
    <Stack spacing={0.5}>
      <Stack direction="row" alignItems="center" spacing={0.5}>
        <Typography variant="h4" sx={{ overflowWrap: 'anywhere' }}>
          {gateway.name || gateway.id}
        </Typography>
        {canEdit ? (
          <IconButton component={Link} to={`/portals/${gateway.id}/edit`} sx={{ padding: 0.5 }}>
            <EditIcon />
          </IconButton>
        ) : null}
      </Stack>
      <CopyToClipboard
        text={gateway.id}
        content={
          <Typography
            variant="body2"
            sx={{ overflowWrap: 'anywhere', color: theme.palette.text.secondary }}
          >
            {gateway.id}
          </Typography>
        }
      />
    </Stack>
  );
}

export const GatewayCard = ({
  gateway,
  canEdit,
}: {
  gateway: GatewayFragmentFragment;
  canEdit: boolean;
}) => {
  return (
    <Stack direction="row" justifyContent="space-between">
      <Stack spacing={2} direction="row" alignItems="center">
        <Avatar
          variant="circular"
          name={gateway.name || gateway.id}
          colorDiscriminator={gateway.id}
          size={56}
        />
        {/* <Stack justifyContent="stretch" flex={1} spacing={0.125}> */}
        <GatewayTitle gateway={gateway} canEdit={canEdit} />

        {/* </Stack> */}
      </Stack>
    </Stack>
  );
};
