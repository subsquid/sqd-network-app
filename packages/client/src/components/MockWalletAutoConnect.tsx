import { useEffect, useRef } from 'react';

import { useConnect } from 'wagmi';

import { getMockAccountIndex } from '../config';

/**
 * When the app is running in mock mode AND the user has previously selected
 * an account (stored in sessionStorage by MockConnectDialog), this component
 * triggers an automatic re-connection to the mock connector on first render.
 *
 * Context: wagmi's mock connector with `defaultConnected: true` initialises
 * its internal state as connected, but doesn't broadcast the connection to
 * React subscribers until `connect()` is called explicitly.  This component
 * bridges that gap after a page reload.
 *
 * If no account has been selected yet (getMockAccountIndex() returns -1),
 * this is a no-op and the user sees the Connect Wallet button.
 */
export function MockWalletAutoConnect() {
  const { connect, connectors } = useConnect();
  const triggered = useRef(false);

  useEffect(() => {
    if (triggered.current) return;
    const hasSelection = getMockAccountIndex() >= 0;
    if (!hasSelection) return;

    const mockConnector = connectors.find(c => c.id === 'mock');
    if (!mockConnector) return;

    triggered.current = true;
    connect({ connector: mockConnector });
  }, [connect, connectors]);

  return null;
}
