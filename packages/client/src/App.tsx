import { useMemo } from 'react';

import { CssBaseline, ThemeProvider } from '@mui/material';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { WagmiProvider } from 'wagmi';

import { queryClient } from '@api/client';
import { Toaster } from '@components/Toaster';
import { getChain, getSubsquidNetwork } from '@hooks/network/useSubsquidNetwork';
import { SquidHeightProvider } from '@hooks/useSquidNetworkHeightHooks';
import { TickerProvider } from '@hooks/useTicker';

import { AppRoutes } from './AppRoutes';
import { createAppWagmiConfig } from './config';
import { useCreateRainbowKitTheme, useCreateTheme, useThemeState } from './theme';

/**
 * Build the wagmi config once per app boot. `createAppWagmiConfig` reads
 * `isMockMode` (a build-time flag from `process.env.MOCK`) internally and
 * adds a "Mock Personas" wallet group to the RainbowKit modal in mock mode.
 */
function useAppWagmiConfig() {
  return useMemo(
    () =>
      createAppWagmiConfig({
        network: getSubsquidNetwork(),
        walletConnectProjectId: process.env.WALLET_CONNECT_PROJECT_ID,
      }),
    [],
  );
}

function App() {
  const [themeName] = useThemeState();
  const theme = useCreateTheme(themeName);
  const rainbowkitTheme = useCreateRainbowKitTheme(themeName);
  const wagmiConfig = useAppWagmiConfig();

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider modalSize="compact" theme={rainbowkitTheme} initialChain={getChain()}>
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
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;
