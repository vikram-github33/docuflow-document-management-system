import React from 'react';
import {
  Box, Typography, Avatar, Chip, Tooltip,
  TableCell, TableRow,
} from '@mui/material';
import FolderIcon              from '@mui/icons-material/Folder';
import PictureAsPdfIcon        from '@mui/icons-material/PictureAsPdf';
import ImageIcon               from '@mui/icons-material/Image';
import TableChartIcon          from '@mui/icons-material/TableChart';
import ArticleIcon             from '@mui/icons-material/Article';
import InsertDriveFileIcon     from '@mui/icons-material/InsertDriveFile';
import {
  getActivityMeta,
  formatActivityDescription,
  timeAgo,
  formatTime,
  getFileIconConfig,
} from '../../utils/activity.utils';
import type { ActivityItem } from '../../types/activity.types';

function EntityIcon({ item }: { item: ActivityItem }) {
  if (item.entityType === 'folder') {
    return <FolderIcon sx={{ fontSize: 18, color: item.folderColor ?? '#1976d2', flexShrink: 0 }} />;
  }
  const cfg = getFileIconConfig(item.fileType);
  const sx  = { fontSize: 18, color: cfg.color, flexShrink: 0 };
  if (item.fileType === 'application/pdf')                              return <PictureAsPdfIcon sx={sx} />;
  if (item.fileType?.startsWith('image/'))                             return <ImageIcon sx={sx} />;
  if (item.fileType?.includes('sheet') || item.fileType?.includes('csv')) return <TableChartIcon sx={sx} />;
  if (item.fileType?.includes('word') || item.fileType?.includes('document')) return <ArticleIcon sx={sx} />;
  return <InsertDriveFileIcon sx={sx} />;
}

interface Props { item: ActivityItem }

export const ActivityRow: React.FC<Props> = ({ item }) => {
  const meta = getActivityMeta(item.type);
  const cfg  = getFileIconConfig(item.fileType);

  return (
    <TableRow
      hover
      sx={{
        '& td': { py: 1.1, borderBottom: '0.5px solid', borderColor: 'divider' },
        '&:last-child td': { borderBottom: 'none' },
        '&:hover': { bgcolor: 'grey.50' },
      }}
    >
      {/* Action badge */}
      <TableCell sx={{ pl: 2, width: 130 }}>
        <Chip
          label={meta.label}
          size="small"
          sx={{
            height: 22, fontSize: 11, fontWeight: 600,
            bgcolor: meta.bg, color: meta.color,
            border: 'none',
            '& .MuiChip-label': { px: 1 },
          }}
        />
      </TableCell>

      {/* Entity name + path */}
      <TableCell>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
          <EntityIcon item={item} />
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="body2" fontWeight={500} noWrap sx={{ fontSize: 13 }}>
              {item.entityName}
            </Typography>
            {item.entityType === 'document' && item.folderName && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.1 }}>
                <FolderIcon sx={{ fontSize: 11, color: item.folderColor ?? '#1976d2' }} />
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: 11 }}>
                  {item.folderName}
                </Typography>
              </Box>
            )}
            {item.entityType === 'folder' && item.entityPath && (
              <Typography variant="caption" color="text.secondary" noWrap
                sx={{ fontSize: 11, fontFamily: 'monospace' }}>
                {item.entityPath}
              </Typography>
            )}
          </Box>
        </Box>
      </TableCell>

      {/* Type badge */}
      <TableCell sx={{ width: 70 }}>
        {item.entityType === 'document' && item.fileType && (
          <Chip
            label={cfg.label}
            size="small"
            sx={{
              height: 20, fontSize: 10, fontWeight: 600,
              bgcolor: `${cfg.color}15`, color: cfg.color,
              border: 'none', '& .MuiChip-label': { px: 0.75 },
            }}
          />
        )}
        {item.entityType === 'folder' && (
          <Chip
            label="Folder"
            size="small"
            sx={{
              height: 20, fontSize: 10, fontWeight: 600,
              bgcolor: `${item.folderColor ?? '#1976d2'}15`,
              color: item.folderColor ?? '#1976d2',
              border: 'none', '& .MuiChip-label': { px: 0.75 },
            }}
          />
        )}
      </TableCell>

      {/* Description */}
      <TableCell sx={{ maxWidth: 260 }}>
        <Typography variant="caption" color="text.secondary" noWrap sx={{ fontSize: 12 }}>
          {formatActivityDescription(item)}
          {item.sharedWith && (
            <Box component="span" sx={{ color: 'primary.main', fontWeight: 500 }}>
              {' '}{item.sharedWith}
            </Box>
          )}
        </Typography>
      </TableCell>

      {/* Performed by */}
      <TableCell sx={{ width: 160 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Avatar sx={{
            bgcolor: item.performedBy.color,
            width: 26, height: 26,
            fontSize: 10, fontWeight: 700,
            flexShrink: 0,
          }}>
            {item.performedBy.initials}
          </Avatar>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="caption" fontWeight={500} noWrap sx={{ fontSize: 12, display: 'block' }}>
              {item.performedBy.name}
            </Typography>
            <Typography variant="caption" color="text.disabled" sx={{ fontSize: 10 }}>
              {item.performedBy.role}
            </Typography>
          </Box>
        </Box>
      </TableCell>

      {/* Time */}
      <TableCell sx={{ width: 110 }}>
        <Tooltip title={new Date(item.timestamp).toLocaleString()} placement="left">
          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12, display: 'block' }}>
              {timeAgo(item.timestamp)}
            </Typography>
            <Typography variant="caption" color="text.disabled" sx={{ fontSize: 10 }}>
              {formatTime(item.timestamp)}
            </Typography>
          </Box>
        </Tooltip>
      </TableCell>
    </TableRow>
  );
};
