import { CssBaseline, ThemeProvider } from '@mui/material';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { WagmiProvider } from 'wagmi';

import { queryClient } from '@api/client';
import { MockWalletAutoConnect } from '@components/MockWalletAutoConnect';
import { Toaster } from '@components/Toaster';
import { getChain } from '@hooks/network/useSubsquidNetwork';
import { SquidHeightProvider } from '@hooks/useSquidNetworkHeightHooks';
import { TickerProvider } from '@hooks/useTicker';

import { AppRoutes } from './AppRoutes';
import { mockConfig, rainbowConfig } from './config';
import { useCreateRainbowKitTheme, useCreateTheme, useThemeState } from './theme';

function App() {
  const [themeName] = useThemeState();
  const theme = useCreateTheme(themeName);
  const rainbowkitTheme = useCreateRainbowKitTheme(themeName);

  if (mockConfig) {
    return (
      <WagmiProvider config={mockConfig}>
        <QueryClientProvider client={queryClient}>
          <MockWalletAutoConnect />
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
        </QueryClientProvider>
      </WagmiProvider>
    );
  }

  return (
    <>
      <WagmiProvider config={rainbowConfig}>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider theme={theme}>
            <RainbowKitProvider
              modalSize="compact"
              theme={rainbowkitTheme}
              initialChain={getChain()}
            >
              <TickerProvider>
                <SquidHeightProvider>
                  <CssBaseline />
                  <BrowserRouter>
                    <AppRoutes />
                  </BrowserRouter>
                </SquidHeightProvider>
              </TickerProvider>
              {/* </SnackbarProvider> */}
            </RainbowKitProvider>
            <Toaster />
          </ThemeProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </>
  );
}

export default App;
