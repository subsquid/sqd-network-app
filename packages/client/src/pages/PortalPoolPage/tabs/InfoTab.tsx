import { ReactNode, memo, useCallback } from 'react';

import { dateFormat } from '@i18n';
import {
  OpenInNewOutlined as ExplorerIcon,
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
import { useContracts } from '@hooks/network/useContracts';
import { useExplorer } from '@hooks/useExplorer';
import { addressFormatter, urlFormatter } from '@lib/formatters/formatters';

import { usePoolData } from '../hooks';

interface InfoTabProps {
  poolId: string;
}

interface AddressActionsProps {
  address: string;
  explorerUrl: string;
  onAddToWallet?: () => void;
}

function AddressActions({ address, explorerUrl, onAddToWallet }: AddressActionsProps) {
  return (
    <Stack direction="row" alignItems="center">
      <CopyToClipboard text={address} content="" showButton={true} />
      <Tooltip title="Open in Explorer">
        <IconButton
          size="small"
          color="inherit"
          aria-label="Open in Explorer"
          component={Link}
          to={explorerUrl}
          rel="noreferrer"
          target="_blank"
        >
          <ExplorerIcon fontSize="inherit" aria-hidden="true" />
        </IconButton>
      </Tooltip>
      {onAddToWallet && (
        <Tooltip title="Add to Wallet">
          <IconButton
            size="small"
            color="inherit"
            aria-label="Add to Wallet"
            onClick={onAddToWallet}
          >
            <WalletIcon fontSize="inherit" aria-hidden="true" />
          </IconButton>
        </Tooltip>
      )}
    </Stack>
  );
}

interface InfoFieldProps {
  label: string;
  value: ReactNode;
  tooltip?: ReactNode;
  actions?: ReactNode;
}

const InfoField = memo(function InfoField({ label, value, tooltip, actions }: InfoFieldProps) {
  const labelContent = tooltip ? (
    <Stack direction="row" alignItems="center" spacing={0.5}>
      <span>{label}</span>
      <HelpTooltip title={tooltip} />
    </Stack>
  ) : (
    label
  );

  const valueContent = actions ? (
    <Stack direction="row" alignItems="center" spacing={0.5}>
      <span>{value}</span>
      {actions}
    </Stack>
  ) : (
    value
  );

  return (
    <Stack spacing={0.5}>
      <Typography variant="body2" color="text.secondary">
        {labelContent}
      </Typography>
      <Typography>{valueContent}</Typography>
    </Stack>
  );
});

export function InfoTab({ poolId }: InfoTabProps) {
  const { SQD_TOKEN } = useContracts();
  const { data: pool } = usePoolData(poolId);
  const { watchAssetAsync } = useWatchAsset();
  const explorer = useExplorer();

  const handleAddTokenToWallet = useCallback(
    async (tokenType: 'lp' | 'reward') => {
      if (!pool) return;

      const tokenConfig =
        tokenType === 'lp'
          ? {
              address: pool.lptToken.address as `0x${string}`,
              symbol: pool.lptToken.symbol,
              decimals: pool.lptToken.decimals,
            }
          : {
              address: pool.rewardToken.address as `0x${string}`,
              symbol: pool.rewardToken.symbol,
              decimals: pool.rewardToken.decimals,
            };

      try {
        const result = await watchAssetAsync({
          type: 'ERC20',
          options: tokenConfig,
        });
        if (result) {
          toast.success('Token added to wallet');
        } else {
          toast.error('Failed to add token to wallet');
        }
      } catch (error) {
        toast.error(`Failed to add token to wallet: ${errorMessage(error)}`);
      }
    },
    [pool, watchAssetAsync],
  );

  if (!pool) return null;

  return (
    <Card sx={{}} title={<span>Pool Info</span>}>
      <Stack spacing={2} divider={<Divider />}>
        <Stack spacing={1.5}>
          <InfoField
            label="Contract"
            value={addressFormatter(pool.id, true)}
            actions={
              <AddressActions address={pool.id} explorerUrl={explorer.getAddressUrl(pool.id)} />
            }
          />

          <InfoField
            label="Operator"
            value={addressFormatter(pool.operator.address, true)}
            actions={
              <AddressActions
                address={pool.operator.address}
                explorerUrl={explorer.getAddressUrl(pool.operator.address)}
              />
            }
          />

          <InfoField
            label="LP-Token"
            value={pool.lptToken.symbol}
            tooltip={`Liquidity Provider token representing your share in the pool. You receive LP tokens when you provide ${SQD_TOKEN}.`}
            actions={
              <AddressActions
                address={pool.lptToken.address}
                explorerUrl={explorer.getAddressUrl(pool.lptToken.address)}
                onAddToWallet={() => handleAddTokenToWallet('lp')}
              />
            }
          />

          <InfoField
            label="Reward Token"
            value={pool.rewardToken.symbol}
            tooltip="The token used to distribute rewards to pool participants."
            actions={
              <AddressActions
                address={pool.rewardToken.address}
                explorerUrl={explorer.getAddressUrl(pool.rewardToken.address)}
                onAddToWallet={() => handleAddTokenToWallet('reward')}
              />
            }
          />

          <InfoField label="Created" value={dateFormat(pool.createdAt, 'dateTime') || '-'} />

          {pool.website && (
            <InfoField
              label="Website"
              value={
                <a href={urlFormatter(pool.website)} target="_blank" rel="noreferrer">
                  {pool.website}
                </a>
              }
            />
          )}
        </Stack>

        <Box>{pool.description || '-'}</Box>
      </Stack>
    </Card>
  );
}
