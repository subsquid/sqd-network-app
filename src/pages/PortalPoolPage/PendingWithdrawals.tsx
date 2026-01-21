import { useCallback, useMemo, useState } from 'react';

import { dateFormat } from '@i18n';
import { OpenInNewOutlined as ExplorerIcon } from '@mui/icons-material';
import {
  Box,
  Button,
  Chip,
  IconButton,
  Skeleton,
  Stack,
  Tab,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tabs,
  Tooltip,
  Typography,
} from '@mui/material';
import BigNumber from 'bignumber.js';
import { Link } from 'react-router-dom';

import { portalPoolAbi } from '@api/contracts';
import { useWriteSQDTransaction } from '@api/contracts/useWriteTransaction';
import { LiquidityEventType } from '@api/pool-squid/graphql';
import { Card } from '@components/Card';
import { HelpTooltip } from '@components/HelpTooltip';
import { DashboardTable, NoItems } from '@components/Table';
import { useCountdown } from '@hooks/useCountdown';
import { useExplorer } from '@hooks/useExplorer';
import { addressFormatter, tokenFormatter } from '@lib/formatters/formatters';
import { useContracts } from '@hooks/network/useContracts';

import type { PendingWithdrawal } from './hooks';
import { usePoolData, usePoolPendingWithdrawals } from './hooks';
import { useLiquidityEvents } from './hooks/useLiquidityEvents';
import { useTopUps } from './hooks/useTopUps';
import { ACTIVITY_TEXTS, TOP_UPS_TEXTS, WITHDRAWALS_TEXTS } from './texts';

interface PendingWithdrawalsProps {
  poolId: string;
}

