import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Chip,
  CircularProgress,
  Alert,
  Tooltip,
  IconButton,
} from '@mui/material';
// @mui/x-tree-view v6.17.0 — MUI v5 compatible ✅
// v6 uses: TreeView + TreeItem (NOT SimpleTreeView)
// TreeItem prop: nodeId (NOT itemId — that's v7+)
// TreeView props: expanded, onNodeToggle, selected, onNodeSelect
import { TreeView } from '@mui/x-tree-view/TreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import RefreshIcon from '@mui/icons-material/Refresh';
import FolderIcon from '@mui/icons-material/Folder';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ImageIcon from '@mui/icons-material/Image';
import TableChartIcon from '@mui/icons-material/TableChart';
import ArticleIcon from '@mui/icons-material/Article';
import WorkIcon from '@mui/icons-material/Work';
import PeopleIcon from '@mui/icons-material/People';
import DescriptionIcon from '@mui/icons-material/Description';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import GavelIcon from '@mui/icons-material/Gavel';
import InventoryIcon from '@mui/icons-material/Inventory';
import SchoolIcon from '@mui/icons-material/School';
import StarIcon from '@mui/icons-material/Star';
import SettingsIcon from '@mui/icons-material/Settings';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { fetchFolderTree, setSelectedFolder } from '../../redux/slices/folderSlice';
import type { FolderTreeNode, FolderDocument } from '../../types/folder.types';

// ─── Folder icon map ──────────────────────────────────────────────────────────
const FOLDER_ICON_MAP: Record<string, React.ElementType> = {
  folder:      FolderIcon,
  work:        WorkIcon,
  people:      PeopleIcon,
  description: DescriptionIcon,
  analytics:   AnalyticsIcon,
  gavel:       GavelIcon,
  inventory:   InventoryIcon,
  school:      SchoolIcon,
  star:        StarIcon,
  settings:    SettingsIcon,
};

// ─── File icon by MIME ────────────────────────────────────────────────────────
function FileTypeIcon({ fileType }: { fileType: string }) {
  const sx = { fontSize: 15, flexShrink: 0, color: '#78909c' };
  if (fileType === 'application/pdf')
    return <PictureAsPdfIcon sx={{ ...sx, color: '#e53935' }} />;
  if (fileType.startsWith('image/'))
    return <ImageIcon sx={{ ...sx, color: '#1e88e5' }} />;
  if (fileType.includes('sheet') || fileType.includes('csv'))
    return <TableChartIcon sx={{ ...sx, color: '#43a047' }} />;
  if (fileType.includes('word') || fileType.includes('document'))
    return <ArticleIcon sx={{ ...sx, color: '#1565c0' }} />;
  return <InsertDriveFileIcon sx={sx} />;
}

// ─── Props ────────────────────────────────────────────────────────────────────
export interface FolderTreeProps {
  onDocumentClick?: (doc: FolderDocument, folderId: string) => void;
  refreshTrigger?: number;
}

// ─── Document leaf ────────────────────────────────────────────────────────────
function DocumentNode({
  doc,
  folderId,
  onDocumentClick,
}: {
  doc: FolderDocument;
  folderId: string;
  onDocumentClick?: (doc: FolderDocument, folderId: string) => void;
}) {
  const label = (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 0.75,
        py: 0.35,
        px: 0.5,
        borderRadius: 1,
        cursor: onDocumentClick ? 'pointer' : 'default',
        minWidth: 0,
        '&:hover': onDocumentClick ? { bgcolor: 'action.hover' } : {},
      }}
      onClick={(e) => {
        e.stopPropagation();
        onDocumentClick?.(doc, folderId);
      }}
    >
      <FileTypeIcon fileType={doc.fileType} />
      <Typography
        variant="caption"
        noWrap
        title={doc.fileName}
        sx={{
          flex: 1,
          color: 'text.secondary',
          lineHeight: 1.4,
          '&:hover': onDocumentClick
            ? { color: 'primary.main', textDecoration: 'underline' }
            : {},
        }}
      >
        {doc.fileName}
      </Typography>
      <Chip
        label={(doc.fileType.split('/')[1] ?? 'file').toUpperCase()}
        size="small"
        sx={{
          height: 16,
          fontSize: 9,
          flexShrink: 0,
          bgcolor: 'grey.100',
          color: 'text.secondary',
          '& .MuiChip-label': { px: 0.5 },
        }}
      />
    </Box>
  );

  return (
    <TreeItem
      nodeId={`doc-${doc.id}`}   // v6 uses nodeId ✅
      label={label}
      sx={{
        '& .MuiTreeItem-content': {
          py: 0,
          '&:hover':                    { bgcolor: 'transparent' },
          '&.Mui-selected':             { bgcolor: 'transparent' },
          '&.Mui-selected:hover':       { bgcolor: 'transparent' },
          '&.Mui-focused':              { bgcolor: 'transparent' },
          '&.Mui-selected.Mui-focused': { bgcolor: 'transparent' },
        },
        // No expand arrow for leaf nodes
        '& > .MuiTreeItem-content .MuiTreeItem-iconContainer': { width: 0 },
      }}
    />
  );
}

