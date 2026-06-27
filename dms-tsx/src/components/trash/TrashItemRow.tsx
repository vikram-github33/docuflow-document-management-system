import React from 'react';
import {
  Box, Typography, Chip, Checkbox, Tooltip,
  IconButton,
} from '@mui/material';
import RestoreFromTrashIcon from '@mui/icons-material/RestoreFromTrash';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import FolderIcon from '@mui/icons-material/Folder';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ImageIcon from '@mui/icons-material/Image';
import TableChartIcon from '@mui/icons-material/TableChart';
import ArticleIcon from '@mui/icons-material/Article';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { getFileIconConfig, formatFileSize, timeAgo, daysUntilPermanentDelete } from '../../utils/trash.utils';
import type { TrashedDocument, TrashedFolder } from '../../types/trash.types';

function FileIcon({ fileType, color }: { fileType: string; color: string }) {
  const sx = { fontSize: 20, color, flexShrink: 0 };
  if (fileType === 'application/pdf')                               return <PictureAsPdfIcon sx={sx} />;
  if (fileType.startsWith('image/'))                               return <ImageIcon sx={sx} />;
  if (fileType.includes('sheet') || fileType.includes('csv'))      return <TableChartIcon sx={sx} />;
  if (fileType.includes('word') || fileType.includes('document'))  return <ArticleIcon sx={sx} />;
  if (fileType === 'text/plain')                                   return <TextSnippetIcon sx={sx} />;
  return <InsertDriveFileIcon sx={sx} />;
}

// ── Document Row ──────────────────────────────────────────────────────────────
interface DocRowProps {
  doc: TrashedDocument;
  isSelected: boolean;
  onToggle: (id: string) => void;
  onRestore: (id: string) => void;
  onDelete: (id: string) => void;
}

export const TrashDocumentRow: React.FC<DocRowProps> = ({
  doc, isSelected, onToggle, onRestore, onDelete,
}) => {
  const cfg  = getFileIconConfig(doc.fileType);
  const days = daysUntilPermanentDelete(doc.deletedAt);
  const urgent = days <= 7;

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: '40px 2.5fr 1fr 1fr 1fr 1fr 1fr',
        alignItems: 'center',
        px: 1.5, py: 1.25,
        borderBottom: '0.5px solid', borderColor: 'divider',
        bgcolor: isSelected ? 'primary.50' : 'background.paper',
        transition: 'background 0.12s',
        '&:hover': { bgcolor: isSelected ? 'primary.50' : 'grey.50' },
        '&:last-child': { borderBottom: 'none' },
      }}
    >
      {/* Checkbox */}
      <Checkbox
        size="small"
        checked={isSelected}
        onChange={() => onToggle(doc.id)}
        sx={{ p: 0.5 }}
      />

      {/* Name + icon */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
        <FileIcon fileType={doc.fileType} color={cfg.color} />
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="body2" noWrap fontWeight={500} sx={{ fontSize: 13 }}>
            {doc.fileName}
          </Typography>
          {doc.folderName && (
            <Typography variant="caption" color="text.secondary" noWrap sx={{ fontSize: 11 }}>
              📁 {doc.folderName}
            </Typography>
          )}
        </Box>
      </Box>

      {/* Type badge */}
      <Chip
        label={cfg.label}
        size="small"
        sx={{
          height: 20, fontSize: 10, fontWeight: 500,
          bgcolor: `${cfg.color}15`, color: cfg.color,
          border: 'none',
          '& .MuiChip-label': { px: 0.75 },
        }}
      />

      {/* Size */}
      <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12 }}>
        {formatFileSize(doc.fileSize)}
      </Typography>

      {/* Deleted */}
      <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12 }}>
        {timeAgo(doc.deletedAt)}
      </Typography>

      {/* Expires */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        {urgent && (
          <Tooltip title="Expiring soon">
            <WarningAmberIcon sx={{ fontSize: 14, color: 'warning.main' }} />
          </Tooltip>
        )}
        <Typography variant="caption" sx={{ fontSize: 12, color: urgent ? 'warning.main' : 'text.secondary', fontWeight: urgent ? 500 : 400 }}>
          {days}d left
        </Typography>
      </Box>

      {/* Actions */}
      <Box sx={{ display: 'flex', gap: 0.5 }}>
        <Tooltip title="Restore">
          <IconButton size="small" onClick={() => onRestore(doc.id)} color="primary" sx={{ p: 0.6 }}>
            <RestoreFromTrashIcon sx={{ fontSize: 17 }} />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete permanently">
          <IconButton size="small" onClick={() => onDelete(doc.id)} color="error" sx={{ p: 0.6 }}>
            <DeleteForeverIcon sx={{ fontSize: 17 }} />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
};

// ── Folder Row ────────────────────────────────────────────────────────────────
interface FolderRowProps {
  folder: TrashedFolder;
  isSelected: boolean;
  onToggle: (id: string) => void;
  onRestore: (id: string) => void;
  onDelete: (id: string) => void;
}

export const TrashFolderRow: React.FC<FolderRowProps> = ({
  folder, isSelected, onToggle, onRestore, onDelete,
}) => {
  const color = folder.color ?? '#1976d2';
  const days  = daysUntilPermanentDelete(folder.deletedAt);
  const urgent = days <= 7;

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: '40px 2.5fr 1fr 1fr 1fr 1fr 1fr',
        alignItems: 'center',
        px: 1.5, py: 1.25,
        borderBottom: '0.5px solid', borderColor: 'divider',
        bgcolor: isSelected ? 'primary.50' : 'background.paper',
        transition: 'background 0.12s',
        '&:hover': { bgcolor: isSelected ? 'primary.50' : 'grey.50' },
        '&:last-child': { borderBottom: 'none' },
      }}
    >
      <Checkbox size="small" checked={isSelected} onChange={() => onToggle(folder.id)} sx={{ p: 0.5 }} />

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
        <FolderIcon sx={{ fontSize: 20, color, flexShrink: 0 }} />
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="body2" noWrap fontWeight={500} sx={{ fontSize: 13 }}>
            {folder.name}
          </Typography>
          <Typography variant="caption" color="text.secondary" noWrap sx={{ fontSize: 11, fontFamily: 'monospace' }}>
            {folder.path}
          </Typography>
        </Box>
      </Box>

      <Chip
        label="Folder"
        size="small"
        sx={{
          height: 20, fontSize: 10, fontWeight: 500,
          bgcolor: `${color}15`, color,
          border: 'none',
          '& .MuiChip-label': { px: 0.75 },
        }}
      />

      <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12 }}>
        {folder.documentCount} file{folder.documentCount !== 1 ? 's' : ''}
      </Typography>

      <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12 }}>
        {timeAgo(folder.deletedAt)}
      </Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        {urgent && (
          <Tooltip title="Expiring soon">
            <WarningAmberIcon sx={{ fontSize: 14, color: 'warning.main' }} />
          </Tooltip>
        )}
        <Typography variant="caption" sx={{ fontSize: 12, color: urgent ? 'warning.main' : 'text.secondary', fontWeight: urgent ? 500 : 400 }}>
          {days}d left
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', gap: 0.5 }}>
        <Tooltip title="Restore">
          <IconButton size="small" onClick={() => onRestore(folder.id)} color="primary" sx={{ p: 0.6 }}>
            <RestoreFromTrashIcon sx={{ fontSize: 17 }} />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete permanently">
          <IconButton size="small" onClick={() => onDelete(folder.id)} color="error" sx={{ p: 0.6 }}>
            <DeleteForeverIcon sx={{ fontSize: 17 }} />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
};
