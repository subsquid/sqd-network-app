import { Box, Chip, Divider, Stack, Typography, useTheme } from '@mui/material';
import { Outlet, useParams } from 'react-router-dom';
import { useMemo } from 'react';

import { useMockPortals } from '@api/portal-pools';
import { useMySources } from '@api/subsquid-network-squid';
import { Loader } from '@components/Loader';
import { NotFound } from '@components/NotFound';
import { CenteredPageWrapper, PageTitle } from '@layouts/NetworkLayout';
import { Card } from '@components/Card';
import { Avatar } from '@components/Avatar';
import { PortalDelegate } from '@pages/DashboardPage/PortalDelegate';
import { Property, PropertyList } from '@components/Property';
import { CopyToClipboard } from '@components/CopyToClipboard';
import { dateFormat } from '@i18n';

function PortalTitle({ portal }: { portal: { name: string; address: string } }) {
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

function PortalStateChip({ state }: { state: number }) {
  const getColor = () => {
    switch (state) {
      case 0:
        return 'success';
      case 1:
        return 'warning';
      case 2:
        return 'default';
      default:
        return 'default';
    }
  };

  const getLabel = () => {
    switch (state) {
      case 0:
        return 'Active';
      case 1:
        return 'Paused';
      case 2:
        return 'Inactive';
      default:
        return 'Unknown';
    }
  };

  return <Chip label={getLabel()} color={getColor()} size="small" />;
}

export const Portal = ({ backPath }: { backPath: string }) => {
  const { address } = useParams<{ address: string }>();

  const { mockPortals, mockProviders, mockUserAddress, stakeMock, requestExitMock } =
    useMockPortals();
  const { data: sources, isLoading: isSourcesLoading } = useMySources();

  const portal = mockPortals.find(p => p.address === address);
  const userProvider = mockProviders.find(p => p.address === address);

  const isLoading = isSourcesLoading;

  if (isLoading) {
    return <Loader />;
  }

  if (!portal || !address) {
    return <NotFound item="portal" id={address} />;
  }

  return (
    <CenteredPageWrapper>
      <PageTitle title={'Portal'} />
      <Card
        title={
          <Stack spacing={2} direction="row" alignItems="center">
            <Avatar
              variant="circular"
              name={portal.name}
              colorDiscriminator={portal.address}
              size={56}
            />
            <PortalTitle portal={portal} />
          </Stack>
        }
        action={
          <Stack direction="row" spacing={1}>
            <PortalDelegate
              portal={portal}
              sources={sources}
              onDeposit={stakeMock}
              onWithdraw={requestExitMock}
              variant="outlined"
            />
          </Stack>
        }
      >
        <Stack spacing={2}>
          <Divider orientation="horizontal" flexItem />
          <PropertyList>
            <Property label="Status" value={<PortalStateChip state={portal.state} />} />
            <Property label="Created" value={dateFormat(portal.createdAt, 'dateTime')} />
            <Property label="Description" value={portal.description || '-'} />
          </PropertyList>
        </Stack>
      </Card>
      <Box>
        <Outlet />
      </Box>
    </CenteredPageWrapper>
  );
};
