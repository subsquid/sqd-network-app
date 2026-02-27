import {
  Toast as OriginalToast,
  ToastOptions as OriginalToastOptions,
  toast as originalToast,
} from 'react-hot-toast';

declare module 'react-hot-toast' {
  interface Toast extends OriginalToast {
    onClose?: () => void;
  }

  interface ToastOptions extends OriginalToastOptions {
    onClose?: () => void;
  }

  export const toast: typeof originalToast & {
    (message: string, options?: ToastOptions): Toast;
    loading(message: string, options?: ToastOptions): Toast;
    success(message: string, options?: ToastOptions): Toast;
    error(message: string, options?: ToastOptions): Toast;
  };
}
