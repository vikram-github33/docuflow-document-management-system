import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { ExplorerToolbar } from '../../components/explorer/ExplorerToolbar';
import { ExplorerSidebar } from '../../components/explorer/ExplorerSidebar';
import { ExplorerBreadcrumb } from '../../components/explorer/ExplorerBreadcrumb';
import { ExplorerMain } from '../../components/explorer/ExplorerMain';
import { ContextMenu, type ContextMenuState } from '../../components/explorer/ContextMenu';
import { CreateFolderDialog } from '../../components/folders/CreateFolderDialog';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { fetchFolderTree, selectFolder } from '../../redux/slices/folderSlice';
import type { FolderTreeNode } from '../../types/folder.types';

export const FolderManagementPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { tree, selection } = useAppSelector(s => s.folders);

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null);

  // Initial fetch
  useEffect(() => {
    dispatch(fetchFolderTree());
  }, [dispatch]);

  const handleContextMenu = (
    e: React.MouseEvent,
    type: 'folder' | 'file',
    id: string,
    node: FolderTreeNode,
  ) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({ mouseX: e.clientX, mouseY: e.clientY, type, id, node });
  };

  const handleCreateSuccess = () => {
    dispatch(fetchFolderTree());
  };

  // The parent folder for CreateFolderDialog
  const parentFolder = selection?.type === 'folder' ? selection.item : null;

  return (
    <Box
      sx={{ display: 'flex', flexDirection: 'column', height: '100vh', bgcolor: 'grey.50' }}
      onContextMenu={(e) => e.preventDefault()} // prevent browser menu on empty areas
    >
      {/* Toolbar */}
      <ExplorerToolbar
        onNewFolder={() => setCreateDialogOpen(true)}
      />

      {/* Breadcrumb */}
      <ExplorerBreadcrumb />

      {/* Main layout */}
      <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        {/* Left sidebar — 280px fixed */}
        <Box
          sx={{
            width: 280,
            flexShrink: 0,
            borderRight: '0.5px solid',
            borderColor: 'divider',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <ExplorerSidebar onContextMenu={handleContextMenu} />
        </Box>

        {/* Right main panel */}
        <Box sx={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <ExplorerMain />
        </Box>
      </Box>

      {/* Context menu */}
      <ContextMenu
        state={contextMenu}
        onClose={() => setContextMenu(null)}
        onNewFolder={() => { setContextMenu(null); setCreateDialogOpen(true); }}
      />

      {/* Create folder dialog */}
      <CreateFolderDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onSuccess={handleCreateSuccess}
        parentFolder={parentFolder}
        allFolders={tree}
      />
    </Box>
  );
};
