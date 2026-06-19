import React from 'react';
import { Box, Typography, LinearProgress, IconButton, Tooltip } from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ReplayIcon from '@mui/icons-material/Replay';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import ImageIcon from '@mui/icons-material/Image';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import TableChartIcon from '@mui/icons-material/TableChart';
import type { UploadFile } from '../../types/upload.types';
import { formatFileSize, truncateFileName } from '../../utils/upload.utils';

interface UploadQueueItemProps {
  file: UploadFile;
  onRemove: (id: string) => void;
  onRetry: (id: string) => void;
}

function FileTypeIcon({ mimeType }: { mimeType: string }) {
  const base = { fontSize: 20 } as const;
  if (mimeType === 'application/pdf') return <PictureAsPdfIcon sx={{ ...base, color: '#d32f2f' }} />;
  if (mimeType.startsWith('image/')) return <ImageIcon sx={{ ...base, color: '#1976d2' }} />;
  if (mimeType.includes('sheet') || mimeType.includes('csv')) return <TableChartIcon sx={{ ...base, color: '#2e7d32' }} />;
  return <InsertDriveFileIcon sx={{ ...base, color: 'text.secondary' }} />;
}

const STATUS_CONFIG: Record<string, { label: string; bg: string; color: string }> = {
  pending:    { label: 'Pending',     bg: '#E6F1FB', color: '#0C447C' },
  initiating: { label: 'Preparing',  bg: '#FAEEDA', color: '#633806' },
  uploading:  { label: '',            bg: '#FAEEDA', color: '#633806' },
  confirming: { label: 'Confirming', bg: '#FAEEDA', color: '#633806' },
  success:    { label: '✓ Done',     bg: '#EAF3DE', color: '#27500A' },
  error:      { label: '✗ Failed',   bg: '#FCEBEB', color: '#791F1F' },
  cancelled:  { label: 'Cancelled',  bg: '#F1EFE8', color: '#444441' },
};

export const UploadQueueItem: React.FC<UploadQueueItemProps> = ({ file, onRemove, onRetry }) => {
  const isActive = file.status === 'uploading' || file.status === 'initiating' || file.status === 'confirming';
  const cfg = STATUS_CONFIG[file.status] ?? STATUS_CONFIG.pending;
  const label = file.status === 'uploading' ? `Uploading ${Math.round(file.progress)}%` : cfg.label;

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 1.25,
        py: 1,
        borderBottom: '1px solid',
        borderColor: 'divider',
        '&:last-child': { borderBottom: 'none', pb: 0 },
      }}
    >
      <Box sx={{ mt: 0.25, flexShrink: 0 }}>
        <FileTypeIcon mimeType={file.mimeType} />
      </Box>

      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography variant="body2" fontWeight={500} noWrap title={file.name}>
          {truncateFileName(file.name)}
        </Typography>

        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mt: 0.25 }}>
          <Typography variant="caption" color="text.secondary">
            {formatFileSize(file.size)}
          </Typography>
          <Box
            component="span"
            sx={{
              fontSize: 10,
              fontWeight: 500,
              px: 0.75,
              py: '1px',
              borderRadius: '10px',
              bgcolor: cfg.bg,
              color: cfg.color,
            }}
          >
            {label}
          </Box>
        </Box>

        {(isActive || file.status === 'success') && (
          <LinearProgress
            variant="determinate"
            value={file.status === 'success' ? 100 : file.progress}
            sx={{
              mt: 0.75,
              height: 3,
              borderRadius: 1,
              bgcolor: 'grey.200',
              '& .MuiLinearProgress-bar': {
                bgcolor: file.status === 'success' ? '#639922' : 'primary.main',
              },
            }}
          />
        )}

        {file.errorMessage && (
          <Typography variant="caption" color="error" display="block" sx={{ mt: 0.5 }}>
            {file.errorMessage}
          </Typography>
        )}
      </Box>

      <Box sx={{ display: 'flex', gap: 0.25, flexShrink: 0 }}>
        {file.status === 'error' && (
          <Tooltip title="Retry">
            <IconButton size="small" onClick={() => onRetry(file.id)}>
              <ReplayIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Tooltip>
        )}
        <Tooltip title="Remove">
          <span>
            <IconButton size="small" onClick={() => onRemove(file.id)} disabled={isActive}>
              <DeleteOutlineIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </span>
        </Tooltip>
      </Box>
    </Box>
  );
};
