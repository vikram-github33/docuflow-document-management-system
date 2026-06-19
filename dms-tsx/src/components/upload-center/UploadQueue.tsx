import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import { UploadQueueItem } from './UploadQueueItem';
import type { UploadFile } from '../../types/upload.types';

interface UploadQueueProps {
  files: UploadFile[];
  onRemove: (id: string) => void;
  onRetry: (id: string) => void;
  onClearCompleted: () => void;
  onClearAll: () => void;
}

export const UploadQueue: React.FC<UploadQueueProps> = ({
  files,
  onRemove,
  onRetry,
  onClearCompleted,
}) => {
  if (files.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
        No files yet — drop some above
      </Typography>
    );
  }

  const hasCompleted = files.some(
    (f) => f.status === 'success' || f.status === 'error' || f.status === 'cancelled'
  );

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
        <Typography variant="body2" fontWeight={500}>
          Upload queue{' '}
          <Typography component="span" variant="body2" color="text.secondary">
            ({files.length})
          </Typography>
        </Typography>
        {hasCompleted && (
          <Button
            size="small"
            startIcon={<DoneAllIcon sx={{ fontSize: 14 }} />}
            onClick={onClearCompleted}
            sx={{ fontSize: 12, py: 0.25, color: 'text.secondary' }}
          >
            Clear completed
          </Button>
        )}
      </Box>

      <Box>
        {files.map((file) => (
          <UploadQueueItem
            key={file.id}
            file={file}
            onRemove={onRemove}
            onRetry={onRetry}
          />
        ))}
      </Box>
    </Box>
  );
};
