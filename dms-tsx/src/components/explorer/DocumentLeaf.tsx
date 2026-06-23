import React from 'react';
import { Box, Typography, Chip } from '@mui/material';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ImageIcon from '@mui/icons-material/Image';
import TableChartIcon from '@mui/icons-material/TableChart';
import ArticleIcon from '@mui/icons-material/Article';
import SlideshowIcon from '@mui/icons-material/Slideshow';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import { getFileIconConfig } from '../../utils/fileIcons';
import type { FolderDocument, FolderTreeNode } from '../../types/folder.types';

function FileIcon({ fileType, color }: { fileType: string; color: string }) {
  const sx = { fontSize: 15, color, flexShrink: 0 };
  if (fileType === 'application/pdf')                              return <PictureAsPdfIcon sx={sx} />;
  if (fileType.startsWith('image/'))                              return <ImageIcon sx={sx} />;
  if (fileType.includes('sheet') || fileType.includes('csv'))    return <TableChartIcon sx={sx} />;
  if (fileType.includes('word') || fileType.includes('document'))return <ArticleIcon sx={sx} />;
  if (fileType.includes('presentation') || fileType.includes('powerpoint')) return <SlideshowIcon sx={sx} />;
  if (fileType === 'text/plain')                                  return <TextSnippetIcon sx={sx} />;
  return <InsertDriveFileIcon sx={sx} />;
}

interface DocumentLeafProps {
  doc: FolderDocument;
  folderId: string;
  isSelected: boolean;
  folderNode: FolderTreeNode;
  onFileClick: (doc: FolderDocument, folderId: string) => void;
  onContextMenu: (e: React.MouseEvent, type: 'folder' | 'file', id: string, node: FolderTreeNode) => void;
}

export const DocumentLeaf: React.FC<DocumentLeafProps> = ({
  doc, folderId, isSelected, folderNode, onFileClick, onContextMenu,
}) => {
  const cfg = getFileIconConfig(doc.fileType);

  const label = (
    <Box
      sx={{
        display: 'flex', alignItems: 'center', gap: 0.75,
        py: 0.35, px: 0.5, borderRadius: 1,
        bgcolor: isSelected ? 'primary.50' : 'transparent',
        border: isSelected ? '1px solid' : '1px solid transparent',
        borderColor: isSelected ? 'primary.200' : 'transparent',
        cursor: 'pointer', minWidth: 0,
        transition: 'background-color 0.12s',
        '&:hover': { bgcolor: isSelected ? 'primary.50' : 'action.hover' },
      }}
      onClick={(e) => { e.stopPropagation(); onFileClick(doc, folderId); }}
      onContextMenu={(e) => onContextMenu(e, 'file', doc.id, folderNode)}
    >
      <FileIcon fileType={doc.fileType} color={isSelected ? '#1976d2' : cfg.color} />
      <Typography
        variant="caption"
        noWrap
        title={doc.fileName}
        sx={{
          flex: 1,
          fontSize: 12,
          color: isSelected ? 'primary.main' : 'text.secondary',
          fontWeight: isSelected ? 500 : 400,
          lineHeight: 1.4,
        }}
      >
        {doc.fileName}
      </Typography>
      <Chip
        label={cfg.label}
        size="small"
        sx={{
          height: 14, fontSize: 9, flexShrink: 0,
          bgcolor: `${cfg.color}15`,
          color: cfg.color,
          '& .MuiChip-label': { px: 0.5 },
        }}
      />
    </Box>
  );

  return (
    <TreeItem
      nodeId={`doc-${doc.id}`}
      label={label}
      sx={{
        '& > .MuiTreeItem-content': {
          borderRadius: 1, py: 0, px: 0.5,
          '&:hover':                    { bgcolor: 'transparent' },
          '&.Mui-selected':             { bgcolor: 'transparent' },
          '&.Mui-selected:hover':       { bgcolor: 'transparent' },
          '&.Mui-focused':              { bgcolor: 'transparent' },
          '&.Mui-selected.Mui-focused': { bgcolor: 'transparent' },
        },
        // Hide expand arrow for leaf nodes
        '& > .MuiTreeItem-content .MuiTreeItem-iconContainer': { width: 0, minWidth: 0 },
      }}
    />
  );
};
