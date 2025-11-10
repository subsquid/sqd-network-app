import React from 'react';

import { addressFormatter, tokenFormatter } from '@lib/formatters/formatters';
import { fromSqd } from '@lib/network';
import {
  Box,
  Stack,
  styled,
  useMediaQuery,
  useTheme,
  SxProps,
  Theme,
  Tooltip,
} from '@mui/material';

import { AccountType, SourceWalletWithBalance } from '@api/subsquid-network-squid';
import { useContracts } from '@network/useContracts';

export interface SourceWalletOptionProps {
  /** The source wallet data */
  source: SourceWalletWithBalance;
  /** Custom styles for the wrapper */
  sx?: SxProps<Theme>;
  /** Custom styles for the label */
  labelSx?: SxProps<Theme>;
  /** Custom styles for the address */
  addressSx?: SxProps<Theme>;
  /** Custom styles for the balance */
  balanceSx?: SxProps<Theme>;
  /** Whether to show the full address on hover */
  showFullAddressOnHover?: boolean;
  /** Custom label for wallet type */
  walletLabel?: string;
  /** Custom label for vesting contract type */
  vestingLabel?: string;
  /** Custom label for temporary holding contract type */
  temporaryHoldingLabel?: string;
  /** Custom component to render the address */
  addressComponent?: React.ComponentType<{ address: string; isMobile: boolean }>;
  /** Custom component to render the balance */
  balanceComponent?: React.ComponentType<{ balance: string; token: string }>;
}

const SourceWalletOptionWrapper = styled(Box, {
  name: 'SourceWalletOptionWrapper',
})(() => ({
  fontSize: '0.875rem',
  width: '100%',
}));

const SourceWalletLabel = styled(Box, {
  name: 'SourceWalletLabel',
})(({ theme }) => ({
  lineHeight: 1.2,
  fontSize: '0.8rem',
  marginTop: theme.spacing(0.5),
}));

const SourceWalletStack = styled(Stack, {
  name: 'SourceWalletStack',
})(() => ({
  width: '100%',
}));

const SourceWalletBalance = styled(Stack, {
  name: 'SourceWalletBalance',
})(({ theme }) => ({
  color: theme.palette.text.secondary,
  textAlign: 'right',
}));

export const SourceWalletOption = ({
  source,
  sx,
  labelSx,
  addressSx,
  balanceSx,
  showFullAddressOnHover = false,
  walletLabel = 'Wallet',
  vestingLabel = 'Vesting contract',
  temporaryHoldingLabel = 'Temporary Holding contract',
  addressComponent: AddressComponent,
  balanceComponent: BalanceComponent,
}: SourceWalletOptionProps) => {
  const { SQD_TOKEN } = useContracts();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const formattedAddress = addressFormatter(source.id, isMobile);
  const formattedBalance = tokenFormatter(fromSqd(source?.balance), SQD_TOKEN);

  const renderAddress = () => {
    if (AddressComponent) {
      return <AddressComponent address={source.id} isMobile={isMobile} />;
    }

    const addressElement = <Box sx={addressSx}>{formattedAddress}</Box>;

    return showFullAddressOnHover ? (
      <Tooltip title={source.id} placement="top">
        {addressElement}
      </Tooltip>
    ) : (
      addressElement
    );
  };

  const renderBalance = () => {
    if (BalanceComponent) {
      return <BalanceComponent balance={source.balance} token={SQD_TOKEN} />;
    }

    return <SourceWalletBalance sx={balanceSx}>{formattedBalance}</SourceWalletBalance>;
  };

  return (
    <SourceWalletOptionWrapper sx={sx}>
      <SourceWalletLabel sx={labelSx}>
        {source.type === AccountType.User
          ? walletLabel
          : `${source.type
              .split('_')
              .map(word => word[0]?.toUpperCase() + word.slice(1).toLowerCase())
              .join(' ')} contract`}
      </SourceWalletLabel>
      <SourceWalletStack direction="row" spacing={1} justifyContent="space-between">
        {renderAddress()}
        {renderBalance()}
      </SourceWalletStack>
    </SourceWalletOptionWrapper>
  );
};
