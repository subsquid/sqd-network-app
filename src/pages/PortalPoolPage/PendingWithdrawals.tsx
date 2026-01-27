import { useCallback, useMemo, useState } from 'react';

import { dateFormat } from '@i18n';
import { OpenInNewOutlined as ExplorerIcon } from '@mui/icons-material';
import {
  Box,
  Button,
  Chip,
  IconButton,
  Stack,
  Tab,
  Tabs,
  Tooltip,
  Typography,
} from '@mui/material';
import { ColumnDef } from '@tanstack/react-table';
import BigNumber from 'bignumber.js';
import { Link } from 'react-router-dom';

import { portalPoolAbi } from '@api/contracts';
import { useWriteSQDTransaction } from '@api/contracts/useWriteTransaction';
import { LiquidityEventType } from '@api/pool-squid/graphql';
import { HelpTooltip } from '@components/HelpTooltip';
import { PaginatedTable } from '@components/Table';
import { useContracts } from '@hooks/network/useContracts';
import { useCountdown } from '@hooks/useCountdown';
import { useExplorer } from '@hooks/useExplorer';
import { useTicker } from '@hooks/useTicker';
import { addressFormatter, tokenFormatter } from '@lib/formatters/formatters';

import type { PendingWithdrawal } from './hooks';
import { usePoolData, usePoolPendingWithdrawals } from './hooks';
import { useLiquidityEvents } from './hooks/useLiquidityEvents';
import { useTopUps } from './hooks/useTopUps';
import { ACTIVITY_TEXTS, TOP_UPS_TEXTS, WITHDRAWALS_TEXTS } from './texts';

interface PendingWithdrawalsProps {
  poolId: string;
}

function WithdrawalTimeLeftCell({ withdrawal }: { withdrawal: PendingWithdrawal }) {
  const timeLeft = useCountdown({
    timestamp: withdrawal.estimatedCompletionAt,
  });
  return <>{timeLeft}</>;
}

function WithdrawalActionCell({
  withdrawal,
  onClaim,
  isClaiming,
}: {
  withdrawal: PendingWithdrawal;
  onClaim: (id: string) => void;
  isClaiming: boolean;
}) {
  const [currentTime, setCurrentTime] = useState(Date.now());

  const updateTime = useCallback(() => {
    setCurrentTime(Date.now());
  }, []);

  useTicker(updateTime, 1000);

  const isReady = withdrawal.estimatedCompletionAt.getTime() < currentTime;

  return (
    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
      <Button
        variant="contained"
        onClick={() => onClaim(withdrawal.id)}
        loading={isClaiming}
        disabled={!isReady}
        color="success"
      >
        CLAIM
      </Button>
    </Box>
  );
}

function PendingWithdrawalsTable({
  pendingWithdrawals,
  claimingId,
  onClaim,
  isLoading,
}: {
  pendingWithdrawals: PendingWithdrawal[];
  claimingId: string | null;
  onClaim: (id: string) => void;
  isLoading: boolean;
}) {
  const { SQD_TOKEN } = useContracts();
  const [pageIndex, setPageIndex] = useState(0);
  const pageSize = 15;

  // Client-side pagination
  const pageCount = Math.ceil(pendingWithdrawals.length / pageSize) || 1;
  const paginatedData = useMemo(() => {
    const start = pageIndex * pageSize;
    return pendingWithdrawals.slice(start, start + pageSize);
  }, [pendingWithdrawals, pageIndex]);

  const columns = useMemo<ColumnDef<PendingWithdrawal>[]>(
    () => [
      {
        id: 'withdrawalId',
        accessorFn: row => Number(row.id) + 1,
        header: () => WITHDRAWALS_TEXTS.table.withdrawalId,
        cell: info => info.getValue(),
      },
      {
        id: 'amount',
        accessorFn: row => row.amount,
        header: () => WITHDRAWALS_TEXTS.table.amount,
        cell: info => {
          const amount = info.getValue() as string;
          return tokenFormatter(BigNumber(amount), SQD_TOKEN, 2);
        },
      },
      {
        id: 'timeLeft',
        accessorFn: row => row,
        header: () => (
          <Stack direction="row" alignItems="center" spacing={0.5}>
            <span>{WITHDRAWALS_TEXTS.table.timeLeft.label}</span>
            <HelpTooltip title={WITHDRAWALS_TEXTS.table.timeLeft.tooltip} />
          </Stack>
        ),
        cell: ({ getValue }) => {
          const withdrawal = getValue() as PendingWithdrawal;
          return <WithdrawalTimeLeftCell withdrawal={withdrawal} />;
        },
      },
      {
        id: 'action',
        accessorFn: row => row,
        header: () => '',
        cell: ({ getValue }) => {
          const withdrawal = getValue() as PendingWithdrawal;
          return (
            <WithdrawalActionCell
              withdrawal={withdrawal}
              onClaim={onClaim}
              isClaiming={claimingId === withdrawal.id}
            />
          );
        },
      },
    ],
    [SQD_TOKEN, claimingId, onClaim],
  );

  return (
    <PaginatedTable
      data={paginatedData}
      columns={columns}
      pageIndex={pageIndex}
      pageCount={pageCount}
      onPageChange={setPageIndex}
      isLoading={isLoading}
      emptyMessage={WITHDRAWALS_TEXTS.noRequests}
    />
  );
}

