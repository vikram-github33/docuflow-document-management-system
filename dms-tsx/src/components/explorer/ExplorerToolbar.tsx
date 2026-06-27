import React from 'react';
import {
  Box, Button, IconButton, Tooltip, Divider,
  Typography, Chip,
} from '@mui/material';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';
import DownloadIcon from '@mui/icons-material/Download';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import FolderIcon from '@mui/icons-material/Folder';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { fetchFolderTree, deleteFolderThunk, clearSelection } from '../../redux/slices/folderSlice';

interface ExplorerToolbarProps {
  onNewFolder: () => void;
  onUpload?: () => void;
  onRename?: (id: string, name: string) => void;
}

export const ExplorerToolbar: React.FC<ExplorerToolbarProps> = ({
  onNewFolder, onUpload, onRename,
}) => {
  const dispatch  = useAppDispatch();
  const { selection, loading } = useAppSelector(s => s.folders);

  const selectedFolder = selection?.type === 'folder' ? selection.item : null;
  const selectedFile   = selection?.type === 'file'   ? selection.item : null;

  const handleDelete = async () => {
    if (!selectedFolder) return;
    if (!window.confirm(`Delete folder "${selectedFolder.name}"? This cannot be undone.`)) return;
    await dispatch(deleteFolderThunk(selectedFolder.id));
    dispatch(clearSelection());
  };

  const handleDownload = () => {
    if (selectedFile?.fileUrl) {
      const a = document.createElement('a');
      a.href = selectedFile.fileUrl;
      a.download = selectedFile.fileName;
      a.target = '_blank';
      a.click();
    }
  };

  return (
    <Box
      sx={{
        px: 2, py: 1,
        display: 'flex', alignItems: 'center', gap: 1,
        bgcolor: 'background.paper',
        borderBottom: '0.5px solid',
        borderColor: 'divider',
        minHeight: 52,
      }}
    >
      {/* Brand */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mr: 1 }}>
        <FolderIcon color="primary" sx={{ fontSize: 22 }} />
        <Box>
          <Typography variant="subtitle2" fontWeight={600} lineHeight={1.1} sx={{ fontSize: 14 }}>
            Document Explorer
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: 10 }}>
            Manage folders & files
          </Typography>
        </Box>
      </Box>

      <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

      {/* Primary actions */}
      <Button
        size="small"
        variant="contained"
        startIcon={<CreateNewFolderIcon sx={{ fontSize: 16 }} />}
        onClick={onNewFolder}
        disableElevation
        sx={{ fontSize: 12, py: 0.6, px: 1.5, textTransform: 'none' }}
      >
        New Folder
      </Button>

      {onUpload && (
        <Button
          size="small"
          variant="outlined"
          startIcon={<UploadFileIcon sx={{ fontSize: 16 }} />}
          onClick={onUpload}
          sx={{ fontSize: 12, py: 0.6, px: 1.5, textTransform: 'none' }}
        >
          Upload
        </Button>
      )}

      <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

      {/* Context-sensitive actions */}
      {selectedFile && (
        <Tooltip title={`Download ${selectedFile.fileName}`}>
          <IconButton size="small" onClick={handleDownload} color="primary">
            <DownloadIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Tooltip>
      )}

      {selectedFolder && (
        <>
          {onRename && (
            <Tooltip title={`Rename "${selectedFolder.name}"`}>
              <IconButton
                size="small"
                onClick={() => onRename(selectedFolder.id, selectedFolder.name)}
              >
                <DriveFileRenameOutlineIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Tooltip>
          )}
          {/* <Tooltip title={`Delete "${selectedFolder.name}"`}>
            <IconButton size="small" color="error" onClick={handleDelete}>
              <DeleteIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Tooltip> */}
        </>
      )}

      {/* Refresh */}
      <Tooltip title="Refresh">
        <IconButton
          size="small"
          onClick={() => dispatch(fetchFolderTree())}
          disabled={loading}
          sx={{ ml: 'auto' }}
        >
          <RefreshIcon sx={{ fontSize: 18, ...(loading && { animation: 'spin 1s linear infinite' }) }} />
        </IconButton>
      </Tooltip>

      {/* Selection indicator */}
      {selection && (
        <Chip
          label={selection.type === 'folder'
            ? `📁 ${selection.item.name}`
            : `📄 ${(selection.item as any).fileName}`}
          size="small"
          variant="outlined"
          onDelete={() => dispatch(clearSelection())}
          sx={{ fontSize: 11, maxWidth: 180 }}
        />
      )}

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </Box>
  );
};
