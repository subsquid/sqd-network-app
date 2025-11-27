import { useMemo } from 'react';

import { calculateDelegationCapacity } from '@lib/network';
import { getWorkerStatus } from '@components/Worker';
import BigNumber from 'bignumber.js';
import { compare as compareSemver } from 'semver';
import { PartialDeep, SimplifyDeep } from 'type-fest';

import { useAccount } from '@network/useAccount.ts';

import { useSquid } from './datasource';
import {
  AccountType,
  Delegation,
  useAllWorkersQuery,
  useMyDelegationsQuery,
  useMyWorkersCountQuery,
  useMyWorkersQuery,
  useWorkerByPeerIdQuery,
  useWorkerDelegationInfoQuery,
  useWorkerOwnerQuery,
  Worker,
} from './graphql';
import { useNetworkSettings } from './settings-graphql';

// inherit API interface for internal class
// export interface BlockchainApiWorker extends Omit<WorkerFragmentFragment, 'createdAt'> {
//   createdAt: Date;
// }

// export class BlockchainApiWorker {
//   ownedByMe?: boolean;
//   delegationCapacity?: number;
//   delegationEnabled: boolean = false;
//   myDelegations: {
//     owner: { id: string; type: AccountType };
//     deposit: string;
//     locked?: boolean;
//     claimableReward: string;
//     claimedReward: string;
//   }[] = [];
//   totalReward: string;
//   // myDelegationsTotal: BigNumber;
//   // myDelegationsRewardsTotal: BigNumber;

//   constructor({ worker, address }: { worker: WorkerFragmentFragment; address?: `0x${string}` }) {
//     Object.assign(this, {
//       ...worker,
//       createdAt: new Date(worker.createdAt),
//       delegationEnabled: worker.status === WorkerStatus.Active,
//       ownedByMe: worker.realOwner?.id === address,
//     });

//     // this.myDelegationsTotal = this.myDelegations.reduce(
//     //   (t, r) => t.plus(fromSqd(r.deposit)),
//     //   BigNumber(0),
//     // );

//     // this.myDelegationsRewardsTotal = this.myDelegations.reduce(
//     //   (t, r) => t.plus(fromSqd(r.claimableReward)).plus(fromSqd(r.claimedReward)),
//     //   BigNumber(0),
//     // );

//     this.totalReward = BigNumber(this.claimedReward).plus(this.claimableReward).toFixed(0);

//     if (this.totalDelegation && this.capedDelegation) {
//       this.delegationCapacity = calculateDelegationCapacity({
//         capedDelegation: this.capedDelegation,
//         totalDelegation: this.totalDelegation,
//       });
//     }
//   }

//   canEdit() {
//     if (!this.ownedByMe) return false;

//     switch (this.status) {
//       case WorkerStatus.Registering:
//       case WorkerStatus.Active:
//         return true;
//       default:
//         return false;
//     }
//   }

//   canUnregister() {
//     if (!this.ownedByMe) return false;

//     switch (this.status) {
//       case WorkerStatus.Deregistering:
//       case WorkerStatus.Deregistered:
//       case WorkerStatus.Withdrawn:
//         return false;
//       default:
//         return true;
//     }
//   }

//   canWithdraw() {
//     return this.status === WorkerStatus.Deregistered && !this.locked;
//   }

//   displayStats() {
//     switch (this.status) {
//       case WorkerStatus.Registering:
//       case WorkerStatus.Active:
//       case WorkerStatus.Deregistering:
//         return true;
//       default:
//         return false;
//     }
//   }
// }

// inherit API interface for internal class
// export interface BlockchainApiFullWorker extends BlockchainApiWorker, WorkerFullFragmentFragment {
//   owner: WorkerFullFragmentFragment['owner'];
// }
// export class BlockchainApiFullWorker extends BlockchainApiWorker {}

export interface WorkerExtended extends Worker {
  delegationCapacity: number;
  myDelegation: string;
  myTotalDelegationReward: string;
  totalReward: string;
}

export enum WorkerSortBy {
  JoinedAt = 'joined_at',
  Uptime24h = 'uptime_24h',
  Uptime90d = 'uptime_90d',
  StakerAPR = 'staker_apr',
  WorkerAPR = 'apr',
  WorkerReward = 'worker_reward',
  DelegationCapacity = 'delegation_capacity',
  MyDelegation = 'my_delegation',
  MyDelegationReward = 'my_delegation_reward',
  Name = 'name',
  Version = 'version',
}

