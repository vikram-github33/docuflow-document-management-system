import React, { useEffect, useState } from 'react';
import { Box, Typography, Chip, CircularProgress, Alert, Tooltip } from '@mui/material';
// @mui/lab is already in your package.json — fully MUI v5 compatible
import TreeView from '@mui/lab/TreeView';
import TreeItem from '@mui/lab/TreeItem';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { DynamicFolderIcon } from './FolderIcon';
import { useFolderTree } from '../../hooks/useFolderHooks';
import type { FolderTreeNode } from '../../types/folder.types';

interface FolderTreeProps {
  selectedId: string | null;
  onSelect: (folder: FolderTreeNode) => void;
  refreshTrigger?: number; // increment to force a refresh
}

// ── Recursive tree node ───────────────────────────────────────────────────────
function FolderNode({
  node,
  selectedId,
  onSelect,
}: {
  node: FolderTreeNode;
  selectedId: string | null;
  onSelect: (f: FolderTreeNode) => void;
}) {
  const isSelected = node.id === selectedId;

  const label = (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        py: 0.5,
        px: 0.75,
        borderRadius: 1.5,
        bgcolor: isSelected ? `${node.color}18` : 'transparent',
        transition: 'background 0.15s',
      }}
      onClick={() => onSelect(node)}
    >
      <DynamicFolderIcon icon={node.icon} color={node.color} sx={{ fontSize: 20 }} />
      <Typography
        variant="body2"
        fontWeight={isSelected ? 600 : 400}
        sx={{ color: isSelected ? node.color : 'text.primary', flex: 1 }}
        noWrap
      >
        {node.name}
      </Typography>
      {node.documentCount > 0 && (
        <Tooltip title={`${node.documentCount} document(s)`}>
          <Chip
            label={node.documentCount}
            size="small"
            sx={{
              height: 18,
              fontSize: 10,
              bgcolor: `${node.color}22`,
              color: node.color,
              fontWeight: 600,
              '& .MuiChip-label': { px: 0.75 },
            }}
          />
        </Tooltip>
      )}
    </Box>
  );

  return (
    <TreeItem nodeId={node.id} label={label}>
      {node.children.map((child) => (
        <FolderNode key={child.id} node={child} selectedId={selectedId} onSelect={onSelect} />
      ))}
    </TreeItem>
  );
}

// ── FolderTree ────────────────────────────────────────────────────────────────
export const FolderTree: React.FC<FolderTreeProps> = ({
  selectedId,
  onSelect,
  refreshTrigger = 0,
}) => {
  const { tree, loading, error, refetch } = useFolderTree();

  // Initial load + re-fetch whenever refreshTrigger increments
  useEffect(() => {
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshTrigger]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress size={24} />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert
        severity="error"
        action={
          <Typography
            variant="caption"
            sx={{ cursor: 'pointer', textDecoration: 'underline', mr: 1 }}
            onClick={refetch}
          >
            Retry
          </Typography>
        }
      >
        {error}
      </Alert>
    );
  }

  if (tree.length === 0) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">No folders yet.</Typography>
        <Typography variant="caption" color="text.secondary">Create a folder to get started.</Typography>
      </Box>
    );
  }

  return (
    <TreeView
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpandIcon={<ChevronRightIcon />}
      selected={selectedId ?? ''}
      sx={{ overflowY: 'auto', userSelect: 'none' }}
    >
      {tree.map((node) => (
        <FolderNode key={node.id} node={node} selectedId={selectedId} onSelect={onSelect} />
      ))}
    </TreeView>
  );
};
