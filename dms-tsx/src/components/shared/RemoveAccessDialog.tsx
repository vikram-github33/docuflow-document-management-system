import React from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Typography, Alert, CircularProgress,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import type { SharedWithMeItem } from '../../types/shared.types';

interface Props {
  item:      SharedWithMeItem | null;
  loading:   boolean;
  onConfirm: () => void;
  onCancel:  () => void;
}

export const RemoveAccessDialog: React.FC<Props> = ({ item, loading, onConfirm, onCancel }) => (
  <Dialog open={!!item} onClose={onCancel} maxWidth="xs" fullWidth
    PaperProps={{ sx: { borderRadius: 3 } }}>
    <DialogTitle sx={{ fontWeight: 600, fontSize: 16, display: 'flex', alignItems: 'center', gap: 1 }}>
      <CloseIcon sx={{ fontSize: 18, color: 'error.main' }} />
      Remove access
    </DialogTitle>
    <DialogContent sx={{ pt: '8px !important' }}>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Remove your access to{' '}
        <strong>{item?.document.fileName}</strong>
        {' '}shared by <strong>{item?.sharedBy.name}</strong>?
      </Typography>
      <Alert severity="warning" sx={{ fontSize: 12 }}>
        You will no longer be able to view or download this file.
      </Alert>
    </DialogContent>
    <DialogActions sx={{ px: 3, py: 2 }}>
      <Button onClick={onCancel} disabled={loading} sx={{ textTransform: 'none' }}>
        Cancel
      </Button>
      <Button
        variant="contained" color="error" onClick={onConfirm}
        disabled={loading} disableElevation
        startIcon={loading ? <CircularProgress size={14} color="inherit" /> : <CloseIcon sx={{ fontSize: 15 }} />}
        sx={{ textTransform: 'none' }}
      >
        {loading ? 'Removing...' : 'Remove access'}
      </Button>
    </DialogActions>
  </Dialog>
);
