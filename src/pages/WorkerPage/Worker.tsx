import { dateFormat } from '@i18n';
import {
  bytesFormatter,
  numberWithCommasFormatter,
  percentFormatter,
  tokenFormatter,
  urlFormatter,
} from '@lib/formatters/formatters.ts';
import { fromSqd, isOwned } from '@lib/network';
import { Box, Divider, Grid, Stack, styled, Typography, useTheme } from '@mui/material';
import { useParams, useSearchParams } from 'react-router-dom';

import {
  Worker as ApiWorker,
  WorkerStatus as ApiWorkerStatus,
  useMySources,
  useMyWorkerDelegations,
  useWorkerByPeerId,
  WorkerStatus,
  type Account,
} from '@api/subsquid-network-squid';
import { Card } from '@components/Card';
import { Loader } from '@components/Loader';
import { NotFound } from '@components/NotFound';
import {
  DelegationCapacity,
  WorkerDelegate,
  WorkerStatusChip,
  WorkerUndelegate,
  WorkerUnregisterButton,
  WorkerVersion,
  WorkerWithdrawButton,
} from '@components/Worker';
import { CenteredPageWrapper, PageTitle } from '@layouts/NetworkLayout';
import { useAccount } from '@network/useAccount';
import { useContracts } from '@network/useContracts';

import { Avatar } from '@components/Avatar';
import { CopyToClipboard } from '@components/CopyToClipboard';
import { Property, PropertyList } from '@components/Property';
import { useMemo } from 'react';
import { WorkerEdit } from './WorkerEdit';

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
    <CenteredPageWrapper>
      <PageTitle title={'Worker'} />
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
            <Stack spacing={2}>
              <Divider />
              <PropertyList>
                <Property label="Status" value={<WorkerStatusChip worker={worker} />} />
                <Property label="Created" value={dateFormat(worker.createdAt, 'dateTime')} />
                <Property label="Version" value={<WorkerVersion worker={worker} />} />
                <Property
                  label="Website"
                  value={
                    worker.website ? (
                      <a href={urlFormatter(worker.website)} target="_blank" rel="noreferrer">
                        {urlFormatter(worker.website)}
                      </a>
                    ) : (
                      '-'
                    )
                  }
                />
                <Property label="Description" value={worker.description || '-'} />
              </PropertyList>
              {isOwned(worker, address) && worker.status !== ApiWorkerStatus.Withdrawn ? (
                <>
                  <Divider orientation="horizontal" flexItem />
                  <Box display="flex" justifyContent="flex-end">
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
                </>
              ) : null}
            </Stack>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card title="Bond">
            <PropertyList>
              <Property label="Bonded" value={tokenFormatter(fromSqd(worker.bond), SQD_TOKEN)} />
              <Property
                label="Worker APR"
                value={worker.apr != null ? percentFormatter(worker.apr) : '-'}
              />
              <Property
                label="Total reward"
                value={tokenFormatter(
                  fromSqd(worker.claimableReward).plus(fromSqd(worker.claimedReward)),
                  SQD_TOKEN,
                )}
              />
            </PropertyList>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Card title="Delegation">
            <PropertyList>
              <Property
                label="Delegation capacity"
                value={<DelegationCapacity worker={worker} />}
              />
              <Property
                label="Delegator APR"
                value={worker.stakerApr != null ? percentFormatter(worker.stakerApr) : '-'}
              />
              <Property
                label="Total reward"
                value={tokenFormatter(fromSqd(worker.totalDelegationRewards), SQD_TOKEN)}
              />
            </PropertyList>
          </Card>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Card title="Health">
            <PropertyList>
              <Property
                label="Uptime, 24h / 90d"
                value={`${percentFormatter(worker.uptime24Hours)} / ${percentFormatter(worker.uptime90Days)}`}
              />
              <Property
                label="Queries, 24h / 90d"
                value={`${numberWithCommasFormatter(worker.queries24Hours)} / ${numberWithCommasFormatter(worker.queries90Days)}`}
              />
              <Property
                label="Data served, 24h / 90d"
                value={`${bytesFormatter(worker.servedData24Hours)} / ${bytesFormatter(worker.servedData90Days)}`}
              />
              <Property label="Data stored" value={bytesFormatter(worker.storedData)} />
            </PropertyList>
          </Card>
        </Grid>
      </Grid>
    </CenteredPageWrapper>
  );
};