export enum SortDir {
  Asc = 'asc',
  Desc = 'desc',
}

const createSortFunction = <T extends PartialDeep<WorkerExtended, { recurseIntoArrays: true }>>(
  sortBy: WorkerSortBy,
  sortDir: SortDir,
): ((a: T, b: T) => number) => {
  return (a, b) => {
    let result: number;

    switch (sortBy) {
      case WorkerSortBy.Name:
        result = a.name ? (b.name ? a.name.localeCompare(b.name) : -1) : 1;
        break;
      case WorkerSortBy.Uptime90d:
        result = (a.uptime90Days ?? -1) - (b.uptime90Days ?? -1);
        break;
      case WorkerSortBy.Uptime24h:
        result = (a.uptime24Hours ?? -1) - (b.uptime24Hours ?? -1);
        break;
      case WorkerSortBy.DelegationCapacity:
        result = (a.delegationCapacity ?? -1) - (b.delegationCapacity ?? -1);
        break;
      case WorkerSortBy.StakerAPR:
        result = (a.stakerApr ?? -1) - (b.stakerApr ?? -1);
        break;
      case WorkerSortBy.WorkerAPR:
        result = (a.apr ?? -1) - (b.apr ?? -1);
        break;
      case WorkerSortBy.WorkerReward:
        result = BigInt(a.totalReward ?? -1) > BigInt(b.totalReward ?? -1) ? 1 : -1;
        break;
      case WorkerSortBy.MyDelegation:
        result = BigInt(a.myDelegation ?? -1) > BigInt(b.myDelegation ?? -1) ? 1 : -1;
        break;
      case WorkerSortBy.MyDelegationReward:
        result =
          BigInt(a.myTotalDelegationReward ?? -1) > BigInt(b.myTotalDelegationReward ?? -1)
            ? 1
            : -1;
        break;
      case WorkerSortBy.Version:
        result = a.version ? (b.version ? compareSemver(a.version, b.version) : 1) : -1;
        break;
      case WorkerSortBy.JoinedAt:
      default:
        result = new Date(a.createdAt || 0).valueOf() - new Date(b.createdAt || 0).valueOf();
    }

    return sortDir === SortDir.Desc ? -result : result;
  };
};

export function sortWorkers<T extends PartialDeep<WorkerExtended, { recurseIntoArrays: true }>>(
  workers: T[],
  sortBy: WorkerSortBy,
  sortDir: SortDir,
): T[] {
  return [...workers].sort(createSortFunction(sortBy, sortDir));
}

interface WorkersQueryParams {
  page: number;
  perPage: number;
  search: string;
  sortBy: WorkerSortBy;
  sortDir: SortDir;
  statusFilter?: string[];
  minUptime?: number;
  minWorkerAPR?: number;
  minDelegatorAPR?: number;
  maxDelegationCapacity?: number;
}

