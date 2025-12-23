import { useState } from 'react';
import {
  Box,
  Button,
  Tab,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tabs,
  Typography,
} from '@mui/material';

import { portalPoolAbi } from '@api/contracts';
import { useWriteSQDTransaction } from '@api/contracts/useWriteTransaction';
import { Card } from '@components/Card';
import { DashboardTable, NoItems } from '@components/Table';
import { useCountdown } from '@hooks/useCountdown';
import { tokenFormatter } from '@lib/formatters/formatters';
import { fromSqd } from '@lib/network';
import { useContracts } from '@network/useContracts';

import type { PendingWithdrawal } from './hooks';
import { usePoolData, usePoolPendingWithdrawals } from './hooks';

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
  const timeLeft = useCountdown({ timestamp: withdrawal.estimatedCompletionAt });

  return (
    <TableRow>
      <TableCell>{withdrawal.id}</TableCell>
      <TableCell>{tokenFormatter(fromSqd(withdrawal.amount), SQD_TOKEN, 2)}</TableCell>
      <TableCell>{timeLeft}</TableCell>
      <TableCell>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="outlined"
            onClick={() => onClaim(withdrawal.id)}
            loading={isClaiming}
            disabled={!isReady}
            color="secondary"
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
}: {
  pendingWithdrawals: PendingWithdrawal[];
  claimingId: string | null;
  onClaim: (id: string) => void;
}) {
  return (
    <DashboardTable sx={{ mx: -2, my: -1 }}>
      <TableHead>
        <TableRow>
          <TableCell>Ticket</TableCell>
          <TableCell>Amount</TableCell>
          <TableCell>Time Left</TableCell>
          <TableCell></TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {pendingWithdrawals.length ? (
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
            <Typography>No pending withdrawals</Typography>
          </NoItems>
        )}
      </TableBody>
    </DashboardTable>
  );
}

export function PendingWithdrawals({ poolId }: PendingWithdrawalsProps) {
  const { data: pool } = usePoolData(poolId);
  const [claimingId, setClaimingId] = useState<string | null>(null);
  const { writeTransactionAsync } = useWriteSQDTransaction();
  const { data: pendingWithdrawals = [] } = usePoolPendingWithdrawals(poolId);

  const handleClaim = async (withdrawalId: string) => {
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
  };

  if (!pool) return null;

  const readyCount = pendingWithdrawals.length;

  return (
    <Box sx={{ mt: 2 }}>
      <Tabs value={0} sx={{ mb: 2 }}>
        <Tab label={`Pending Withdrawals`} />
      </Tabs>
      <Card>
        <PendingWithdrawalsTable
          pendingWithdrawals={pendingWithdrawals}
          claimingId={claimingId}
          onClaim={handleClaim}
        />
      </Card>
    </Box>
  );
}
