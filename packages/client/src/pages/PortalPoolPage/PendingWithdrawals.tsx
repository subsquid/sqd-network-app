import { useCallback, useMemo, useState } from 'react';

import { dateFormat } from '@i18n';
import {
  OpenInNewOutlined as ExplorerIcon,
  LockOpenOutlined,
  LockOutlined,
} from '@mui/icons-material';
import {
  Box,
  Button,
  Chip,
  FormControlLabel,
  IconButton,
  Stack,
  Switch,
  Tooltip,
  Typography,
} from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { ColumnDef } from '@tanstack/react-table';
import BigNumber from 'bignumber.js';
import { Link } from 'react-router-dom';
import { useAccount } from 'wagmi';

import { portalPoolAbi } from '@api/contracts';
import { useWriteSQDTransaction } from '@api/contracts/useWriteTransaction';
import { EventType } from '@api/types';
import { Card } from '@components/Card';
import { HelpTooltip } from '@components/HelpTooltip';
import { StateSelect } from '@components/StateSelect';
import { PaginatedTable } from '@components/Table';
import { useContracts } from '@hooks/network/useContracts';
import { useCountdown } from '@hooks/useCountdown';
import { useExplorer } from '@hooks/useExplorer';
import { useTicker } from '@hooks/useTicker';
import { addressFormatter, tokenFormatter } from '@lib/formatters/formatters';

import type { PendingWithdrawal } from './hooks';
import { usePoolData, usePoolEvents, usePoolPendingWithdrawals } from './hooks';
import type { PoolEvent } from './hooks/usePoolEvents';
import { invalidatePoolQueries } from './utils/poolUtils';

const PAGE_SIZE = 10;

interface PendingWithdrawalsProps {
  poolId: string;
}

function WithdrawalTimeLeftCell({ withdrawal }: { withdrawal: PendingWithdrawal }) {
  const isReady = withdrawal.estimatedCompletionAt.getTime() < Date.now();
  const timeLeft = useCountdown({
    timestamp: withdrawal.estimatedCompletionAt,
  });
  const formattedDate = dateFormat(withdrawal.estimatedCompletionAt, 'dateTime');

  return (
    <Tooltip title={formattedDate ?? ''}>
      <span>{isReady ? 'Ready' : timeLeft}</span>
    </Tooltip>
  );
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
        variant="outlined"
        size="small"
        onClick={() => onClaim(withdrawal.id)}
        loading={isClaiming}
        disabled={!isReady}
        color="error"
      >
        WITHDRAW
      </Button>
    </Box>
  );
}

