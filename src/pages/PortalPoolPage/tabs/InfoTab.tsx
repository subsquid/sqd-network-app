import { useCallback } from 'react';

import { dateFormat } from '@i18n';
import {
  LanguageOutlined as ExplorerIcon,
  AddBoxOutlined as WalletIcon,
} from '@mui/icons-material';
import { Box, Divider, IconButton, Stack, Tooltip, Typography } from '@mui/material';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { useWatchAsset } from 'wagmi';

import { errorMessage } from '@api/contracts/utils';
import { Card } from '@components/Card';
import { CopyToClipboard } from '@components/CopyToClipboard';
import { HelpTooltip } from '@components/HelpTooltip';
import { useExplorer } from '@hooks/useExplorer';
import { addressFormatter, urlFormatter } from '@lib/formatters/formatters';

import { usePoolData } from '../hooks';

interface InfoTabProps {
  poolId: string;
}

export function InfoTab({ poolId }: InfoTabProps) {
  const { data: pool } = usePoolData(poolId);
  const { watchAssetAsync } = useWatchAsset();
  const explorer = useExplorer();

  const handleAddTokenToWallet = useCallback(async () => {
    if (!pool) return;

    try {
      const result = await watchAssetAsync({
        type: 'ERC20',
        options: {
          address: pool.lptToken as `0x${string}`,
          symbol: pool.lptTokenSymbol,
          decimals: 18,
        },
      });
      if (result) {
        toast.success('Token added to wallet');
      } else {
        toast.error('Failed to add token to wallet');
      }
    } catch (error) {
      toast.error('Failed to add token to wallet: ' + errorMessage(error));
    }
  }, [pool, watchAssetAsync]);

  if (!pool) return null;
  return (
    <Card sx={{}} title={<span>Information</span>}>
      <Stack spacing={2} divider={<Divider />}>
        <Stack spacing={1.5}>
          <Stack spacing={0.5}>
            <Typography variant="body2" color="text.secondary">
              Pool Contract
            </Typography>
            <Typography>
              <Stack direction="row" alignItems="center" spacing={0.5}>
                <span>{addressFormatter(pool.id, true)}</span>
                <Stack direction="row" alignItems="center">
                  <CopyToClipboard text={pool.id} content="" showButton={true} />
                  <Tooltip title="Open in Explorer">
                    <IconButton
                      size="small"
                      color="inherit"
                      component={Link}
                      to={explorer.getAddressUrl(pool.id)}
                    >
                      <ExplorerIcon fontSize="inherit" />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </Stack>
            </Typography>
          </Stack>

          <Stack spacing={0.5}>
            <Typography variant="body2" color="text.secondary">
              Operator
            </Typography>
            <Typography>
              <Stack direction="row" alignItems="center" spacing={0.5}>
                <span>{addressFormatter(pool.operator.address, true)}</span>
                <Stack direction="row" alignItems="center">
                  <CopyToClipboard text={pool.operator.address} content="" showButton={true} />
                  <Tooltip title="Open in Explorer">
                    <IconButton
                      size="small"
                      color="inherit"
                      component={Link}
                      to={explorer.getAddressUrl(pool.operator.address)}
                    >
                      <ExplorerIcon fontSize="inherit" />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </Stack>
            </Typography>
          </Stack>

          <Stack spacing={0.5}>
            <Typography variant="body2" color="text.secondary">
              <Stack direction="row" alignItems="center" spacing={0.5}>
                <span>LP-Token</span>
                <HelpTooltip title="Liquidity Provider token representing your share in the pool. You receive LP tokens when you deposit SQD." />
              </Stack>
            </Typography>
            <Typography>
              <Stack direction="row" alignItems="center" spacing={0.5}>
                <span>{pool.lptTokenSymbol}</span>
                <Stack direction="row" alignItems="center">
                  <CopyToClipboard text={pool.lptToken} content="" showButton={true} />
                  <Tooltip title="Open in Explorer">
                    <IconButton
                      size="small"
                      color="inherit"
                      component={Link}
                      to={explorer.getAddressUrl(pool.lptToken)}
                    >
                      <ExplorerIcon fontSize="inherit" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Add to Wallet">
                    <IconButton size="small" color="inherit" onClick={handleAddTokenToWallet}>
                      <WalletIcon fontSize="inherit" />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </Stack>
            </Typography>
          </Stack>

          <Stack spacing={0.5}>
            <Typography variant="body2" color="text.secondary">
              Created
            </Typography>
            <Typography>{dateFormat(pool.createdAt, 'dateTime')}</Typography>
          </Stack>

          {pool.website && (
            <Stack spacing={0.5}>
              <Typography variant="body2" color="text.secondary">
                Website
              </Typography>
              <Typography>
                <a href={urlFormatter(pool.website)} target="_blank" rel="noreferrer">
                  {pool.website}
                </a>
              </Typography>
            </Stack>
          )}
        </Stack>

        <Box>{pool.description}</Box>
      </Stack>
    </Card>
  );
}
