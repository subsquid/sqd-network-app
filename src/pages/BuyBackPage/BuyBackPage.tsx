import { Warning } from '@mui/icons-material';
import { Alert, Box, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import { Outlet } from 'react-router-dom';

import { useSourcesQuery, useSquid } from '@api/subsquid-network-squid';
import { SquaredChip } from '@components/Chip';
import { DashboardTable, NoItems } from '@components/Table';
import { NameWithAvatar } from '@components/SourceWalletName';
import { CenteredPageWrapper } from '@layouts/NetworkLayout';
import { ConnectedWalletRequired } from '@network/ConnectedWalletRequired';
import { useAccount } from '@network/useAccount';
import { useContracts } from '@network/useContracts';

import { DepositButton } from './DepositButton';
import { SectionHeader } from '@components/SectionHeader';

export function OtcContracts() {
  const account = useAccount();
  const squid = useSquid();

  const { data: sourcesQuery, isLoading: isSourcesQueryLoading } = useSourcesQuery({
    address: account.address as `0x${string}`,
  });
  const { BUYBACK } = useContracts();

  const BUYBACKs = [BUYBACK];
  const sources = sourcesQuery?.accounts;

  const isLoading = isSourcesQueryLoading;

  return (
    <Box>
      <SectionHeader title="Buyback" />
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
                    <DepositButton address={address} sources={sources} />
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
    <CenteredPageWrapper className="wide">
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
