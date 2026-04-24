import { useEffect, useRef } from 'react';

import { useConnect } from 'wagmi';

/**
 * When the app is running with a mock wagmi config (MOCK_WALLET_ADDRESS set),
 * this component triggers an automatic connection to the mock connector on
 * first render so that the rest of the UI sees a pre-connected wallet without
 * any user interaction.
 *
 * The mock connector's `defaultConnected: true` flag initialises the internal
 * state, but wagmi still requires an explicit `connect()` call to broadcast
 * the connection to subscribers.  This component bridges that gap.
 *
 * It is a no-op in production builds (MOCK_WALLET_ADDRESS is always empty).
 */
export function MockWalletAutoConnect() {
  const { connect, connectors } = useConnect();
  const connected = useRef(false);

  useEffect(() => {
    if (connected.current) return;
    const mockConnector = connectors.find(c => c.id === 'mock');
    if (!mockConnector) return;
    connected.current = true;
    connect({ connector: mockConnector });
  }, [connect, connectors]);

  return null;
}
