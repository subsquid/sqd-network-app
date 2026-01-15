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
import { useContracts } from '@network/useContracts';

import { usePoolData } from '../hooks';
import { INFO_TEXTS } from '../texts';

interface InfoTabProps {
  poolId: string;
}

export function InfoTab({ poolId }: InfoTabProps) {
  const { SQD_TOKEN } = useContracts();
  const { data: pool } = usePoolData(poolId);
  const { watchAssetAsync } = useWatchAsset();
  const explorer = useExplorer();

  const handleAddTokenToWallet = useCallback(async () => {
    if (!pool) return;

    try {
      const result = await watchAssetAsync({
        type: 'ERC20',
        options: {
          address: pool.lptToken.address as `0x${string}`,
          symbol: pool.lptToken.symbol,
          decimals: pool.lptToken.decimals,
        },
      });
      if (result) {
        toast.success(INFO_TEXTS.notifications.tokenAddedSuccess);
      } else {
        toast.error(INFO_TEXTS.notifications.tokenAddedError);
      }
    } catch (error) {
      toast.error(INFO_TEXTS.notifications.tokenAddedErrorWithReason(errorMessage(error)));
    }
  }, [pool, watchAssetAsync]);

  if (!pool) return null;
  return (
    <Card sx={{}} title={<span>{INFO_TEXTS.title}</span>}>
      <Stack spacing={2} divider={<Divider />}>
        <Stack spacing={1.5}>
          <Stack spacing={0.5}>
            <Typography variant="body2" color="text.secondary">
              {INFO_TEXTS.contract}
            </Typography>
            <Typography>
              <Stack direction="row" alignItems="center" spacing={0.5}>
                <span>{addressFormatter(pool.id, true)}</span>
                <Stack direction="row" alignItems="center">
                  <CopyToClipboard text={pool.id} content="" showButton={true} />
                  <Tooltip title={INFO_TEXTS.actions.openInExplorer}>
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
              {INFO_TEXTS.operator}
            </Typography>
            <Typography>
              <Stack direction="row" alignItems="center" spacing={0.5}>
                <span>{addressFormatter(pool.operator.address, true)}</span>
                <Stack direction="row" alignItems="center">
                  <CopyToClipboard text={pool.operator.address} content="" showButton={true} />
                  <Tooltip title={INFO_TEXTS.actions.openInExplorer}>
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
                <span>{INFO_TEXTS.lpToken.label}</span>
                <HelpTooltip title={INFO_TEXTS.lpToken.tooltip(SQD_TOKEN)} />
              </Stack>
            </Typography>
            <Typography>
              <Stack direction="row" alignItems="center" spacing={0.5}>
                <span>{pool.lptToken.symbol}</span>
                <Stack direction="row" alignItems="center">
                  <CopyToClipboard text={pool.lptToken.address} content="" showButton={true} />
                  <Tooltip title={INFO_TEXTS.actions.openInExplorer}>
                    <IconButton
                      size="small"
                      color="inherit"
                      component={Link}
                      to={explorer.getAddressUrl(pool.lptToken.address)}
                    >
                      <ExplorerIcon fontSize="inherit" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title={INFO_TEXTS.actions.addToWallet}>
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
              {INFO_TEXTS.created}
            </Typography>
            <Typography>{dateFormat(pool.createdAt, 'dateTime')}</Typography>
          </Stack>

          {pool.website && (
            <Stack spacing={0.5}>
              <Typography variant="body2" color="text.secondary">
                {INFO_TEXTS.website}
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