function WithdrawalRow({
  withdrawal,
  onClaim,
  isClaiming,
}: {
  withdrawal: PendingWithdrawal;
  onClaim: (id: string) => void;
  isClaiming: boolean;
}) {
  const { SQD_TOKEN } = useContracts();
  const isReady = withdrawal.estimatedCompletionAt.getTime() < Date.now();
  const timeLeft = useCountdown({
    timestamp: withdrawal.estimatedCompletionAt,
  });

  return (
    <TableRow>
      <TableCell>{Number(withdrawal.id) + 1}</TableCell>
      <TableCell>{tokenFormatter(withdrawal.amount, SQD_TOKEN, 2)}</TableCell>
      <TableCell>{timeLeft}</TableCell>
      <TableCell>
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
      </TableCell>
    </TableRow>
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
  return (
    <DashboardTable>
      <TableHead>
        <TableRow>
          <TableCell>{WITHDRAWALS_TEXTS.table.withdrawalId}</TableCell>
          <TableCell>{WITHDRAWALS_TEXTS.table.amount}</TableCell>
          <TableCell>
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <span>{WITHDRAWALS_TEXTS.table.timeLeft.label}</span>
              <HelpTooltip title={WITHDRAWALS_TEXTS.table.timeLeft.tooltip} />
            </Stack>
          </TableCell>
          <TableCell></TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {isLoading ? (
          <TableRow>
            <TableCell>
              <Skeleton width="50%" />
            </TableCell>
            <TableCell>
              <Skeleton width="50%" />
            </TableCell>
            <TableCell>
              <Skeleton width="50%" />
            </TableCell>
            <TableCell>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Skeleton variant="rounded" width={80} height={36} />
              </Box>
            </TableCell>
          </TableRow>
        ) : pendingWithdrawals.length ? (
          pendingWithdrawals.map(withdrawal => (
            <WithdrawalRow
              key={withdrawal.id}
              withdrawal={withdrawal}
              onClaim={onClaim}
              isClaiming={claimingId === withdrawal.id}
            />
          ))
        ) : (
          <NoItems>
            <Typography>{WITHDRAWALS_TEXTS.noRequests}</Typography>
          </NoItems>
        )}
      </TableBody>
    </DashboardTable>
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
  const { events, isLoading: isLoadingEvents } = useLiquidityEvents({ poolId });
  const { data: pool, isLoading: isLoadingPool } = usePoolData(poolId);
  const explorer = useExplorer();
  const { SQD_TOKEN } = useContracts();

  const isLoading = isLoadingEvents || isLoadingPool;

  const sortedEvents = useMemo(() => {
    return [...events].sort((a, b) => {
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });
  }, [events]);

  if (!pool) return null;

  return (
    <DashboardTable loading={isLoading}>
      <>
        <TableHead>
          <TableRow>
            <TableCell>{ACTIVITY_TEXTS.table.account}</TableCell>
            <TableCell>{ACTIVITY_TEXTS.table.type}</TableCell>
            <TableCell>{ACTIVITY_TEXTS.table.amount}</TableCell>
            <TableCell>{ACTIVITY_TEXTS.table.time}</TableCell>
            <TableCell align="center"></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedEvents.length === 0 && !isLoading ? (
            <NoItems>
              <Typography>{ACTIVITY_TEXTS.noActivity}</Typography>
            </NoItems>
          ) : (
            sortedEvents.map((event, index) => (
              <TableRow key={`${event.txHash}-${index}`}>
                <TableCell>
                  <Typography variant="body1" fontWeight={500}>
                    {event.providerId
                      ? addressFormatter(event.providerId, true)
                      : addressFormatter(undefined, true)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={getEventTypeLabel(event.eventType)}
                    size="small"
                    variant="outlined"
                    color={getEventTypeColor(event.eventType)}
                    sx={{ minWidth: 60 }}
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body1" fontWeight={500}>
                    {tokenFormatter(
                      BigNumber(event.amount || 0).shiftedBy(-pool.lptToken.decimals),
                      SQD_TOKEN,
                      2,
                    )}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Tooltip title={dateFormat(event.timestamp, 'dateTime')}>
                    <Typography
                      variant="body1"
                      component="span"
                      sx={{ cursor: 'default', display: 'inline-block' }}
                    >
                      {formatTimeAgo(event.timestamp)}
                    </Typography>
                  </Tooltip>
                </TableCell>
                <TableCell align="center">
                  <Tooltip title={`Open in Explorer`}>
                    <IconButton
                      size="small"
                      component={Link}
                      to={explorer.getTxUrl(event.txHash)}
                      target="_blank"
                    >
                      <ExplorerIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </>
    </DashboardTable>
  );
}

function TopUpsTable({ poolId }: { poolId: string }) {
  const { topUps, isLoading: isLoadingTopUps } = useTopUps({ poolId });
  const { data: pool, isLoading: isLoadingPool } = usePoolData(poolId);
  const explorer = useExplorer();

  const isLoading = isLoadingTopUps || isLoadingPool;

  const sortedTopUps = useMemo(() => {
    return [...topUps].sort((a, b) => {
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });
  }, [topUps]);

  if (!pool) return null;

  return (
    <DashboardTable loading={isLoading}>
      <>
        <TableHead>
          <TableRow>
            <TableCell>{TOP_UPS_TEXTS.table.amount}</TableCell>
            <TableCell>{TOP_UPS_TEXTS.table.time}</TableCell>
            <TableCell align="center"></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedTopUps.length === 0 && !isLoading ? (
            <NoItems>
              <Typography>{TOP_UPS_TEXTS.noTopUps}</Typography>
            </NoItems>
          ) : (
            sortedTopUps.map((topUp, index) => (
              <TableRow key={`${topUp.txHash}-${index}`}>
                <TableCell>
                  <Typography variant="body1" fontWeight={500}>
                    {tokenFormatter(
                      BigNumber(topUp.amount || 0).shiftedBy(-pool.rewardToken.decimals),
                      pool.rewardToken.symbol,
                      2,
                    )}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Tooltip title={dateFormat(topUp.timestamp, 'dateTime')}>
                    <Typography
                      variant="body1"
                      component="span"
                      sx={{ cursor: 'default', display: 'inline-block' }}
                    >
                      {formatTimeAgo(topUp.timestamp)}
                    </Typography>
                  </Tooltip>
                </TableCell>
                <TableCell align="center">
                  <Tooltip title={`Open in Explorer`}>
                    <IconButton
                      size="small"
                      component={Link}
                      to={explorer.getTxUrl(topUp.txHash)}
                      target="_blank"
                    >
                      <ExplorerIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </>
    </DashboardTable>
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
      <Card>
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
      </Card>
    </Box>
  );
}
