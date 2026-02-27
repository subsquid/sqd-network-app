import { useMemo } from 'react';

import { useQuery } from '@tanstack/react-query';
import { compare as compareSemver } from 'semver';
import { PartialDeep } from 'type-fest';
import { useAccount } from 'wagmi';

import { trpc } from '@api/trpc';
import { type RouterOutput } from '@api/types';
import { getWorkerStatus } from '@components/Worker';

import { useNetworkSettings } from './settings-graphql';

export type WorkerWithCapacity = RouterOutput['worker']['list'][number];

export type WorkerExtended = WorkerWithCapacity & {
  myDelegation: string;
  myTotalDelegationReward: string;
  totalReward: string;
};

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
  const { data: workers, isPending } = useQuery(trpc.worker.list.queryOptions());

  const filteredData = useMemo(() => {
    const filtered = (workers || []).filter(w => {
      if (search) {
        const regex = new RegExp(escapeRegExp(search), 'i');
        if (!w.peerId.match(regex) && !w.name?.match(regex)) {
          return false;
        }
      }

      if (statusFilter.length > 0) {
        const workerStatus = getWorkerStatus(w);
        if (!statusFilter.includes(workerStatus.label)) {
          return false;
        }
      }

      if (minUptime != null && minUptime > 0) {
        const uptime = w.uptime90Days != null ? w.uptime90Days : 0;
        if (uptime < minUptime) {
          return false;
        }
      }

      if (minWorkerAPR != null && minWorkerAPR > 0) {
        const workerAPR = w.apr != null ? w.apr : 0;
        if (workerAPR < minWorkerAPR) return false;
      }

      if (minDelegatorAPR != null && minDelegatorAPR > 0) {
        const delegatorAPR = w.stakerApr != null ? w.stakerApr : 0;
        if (delegatorAPR < minDelegatorAPR) return false;
      }

      if (maxDelegationCapacity != null && maxDelegationCapacity > 0) {
        if (w.delegationCapacity > maxDelegationCapacity) return false;
      }

      return true;
    });

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
    workers,
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

  const { data: rawWorkers, isLoading } = useQuery(
    trpc.worker.listMine.queryOptions({ address: address || '' }, { enabled: !!address }),
  );

  const data = useMemo(
    () => sortWorkers(rawWorkers || [], sortBy, sortDir),
    [rawWorkers, sortBy, sortDir],
  );

  return {
    data,
    isLoading: isSettingsLoading || isLoading,
  };
}

export function useWorkerByPeerId(peerId?: string) {
  const { isPending: isSettingsLoading } = useNetworkSettings();
  const { address } = useAccount();

  const { data: rawWorkers, isLoading } = useQuery(
    trpc.worker.get.queryOptions({ peerId: peerId || '', address }, { enabled: !!peerId }),
  );

  return {
    data: rawWorkers?.[0],
    isLoading: isSettingsLoading || isLoading,
  };
}

export function useMyDelegations({ sortBy, sortDir }: MyWorkersParams) {
  const { address } = useAccount();
  const { isPending: isSettingsLoading } = useNetworkSettings();
  const enabled = !!address;

  const { data: rawDelegations, isLoading: isDelegationsQueryLoading } = useQuery(
    trpc.worker.delegations.queryOptions({ address: address ?? '' }, { enabled }),
  );

  const data = useMemo(
    () => sortWorkers(rawDelegations || [], sortBy, sortDir),
    [rawDelegations, sortBy, sortDir],
  );

  return {
    isLoading: isSettingsLoading || isDelegationsQueryLoading,
    data,
  };
}
