import React, { useCallback, useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import { ALLOWED_EXTENSIONS, MAX_FILE_SIZE_BYTES } from '../../constants/upload.constants';
import { formatFileSize } from '../../utils/upload.utils';

interface UploadDropZoneProps {
  onFilesSelected: (files: File[]) => void;
  disabled?: boolean;
}

export const UploadDropZone: React.FC<UploadDropZoneProps> = ({ onFilesSelected, disabled = false }) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!disabled) setIsDragOver(true);
  }, [disabled]);

  const handleDragLeave = useCallback(() => setIsDragOver(false), []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (disabled) return;
    const dropped = Array.from(e.dataTransfer.files);
    if (dropped.length > 0) onFilesSelected(dropped);
  }, [disabled, onFilesSelected]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files ?? []);
    console.log("selected",selected)
    if (selected.length > 0) onFilesSelected(selected);
    e.target.value = '';
  }, [onFilesSelected]);

  return (
    <Box
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      sx={{
        border: '1.5px dashed',
        borderColor: isDragOver ? 'primary.main' : 'divider',
        borderRadius: 3,
        p: 5,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 1.5,
        bgcolor: isDragOver ? 'action.hover' : 'background.paper',
        cursor: disabled ? 'not-allowed' : 'default',
        transition: 'all 0.15s ease',
        opacity: disabled ? 0.5 : 1,
        minHeight: 180,
      }}
    >
      <input
        type="file"
        id="dms-file-input"
        multiple
        hidden
        disabled={disabled}
        accept={ALLOWED_EXTENSIONS.join(',')}
        onChange={handleChange}
      />

      <CloudUploadIcon sx={{ fontSize: 40, color: 'text.secondary' }} />

      <Typography variant="subtitle1" fontWeight={500}>
        {isDragOver ? 'Drop files here' : 'Drag & drop files here'}
      </Typography>

      <Typography variant="caption" color="text.secondary">
        PDF, DOCX, XLSX, PNG, JPG, CSV and more — max {formatFileSize(MAX_FILE_SIZE_BYTES)} each
      </Typography>

      <Button
        variant="outlined"
        size="small"
        startIcon={<FolderOpenIcon />}
        disabled={disabled}
        onClick={() => document.getElementById('dms-file-input')?.click()}
        sx={{ mt: 0.5 }}
      >
        Browse files
      </Button>
    </Box>
  );
};
