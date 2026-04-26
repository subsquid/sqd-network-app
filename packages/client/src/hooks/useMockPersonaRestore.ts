/**
 * Restores the last-used mock persona after a page reload.
 *
 * Root cause: wagmi's built-in `reconnect()` calls `connector.connect({
 * isReconnecting: true })`. The wagmi `mock()` connector only accepts this
 * when `provider.connected === true`, but `provider.connected` resets to
 * `defaultConnected` (= `false`) on every page load — so all reconnect
 * attempts throw `ConnectorNotConnectedError` and the user ends up logged
 * out.
 *
 * Fix: once wagmi reaches status 'disconnected' (reconnect attempts
 * exhausted), read the persona ID saved by `mockPersonaWallet`'s `connect`
 * override, find the matching connector, and call `connect()` directly.
 *
 * No-op in non-mock (production) builds.
 */
import { useEffect, useRef } from 'react';

import { useAccount, useConfig, useConnect } from 'wagmi';

import { MOCK_PERSONA_STORAGE_KEY, isMockMode } from '../config';

export function useMockPersonaRestore(): void {
  const config = useConfig();
  const { status } = useAccount();
  const { connect } = useConnect();
  // Guard: attempt only once per mount, regardless of how often status changes.
  const attempted = useRef(false);

  useEffect(() => {
    if (!isMockMode) return;
    if (attempted.current) return;

    if (status === 'connecting' || status === 'reconnecting') return;

    // 'connected' means wagmi's own reconnect worked; nothing to do.
    if (status === 'connected') {
      attempted.current = true;
      return;
    }

    // 'disconnected': wagmi gave up — restore from localStorage.
    attempted.current = true;
    const storedId = localStorage.getItem(MOCK_PERSONA_STORAGE_KEY);
    if (!storedId) return;

    const connector = config.connectors.find(c => c.id === storedId);
    if (connector) {
      connect({ connector });
    }
  }, [status, config, connect]);
}
