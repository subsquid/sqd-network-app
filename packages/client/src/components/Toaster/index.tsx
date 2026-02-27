import { Report } from '@mui/icons-material';
import { Alert, AlertColor, Box, CircularProgress, Typography } from '@mui/material';
import toast, { Toast, Toaster as Toaster_ } from 'react-hot-toast';

interface ToastConfig {
  color: AlertColor;
  icon?: React.ReactNode;
}

export const Toaster = () => {
  const getToastConfig = (type: string): ToastConfig => {
    switch (type) {
      case 'error':
        return { color: 'error', icon: <Report color="error" /> };
      case 'success':
        return { color: 'success' };
      case 'loading':
        return {
          color: 'info',
          icon: (
            <Box display="flex" alignItems="center">
              <CircularProgress size={20} color="info" />
            </Box>
          ),
        };
      default:
        return { color: 'info' };
    }
  };

  const handleClose = (t: Toast) => {
    t.onClose?.();
    toast.remove(t.id);
  };

  return (
    <Toaster_
      position="bottom-right"
      gutter={8}
      toastOptions={{ duration: 2000 }}
      reverseOrder={true}
    >
      {(t: Toast) => {
        const content = typeof t.message === 'function' ? t.message(t) : t.message;
        const { color, icon } = getToastConfig(t.type);

        return (
          <Alert hidden={!t.visible} icon={icon} color={color} onClose={() => handleClose(t)}>
            <Typography>{content}</Typography>
          </Alert>
        );
      }}
    </Toaster_>
  );
};
