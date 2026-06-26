import React from 'react';
import { Box, Typography, CircularProgress, Alert, IconButton } from '@mui/material';
import { TreeView } from '@mui/x-tree-view/TreeView';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import FolderIcon from '@mui/icons-material/Folder';
import RefreshIcon from '@mui/icons-material/Refresh';
import { TreeNode } from './TreeNode';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { selectFolder, selectFile, setExpandedIds, fetchFolderTree } from '../../redux/slices/folderSlice';
import type { FolderTreeNode, FolderDocument, Folder } from '../../types/folder.types';

interface FileTreeProps {
  onContextMenu: (e: React.MouseEvent, type: 'folder' | 'file', id: string, node: FolderTreeNode) => void;
  data: FolderTreeNode[] | Folder[];
}

export const FileTree: React.FC<FileTreeProps> = ({ onContextMenu,data }) => {
  const dispatch  = useAppDispatch();
  const {loading, error, expandedIds, selection, searchQuery} = useAppSelector(s => s.folders);
  const selectedFolderId = selection?.type === 'folder' ? selection.item.id : null;
  const selectedFileId   = selection?.type === 'file'   ? selection.item.id : null;

  const handleFolderClick = (node: FolderTreeNode) => {
    dispatch(selectFolder(node));
  };

  const handleFileClick = (doc: FolderDocument, folderId: string) => {
    dispatch(selectFile({ doc, folderId }));
  };

  const handleNodeToggle = (_e: React.SyntheticEvent, nodeIds: string[]) => {
    dispatch(setExpandedIds(nodeIds));
  };

  // ── Loading ────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, p: 4 }}>
        <CircularProgress size={22} thickness={4} />
        <Typography variant="caption" color="text.secondary">Loading...</Typography>
      </Box>
    );
  }

  // ── Error ──────────────────────────────────────────────────────────────────
  if (error) {
    return (
      <Box sx={{ p: 1.5 }}>
        <Alert
          severity="error"
          action={
            <IconButton size="small" onClick={() => dispatch(fetchFolderTree())}>
              <RefreshIcon fontSize="small" />
            </IconButton>
          }
        >
          <Typography variant="caption">{error}</Typography>
        </Alert>
      </Box>
    );
  }

  // ── Empty ──────────────────────────────────────────────────────────────────
  if (!data || data.length === 0) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, p: 4 }}>
        <FolderIcon sx={{ fontSize: 40, opacity: 0.2, color: 'text.secondary' }} />
        <Typography variant="body2" color="text.secondary" fontWeight={500}>No folders yet</Typography>
        <Typography variant="caption" color="text.secondary" textAlign="center">
          Click "New Folder" to create one
        </Typography>
      </Box>
    );
  }
// console.log("data",data)
  return (
    <TreeView
      defaultCollapseIcon={<ExpandMoreIcon sx={{ fontSize: 16 }} />}
      defaultExpandIcon={<ChevronRightIcon sx={{ fontSize: 16 }} />}
      expanded={expandedIds}
      selected={selectedFileId ? `doc-${selectedFileId}` : (selectedFolderId ?? '')}
      onNodeToggle={handleNodeToggle}
      onNodeSelect={(_e: React.SyntheticEvent, nodeId: string) => {
        // Selection handled by onClick inside label — avoid double dispatch
        void nodeId;
      }}
      sx={{
        userSelect: 'none',
        '& .MuiTreeItem-root': { my: 0.1 },
      }}
    >
      {data.map((node:any) => {
        // console.log("node",node)
        return(
        <TreeNode
          key={node.id}
          node={node}
          selectedFolderId={selectedFolderId}
          selectedFileId={selectedFileId}
          expandedIds={expandedIds}
          searchQuery={searchQuery}
          onFolderClick={handleFolderClick}
          onFileClick={handleFileClick}
          onContextMenu={onContextMenu}
        />
      )})}
      {/* {data.map((node:any) => (
  <div key={node.id}>
    <h4>{node.name}</h4>

    {node.documents?.map((doc:any) => (
      <div key={doc.id}>
        📄 {doc.fileName}
      </div>
    ))}
  </div>))} */}
    </TreeView>
  );
};
