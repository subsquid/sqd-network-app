import { dateFormat } from '@i18n';
import { urlFormatter } from '@lib/formatters/formatters';
import { Divider, Stack, styled } from '@mui/material';
import { Box } from '@mui/system';
import { useParams, useSearchParams } from 'react-router-dom';

import { useGatewayByPeerId } from '@api/subsquid-network-squid/gateways-graphql';
import { BackButton } from '@components/BackButton';
import { Card } from '@components/Card';
import { CopyToClipboard } from '@components/CopyToClipboard';
import { Loader } from '@components/Loader';
import { NotFound } from '@components/NotFound';
import { CenteredPageWrapper } from '@layouts/NetworkLayout';

import { GatewayCard } from './GatewayCard';
import { GatewayUnregisterButton } from './GatewayUnregister';
import { SquaredChip } from '@components/Chip';

export const DescLabel = styled(Box, {
  name: 'DescLabel',
})(({ theme }) => ({
  flex: 0.5,
  color: theme.palette.text.secondary,
  whiteSpace: 'balance',
  maxWidth: theme.spacing(25),
  fontSize: '1rem',
}));

export const DescValue = styled(Box, {
  name: 'DescValue',
})(({ theme }) => ({
  flex: 1,
  marginLeft: theme.spacing(2),
  overflowWrap: 'anywhere',
}));

export const Gateway = ({ backPath }: { backPath: string }) => {
  const { peerId } = useParams<{ peerId: string }>();
  const { data: gateway, isLoading } = useGatewayByPeerId(peerId);

  const [searchParams] = useSearchParams();

  if (isLoading) return <Loader />;
  else if (!gateway) {
    return <NotFound item="gateway" id={peerId} />;
  }

  return (
    <CenteredPageWrapper className="wide">
      <Box sx={{ mb: 3 }}>
        <BackButton path={searchParams.get('backPath') || backPath} />
      </Box>
      <Card>
        <Stack spacing={3} divider={<Divider orientation="horizontal" flexItem />}>
          <GatewayCard gateway={gateway} canEdit={false} />
          <Stack mt={4} spacing={3} divider={<Divider orientation="horizontal" flexItem />}>
            <Box>
              <SquaredChip label="Info" />
              <Stack spacing={2} direction="column">
                <Stack direction="row">
                  <DescLabel>Registered</DescLabel>
                  <DescValue>{dateFormat(gateway.createdAt, 'dateTime')}</DescValue>
                </Stack>
                <Stack direction="row">
                  <DescLabel>Endpoint URL</DescLabel>
                  <DescValue>
                    {gateway.endpointUrl ? (
                      <CopyToClipboard text={urlFormatter(gateway.endpointUrl)} />
                    ) : (
                      '-'
                    )}
                  </DescValue>
                </Stack>
                <Stack direction="row">
                  <DescLabel>Website</DescLabel>
                  <DescValue>
                    {gateway.website ? (
                      <a href={urlFormatter(gateway.website)} target="_blank" rel="noreferrer">
                        {urlFormatter(gateway.website)}
                      </a>
                    ) : (
                      '-'
                    )}
                  </DescValue>
                </Stack>
                <Stack direction="row">
                  <DescLabel>Contact</DescLabel>
                  <DescValue>
                    {gateway.email ? <CopyToClipboard text={gateway.email} /> : '-'}
                  </DescValue>
                </Stack>
                <Stack direction="row">
                  <DescLabel>Description</DescLabel>
                  <DescValue>{gateway.description || '-'}</DescValue>
                </Stack>
              </Stack>
            </Box>
          </Stack>
        </Stack>
      </Card>
      <Box mt={3} display="flex" justifyContent="flex-end">
        <GatewayUnregisterButton gateway={gateway} />
      </Box>
    </CenteredPageWrapper>
  );
};