function formatTimeAgo(timestamp: string): string {
  const now = new Date().getTime();
  const time = new Date(timestamp).getTime();
  const diffSeconds = Math.floor((now - time) / 1000);

  if (diffSeconds < 60) return `${diffSeconds}s ago`;

  const diffMinutes = Math.floor(diffSeconds / 60);
  if (diffMinutes < 60) return `${diffMinutes}m ago`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;

  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}

function getEventTypeLabel(eventType: LiquidityEventType): string {
  switch (eventType) {
    case LiquidityEventType.Deposit:
      return ACTIVITY_TEXTS.eventTypes.provide;
    case LiquidityEventType.Withdrawal:
      return ACTIVITY_TEXTS.eventTypes.withdrawal;
    case LiquidityEventType.Exit:
      return ACTIVITY_TEXTS.eventTypes.exit;
    default:
      return eventType;
  }
}

function getEventTypeColor(
  eventType: LiquidityEventType,
): 'success' | 'error' | 'default' | 'primary' | 'secondary' | 'info' | 'warning' {
  switch (eventType) {
    case LiquidityEventType.Deposit:
      return 'info';
    case LiquidityEventType.Withdrawal:
      return 'error';
    case LiquidityEventType.Exit:
      return 'warning';
    default:
      return 'default';
  }
}

function ActivityTable({ poolId }: { poolId: string }) {
  const [pageIndex, setPageIndex] = useState(0);
  const pageSize = 15;

  const {
    events,
    totalCount,
    isLoading: isLoadingEvents,
  } = useLiquidityEvents({
    poolId,
    limit: pageSize,
    offset: pageIndex * pageSize,
  });
  const { data: pool, isLoading: isLoadingPool } = usePoolData(poolId);
  const explorer = useExplorer();
  const { SQD_TOKEN } = useContracts();

  const isLoading = isLoadingEvents || isLoadingPool;

  // Calculate total page count from totalCount
  const pageCount = Math.ceil(totalCount / pageSize) || 1;

  const columns = useMemo<ColumnDef<(typeof events)[number]>[]>(
    () => [
      {
        id: 'account',
        accessorFn: row => row.providerId,
        header: () => ACTIVITY_TEXTS.table.account,
        cell: info => (
          <Typography variant="body1" fontWeight={500}>
            {info.getValue()
              ? addressFormatter(info.getValue() as string, true)
              : addressFormatter(undefined, true)}
          </Typography>
        ),
      },
      {
        id: 'type',
        accessorFn: row => row.eventType,
        header: () => ACTIVITY_TEXTS.table.type,
        cell: info => (
          <Chip
            label={getEventTypeLabel(info.getValue() as LiquidityEventType)}
            size="small"
            variant="outlined"
            color={getEventTypeColor(info.getValue() as LiquidityEventType)}
            sx={{ minWidth: 60 }}
          />
        ),
      },
      {
        id: 'amount',
        accessorFn: row => row.amount,
        header: () => ACTIVITY_TEXTS.table.amount,
        cell: ({ row, getValue }) => (
          <Typography variant="body1" fontWeight={500}>
            {pool &&
              tokenFormatter(
                BigNumber((getValue() as string) || 0).shiftedBy(-pool.lptToken.decimals),
                SQD_TOKEN,
                2,
              )}
          </Typography>
        ),
      },
      {
        id: 'time',
        accessorFn: row => row.timestamp,
        header: () => ACTIVITY_TEXTS.table.time,
        cell: info => (
          <Tooltip title={dateFormat(info.getValue() as string, 'dateTime')}>
            <Typography
              variant="body1"
              component="span"
              sx={{ cursor: 'default', display: 'inline-block' }}
            >
              {formatTimeAgo(info.getValue() as string)}
            </Typography>
          </Tooltip>
        ),
      },
      {
        id: 'actions',
        accessorFn: row => row.txHash,
        header: () => '',
        cell: info => (
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Tooltip title={`Open in Explorer`}>
              <IconButton
                size="small"
                component={Link}
                to={explorer.getTxUrl(info.getValue() as string)}
                target="_blank"
              >
                <ExplorerIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        ),
      },
    ],
    [pool, SQD_TOKEN, explorer],
  );

  if (!pool) return null;

  return (
    <PaginatedTable
      data={events}
      columns={columns}
      pageIndex={pageIndex}
      pageCount={pageCount}
      onPageChange={setPageIndex}
      isLoading={isLoading}
      emptyMessage={ACTIVITY_TEXTS.noActivity}
    />
  );
}

