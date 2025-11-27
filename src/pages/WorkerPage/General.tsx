import { dateFormat } from '@i18n';

import { fromSqd, isOwned } from '@lib/network';
import { Grid } from '@mui/material';

import {
  WorkerStatus as ApiWorkerStatus,
  useMySources,
  useMyWorkerDelegations,
  useWorkerByPeerId,
} from '@api/subsquid-network-squid';
import { Card } from '@components/Card';
import { Loader } from '@components/Loader';
import { NotFound } from '@components/NotFound';
import { DelegationCapacity } from '@components/Worker';
import { useAccount } from '@network/useAccount';
import { useContracts } from '@network/useContracts';

import { Property, PropertyList } from '@components/Property';
import { useMemo } from 'react';
import {
  bytesFormatter,
  numberWithCommasFormatter,
  percentFormatter,
  tokenFormatter,
  urlFormatter,
} from '@lib/formatters/formatters';
import { useParams } from 'react-router-dom';

export function WorkerGeneral() {
  const { peerId } = useParams<{ peerId: string }>();

  const { data: worker, isLoading: isPending } = useWorkerByPeerId(peerId);
  const { address } = useAccount();
  const { SQD_TOKEN } = useContracts();

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

  if (!worker || !peerId) {
    return <NotFound item="worker" id={peerId} />;
  }

  return (
    <>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card title={'Info'} sx={{ width: 1, height: 1 }}>
            <PropertyList>
              <Property label="Created" value={dateFormat(worker.createdAt, 'dateTime')} />
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
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card title="Health" sx={{ width: 1, height: 1 }}>
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
        <Grid size={{ xs: 12, md: 6 }}>
          <Card title="Bond" sx={{ width: 1, height: 1 }}>
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
          <Card title="Delegation" sx={{ width: 1, height: 1 }}>
            <PropertyList>
              <Property
                label="Total delegation"
                value={tokenFormatter(fromSqd(worker.totalDelegation), SQD_TOKEN)}
              />
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
      </Grid>
    </>
  );
}
