import React from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Typography, Alert, CircularProgress,
} from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  confirmColor?: 'error' | 'primary' | 'warning';
  severity?: 'error' | 'warning' | 'info';
  warningText?: string;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open, title, message, confirmLabel,
  confirmColor = 'error', severity = 'warning',
  warningText, loading = false,
  onConfirm, onCancel,
}) => (
  <Dialog open={open} onClose={onCancel} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
    <DialogTitle sx={{ fontWeight: 600, fontSize: 16, pb: 1 }}>
      {title}
    </DialogTitle>
    <DialogContent>
      <Typography variant="body2" color="text.secondary" sx={{ mb: warningText ? 2 : 0 }}>
        {message}
      </Typography>
      {warningText && (
        <Alert severity={severity} icon={<WarningAmberIcon fontSize="small" />} sx={{ fontSize: 12 }}>
          {warningText}
        </Alert>
      )}
    </DialogContent>
    <DialogActions sx={{ px: 3, py: 2 }}>
      <Button onClick={onCancel} disabled={loading} sx={{ textTransform: 'none' }}>
        Cancel
      </Button>
      <Button
        variant="contained"
        color={confirmColor}
        onClick={onConfirm}
        disabled={loading}
        disableElevation
        startIcon={loading ? <CircularProgress size={14} color="inherit" /> : undefined}
        sx={{ textTransform: 'none' }}
      >
        {loading ? 'Processing...' : confirmLabel}
      </Button>
    </DialogActions>
  </Dialog>
);