function TopUpsTable({ poolId }: { poolId: string }) {
  const [pageIndex, setPageIndex] = useState(0);
  const pageSize = 15;

  const {
    topUps,
    totalCount,
    isLoading: isLoadingTopUps,
  } = useTopUps({
    poolId,
    limit: pageSize,
    offset: pageIndex * pageSize,
  });
  const { data: pool, isLoading: isLoadingPool } = usePoolData(poolId);
  const explorer = useExplorer();

  const isLoading = isLoadingTopUps || isLoadingPool;

  // Calculate total page count from totalCount
  const pageCount = Math.ceil(totalCount / pageSize) || 1;

  const columns = useMemo<ColumnDef<(typeof topUps)[number]>[]>(
    () => [
      {
        id: 'amount',
        accessorFn: row => row.amount,
        header: () => TOP_UPS_TEXTS.table.amount,
        cell: ({ getValue }) => (
          <Typography variant="body1" fontWeight={500}>
            {pool &&
              tokenFormatter(
                BigNumber((getValue() as string) || 0).shiftedBy(-pool.rewardToken.decimals),
                pool.rewardToken.symbol,
                2,
              )}
          </Typography>
        ),
      },
      {
        id: 'time',
        accessorFn: row => row.timestamp,
        header: () => TOP_UPS_TEXTS.table.time,
        cell: info => (
          <Tooltip title={dateFormat(info.getValue() as string, 'dateTime')}>
            <Typography
              variant="body1"
              component="span"
              sx={{ cursor: 'default', display: 'inline-block' }}
            >
              {formatTimeAgo(info.getValue() as string)}
            </Typography>
          </Tooltip>
        ),
      },
      {
        id: 'actions',
        accessorFn: row => row.txHash,
        header: () => '',
        cell: info => (
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Tooltip title={`Open in Explorer`}>
              <IconButton
                size="small"
                component={Link}
                to={explorer.getTxUrl(info.getValue() as string)}
                target="_blank"
              >
                <ExplorerIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        ),
      },
    ],
    [pool, explorer],
  );

  if (!pool) return null;

  return (
    <PaginatedTable
      data={topUps}
      columns={columns}
      pageIndex={pageIndex}
      pageCount={pageCount}
      onPageChange={setPageIndex}
      isLoading={isLoading}
      emptyMessage={TOP_UPS_TEXTS.noTopUps}
    />
  );
}

export function PendingWithdrawals({ poolId }: PendingWithdrawalsProps) {
  const { data: pool, isLoading: poolLoading } = usePoolData(poolId);
  const [claimingId, setClaimingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const { writeTransactionAsync } = useWriteSQDTransaction();
  const { data: pendingWithdrawals = [], isLoading: withdrawalsLoading } =
    usePoolPendingWithdrawals(poolId);

  const handleClaim = useCallback(
    async (withdrawalId: string) => {
      setClaimingId(withdrawalId);
      try {
        await writeTransactionAsync({
          address: poolId as `0x${string}`,
          abi: portalPoolAbi,
          functionName: 'withdrawExit',
          args: [BigInt(withdrawalId)],
        });
      } catch (error) {
        // Error is already handled by useWriteSQDTransaction
      } finally {
        setClaimingId(null);
      }
    },
    [poolId, writeTransactionAsync],
  );

  const handleTabChange = useCallback((_: React.SyntheticEvent, value: number) => {
    setActiveTab(value);
  }, []);

  if (!pool && !poolLoading) return null;

  return (
    <Box>
      <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 2 }}>
        <Tab label={ACTIVITY_TEXTS.title} />
        <Tab label={TOP_UPS_TEXTS.title} />
        <Tab label={WITHDRAWALS_TEXTS.tabTitle} />
      </Tabs>
      {activeTab === 0 && <ActivityTable poolId={poolId} />}
      {activeTab === 1 && <TopUpsTable poolId={poolId} />}
      {activeTab === 2 && (
        <PendingWithdrawalsTable
          pendingWithdrawals={pendingWithdrawals}
          claimingId={claimingId}
          onClaim={handleClaim}
          isLoading={poolLoading || withdrawalsLoading}
        />
      )}
    </Box>
  );
}
