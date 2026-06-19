import React from 'react';
import { Snackbar, Alert, Stack } from '@mui/material';
import { TOAST_DURATION_MS } from '../../constants/upload.constants';

export interface ToastMessage {
  id: string;
  message: string;
  severity: 'success' | 'error' | 'info' | 'warning';
}

interface UploadToastStackProps {
  toasts: ToastMessage[];
  onClose: (id: string) => void;
}

export const UploadToastStack: React.FC<UploadToastStackProps> = ({ toasts, onClose }) => (
  <Stack
    spacing={1}
    sx={{ position: 'fixed', bottom: 24, right: 24, zIndex: 1400, maxWidth: 360 }}
  >
    {toasts.map((toast) => (
      <Snackbar
        key={toast.id}
        open
        autoHideDuration={TOAST_DURATION_MS}
        onClose={() => onClose(toast.id)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        sx={{ position: 'relative', mt: 0 }}
      >
        <Alert
          onClose={() => onClose(toast.id)}
          severity={toast.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    ))}
  </Stack>
);
