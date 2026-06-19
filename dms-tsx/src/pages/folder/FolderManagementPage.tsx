import React, { useState } from 'react';
import {
  Box, Button, Typography, Paper, Breadcrumbs,
} from '@mui/material';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import FolderIcon from '@mui/icons-material/Folder';
import { FolderTree } from '../../components/folders/FolderTree';
import { FolderDetails } from '../../components/folders/FolderDetails';
import { CreateFolderDialog } from '../../components/folders/CreateFolderDialog';
import { useFolderTree } from '../../hooks/useFolderHooks';
import type { FolderTreeNode } from '../../types/folder.types';

export const FolderManagementPage: React.FC = () => {
  const [selectedFolder, setSelectedFolder] = useState<FolderTreeNode | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  // Incrementing this triggers FolderTree to re-fetch
  const [refreshTick, setRefreshTick] = useState(0);
  const refresh = () => setRefreshTick((n) => n + 1);

  const { tree } = useFolderTree();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', bgcolor: 'grey.50' }}>

      {/* ── Toolbar ──────────────────────────────────────────────────────────── */}
      <Paper
        variant="outlined"
        square
        sx={{
          px: 3, py: 1.5,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          bgcolor: 'background.paper',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <FolderIcon color="primary" />
          <Box>
            <Typography variant="h6" fontWeight={600} lineHeight={1.1}>Folder Management</Typography>
            <Typography variant="caption" color="text.secondary">
              Organise your documents into folders
            </Typography>
          </Box>
        </Box>
        <Button
          variant="contained"
          startIcon={<CreateNewFolderIcon />}
          onClick={() => setCreateDialogOpen(true)}
          disableElevation
        >
          Create Folder
        </Button>
      </Paper>

      {/* ── Breadcrumb (only when a folder is selected) ───────────────────── */}
      {selectedFolder && (
        <Box sx={{ px: 3, py: 1, bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider' }}>
          <Breadcrumbs>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
              onClick={() => setSelectedFolder(null)}
            >
              All Folders
            </Typography>
            {selectedFolder.path
              .split('/')
              .filter(Boolean)
              .map((seg:any, i:any, arr:any) =>
                i === arr.length - 1 ? (
                  <Typography key={i} variant="body2" fontWeight={600} color="text.primary">{seg}</Typography>
                ) : (
                  <Typography key={i} variant="body2" color="text.secondary">{seg}</Typography>
                )
              )}
          </Breadcrumbs>
        </Box>
      )}

      {/* ── Main layout ──────────────────────────────────────────────────────── */}
      <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        {/* Left: Tree */}
        <Paper
          variant="outlined"
          square
          sx={{
            width: 300, flexShrink: 0,
            display: 'flex', flexDirection: 'column',
            borderTop: 'none', borderBottom: 'none', borderLeft: 'none',
            overflow: 'hidden',
          }}
        >
          <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
            <Typography variant="caption" fontWeight={600} color="text.secondary" letterSpacing={1}>
              FOLDERS
            </Typography>
          </Box>
          <Box sx={{ flex: 1, overflowY: 'auto', p: 1 }}>
            <FolderTree
              selectedId={selectedFolder?.id ?? null}
              onSelect={setSelectedFolder}
              refreshTrigger={refreshTick}
            />
          </Box>
        </Paper>

        {/* Right: Details */}
        <Box sx={{ flex: 1, overflow: 'auto', bgcolor: 'background.paper' }}>
          <FolderDetails
            folder={selectedFolder}
            onClearSelection={() => setSelectedFolder(null)}
            onDeleted={refresh}
            onEditClick={(id) => {
              // TODO: wire up edit dialog
              console.log('Edit:', id);
            }}
            // Future: onUploadClick={(folderId) => navigate(`/upload?folderId=${folderId}`)}
          />
        </Box>
      </Box>

      {/* ── Create dialog ─────────────────────────────────────────────────── */}
      <CreateFolderDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onSuccess={refresh}          // refresh tree + optionally auto-select
        parentFolder={selectedFolder}
        allFolders={tree}
      />
    </Box>
  );
};
