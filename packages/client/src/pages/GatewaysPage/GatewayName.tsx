import { Stack, Typography, styled } from '@mui/material';
import { Box } from '@mui/system';
import { Link } from 'react-router-dom';

import { Gateway } from '@api/subsquid-network-squid';
import { Avatar } from '@components/Avatar';
import { PeerIdShort, shortPeerId } from '@components/PeerId';

const Name = styled(Box, {
  name: 'Name',
})(({ theme }) => ({
  marginBottom: theme.spacing(0.5),
  fontWeight: 500,
}));

export const GatewayName = ({
  gateway,
  to,
}: {
  gateway: Pick<Gateway, 'name' | 'id'>;
  to?: string;
}) => {
  return (
    <Stack spacing={1.5} direction="row" alignItems="center">
      <Avatar
        // online={!!gateway.online}
        name={gateway.name || gateway.id}
        colorDiscriminator={gateway.id}
      />
      <Box overflow="clip">
        {gateway.name ? (
          <Name>{gateway.name.length > 30 ? gateway.name.slice(0, 27) + '...' : gateway.name}</Name>
        ) : null}
        <Typography variant="caption">
          <PeerIdShort>
            <Link to={to || '#'}>{shortPeerId(gateway.id)}</Link>
          </PeerIdShort>
        </Typography>
        {/* <WorkerDelegationCapacity gateway={gateway} /> */}
      </Box>
    </Stack>
  );
};
