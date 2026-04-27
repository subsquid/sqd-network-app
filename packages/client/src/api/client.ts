import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

const TOAST_DEDUP_WINDOW_MS = 3000;

const errorToastTimestamps = new Map<string, number>();

function toApiErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message.trim()) return error.message;
  if (typeof error === 'string' && error.trim()) return error;
  if (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof error.message === 'string' &&
    error.message.trim()
  ) {
    return error.message;
  }

  return 'API request failed. Please try again.';
}

function showApiErrorToast(error: unknown) {
  const message = toApiErrorMessage(error);

  // Suppress duplicate toasts for the same message within the dedup window
  // to avoid flooding the UI when multiple queries fail simultaneously.
  const now = Date.now();
  const lastShown = errorToastTimestamps.get(message);
  if (lastShown !== undefined && now - lastShown < TOAST_DEDUP_WINDOW_MS) return;
  errorToastTimestamps.set(message, now);

  toast.error(message);
}

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: error => {
      showApiErrorToast(error);
    },
  }),
  mutationCache: new MutationCache({
    onError: error => {
      showApiErrorToast(error);
    },
  }),
  defaultOptions: {
    queries: {
      networkMode: 'always',
    },
    mutations: {
      networkMode: 'always',
    },
  },
});