// ─── Folder node (recursive) ──────────────────────────────────────────────────
function FolderNode({
  node,
  selectedId,
  expandedIds,
  onSelect,
  onDocumentClick,
}: {
  node: FolderTreeNode;
  selectedId: string | null;
  expandedIds: string[];
  onSelect: (f: FolderTreeNode) => void;
  onDocumentClick?: (doc: FolderDocument, folderId: string) => void;
}) {
  const isSelected   = node.id === selectedId;
  const isExpanded   = expandedIds.includes(node.id);
  const hasChildren  = node.children?.length > 0;
  const hasDocuments = node.documents?.length > 0;
  const hasContent   = hasChildren || hasDocuments;
  const nodeColor    = node.color ?? '#1976d2';
  const FolderIconComp = FOLDER_ICON_MAP[node.icon ?? 'folder'] ?? FolderIcon;

  const label = (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        py: 0.5,
        px: 0.5,
        borderRadius: 1.5,
        bgcolor: isSelected ? `${nodeColor}18` : 'transparent',
        transition: 'background-color 0.15s ease',
        minWidth: 0,
      }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(node);
      }}
    >
      {/* Open folder icon when expanded */}
      {hasContent && isExpanded
        ? <FolderOpenIcon sx={{ fontSize: 19, color: nodeColor, flexShrink: 0 }} />
        : <FolderIconComp  sx={{ fontSize: 19, color: nodeColor, flexShrink: 0 }} />
      }

      <Typography
        variant="body2"
        noWrap
        sx={{
          flex: 1,
          fontWeight: isSelected ? 600 : 400,
          color: isSelected ? nodeColor : 'text.primary',
          lineHeight: 1.4,
        }}
      >
        {node.name}
      </Typography>

      {node.documentCount > 0 && (
        <Tooltip title={`${node.documentCount} document(s)`} placement="right">
          <Chip
            label={node.documentCount}
            size="small"
            sx={{
              height: 18,
              fontSize: 10,
              fontWeight: 600,
              flexShrink: 0,
              bgcolor: `${nodeColor}22`,
              color: nodeColor,
              '& .MuiChip-label': { px: 0.75 },
            }}
          />
        </Tooltip>
      )}

      {node.isArchived && (
        <Chip
          label="Archived"
          size="small"
          sx={{
            height: 16,
            fontSize: 9,
            flexShrink: 0,
            bgcolor: 'grey.200',
            color: 'text.secondary',
            '& .MuiChip-label': { px: 0.5 },
          }}
        />
      )}
    </Box>
  );

  return (
    <TreeItem
      nodeId={node.id}   // v6 uses nodeId ✅
      label={label}
      sx={{
        '& .MuiTreeItem-content': {
          borderRadius: 1.5,
          py: 0.1,
          '&:hover':                    { bgcolor: 'transparent' },
          '&.Mui-selected':             { bgcolor: 'transparent' },
          '&.Mui-selected:hover':       { bgcolor: 'transparent' },
          '&.Mui-focused':              { bgcolor: 'transparent' },
          '&.Mui-selected.Mui-focused': { bgcolor: 'transparent' },
        },
        '& > .MuiTreeItem-content .MuiTreeItem-iconContainer': {
          color: 'text.secondary',
        },
      }}
    >
      {/* Subfolders first */}
      {hasChildren && node.children.map((child) => (
        <FolderNode
          key={child.id}
          node={child}
          selectedId={selectedId}
          expandedIds={expandedIds}
          onSelect={onSelect}
          onDocumentClick={onDocumentClick}
        />
      ))}

      {/* Files section */}
      {hasDocuments && (
        <>
          {hasChildren && (
            <Box sx={{ px: 2, pt: 0.5, pb: 0.25 }}>
              <Typography
                variant="caption"
                sx={{
                  color: 'text.disabled',
                  fontSize: 10,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                }}
              >
                Files
              </Typography>
            </Box>
          )}
          {node.documents.map((doc) => (
            <DocumentNode
              key={doc.id}
              doc={doc}
              folderId={node.id}
              onDocumentClick={onDocumentClick}
            />
          ))}
        </>
      )}
    </TreeItem>
  );
}

