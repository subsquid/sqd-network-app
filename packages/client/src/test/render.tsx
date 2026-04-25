import type { ReactElement, ReactNode } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { type RenderOptions, render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { type Config, WagmiProvider } from 'wagmi';

import { createUnitWagmiConfig } from './wagmi/testConfig';

export interface TestProvidersOptions {
  /** wagmi config to mount. Defaults to a fresh `createUnitWagmiConfig()`. */
  wagmiConfig?: Config;
  /** Initial router entries — defaults to ['/']. */
  initialEntries?: string[];
  /** Pre-instantiated QueryClient — useful when a spec needs to inspect cache. */
  queryClient?: QueryClient;
}

/**
 * Wrap children in the standard provider tree expected by app code.
 *
 * Only the providers that hooks/components depend on are mounted — no MUI
 * theme, no toaster — keep tests fast and free of unrelated setup. Specs that
 * render UI requiring the MUI theme can wrap manually or extend this helper.
 */
export function TestProviders({
  children,
  wagmiConfig,
  initialEntries = ['/'],
  queryClient,
}: TestProvidersOptions & { children: ReactNode }) {
  const config = wagmiConfig ?? createUnitWagmiConfig();
  const client =
    queryClient ??
    new QueryClient({
      defaultOptions: {
        queries: { retry: false, gcTime: 0, staleTime: 0 },
        mutations: { retry: false },
      },
    });

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={client}>
        <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

/** Drop-in replacement for RTL's `render` that wraps in `TestProviders`. */
export function renderWithProviders(
  ui: ReactElement,
  options: TestProvidersOptions & Omit<RenderOptions, 'wrapper'> = {},
) {
  const { wagmiConfig, initialEntries, queryClient, ...rest } = options;
  return render(ui, {
    wrapper: ({ children }) => (
      <TestProviders
        wagmiConfig={wagmiConfig}
        initialEntries={initialEntries}
        queryClient={queryClient}
      >
        {children}
      </TestProviders>
    ),
    ...rest,
  });
}
