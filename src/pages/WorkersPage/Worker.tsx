import { dateFormat } from '@i18n';
import {
  bytesFormatter,
  numberWithCommasFormatter,
  percentFormatter,
  tokenFormatter,
  urlFormatter,
} from '@lib/formatters/formatters.ts';
import { fromSqd } from '@lib/network';
import { Box, Divider, Grid, Stack, styled, Typography, useTheme } from '@mui/material';
import { useParams, useSearchParams } from 'react-router-dom';

import {
  useWorkerByPeerId,
  WorkerStatus as ApiWorkerStatus,
  WorkerStatus,
  useMySources,
  useMyWorkerDelegations,
  Worker as ApiWorker,
  type Account,
} from '@api/subsquid-network-squid';
import { Card } from '@components/Card';
import { Loader } from '@components/Loader';
import { NotFound } from '@components/NotFound';
import { CenteredPageWrapper, PageTitle } from '@layouts/NetworkLayout';
import { useAccount } from '@network/useAccount';
import { useContracts } from '@network/useContracts';
import { WorkerUnregisterButton } from '@pages/WorkersPage/WorkerUnregister';

import { DelegationCapacity } from './DelegationCapacity';
import { WorkerDelegate } from './WorkerDelegate';
import { WorkerUndelegate } from './WorkerUndelegate';
import { WorkerVersion } from './WorkerVersion';
import { WorkerWithdrawButton } from './WorkerWithdraw';
import { Avatar } from '@components/Avatar';
import { CopyToClipboard } from '@components/CopyToClipboard';
import { WorkerEdit } from './WorkerEdit';
import { WorkerStatusChip } from './WorkerStatus';
import { useMemo } from 'react';

// const sx = {
//   background: '#000',
//   color: '#fff',

//   '&:hover': {
//     background: '#333',
//     color: '#fff',
//   },
// };

const InfoRow = styled(Box, {
  name: 'InfoRow',
})(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: `minmax(auto, ${theme.spacing(25)}) 1fr`,
  gap: theme.spacing(2),
  alignItems: 'start',
  [theme.breakpoints.down('sm')]: {
    gridTemplateColumns: '1fr',
    gap: theme.spacing(0.5),
  },
}));

const InfoLabel = styled(Box, {
  name: 'InfoLabel',
})(({ theme }) => ({
  color: theme.palette.text.secondary,
  wordBreak: 'break-word',
}));

const InfoValue = styled(Box, {
  name: 'InfoValue',
})(() => ({
  overflowWrap: 'anywhere',
}));

const CardContentStack = styled(Stack)(({ theme }) => ({
  flex: 1,
  width: '100%',
}));

function WorkerTitle({
  worker,
  owner,
  canEdit,
}: {
  worker: Pick<ApiWorker, 'id' | 'status' | 'peerId' | 'name'>;
  owner: Pick<Account, 'id' | 'type'>;
  canEdit: boolean;
}) {
  const theme = useTheme();

  return (
    <Stack spacing={0.5}>
      <Stack direction="row" alignItems="center" spacing={0.5}>
        <Typography variant="h4" sx={{ overflowWrap: 'anywhere' }}>
          {worker.name || worker.peerId}
        </Typography>
        {canEdit ? <WorkerEdit worker={worker} owner={owner} disabled={!canEdit} /> : null}
      </Stack>
      <Typography
        variant="body2"
        component="span"
        sx={{ overflowWrap: 'anywhere', color: theme.palette.text.secondary }}
      >
        <CopyToClipboard text={worker.peerId} content={<span>{worker.peerId}</span>} />
      </Typography>
    </Stack>
  );
}

