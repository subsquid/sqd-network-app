import { Divider, Stack, Typography } from '@mui/material';

import { Card } from '@components/Card';
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
          <Property label="Contract" value={addressFormatter(pool.id, true)} />
          <Property label="Operator" value={addressFormatter(pool.operator.address, true)} />
          <Property label="LP-Token" value={pool.lptTokenSymbol} />
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
