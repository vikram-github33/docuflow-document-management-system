import React, { useState, useCallback } from 'react';
import { Box, Container, Grid, Paper, Typography } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { UploadDropZone } from '../components/upload-center/UploadDropZone';
import { UploadSettingsPanel } from '../components/upload-center/UploadSettingsPanel';
import { UploadQueue } from '../components/upload-center/UploadQueue';
import { UploadKPIRow } from '../components/upload-center/UploadKPIRow';
import { S3FlowDiagram } from '../components/upload-center/S3FlowDiagram';
import { UploadToastStack, type ToastMessage } from '../components/upload-center/UploadToastStack';
import { useUploadQueue } from '../hooks/useUploadQueue';
import { computeKPIStats, generateUploadId } from '../utils/upload.utils';
import type { UploadSettings } from '../types/upload.types';

const defaultSettings: UploadSettings = {
  folderId: null,
  tags: [],
  description: '',
  overwriteExisting: false,
  notifyOnComplete: false,
};

export const UploadCenterPage: React.FC = () => {
  const {
    files,
    addFiles,
    removeFile,
    retryFile,
    clearCompleted,
    clearAll,
    startPending,
    isProcessing,
  } = useUploadQueue();

  const [settings, setSettings] = useState<UploadSettings>(defaultSettings);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const pushToast = useCallback((message: string, severity: ToastMessage['severity'] = 'info') => {
    setToasts((prev) => [
      ...prev.slice(-4),
      { id: generateUploadId(), message, severity },
    ]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const handleFilesSelected = useCallback(
    (selected: File[]) => {
      if (!selected.length) return;
      addFiles(selected, settings);
      pushToast(`${selected.length} file(s) added to queue.`, 'info');
    },
    [addFiles, settings, pushToast]
  );

  const handleStartUpload = useCallback(() => {
    const pendingCount = files.filter((f) => f.status === 'pending').length;
    if (!pendingCount) return;
    startPending();
    pushToast(`Starting upload for ${pendingCount} file(s)...`, 'info');
  }, [files, startPending, pushToast]);

  const stats = computeKPIStats(files);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50', py: 4 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 3 }}>
          <CloudUploadIcon sx={{ fontSize: 28, color: 'primary.main' }} />
          <Box>
            <Typography variant="h6" fontWeight={500} lineHeight={1.2}>
              Upload Center
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Secure document uploads via AWS S3 presigned URLs
            </Typography>
          </Box>
        </Box>

        {/* KPI row — appears once files are added */}
        {files.length > 0 && (
          <Box sx={{ mb: 2.5 }}>
            <UploadKPIRow stats={stats} />
          </Box>
        )}

        <Grid container spacing={2}>
          {/* Left: drop zone + queue */}
          <Grid item xs={12} md={8}>
            <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 3, mb: 2 }}>
              <UploadDropZone onFilesSelected={handleFilesSelected} disabled={isProcessing} />
            </Paper>

            <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 3 }}>
              <UploadQueue
                files={files}
                onRemove={removeFile}
                onRetry={retryFile}
                onClearCompleted={clearCompleted}
                onClearAll={clearAll}
              />
            </Paper>
          </Grid>

          {/* Right: settings + S3 flow */}
          <Grid item xs={12} md={4}>
            <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 3, mb: 2 }}>
              <UploadSettingsPanel
                settings={settings}
                onChange={setSettings}
                onStartUpload={handleStartUpload}
                hasFiles={files.some((f) => f.status === 'pending')}
                isProcessing={isProcessing}
              />
            </Paper>

            <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 3 }}>
              <S3FlowDiagram />
            </Paper>
          </Grid>
        </Grid>
      </Container>

      <UploadToastStack toasts={toasts} onClose={removeToast} />
    </Box>
  );
};
