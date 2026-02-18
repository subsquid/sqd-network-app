import { CenteredPageWrapper } from '@layouts/NetworkLayout';
import { Warning } from '@mui/icons-material';
import { Alert, Box, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import { Outlet } from 'react-router-dom';

import { useQuery } from '@tanstack/react-query';

import { trpc } from '@api/trpc';
import { SectionHeader } from '@components/SectionHeader';
import { NameWithAvatar } from '@components/SourceWalletName';
import { DashboardTable, NoItems } from '@components/Table';
import { ConnectedWalletRequired } from '@components/ConnectedWalletRequired';
import { useAccount } from 'wagmi';
import { useContracts } from '@hooks/network/useContracts';

import { DepositButton } from './DepositButton';

export function OtcContracts() {
  const account = useAccount();

  const { data: sources, isLoading: isSourcesQueryLoading } = useQuery(trpc.account.sources.queryOptions(
    { address: (account.address as string) || '0x' },
    { enabled: !!account.address },
  ));
  const { BUYBACK } = useContracts();

  const BUYBACKs = [BUYBACK];

  const isLoading = isSourcesQueryLoading;

  return (
    <Box>
      <SectionHeader title="Buyback" sx={{ mb: 2 }} />
      <DashboardTable loading={isLoading} sx={{ mb: 2 }}>
        <TableHead>
          <TableRow>
            <TableCell>Contract</TableCell>
            <TableCell className="pinned"></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {BUYBACKs.length ? (
            BUYBACKs.map(address => (
              <TableRow key={address}>
                <TableCell>
                  <NameWithAvatar title="Contract" subtitle={address} avatarValue={address} />
                </TableCell>
                <TableCell className="pinned">
                  <Box display="flex" justifyContent="flex-end">
                    <DepositButton address={address} sources={sources as any} />
                  </Box>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <NoItems />
          )}
        </TableBody>
      </DashboardTable>
    </Box>
  );
}

export function BuyBacksPage() {
  return (
    <CenteredPageWrapper>
      <ConnectedWalletRequired>
        <Alert sx={{ mb: 2 }} color="warning" icon={<Warning color="warning" />}>
          <Typography>
            This is the official Subsquid Labs buyback page. Please only deposit the contractually
            agreed amount of SQD Tokens. Deposited SQD cannot be refunded.
            <br />
            For questions, please reach out to <a href="mailto:mf@subsquid.io">mf@subsquid.io</a>
          </Typography>
        </Alert>
        <OtcContracts />
      </ConnectedWalletRequired>
      <Outlet />
    </CenteredPageWrapper>
  );
}