function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function useWorkers({
  page,
  perPage,
  search,
  sortBy,
  sortDir,
  statusFilter = [],
  minUptime,
  minWorkerAPR,
  minDelegatorAPR,
  maxDelegationCapacity,
}: WorkersQueryParams) {
  const { isPending: isSettingsLoading } = useNetworkSettings();
  const { data, isPending } = useAllWorkersQuery({});

  const filteredData = useMemo(() => {
    const filtered = (data?.workers || [])
      .filter(w => {
        // Search filter
        if (search) {
          const regex = new RegExp(escapeRegExp(search), 'i');
          if (!w.peerId.match(regex) && !w.name?.match(regex)) {
            return false;
          }
        }

        // Status filter
        if (statusFilter.length > 0) {
          const workerStatus = getWorkerStatus(w);
          if (!statusFilter.includes(workerStatus.label)) {
            return false;
          }
        }

        // Min uptime filter
        if (minUptime != null && minUptime > 0) {
          const uptime = w.uptime90Days != null ? w.uptime90Days : 0;
          if (uptime < minUptime) {
            return false;
          }
        }

        // Min worker APR filter
        if (minWorkerAPR != null && minWorkerAPR > 0) {
          const workerAPR = w.apr != null ? w.apr : 0;
          if (workerAPR < minWorkerAPR) return false;
        }

        // Min delegator APR filter
        if (minDelegatorAPR != null && minDelegatorAPR > 0) {
          const delegatorAPR = w.stakerApr != null ? w.stakerApr : 0;
          if (delegatorAPR < minDelegatorAPR) return false;
        }

        // Max delegation capacity filter
        if (maxDelegationCapacity != null && maxDelegationCapacity > 0) {
          const delegationCapacity = calculateDelegationCapacity({
            totalDelegation: w.totalDelegation,
            capedDelegation: w.capedDelegation,
          });
          if (delegationCapacity > maxDelegationCapacity) return false;
        }

        return true;
      })
      .map(w => ({
        ...w,
        delegationCapacity: calculateDelegationCapacity({
          totalDelegation: w.totalDelegation,
          capedDelegation: w.capedDelegation,
        }),
      }));

    const totalPages = Math.ceil(filtered.length / perPage);
    const normalizedPage = Math.min(Math.max(1, page), totalPages);

    return {
      page: normalizedPage,
      totalPages,
      workers: sortWorkers(filtered, sortBy, sortDir).slice(
        (normalizedPage - 1) * perPage,
        normalizedPage * perPage,
      ),
    };
  }, [
    data?.workers,
    search,
    sortBy,
    sortDir,
    page,
    perPage,
    statusFilter,
    minUptime,
    minWorkerAPR,
    minDelegatorAPR,
    maxDelegationCapacity,
  ]);

  return {
    ...filteredData,
    isLoading: isSettingsLoading || isPending,
  };
}

interface MyWorkersParams {
  sortBy: WorkerSortBy;
  sortDir: SortDir;
}

export function useMyWorkers({ sortBy, sortDir }: MyWorkersParams) {
  const { address } = useAccount();
  const { isPending: isSettingsLoading } = useNetworkSettings();

  const { data: workers, isLoading } = useMyWorkersQuery(
    { address: address || '' },
    {
      select: res =>
        res.workers.map(w => ({
          ...w,
          totalReward: BigNumber(w.claimedReward).plus(w.claimableReward).toFixed(),
        })),
      enabled: !!address,
    },
  );

  const data = useMemo(
    () => sortWorkers(workers || [], sortBy, sortDir),
    [workers, sortBy, sortDir],
  );

  return {
    data,
    isLoading: isSettingsLoading || isLoading,
  };
}

export function useWorkerByPeerId(peerId?: string) {
  const { isPending: isSettingsLoading } = useNetworkSettings();
  const { address } = useAccount();

  const {
    data: worker,
    isLoading,
    promise,
  } = useWorkerByPeerIdQuery(
    { peerId: peerId || '', address },
    {
      select: res => {
        if (!res.workers.length) return;
        return res.workers.map(w => ({
          ...w,
          delegationCapacity: calculateDelegationCapacity({
            totalDelegation: w.totalDelegation,
            capedDelegation: w.capedDelegation,
          }),
        }))[0];
      },
      enabled: !!peerId,
    },
  );

  return {
    data: worker,
    isLoading: isSettingsLoading || isLoading,
    promise,
  };
}

// export function useMyClaimsAvailable() {
//   const { address } = useAccount();
//   const datasource = useSquidDataSource();

//   const { data, isLoading } = useMyClaimsQuery( {
//     address: address || '',
//   });

//   const { sources, claims } = useMemo(() => {
//     const allWorkers = [
//       ...(data?.workers || []).map(w => ({
//         ...w,
//         type: ClaimType.Worker,
//       })),
//       ...(data?.delegations || []).map(d => {
//         return {
//           ...d.worker,
//           type: ClaimType.Delegation,
//           owner: d.owner,
//           claimableReward: d.claimableReward,
//         };
//       }),
//     ];

//     const filteredWorkers = source ? allWorkers.filter(w => w.owner.id === source) : allWorkers;

//     return {
//       sources: values(
//         mapValues(groupBy(allWorkers, 'owner.id'), g => {
//           const total = g.reduce((t, i) => t.plus(i.claimableReward), BigNumber(0));

//           return {
//             ...g[0].owner,
//             balance: total.toFixed(0),
//           };
//         }),
//       ),

//       claims: values(
//         mapValues(groupBy(filteredWorkers, 'id'), g => {
//           const total = g.reduce((t, i) => t.plus(i.claimableReward), BigNumber(0));

