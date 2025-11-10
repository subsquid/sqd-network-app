import { info } from '@logger';
import * as Sentry from '@sentry/react';
import BigNumber from 'bignumber.js';
import { createRoot } from 'react-dom/client';
import { useNavigate } from 'react-router-dom';
import { useDisconnect } from 'wagmi';

import { queryClient } from '@api/client';

import App from './App';

BigNumber.set({ ROUNDING_MODE: 3, DECIMAL_PLACES: 18 });

declare global {
  interface process {
    env: {
      APP_VERSION: string;
      DOCS_API_URL: string;
      DISABLE_DEMO_FEATURES: string;

      NETWORK: string;
      SQUID_API_URL: string;
      WALLET_CONNECT_PROJECT_ID: string;
      BLOCK_CHAIN_NODE_ADDRESS: string;
      SQD_CONTRACT_ADDRESS: string;
      WORKER_REGISTRATION_CONTRACT_ADDRESS: string;
      STAKING_REGISTRATION_CONTRACT_ADDRESS: string;
    };
  }

  interface Window {
    gtag(event: string, action: string, params?: Record<string, string>): void;
  }
}

info(`
----------------
SQD Network App v.${process.env.APP_VERSION}
----------------
`);

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const container = document.getElementById('root')!;
const loader = document.getElementById('loader');

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function hideLoader(delay = 100) {
  loader?.classList.remove('visible');
  await sleep(delay);
  loader?.classList.remove('show');
}

export async function appShowLoader() {
  loader?.classList.add('show');
  await sleep(1);
  loader?.classList.add('visible');
}

if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.APP_ENV,
    integrations: [Sentry.browserTracingIntegration()],
    ignoreErrors: [
      // Random plugins/extensions
      'top.GLOBALS',
      // See: http://blog.errorception.com/2012/03/tale-of-unfindable-js-error.html
      'originalCreateNotification',
      'canvas.contentDocument',
      'wallet must has at least one account',
    ],
    beforeSend(event) {
      if (
        (event.extra?.__serialized__ as Error)?.message === 'wallet must has at least one account'
      ) {
        return null;
      }
      return event;
    },
    denyUrls: [
      // Extensions
      /extensions\//i,
      /^chrome:\/\//i,
      /^chrome-extension:\/\//i,
      /^moz-extension:\/\//i,
    ],
    tracesSampleRate: 1.0,
    sendDefaultPii: false,
  });
}

export function useAppReload({ delay = 500, to }: { delay?: number; to?: string } = {}) {
  const navigate = useNavigate();
  const { disconnectAsync } = useDisconnect();

  return async () => {
    await appShowLoader();
    await sleep(delay);

    root.unmount();

    await disconnectAsync();
    queryClient.clear();
    if (to) {
      navigate(to);
    }

    root = createRoot(container);
    root.render(<App />);

    await hideLoader();
  };
}

let root = createRoot(container);
root.render(<App />);
// hideLoader(0);
