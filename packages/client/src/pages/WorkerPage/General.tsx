import { dateFormat } from '@i18n';
import { Grid } from '@mui/material';
import { useParams } from 'react-router-dom';

import { useWorkerByPeerId } from '@api/subsquid-network-squid';
import { Card } from '@components/Card';
import { HelpTooltip } from '@components/HelpTooltip';
import { Loader } from '@components/Loader';
import { NotFound } from '@components/NotFound';
import { Property, PropertyList } from '@components/Property';
import { DelegationCapacity } from '@components/Worker';
import { useContracts } from '@hooks/network/useContracts';
import {
  bytesFormatter,
  numberWithCommasFormatter,
  percentFormatter,
  tokenFormatter,
  urlFormatter,
} from '@lib/formatters/formatters';
import { fromSqd } from '@lib/network';

export function WorkerGeneral() {
  const { peerId } = useParams<{ peerId: string }>();

  const { data: worker, isLoading: isPending } = useWorkerByPeerId(peerId);
  const { SQD_TOKEN } = useContracts();

  const isLoading = isPending;

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
                label={
                  <HelpTooltip title="Per-worker reward totals come from the indexer and may be slightly out of date. The aggregated Claimable balance shown on the Assets page is read directly from the on-chain rewards contract and is always accurate.">
                    Total reward
                  </HelpTooltip>
                }
                value={tokenFormatter(fromSqd(worker.totalReward), SQD_TOKEN)}
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
