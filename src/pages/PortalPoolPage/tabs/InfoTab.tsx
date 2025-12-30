import { Divider, Stack, Typography } from '@mui/material';

import { Card } from '@components/Card';
import { HelpTooltip } from '@components/HelpTooltip';
import { Property, PropertyList } from '@components/Property';
import { dateFormat } from '@i18n';
import { addressFormatter, urlFormatter } from '@lib/formatters/formatters';

import { usePoolData } from '../hooks';

interface InfoTabProps {
  poolId: string;
}

export function InfoTab({ poolId }: InfoTabProps) {
  const { data: pool } = usePoolData(poolId);

  if (!pool) return null;
  return (
    <Card sx={{ height: '100%', overflowY: 'auto', overflowX: 'hidden' }}>
      <Stack divider={<Divider />} spacing={2} pb={2}>
        <PropertyList>
          <Property
            label="Contract"
            value={
              <a
                href={`https://arbiscan.io/address/${pool.id}`}
                target="_blank"
                rel="noreferrer"
                style={{
                  color: 'inherit',
                  textDecoration: 'underline',
                }}
              >
                {addressFormatter(pool.id, true)}
              </a>
            }
          />
          <Property
            label="Operator"
            value={
              <a
                href={`https://arbiscan.io/address/${pool.operator.address}`}
                target="_blank"
                rel="noreferrer"
                style={{
                  color: 'inherit',
                  textDecoration: 'underline',
                }}
              >
                {addressFormatter(pool.operator.address, true)}
              </a>
            }
          />
          <Property
            label={
              <Stack direction="row" alignItems="center" spacing={0.5}>
                <span>LP-Token</span>
                <HelpTooltip title="Liquidity Provider token representing your share in the pool. You receive LP tokens when you deposit SQD." />
              </Stack>
            }
            value={pool.lptTokenSymbol}
          />
          <Property
            label="Created"
            value={dateFormat(new Date('2025-12-16T12:00:00Z'), 'dateTime')}
          />
          {pool.website && (
            <Property
              label="Website"
              value={
                <a href={urlFormatter(pool.website)} target="_blank" rel="noreferrer">
                  {pool.website}
                </a>
              }
            />
          )}
        </PropertyList>
        {pool.description ? (
          <Typography sx={{ overflowWrap: 'anywhere' }}>{pool.description}</Typography>
        ) : (
          <Typography>-</Typography>
        )}
      </Stack>
    </Card>
  );
}