export const Worker = ({ backPath }: { backPath: string }) => {
  const { peerId } = useParams<{ peerId: string }>();
  const { data: worker, isLoading: isPending } = useWorkerByPeerId(peerId);
  const { address } = useAccount();
  const { SQD_TOKEN } = useContracts();

  const [searchParams] = useSearchParams();

  const { data: sources, isLoading: isSourcesLoading } = useMySources();
  const { data: delegations, isLoading: isDelegationsLoading } = useMyWorkerDelegations({ peerId });

  const isLoading = isPending || isSourcesLoading || isDelegationsLoading;

  const canEdit = useMemo(() => {
    if (!worker) return false;
    if (worker.status === ApiWorkerStatus.Withdrawn) return false;
    if (!isOwned(worker, address)) return false;
    return [ApiWorkerStatus.Active, ApiWorkerStatus.Registering].includes(worker.status);
  }, [worker, address]);

  if (isLoading) {
    return <Loader />;
  }

  if (!worker) {
    return <NotFound item="worker" id={peerId} />;
  }

  return (
    <CenteredPageWrapper className="wide">
      <PageTitle title={'Worker'} backPath={searchParams.get('backPath') || backPath} />
      <Grid container spacing={2}>
        <Grid size={{ xs: 12 }}>
          <Card
            title={
              <Stack spacing={2} direction="row" alignItems="center">
                <Avatar
                  variant="circular"
                  name={worker.name || worker.peerId}
                  colorDiscriminator={worker.peerId}
                  size={56}
                />
                <WorkerTitle worker={worker} owner={worker.owner} canEdit={canEdit} />
              </Stack>
            }
            action={
              <Stack direction="row" spacing={1}>
                <WorkerDelegate
                  worker={worker}
                  variant="outlined"
                  sources={sources}
                  disabled={isLoading}
                />
                <WorkerUndelegate
                  worker={worker}
                  sources={delegations?.map(d => ({
                    id: d.owner.id,
                    type: d.owner.type,
                    balance: d.deposit,
                    locked: d.locked || false,
                    lockEnd: d.lockEnd,
                  }))}
                  disabled={isLoading}
                />
              </Stack>
            }
          >
            <CardContentStack spacing={2}>
              <Divider />

              <InfoRow>
                <InfoLabel>Status</InfoLabel>
                <InfoValue>
                  <WorkerStatusChip worker={worker} />
                </InfoValue>
              </InfoRow>

              <InfoRow>
                <InfoLabel>Created</InfoLabel>
                <InfoValue>{dateFormat(worker.createdAt, 'dateTime')}</InfoValue>
              </InfoRow>

              <InfoRow>
                <InfoLabel>Version</InfoLabel>
                <InfoValue>
                  <WorkerVersion worker={worker} />
                </InfoValue>
              </InfoRow>

              <InfoRow>
                <InfoLabel>Website</InfoLabel>
                <InfoValue>
                  {worker.website ? (
                    <a href={urlFormatter(worker.website)} target="_blank" rel="noreferrer">
                      {urlFormatter(worker.website)}
                    </a>
                  ) : (
                    '-'
                  )}
                </InfoValue>
              </InfoRow>

              <InfoRow>
                <InfoLabel>Description</InfoLabel>
                <InfoValue>{worker.description || '-'}</InfoValue>
              </InfoRow>
            </CardContentStack>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card title="Bond">
            <CardContentStack spacing={2}>
              <InfoRow>
                <InfoLabel>Bonded</InfoLabel>
                <InfoValue>{tokenFormatter(fromSqd(worker.bond), SQD_TOKEN)}</InfoValue>
              </InfoRow>

              <InfoRow>
                <InfoLabel>Worker APR</InfoLabel>
                <InfoValue>{worker.apr != null ? percentFormatter(worker.apr) : '-'}</InfoValue>
              </InfoRow>

              <InfoRow>
                <InfoLabel>Total reward</InfoLabel>
                <InfoValue>
                  {tokenFormatter(
                    fromSqd(worker.claimableReward).plus(fromSqd(worker.claimedReward)),
                    SQD_TOKEN,
                  )}
                </InfoValue>
              </InfoRow>
            </CardContentStack>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Card title="Delegation">
            <CardContentStack spacing={2}>
              <InfoRow>
                <InfoLabel>Delegation capacity</InfoLabel>
                <InfoValue>
                  <DelegationCapacity worker={worker} />
                </InfoValue>
              </InfoRow>

              <InfoRow>
                <InfoLabel>Delegator APR</InfoLabel>
                <InfoValue>
                  {worker.stakerApr != null ? percentFormatter(worker.stakerApr) : '-'}
                </InfoValue>
              </InfoRow>

              <InfoRow>
                <InfoLabel>Total reward</InfoLabel>
                <InfoValue>
                  {tokenFormatter(fromSqd(worker.totalDelegationRewards), SQD_TOKEN)}
                </InfoValue>
              </InfoRow>
            </CardContentStack>
          </Card>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Card title="Health">
            <CardContentStack spacing={2}>
              <InfoRow>
                <InfoLabel>Uptime, 24h / 90d</InfoLabel>
                <InfoValue>
                  {percentFormatter(worker.uptime24Hours)} / {percentFormatter(worker.uptime90Days)}
                </InfoValue>
              </InfoRow>

              <InfoRow>
                <InfoLabel>Queries, 24h / 90d</InfoLabel>
                <InfoValue>
                  {numberWithCommasFormatter(worker.queries24Hours)} /{' '}
                  {numberWithCommasFormatter(worker.queries90Days)}
                </InfoValue>
              </InfoRow>

              <InfoRow>
                <InfoLabel>Data served, 24h / 90d</InfoLabel>
                <InfoValue>
                  {bytesFormatter(worker.servedData24Hours)} /{' '}
                  {bytesFormatter(worker.servedData90Days)}
                </InfoValue>
              </InfoRow>

              <InfoRow>
                <InfoLabel>Data stored</InfoLabel>
                <InfoValue>{bytesFormatter(worker.storedData)}</InfoValue>
              </InfoRow>
            </CardContentStack>
          </Card>
        </Grid>
      </Grid>

      {isOwned(worker, address) && worker.status !== ApiWorkerStatus.Withdrawn ? (
        <Box mt={3} display="flex" justifyContent="flex-end">
          {worker.status === WorkerStatus.Deregistered ||
          worker.status === WorkerStatus.Deregistering ? (
            <WorkerWithdrawButton
              worker={worker}
              source={{
                ...worker.owner,
                locked: !!worker.locked,
                lockEnd: worker.lockEnd,
              }}
              disabled={worker.status !== WorkerStatus.Deregistered}
            />
          ) : (
            <WorkerUnregisterButton
              worker={worker}
              source={worker.owner}
              disabled={worker.status !== WorkerStatus.Active}
            />
          )}
        </Box>
      ) : null}
    </CenteredPageWrapper>
  );
};

export function isOwned(
  something: { owner: { id: string; owner?: { id: string } } },
  address: string | undefined,
) {
  return (
    address != null && (something.owner.id === address || something.owner.owner?.id === address)
  );
}
