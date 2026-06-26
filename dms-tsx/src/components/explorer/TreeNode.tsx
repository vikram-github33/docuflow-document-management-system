import React from 'react';
import { Box, Typography, Chip, Tooltip } from '@mui/material';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import FolderIcon from '@mui/icons-material/Folder';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import WorkIcon from '@mui/icons-material/Work';
import PeopleIcon from '@mui/icons-material/People';
import DescriptionIcon from '@mui/icons-material/Description';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import GavelIcon from '@mui/icons-material/Gavel';
import InventoryIcon from '@mui/icons-material/Inventory';
import SchoolIcon from '@mui/icons-material/School';
import StarIcon from '@mui/icons-material/Star';
import SettingsIcon from '@mui/icons-material/Settings';
import { DocumentLeaf } from './DocumentLeaf';
import type { FolderTreeNode, FolderDocument } from '../../types/folder.types';

const ICON_MAP: Record<string, React.ElementType> = {
  folder: FolderIcon, work: WorkIcon, people: PeopleIcon,
  description: DescriptionIcon, analytics: AnalyticsIcon,
  gavel: GavelIcon, inventory: InventoryIcon, school: SchoolIcon,
  star: StarIcon, settings: SettingsIcon,
};

interface TreeNodeProps {
  node: FolderTreeNode;
  selectedFolderId: string | null;
  selectedFileId: string | null;
  expandedIds: string[];
  searchQuery: string;
  onFolderClick: (node: FolderTreeNode) => void;
  onFileClick: (doc: FolderDocument, folderId: string) => void;
  onContextMenu: (e: React.MouseEvent, type: 'folder' | 'file', id: string, node: FolderTreeNode) => void;
}

// Filter tree nodes by search query
function nodeMatchesSearch(node: FolderTreeNode, q: string): boolean {
  if (!q) return true;
  const lower = q.toLowerCase();
  if (node.name.toLowerCase().includes(lower)) return true;
  if (node.documents?.some(d => d.fileName.toLowerCase().includes(lower))) return true;
  if (node.children?.some(c => nodeMatchesSearch(c, q))) return true;
  return false;
}

export const TreeNode: React.FC<TreeNodeProps> = ({
  node, selectedFolderId, selectedFileId, expandedIds,
  searchQuery, onFolderClick, onFileClick, onContextMenu,
}) => {
  // console.log("node Trees renderr",node)
  
  // if (searchQuery && !nodeMatchesSearch(node, searchQuery)) return null;
  
  const isSelected  = node.id === selectedFolderId;
  const isExpanded  = expandedIds.includes(node.id);
  const hasChildren = (node.children?.length ?? 0) > 0;
  const hasFiles    = (node.documents?.length ?? 0) > 0;
  const hasContent  = hasChildren || hasFiles;
  const color       = node.color ?? '#1976d2';
  const FolderIconComp = ICON_MAP[node.icon ?? 'folder'] ?? FolderIcon;
  
  // console.log("hasFiles",hasFiles)
  const label = (
    <Box
      sx={{
        display: 'flex', alignItems: 'center', gap: 0.75,
        py: 0.4, px: 0.5, borderRadius: 1.5,
        bgcolor: isSelected ? `${color}15` : 'transparent',
        transition: 'background-color 0.12s',
        minWidth: 0,
        '&:hover': { bgcolor: isSelected ? `${color}20` : 'action.hover' },
      }}
      onClick={(e) => { e.stopPropagation(); onFolderClick(node); }}
      onContextMenu={(e) => onContextMenu(e, 'folder', node.id, node)}
    >
      {hasContent && isExpanded
        ? <FolderOpenIcon sx={{ fontSize: 18, color, flexShrink: 0 }} />
        : <FolderIconComp sx={{ fontSize: 18, color, flexShrink: 0 }} />
      }
      <Typography
        variant="body2"
        noWrap
        sx={{
          flex: 1, fontSize: 13,
          fontWeight: isSelected ? 600 : 400,
          color: isSelected ? color : 'text.primary',
          lineHeight: 1.3,
        }}
      >
        {node.name}
      </Typography>
      {node.isArchived && (
        <Chip label="Arch" size="small" sx={{ height: 14, fontSize: 9, '& .MuiChip-label': { px: 0.5 } }} />
      )}
      {node.documentCount > 0 && (
        <Tooltip title={`${node.documentCount} file(s)`} placement="right">
          <Typography
            variant="caption"
            sx={{
              fontSize: 10, fontWeight: 600, flexShrink: 0,
              color, opacity: 0.7, minWidth: 16, textAlign: 'right',
            }}
          >
            {node.documentCount}
          </Typography>
        </Tooltip>
      )}
    </Box>
  );
// console.log('NODE', node);
// console.log('DOCUMENTS', node.documents);
// console.log('HAS FILES', hasFiles);
  return (
    <TreeItem
      nodeId={node.id}
      label={label}
      sx={{
        '& > .MuiTreeItem-content': {
          borderRadius: 1.5, py: 0, px: 0.5,
          '&:hover':                    { bgcolor: 'transparent' },
          '&.Mui-selected':             { bgcolor: 'transparent' },
          '&.Mui-selected:hover':       { bgcolor: 'transparent' },
          '&.Mui-focused':              { bgcolor: 'transparent' },
          '&.Mui-selected.Mui-focused': { bgcolor: 'transparent' },
        },
        '& > .MuiTreeItem-content .MuiTreeItem-iconContainer': { color: 'text.disabled' },
      }}
    >
      {/* Subfolders */}
      {hasChildren && node.children.map(child => (
        <TreeNode
          key={child.id}
          node={child}
          selectedFolderId={selectedFolderId}
          selectedFileId={selectedFileId}
          expandedIds={expandedIds}
          searchQuery={searchQuery}
          onFolderClick={onFolderClick}
          onFileClick={onFileClick}
          onContextMenu={onContextMenu}
        />
      ))}

      {/* Files */}
      {hasFiles && node.documents
        // .filter(d => !searchQuery || d.fileName.toLowerCase().includes(searchQuery.toLowerCase()))
        .map(doc => (
          <DocumentLeaf
            key={doc.id}
            doc={doc}
            folderId={node.id}
            isSelected={doc.id === selectedFileId}
            onFileClick={onFileClick}
            onContextMenu={onContextMenu}
            folderNode={node}
          />
        ))
      }
    </TreeItem>
  );
};
