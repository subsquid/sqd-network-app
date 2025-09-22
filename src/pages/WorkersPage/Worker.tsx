import { dateFormat } from '@i18n';
import {
  bytesFormatter,
  numberWithCommasFormatter,
  percentFormatter,
  tokenFormatter,
  urlFormatter,
} from '@lib/formatters/formatters.ts';
import { fromSqd } from '@lib/network';
import { Box, Divider, Stack, styled } from '@mui/material';
import { useParams, useSearchParams } from 'react-router-dom';

import {
  useWorkerByPeerId,
  WorkerStatus as ApiWorkerStatus,
  WorkerStatus,
  useMySources,
  useMyWorkerDelegations,
} from '@api/subsquid-network-squid';
import { Card } from '@components/Card';
import { SquaredChip } from '@components/Chip';
import { Loader } from '@components/Loader';
import { NotFound } from '@components/NotFound';
import { CenteredPageWrapper, NetworkPageTitle } from '@layouts/NetworkLayout';
import { useAccount } from '@network/useAccount';
import { useContracts } from '@network/useContracts';
import { WorkerUnregisterButton } from '@pages/WorkersPage/WorkerUnregister';

import { DelegationCapacity } from './DelegationCapacity';
import { WorkerCard } from './WorkerCard';
import { WorkerDelegate } from './WorkerDelegate';
import { WorkerUndelegate } from './WorkerUndelegate';
import { WorkerVersion } from './WorkerVersion';
import { WorkerWithdrawButton } from './WorkerWithdraw';

// const sx = {
//   background: '#000',
//   color: '#fff',

//   '&:hover': {
//     background: '#333',
//     color: '#fff',
//   },
// };

export const WorkerDescLabel = styled(Box, {
  name: 'WorkerDescLabel',
})(({ theme }) => ({
  flex: 0.5,
  color: theme.palette.text.secondary,
  whiteSpace: 'balance',
  maxWidth: theme.spacing(25),
}));

export const WorkerColumn = styled(Box, {
  name: 'WorkerDescLabel',
})(() => ({
  flex: 1,
}));

export const WorkerDescTable = styled(Box, {
  name: 'WorkerDescTable',
})(() => ({
  flex: 1,
}));

export const WorkerDescRow = styled(Box, {
  name: 'WorkerDescRow',
})(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  margin: theme.spacing(5, 0),
  lineHeight: 1.4,
}));

export const WorkerDescValue = styled(Box, {
  name: 'WorkerDescValue',
})(({ theme }) => ({
  flex: 1,
  marginLeft: theme.spacing(2),
  overflowWrap: 'anywhere',
}));

export const Title = styled(SquaredChip)(({ theme }) => ({
  marginBottom: theme.spacing(3),
}));