//           return {
//             ...g[0],
//             claimableReward: total.toFixed(0),
//           };
//         }),
//       ),
//     };
//   }, [data?.delegations, data?.workers, source]);

//   return {
//     isLoading,
//     sources,
//     claims,
//   };
// }

export function useMyDelegations({ sortBy, sortDir }: MyWorkersParams) {
  const { address } = useAccount();
  const { isPending: isSettingsLoading } = useNetworkSettings();
  const datasource = useSquid();

  const { data: delegationsQuery, isLoading: isDelegationsQueryLoading } = useMyDelegationsQuery({
    address: address || '0x',
  });

  const data = useMemo(() => {
    type WorkerWithDelegations = SimplifyDeep<
      Pick<
        Worker,
        | 'id'
        | 'peerId'
        | 'name'
        | 'capedDelegation'
        | 'totalDelegation'
        | 'online'
        | 'jailed'
        | 'status'
        | 'stakerApr'
      > &
        Pick<WorkerExtended, 'delegationCapacity' | 'myDelegation' | 'myTotalDelegationReward'> & {
          delegations: (Pick<Delegation, 'deposit' | 'locked' | 'lockEnd'> & {
            owner: { id: string; type: AccountType };
          })[];
        }
    >;

    return sortWorkers(
      delegationsQuery?.workers?.map(w => {
        const worker: WorkerWithDelegations = {
          id: w.id,
          name: w.name,
          peerId: w.peerId,
          status: w.status,
          online: w.online,
          jailed: w.jailed,
          stakerApr: w.stakerApr,
          totalDelegation: w.totalDelegation,
          capedDelegation: w.capedDelegation,
          delegationCapacity: calculateDelegationCapacity({
            totalDelegation: w.totalDelegation,
            capedDelegation: w.capedDelegation,
          }),
          myDelegation: '0',
          myTotalDelegationReward: '0',
          delegations: [],
        };

        w.delegations.forEach(d => {
          worker.myDelegation = BigNumber(worker.myDelegation).plus(d.deposit).toFixed();
          worker.myTotalDelegationReward = BigNumber(worker.myTotalDelegationReward)
            .plus(d.claimableReward)
            .plus(d.claimedReward)
            .toFixed();
          worker.delegations.push(d);
        });

        return worker;
      }) || [],
      sortBy,
      sortDir,
    );
  }, [delegationsQuery, sortBy, sortDir]);

  return {
    isLoading: isSettingsLoading || isDelegationsQueryLoading,
    data,
  };
}

export function useIsWorkerOperator() {
  const { address } = useAccount();
  const datasource = useSquid();

  const { data, isLoading } = useMyWorkersCountQuery(
    { address: address || '' },
    {
      select: res => !!res.workersConnection.totalCount,
    },
  );

  return {
    isLoading,
    isWorkerOperator: data ?? false,
  };
}

interface WorkerDelegationInfoParams {
  workerId?: string;
  enabled?: boolean;
}

export function useWorkerDelegationInfo({ workerId, enabled }: WorkerDelegationInfoParams) {
  const datasource = useSquid();

  const { data, isLoading } = useWorkerDelegationInfoQuery(
    { workerId: workerId || '' },
    {
      select: res => ({
        worker: res.workerById,
        info: res.settings[0],
      }),
      enabled,
    },
  );

  return {
    isLoading,
    data,
  };
}

interface WorkerOwnerParams {
  workerId?: string;
  enabled?: boolean;
}

export function useWorkerOwner({ workerId, enabled }: WorkerOwnerParams) {
  const datasource = useSquid();

  const { data, isLoading } = useWorkerOwnerQuery(
    { workerId: workerId || '' },
    {
      select: res => res.workerById,
      enabled,
    },
  );

  return {
    isLoading,
    data,
  };
}

interface MyWorkerDelegationsParams {
  peerId?: string;
  enabled?: boolean;
}

export function useMyWorkerDelegations({ peerId, enabled }: MyWorkerDelegationsParams) {
  const { address } = useAccount();
  const datasource = useSquid();

  const { data: delegations, isLoading: isDelegationsLoading } = useMyDelegationsQuery(
    {
      workerId: peerId || '',
      address: address || '',
    },
    {
      select: res => res.workers,
      enabled,
    },
  );

  return {
    isLoading: isDelegationsLoading,
    data: delegations?.[0]?.delegations,
  };
}
