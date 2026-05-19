import { useEffect } from 'react';

import { dateFormat } from '@i18n';
import { CenteredPageWrapper } from '@layouts/NetworkLayout';
import { Box, Grid } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useParams, useSearchParams } from 'react-router-dom';

import { trpc } from '@api/trpc';
import { BackButton } from '@components/BackButton';
import { Card } from '@components/Card';
import { CopyToClipboard } from '@components/CopyToClipboard';
import { Loader } from '@components/Loader';
import { NotFound } from '@components/NotFound';
import { Property, PropertyList } from '@components/Property';
import { SectionHeader } from '@components/SectionHeader';
import { SourceProvider, useSourceContext } from '@contexts/SourceContext';
import { urlFormatter } from '@lib/formatters/formatters';

import { GatewayCard } from './GatewayCard';
import { GatewayStatus } from './GatewayStatus';
import { GatewayUnregisterButton } from './GatewayUnregister';

function GatewayContent({ backPath }: { backPath: string }) {
  const { peerId } = useParams<{ peerId: string }>();
  const { sources, selectedSource, setSelectedSourceId } = useSourceContext();
  const { data: gateway, isLoading } = useQuery(
    trpc.gateway.get.queryOptions({ peerId: peerId || '' }, { enabled: !!peerId }),
  );

  const [searchParams] = useSearchParams();
  const managingSource = sources.find(
    source => gateway && source.id.toLowerCase() === gateway.ownerId.toLowerCase(),
  );
  const canManage = !!managingSource;

  useEffect(() => {
    if (!managingSource || selectedSource?.id === managingSource.id) return;

    setSelectedSourceId(managingSource.id);
  }, [managingSource, selectedSource?.id, setSelectedSourceId]);

  if (isLoading) return <Loader />;
  else if (!gateway) {
    return <NotFound item="gateway" id={peerId} />;
  }

  return (
    <CenteredPageWrapper>
      <Box sx={{ mb: 3 }}>
        <BackButton path={searchParams.get('backPath') || backPath} />
      </Box>
      <Card sx={{ mb: 2 }}>
        <SectionHeader
          title={<GatewayCard gateway={gateway} canEdit={false} />}
          action={canManage ? <GatewayUnregisterButton gateway={gateway} /> : undefined}
        />
      </Card>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card title="Info" sx={{ width: 1, height: 1 }}>
            <PropertyList>
              <Property label="Status" value={<GatewayStatus gateway={gateway} />} />
              <Property label="Registered" value={dateFormat(gateway.createdAt, 'dateTime')} />
              <Property
                label="Endpoint URL"
                value={
                  gateway.endpointUrl ? (
                    <CopyToClipboard text={urlFormatter(gateway.endpointUrl)} />
                  ) : (
                    '-'
                  )
                }
              />
            </PropertyList>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card title="Contact" sx={{ width: 1, height: 1 }}>
            <PropertyList>
              <Property
                label="Website"
                value={
                  gateway.website ? (
                    <a href={urlFormatter(gateway.website)} target="_blank" rel="noreferrer">
                      {urlFormatter(gateway.website)}
                    </a>
                  ) : (
                    '-'
                  )
                }
              />
              <Property
                label="Email"
                value={gateway.email ? <CopyToClipboard text={gateway.email} /> : '-'}
              />
              <Property label="Description" value={gateway.description || '-'} />
            </PropertyList>
          </Card>
        </Grid>
      </Grid>
    </CenteredPageWrapper>
  );
}

export const Gateway = ({ backPath }: { backPath: string }) => (
  <SourceProvider>
    <GatewayContent backPath={backPath} />
  </SourceProvider>
);
