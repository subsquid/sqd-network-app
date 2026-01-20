import { useState } from 'react';

import { dateFormat } from '@i18n';
import { CenteredPageWrapper } from '@layouts/NetworkLayout';
import { ExpandMore, Info } from '@mui/icons-material';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Collapse,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stack,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { ColumnLabel, ColumnValue } from '@pages/DashboardPage/Summary';
import { Link, Outlet } from 'react-router-dom';

import { useStakeInfo } from '@api/contracts/useStakeInfo';
import { useMyGatewaysQuery } from '@api/subsquid-network-squid';
import { Card } from '@components/Card';
import { SquaredChip } from '@components/Chip';
import { FormikSelect } from '@components/Form';
import { HelpTooltip } from '@components/HelpTooltip';
import { SectionHeader } from '@components/SectionHeader';
import { SourceWalletOption } from '@components/SourceWallet';
import { DashboardTable, NoItems } from '@components/Table';
import { SourceProvider, useSourceContext } from '@contexts/SourceContext';
import { useCountdown } from '@hooks/useCountdown';
import { numberWithCommasFormatter, tokenFormatter } from '@lib/formatters/formatters';
import { fromSqd } from '@lib/network';
import { ConnectedWalletRequired } from '@components/ConnectedWalletRequired';
import { useContracts } from '@hooks/network/useContracts';

import { AddGatewayButton } from './AddNewGateway';
import { AutoExtension } from './AutoExtension';
import { GatewayName } from './GatewayName';
import { GatewayStakeButton } from './GatewayStake';
import { GatewayUnregisterButton } from './GatewayUnregister';
import { GatewayUnstakeButton } from './GatewayUnstake';

function AppliesTooltip({ timestamp }: { timestamp?: string }) {
  const timeLeft = useCountdown({ timestamp });

  return <span>{`Applies in ${timeLeft} (${dateFormat(timestamp, 'dateTime')})`}</span>;
}

function ExpiresTooltip({ timestamp }: { timestamp?: string }) {
  const timeLeft = useCountdown({ timestamp });

  return <span>{`Expires in ${timeLeft} (${dateFormat(timestamp, 'dateTime')})`}</span>;
}

export function MyStakes() {
  const theme = useTheme();
  const narrowXs = useMediaQuery(theme.breakpoints.down('xs'));

  const { selectedSource } = useSourceContext();
  const selectedSourceAddress = (selectedSource?.id || '0x') as `0x${string}`;

  const { SQD_TOKEN } = useContracts();

  const { stake, isLoading, isPending, isActive, isExpired, appliedAt, unlockedAt, cuPerEpoch } =
    useStakeInfo(selectedSourceAddress);

  return (
    <>
      <Box minHeight={256} mb={2} display="flex">
        <Card
          sx={{ width: 1 }}
          title={<SquaredChip label="Lock Info" color="primary" />}
          action={
            <Stack direction="row" spacing={1}>
              <GatewayStakeButton disabled={isLoading || isPending} />
              <GatewayUnstakeButton disabled={isLoading || !stake?.amount} />
            </Stack>
          }
        >
          <Stack direction="column" flex={1}>
            <AutoExtension value={stake?.autoExtension} disabled={isLoading || !stake?.amount} />
            <Stack
              divider={<Divider flexItem />}
              spacing={1}
              direction={narrowXs ? 'column' : 'row'}
              alignItems={narrowXs ? 'stretch' : 'flex-end'}
              height={1}
              justifyContent="stretch"
              width={0.75}
            >
              <Stack divider={<Divider flexItem />} spacing={1} flex={1}>
                <Box>
                  <ColumnLabel>
                    <Stack direction="row" spacing={1}>
                      <span>Amount</span>
                      <Box display="flex">
                        {stake &&
                          (isPending ? (
                            <Tooltip
                              title={<AppliesTooltip timestamp={appliedAt} />}
                              placement="top"
                            >
                              <SquaredChip label="Pending" color="warning" />
                            </Tooltip>
                          ) : isActive ? (
                            <Tooltip
                              title={<ExpiresTooltip timestamp={unlockedAt} />}
                              placement="top"
                            >
                              <SquaredChip label="Active" color="info" />
                            </Tooltip>
                          ) : isExpired ? (
                            <SquaredChip label="Expired" color="error" />
                          ) : null)}
                      </Box>
                    </Stack>
                  </ColumnLabel>
                  <ColumnValue>{tokenFormatter(fromSqd(stake?.amount), SQD_TOKEN, 3)}</ColumnValue>
                </Box>
                <Box>
                  <ColumnLabel>
                    <HelpTooltip title="In the current epoch">
                      <span>Available CUs</span>
                    </HelpTooltip>
                  </ColumnLabel>
                  <ColumnValue>{numberWithCommasFormatter(cuPerEpoch || 0)}</ColumnValue>
                </Box>
              </Stack>
            </Stack>
          </Stack>
        </Card>
      </Box>
    </>
  );
}

