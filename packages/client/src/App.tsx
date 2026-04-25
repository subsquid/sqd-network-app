import { useMemo } from 'react';

import { CssBaseline, ThemeProvider } from '@mui/material';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { WagmiProvider } from 'wagmi';

import { queryClient } from '@api/client';
import { MockWalletAutoConnect } from '@components/MockWalletAutoConnect';
import { Toaster } from '@components/Toaster';
import { getChain, getSubsquidNetwork } from '@hooks/network/useSubsquidNetwork';
import { SquidHeightProvider } from '@hooks/useSquidNetworkHeightHooks';
import { TickerProvider } from '@hooks/useTicker';

import { AppRoutes } from './AppRoutes';
import { MOCK_RPC_URL, createAppWagmiConfig, isMockMode } from './config';
import { useCreateRainbowKitTheme, useCreateTheme, useThemeState } from './theme';

/**
 * App-level wagmi config: built once on first render so reading a fresh
 * `getMockAccountIndex()` value during reload-driven account switching still
 * works (the read happens inside `createAppWagmiConfig`). Once Phase 10 lands
 * the reload flow goes away and this stays correct because env-derived inputs
 * don't change between renders.
 */
function useAppWagmiConfig() {
  return useMemo(
    () =>
      createAppWagmiConfig({
        mode: isMockMode ? 'mock' : 'live',
        network: getSubsquidNetwork(),
        walletConnectProjectId: process.env.WALLET_CONNECT_PROJECT_ID,
        mockRpcUrl: MOCK_RPC_URL,
      }),
    [],
  );
}

function App() {
  const [themeName] = useThemeState();
  const theme = useCreateTheme(themeName);
  const rainbowkitTheme = useCreateRainbowKitTheme(themeName);
  const wagmiConfig = useAppWagmiConfig();

  const inner = (
    <ThemeProvider theme={theme}>
      <TickerProvider>
        <SquidHeightProvider>
          <CssBaseline />
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </SquidHeightProvider>
      </TickerProvider>
      <Toaster />
    </ThemeProvider>
  );

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        {isMockMode ? (
          <>
            <MockWalletAutoConnect />
            {inner}
          </>
        ) : (
          <RainbowKitProvider modalSize="compact" theme={rainbowkitTheme} initialChain={getChain()}>
            {inner}
          </RainbowKitProvider>
        )}
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;