export const Worker = ({ backPath }: { backPath: string }) => {
  const { peerId } = useParams<{ peerId: string }>();
  const { data: worker, isLoading: isPending } = useWorkerByPeerId(peerId);
  const { address } = useAccount();
  const { SQD_TOKEN } = useContracts();

  const [searchParams] = useSearchParams();

  const { data: sources, isLoading: isSourcesLoading } = useMySources();
  const { data: delegations, isLoading: isDelegationsLoading } = useMyWorkerDelegations({ peerId });

  const isLoading = isPending || isSourcesLoading || isDelegationsLoading;

  if (isLoading) {
    return <Loader />;
  }

  if (!worker) {
    return <NotFound item="worker" id={peerId} />;
  }

  return (
    <CenteredPageWrapper className="wide">
      <NetworkPageTitle
        backPath={searchParams.get('backPath') || backPath}
        endAdornment={
          <Stack direction="row" spacing={2}>
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
      />

      <Card outlined>
        <Stack spacing={3} divider={<Divider orientation="horizontal" flexItem />}>
          <WorkerCard
            worker={worker}
            owner={worker.owner}
            canEdit={
              isOwned(worker, address) &&
              [ApiWorkerStatus.Active, ApiWorkerStatus.Registering].includes(worker.status)
            }
          />
          <Box>
            <Title label="Info" />
            <Stack spacing={2} direction="column">
              <Stack direction="row">
                <WorkerDescLabel>Created</WorkerDescLabel>
                <WorkerDescValue>{dateFormat(worker.createdAt, 'dateTime')}</WorkerDescValue>
              </Stack>
              <Stack direction="row">
                <WorkerDescLabel>Version</WorkerDescLabel>
                <WorkerDescValue>
                  <WorkerVersion worker={worker} />
                </WorkerDescValue>
              </Stack>
              <Stack direction="row">
                <WorkerDescLabel>Website</WorkerDescLabel>
                <WorkerDescValue>
                  {worker.website ? (
                    <a href={urlFormatter(worker.website)} target="_blank" rel="noreferrer">
                      {urlFormatter(worker.website)}
                    </a>
                  ) : (
                    '-'
                  )}
                </WorkerDescValue>
              </Stack>
              <Stack direction="row">
                <WorkerDescLabel>Description</WorkerDescLabel>
                <WorkerDescValue>{worker.description || '-'}</WorkerDescValue>
              </Stack>
            </Stack>
          </Box>
          <Box>
            <Title label="Bond" />
            <Stack spacing={2}>
              <Stack direction="row">
                <WorkerDescLabel>Bonded</WorkerDescLabel>
                <WorkerDescValue>{tokenFormatter(fromSqd(worker.bond), SQD_TOKEN)}</WorkerDescValue>
              </Stack>
              <Stack direction="row">
                <WorkerDescLabel>Worker APR</WorkerDescLabel>
                <WorkerDescValue>
                  {worker.apr != null ? percentFormatter(worker.apr) : '-'}
                </WorkerDescValue>
              </Stack>
              <Stack direction="row">
                <WorkerDescLabel>Total reward</WorkerDescLabel>
                <WorkerDescValue>
                  {tokenFormatter(
                    fromSqd(worker.claimableReward).plus(fromSqd(worker.claimedReward)),
                    SQD_TOKEN,
                  )}
                </WorkerDescValue>
              </Stack>
            </Stack>
          </Box>

          <Box>
            <Title label="Delegation" />
            <Stack spacing={2}>
              <Stack direction="row">
                <WorkerDescLabel>Delegators</WorkerDescLabel>
                <WorkerDescValue>{worker.delegationCount}</WorkerDescValue>
              </Stack>
              <Stack direction="row">
                <WorkerDescLabel>Total delegation</WorkerDescLabel>
                <WorkerDescValue>
                  {tokenFormatter(fromSqd(worker.totalDelegation), SQD_TOKEN)}
                </WorkerDescValue>
              </Stack>
              <Stack direction="row">
                <WorkerDescLabel>Delegation capacity</WorkerDescLabel>
                <WorkerDescValue>
                  <DelegationCapacity worker={worker} />
                </WorkerDescValue>
              </Stack>
              <Stack direction="row">
                <WorkerDescLabel>Delegator APR</WorkerDescLabel>
                <WorkerDescValue>
                  {worker.stakerApr != null ? percentFormatter(worker.stakerApr) : '-'}
                </WorkerDescValue>
              </Stack>
              <Stack direction="row">
                <WorkerDescLabel>Total reward</WorkerDescLabel>
                <WorkerDescValue>
                  {tokenFormatter(fromSqd(worker.totalDelegationRewards), SQD_TOKEN)}
                </WorkerDescValue>
              </Stack>
            </Stack>
          </Box>

          <Box>
            <Title label="Statistics" />
            <Stack spacing={2}>
              <Stack direction="row">
                <WorkerDescLabel>Uptime, 24h / 90d</WorkerDescLabel>
                <WorkerDescValue>
                  {percentFormatter(worker.uptime24Hours)} / {percentFormatter(worker.uptime90Days)}
                </WorkerDescValue>
              </Stack>
              <Stack direction="row">
                <WorkerDescLabel>Queries, 24h / 90d</WorkerDescLabel>
                <WorkerDescValue>
                  {numberWithCommasFormatter(worker.queries24Hours)} /{' '}
                  {numberWithCommasFormatter(worker.queries90Days)}
                </WorkerDescValue>
              </Stack>
              <Stack direction="row">
                <WorkerDescLabel>Data served, 24h / 90d</WorkerDescLabel>
                <WorkerDescValue>
                  {bytesFormatter(worker.servedData24Hours)} /{' '}
                  {bytesFormatter(worker.servedData90Days)}
                </WorkerDescValue>
              </Stack>
              <Stack direction="row">
                <WorkerDescLabel>Data stored</WorkerDescLabel>
                <WorkerDescValue>{bytesFormatter(worker.storedData)}</WorkerDescValue>
              </Stack>
            </Stack>
            {/* <UptimeGraph worker={worker} /> */}
          </Box>
        </Stack>
      </Card>

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

function isOwned(
  something: { owner: { id: string; owner?: { id: string } } },
  address: string | undefined,
) {
  return (
    address != null && (something.owner.id === address || something.owner.owner?.id === address)
  );
}