export function MyGateways() {
  const { selectedSource } = useSourceContext();
  const selectedSourceAddress = (selectedSource?.id || '0x') as `0x${string}`;

  const { data: gatewaysQuery, isLoading: isGatewaysQueryLoading } = useMyGatewaysQuery({
    address: selectedSourceAddress,
  });

  const isLoading = isGatewaysQueryLoading;

  return (
    <>
      <SectionHeader
        title="My Portals"
        sx={{ mb: 2 }}
        action={
          <Stack direction="row" spacing={1}>
            <Button
              color="secondary"
              variant="outlined"
              component={Link}
              target="_blank"
              to="https://docs.sqd.dev/subsquid-network/participate/portal/"
            >
              LEARN MORE
            </Button>
            <AddGatewayButton disabled={isLoading} />
          </Stack>
        }
      />
      <DashboardTable loading={isLoading} sx={{ mb: 2 }}>
        <TableHead>
          <TableRow>
            <TableCell>Portal</TableCell>
            <TableCell>Registered</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {gatewaysQuery?.gateways.length ? (
            gatewaysQuery.gateways.map(gateway => (
              <TableRow key={gateway.id}>
                <TableCell>
                  <GatewayName gateway={gateway} to={`/portals/${gateway.id}`} />
                </TableCell>
                <TableCell>{dateFormat(gateway.createdAt)}</TableCell>
                <TableCell>
                  <Box display="flex" justifyContent="flex-end">
                    <GatewayUnregisterButton gateway={gateway} />
                  </Box>
                </TableCell>
              </TableRow>
            ))
          ) : isLoading ? null : (
            <NoItems>
              <Typography>No portal registered yet</Typography>
            </NoItems>
          )}
        </TableBody>
      </DashboardTable>
    </>
  );
}

const GettingStarted = () => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);

  const steps = [
    {
      primary: 'Get SQD tokens',
      secondary: (
        <>
          Make sure you have enough SQD tokens to get started.{' '}
          <a
            href="https://docs.sqd.dev/subsquid-network/participate/portal/#staking-requirements-and-compute-units"
            target="_blank"
            rel="noreferrer"
          >
            How much do I need?
          </a>
        </>
      ),
    },
    {
      primary: 'Lock your tokens',
      secondary: (
        <>
          Lock your SQD tokens to generate Compute Units (CUs), which are used to handle SQD Network
          queries.{' '}
          <a
            href="https://docs.sqd.dev/subsquid-network/participate/portal/#staking-requirements-and-compute-units"
            target="_blank"
            rel="noreferrer"
          >
            How do CUs transfer to SQD?
          </a>
        </>
      ),
    },
    {
      primary: 'Generate a Peer ID',
      secondary: (
        <>
          Create a Peer ID to identify your portal.{' '}
          <a
            href="https://docs.sqd.dev/subsquid-network/participate/portal/#generate-peer-id"
            target="_blank"
            rel="noreferrer"
          >
            How to generate a Peer ID?
          </a>
        </>
      ),
    },
    {
      primary: 'Register Your Portal',
      secondary: <>Add your portal to the chain to complete the setup.</>,
    },
  ];

  return (
    <Card sx={{ mb: 2, background: '#f3f3ff', padding: 0 }}>
      <Alert
        sx={{ cursor: 'pointer' }}
        color="info"
        icon={<Info />}
        action={
          <IconButton color="inherit" sx={{ padding: 0.5 }}>
            <ExpandMore
              sx={{
                transition: 'transform 300ms ease-out',
                transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
              }}
            />
          </IconButton>
        }
        onClick={() => setOpen(!open)}
      >
        <Typography>Getting started with your portal</Typography>
      </Alert>

      <Collapse in={open} timeout={300}>
        <Box pt={0} pl={6.5} pr={6.5} pb={2} color="#383766">
          <List disablePadding>
            {steps.map(({ primary, secondary }, i) => (
              <ListItem
                key={i}
                sx={{ listStyle: 'list-item' }}
                disablePadding
                alignItems="flex-start"
              >
                <ListItemIcon>
                  <Avatar
                    sx={{
                      width: 32,
                      height: 32,
                      fontSize: '16px',
                      backgroundColor: theme.palette.info.main,
                    }}
                  >
                    {i + 1}
                  </Avatar>
                </ListItemIcon>
                <ListItemText primary={primary} secondary={secondary} />
              </ListItem>
            ))}
          </List>
          <Typography variant="body1" mt={1}>
            That's it! Your portal is now ready to run. For more detailed guidance, check out the{' '}
            <a
              href="https://docs.sqd.dev/subsquid-network/participate/portal/"
              target="_blank"
              rel="noreferrer"
            >
              Portal Documentation
            </a>{' '}
            or{' '}
            <a href="https://t.me/HydraDevs" target="_blank" rel="noreferrer">
              contact our team
            </a>{' '}
            for help.
          </Typography>
        </Box>
      </Collapse>
    </Card>
  );
};

function GatewaysPageContent() {
  const { sources, selectedSource, setSelectedSourceId, isLoading } = useSourceContext();

  const formik = {
    values: { source: selectedSource?.id || sources[0]?.id || '' },
    setFieldValue: () => {},
    errors: {},
    touched: {},
  };

  return (
    <>
      <GettingStarted />
      <Box sx={{ mb: 2 }}>
        <FormikSelect
          id="source"
          formik={formik as any}
          options={sources.map(source => ({
            label: <SourceWalletOption source={source} />,
            value: source.id,
          }))}
          onChange={event => setSelectedSourceId(event.target.value as string)}
        />
      </Box>
      <MyStakes />
      <MyGateways />
    </>
  );
}

export function GatewaysPage() {
  return (
    <CenteredPageWrapper>
      <ConnectedWalletRequired>
        <SourceProvider>
          <GatewaysPageContent />
        </SourceProvider>
      </ConnectedWalletRequired>
      <Outlet />
    </CenteredPageWrapper>
  );
}