function PendingWithdrawalsTable({
  pendingWithdrawals,
  claimingId,
  onClaim,
  isLoading,
  pageIndex,
  onPageChange,
}: {
  pendingWithdrawals: PendingWithdrawal[];
  claimingId: string | null;
  onClaim: (id: string) => void;
  isLoading: boolean;
  pageIndex: number;
  onPageChange: (page: number) => void;
}) {
  const { SQD_TOKEN } = useContracts();

  // Client-side pagination
  const pageCount = Math.ceil(pendingWithdrawals.length / PAGE_SIZE) || 1;
  const paginatedData = useMemo(() => {
    const start = pageIndex * PAGE_SIZE;
    return pendingWithdrawals.slice(start, start + PAGE_SIZE);
  }, [pendingWithdrawals, pageIndex]);

  const columns = useMemo<ColumnDef<PendingWithdrawal>[]>(
    () => [
      {
        id: 'withdrawalId',
        accessorFn: row => Number(row.id) + 1,
        header: () => 'Withdrawal ID',
        cell: info => info.getValue(),
      },
      {
        id: 'amount',
        accessorFn: row => row.amount,
        header: () => 'Amount',
        cell: info => tokenFormatter(Number(info.getValue() as string), SQD_TOKEN, 2),
      },
      {
        id: 'timeLeft',
        accessorFn: row => row,
        header: () => (
          <Stack direction="row" alignItems="center" spacing={0.5}>
            <span>Time Left</span>
            <HelpTooltip title="Remaining time before this withdrawal can be claimed." />
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
      onPageChange={onPageChange}
      isLoading={isLoading}
      emptyMessage="No withdrawal requests"
    />
  );
}

const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

function formatTimeAgo(timestamp: string): string {
  const diffSeconds = Math.floor((Date.now() - new Date(timestamp).getTime()) / 1000);

  if (diffSeconds < 60) return rtf.format(-diffSeconds, 'second');

  const diffMinutes = Math.floor(diffSeconds / 60);
  if (diffMinutes < 60) return rtf.format(-diffMinutes, 'minute');

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return rtf.format(-diffHours, 'hour');

  const diffDays = Math.floor(diffHours / 24);
  return rtf.format(-diffDays, 'day');
}

function getEventTypeLabel(eventType: EventType): string {
  switch (eventType) {
    case EventType.Deposit:
      return 'Provide';
    case EventType.Withdrawal:
      return 'Withdraw';
    case EventType.Exit:
      return 'Exit';
    case EventType.Topup:
      return 'Top Up';
    case EventType.Claim:
      return 'Claim';
    default:
      return eventType;
  }
}

function getEventTypeColor(
  eventType: EventType,
): 'success' | 'error' | 'default' | 'primary' | 'secondary' | 'info' | 'warning' {
  switch (eventType) {
    case EventType.Deposit:
      return 'info';
    case EventType.Withdrawal:
      return 'error';
    case EventType.Exit:
      return 'warning';
    case EventType.Topup:
      return 'success';
    case EventType.Claim:
      return 'secondary';
    default:
      return 'default';
  }
}

function isRewardEvent(eventType: EventType): boolean {
  return eventType === EventType.Topup || eventType === EventType.Claim;
}

const EVENT_TYPE_OPTIONS = [
  { name: getEventTypeLabel(EventType.Deposit), value: EventType.Deposit },
  { name: getEventTypeLabel(EventType.Withdrawal), value: EventType.Withdrawal },
  { name: getEventTypeLabel(EventType.Exit), value: EventType.Exit },
  { name: getEventTypeLabel(EventType.Topup), value: EventType.Topup },
  { name: getEventTypeLabel(EventType.Claim), value: EventType.Claim },
];

const SQD_DECIMALS = 18;

function formatEventAmount(
  event: PoolEvent,
  sqdSymbol: string,
  rewardToken: { decimals: number; symbol: string } | undefined,
): string {
  if (isRewardEvent(event.eventType)) {
    if (!rewardToken) return '';
    return tokenFormatter(
      BigNumber(event.amount).shiftedBy(-rewardToken.decimals),
      rewardToken.symbol,
      2,
    );
  }
  return tokenFormatter(BigNumber(event.amount).shiftedBy(-SQD_DECIMALS), sqdSymbol, 2);
}

export function PoolActivity({ poolId }: PendingWithdrawalsProps) {
  const { data: pool, isLoading: poolLoading } = usePoolData(poolId);
  const [myActivityOnly, setMyActivityOnly] = useState(false);
  const [eventTypeFilter, setEventTypeFilter] = useState<EventType[]>([]);
  const [pageIndex, setPageIndex] = useState(0);
  const { address } = useAccount();
  const { SQD_TOKEN } = useContracts();

  const { events, totalCount, isLoading } = usePoolEvents({
    poolId,
    providerId: myActivityOnly ? address : undefined,
    eventTypes: eventTypeFilter.length ? eventTypeFilter : undefined,
    limit: PAGE_SIZE,
    offset: pageIndex * PAGE_SIZE,
  });
  const explorer = useExplorer();

  const pageCount = Math.ceil(totalCount / PAGE_SIZE) || 1;

  const columns = useMemo<ColumnDef<PoolEvent>[]>(
    () => [
      {
        id: 'account',
        accessorFn: row => row.providerId,
        header: () => 'Account',
        cell: info => (
          <Typography variant="body1" fontWeight={500}>
            {info.getValue() ? addressFormatter(info.getValue() as string, true) : '—'}
          </Typography>
        ),
      },
      {
        id: 'type',
        accessorFn: row => row.eventType,
        header: () => 'Type',
        cell: info => (
          <Chip
            label={getEventTypeLabel(info.getValue() as EventType)}
            size="small"
            variant="outlined"
            color={getEventTypeColor(info.getValue() as EventType)}
            sx={{ minWidth: 60 }}
          />
        ),
      },
      {
        id: 'amount',
        accessorFn: row => row,
        header: () => 'Amount',
        cell: ({ getValue }) => (
          <Typography variant="body1" fontWeight={500}>
            {formatEventAmount(getValue() as PoolEvent, SQD_TOKEN, pool?.rewardToken)}
          </Typography>
        ),
      },
      {
        id: 'time',
        accessorFn: row => row.timestamp,
        header: () => 'Time',
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
            <Tooltip title="Open in Explorer">
              <IconButton
                size="small"
                aria-label="Open in Explorer"
                component={Link}
                to={explorer.getTxUrl(info.getValue() as string)}
                target="_blank"
              >
                <ExplorerIcon fontSize="small" aria-hidden="true" />
              </IconButton>
            </Tooltip>
          </Box>
        ),
      },
    ],
    [pool, explorer, SQD_TOKEN],
  );

  if (!pool && !poolLoading) return null;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <StateSelect
          variant="filled"
          options={EVENT_TYPE_OPTIONS}
          selected={eventTypeFilter}
          onChange={items => {
            setEventTypeFilter(items.map(i => i.value as EventType));
            setPageIndex(0);
          }}
          renderValue={items =>
            items.length === EVENT_TYPE_OPTIONS.length || items.length === 0
              ? 'All'
              : `${items.length > 1 ? items.length + ' selected' : items[0].name}`
          }
          renderMenuItem={item => (
            <Chip
              label={item.name}
              size="small"
              variant="outlined"
              color={getEventTypeColor(item.value as EventType)}
              sx={{ minWidth: 60, pointerEvents: 'none' }}
            />
          )}
        />
        <FormControlLabel
          control={
            <Switch
              color="info"
              checked={myActivityOnly}
              onChange={(_, checked) => {
                setMyActivityOnly(checked);
                setPageIndex(0);
              }}
              disabled={!address}
            />
          }
          label="My Activity"
        />
      </Box>
      <PaginatedTable
        data={events}
        columns={columns}
        pageIndex={pageIndex}
        pageCount={pageCount}
        onPageChange={setPageIndex}
        isLoading={isLoading}
        emptyMessage="No activity yet"
      />
    </Box>
  );
}

export function PendingWithdrawals({ poolId }: PendingWithdrawalsProps) {
  const { data: pool, isLoading: poolLoading } = usePoolData(poolId);
  const [claimingId, setClaimingId] = useState<string | null>(null);
  const { writeTransactionAsync } = useWriteSQDTransaction();
  const queryClient = useQueryClient();
  const { data: pendingWithdrawals = [], isLoading: withdrawalsLoading } =
    usePoolPendingWithdrawals(poolId);
  const { SQD_TOKEN } = useContracts();

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
        await invalidatePoolQueries(queryClient, poolId);
      } finally {
        setClaimingId(null);
      }
    },
    [poolId, writeTransactionAsync, queryClient],
  );

  if (!pool && !poolLoading) return null;

  return (
    <Card
      title={
        <Stack direction="row" alignItems="center" spacing={0.5}>
          <span>Pending Withdrawals</span>
          <HelpTooltip title="Withdrawals that are waiting for the unlock period to complete before they can be claimed." />
        </Stack>
      }
    >
      {pendingWithdrawals.length === 0 ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            No withdrawal requests
          </Typography>
        </Box>
      ) : (
        <Stack spacing={1.5}>
          {pendingWithdrawals.map(withdrawal => (
            <Stack
              key={withdrawal.id}
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              spacing={1}
              sx={{
                py: 1.5,
                borderTop: 1,
                borderBottom: 1,
                borderColor: 'divider',
              }}
            >
              <Stack direction="row" alignItems="center" spacing={1} sx={{ minWidth: 0 }}>
                {withdrawal.estimatedCompletionAt.getTime() < Date.now() ? (
                  <LockOpenOutlined sx={{ fontSize: 20 }} />
                ) : (
                  <LockOutlined sx={{ fontSize: 20 }} />
                )}
                <Stack spacing={0.25} sx={{ minWidth: 0 }}>
                  <Typography variant="body1" fontWeight={500}>
                    {tokenFormatter(Number(withdrawal.amount), SQD_TOKEN, 2)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <WithdrawalTimeLeftCell withdrawal={withdrawal} />
                  </Typography>
                </Stack>
              </Stack>
              <WithdrawalActionCell
                withdrawal={withdrawal}
                onClaim={handleClaim}
                isClaiming={claimingId === withdrawal.id}
              />
            </Stack>
          ))}
        </Stack>
      )}
    </Card>
  );
}