// ─── FolderTree ───────────────────────────────────────────────────────────────
export const FolderTree: React.FC<FolderTreeProps> = ({
  onDocumentClick,
  refreshTrigger = 0,
}) => {
  const dispatch = useAppDispatch();
  const { tree, loading, error, selectedFolder } = useAppSelector(
    (state) => state.folders
  );
  const selectedId = selectedFolder?.id ?? null;

  const [expandedIds, setExpandedIds] = useState<string[]>([]);

  // Fetch on mount + when refreshTrigger changes
  useEffect(() => {
    dispatch(fetchFolderTree());
  }, [refreshTrigger]);

  // Auto-expand ancestors of selected folder
  useEffect(() => {
    if (!selectedId || !tree.length) return;

    function findAncestors(
      nodes: FolderTreeNode[],
      targetId: string,
      acc: string[] = [],
    ): string[] | null {
      for (const n of nodes) {
        if (n.id === targetId) return acc;
        const found = findAncestors(n.children, targetId, [...acc, n.id]);
        if (found) return found;
      }
      return null;
    }

    const ancestors = findAncestors(tree, selectedId);
    if (ancestors && ancestors.length > 0) {
      setExpandedIds((prev) => Array.from(new Set([...prev, ...ancestors])));
    }
  }, [selectedId, tree]);

  const handleSelect = (folder: FolderTreeNode) => {
    dispatch(setSelectedFolder(folder));
  };

  // ── Loading ────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, p: 4 }}>
        <CircularProgress size={24} thickness={4} />
        <Typography variant="caption" color="text.secondary">Loading folders...</Typography>
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
            <IconButton size="small" onClick={() => dispatch(fetchFolderTree())} title="Retry">
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
  if (!tree || tree.length === 0) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, p: 4 }}>
        <FolderIcon sx={{ fontSize: 40, opacity: 0.25 }} />
        <Typography variant="body2" fontWeight={500} color="text.secondary">
          No folders yet
        </Typography>
        <Typography variant="caption" color="text.secondary" textAlign="center">
          Click "Create Folder" to get started
        </Typography>
      </Box>
    );
  }

  // ── Tree ───────────────────────────────────────────────────────────────────
  return (
    <TreeView
      // v6 exact API ✅
      expanded={expandedIds}
      onNodeToggle={(_e: React.SyntheticEvent, nodeIds: string[]) =>
        setExpandedIds(nodeIds)
      }
      selected={selectedId ?? ''}
      onNodeSelect={(_e: React.SyntheticEvent, nodeId: string) => {
        // Only select if it's a folder node (not a doc- prefixed leaf)
        if (!nodeId.startsWith('doc-')) {
          const found = findNodeById(tree, nodeId);
          if (found) handleSelect(found);
        }
      }}
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpandIcon={<ChevronRightIcon />}
      sx={{
        overflowY: 'auto',
        userSelect: 'none',
        '& .MuiTreeItem-root': { my: 0.15 },
      }}
    >
      {tree.map((node) => (
        <FolderNode
          key={node.id}
          node={node}
          selectedId={selectedId}
          expandedIds={expandedIds}
          onSelect={handleSelect}
          onDocumentClick={onDocumentClick}
        />
      ))}
    </TreeView>
  );
};

// ─── Util: find node by id anywhere in the tree ───────────────────────────────
function findNodeById(
  nodes: FolderTreeNode[],
  id: string,
): FolderTreeNode | null {
  for (const n of nodes) {
    if (n.id === id) return n;
    const found = findNodeById(n.children, id);
    if (found) return found;
  }
  return null;
}
