import { useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Chip,
  Link,
  Tab,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tabs,
  Typography,
} from '@mui/material';

const USDC_LOGO = 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png?v=040';

import { Card } from '@components/Card';
import { DashboardTable, NoItems } from '@components/Table';
import { useCountdown } from '@hooks/useCountdown';
import { tokenFormatter } from '@lib/formatters/formatters';
import { fromSqd } from '@lib/network';
import { useContracts } from '@network/useContracts';

import type { PendingWithdrawal, PoolData } from './usePoolData';

interface PendingWithdrawalsProps {
  pool: PoolData;
}

function getStatusColor(
  status: PendingWithdrawal['status'],
): 'warning' | 'info' | 'success' | 'default' {
  switch (status) {
    case 'pending':
      return 'warning';
    case 'processing':
      return 'info';
    case 'ready':
      return 'success';
    default:
      return 'default';
  }
}

function getStatusLabel(status: PendingWithdrawal['status']): string {
  switch (status) {
    case 'pending':
      return 'Pending';
    case 'processing':
      return 'Processing';
    case 'ready':
      return 'Ready to Claim';
    default:
      return status;
  }
}

function TimeUntilWithdrawn({ timestamp }: { timestamp: string }) {
  const timeLeft = useCountdown({ timestamp });
  return <span>~{timeLeft}</span>;
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
  const isReady = withdrawal.status === 'ready';

  return (
    <TableRow>
      <TableCell>{tokenFormatter(fromSqd(withdrawal.amount), SQD_TOKEN, 2)}</TableCell>
      <TableCell>
        <Chip
          label={getStatusLabel(withdrawal.status)}
          color={getStatusColor(withdrawal.status)}
          size="small"
        />
      </TableCell>
      <TableCell>
        {isReady ? (
          <Button
            size="small"
            variant="contained"
            onClick={() => onClaim(withdrawal.id)}
            loading={isClaiming}
          >
            Claim
          </Button>
        ) : (
          <TimeUntilWithdrawn timestamp={withdrawal.estimatedCompletionAt} />
        )}
      </TableCell>
    </TableRow>
  );
}

function PendingWithdrawalsTable({
  pool,
  claimingId,
  onClaim,
}: {
  pool: PoolData;
  claimingId: string | null;
  onClaim: (id: string) => void;
}) {
  const { userPendingWithdrawals } = pool;

  return (
    <DashboardTable sx={{ mx: -2, my: -1 }}>
      <TableHead>
        <TableRow>
          <TableCell>Amount</TableCell>
          <TableCell>Status</TableCell>
          <TableCell>Action</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {userPendingWithdrawals.length ? (
          userPendingWithdrawals.map(withdrawal => (
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

function PayoutsTable() {
  return (
    <DashboardTable>
      <TableHead>
        <TableRow>
          <TableCell>Date</TableCell>
          <TableCell>Amount</TableCell>
          <TableCell>Transaction</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          <TableCell>Dec 15, 2025</TableCell>
          <TableCell>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Avatar src={USDC_LOGO} alt="USDC" sx={{ width: 20, height: 20 }} />
              <Typography variant="body2" fontWeight={500}>
                +125.50 USDC
              </Typography>
            </Box>
          </TableCell>
          <TableCell>
            <Link
              href="https://arbiscan.io/tx/0x1a2b3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890"
              target="_blank"
              rel="noopener noreferrer"
              underline="hover"
              sx={{ fontFamily: 'monospace', fontSize: '0.875rem', color: 'text.primary' }}
            >
              0x1a2b...7890
            </Link>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Dec 1, 2025</TableCell>
          <TableCell>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Avatar src={USDC_LOGO} alt="USDC" sx={{ width: 20, height: 20 }} />
              <Typography variant="body2" fontWeight={500}>
                +118.75 USDC
              </Typography>
            </Box>
          </TableCell>
          <TableCell>
            <Link
              href="https://arbiscan.io/tx/0x9876543210fedcba9876543210fedcba9876543210fedcba9876543210fedcba"
              target="_blank"
              rel="noopener noreferrer"
              underline="hover"
              sx={{ fontFamily: 'monospace', fontSize: '0.875rem', color: 'text.primary' }}
            >
              0x9876...dcba
            </Link>
          </TableCell>
        </TableRow>
      </TableBody>
    </DashboardTable>
  );
}

function MyHistoryTable() {
  return (
    <DashboardTable>
      <TableHead>
        <TableRow>
          <TableCell>Date</TableCell>
          <TableCell>Type</TableCell>
          <TableCell>Amount</TableCell>
          <TableCell>Status</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <NoItems>
          <Typography>No history yet</Typography>
        </NoItems>
      </TableBody>
    </DashboardTable>
  );
}

export function PendingWithdrawals({ pool }: PendingWithdrawalsProps) {
  const { userPendingWithdrawals } = pool;
  const [claimingId, setClaimingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState(0);

  const handleClaim = async (withdrawalId: string) => {
    setClaimingId(withdrawalId);
    try {
      // TODO: Call pool contract claim function
      console.log('Claiming withdrawal:', withdrawalId);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Mock delay
    } catch (error) {
      console.error('Claim failed:', error);
    } finally {
      setClaimingId(null);
    }
  };

  const readyCount = userPendingWithdrawals.filter(w => w.status === 'ready').length;

  return (
    <Box sx={{ mt: 2 }}>
      <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)} sx={{ mb: 2 }}>
        <Tab label={`Pending Withdrawals${readyCount > 0 ? ` (${readyCount})` : ''}`} />
        <Tab label="Payouts" />
        <Tab label="My History" />
      </Tabs>
      <Card>
        {activeTab === 0 && (
          <PendingWithdrawalsTable pool={pool} claimingId={claimingId} onClaim={handleClaim} />
        )}
        {activeTab === 1 && <PayoutsTable />}
        {activeTab === 2 && <MyHistoryTable />}
      </Card>
    </Box>
  );
}
