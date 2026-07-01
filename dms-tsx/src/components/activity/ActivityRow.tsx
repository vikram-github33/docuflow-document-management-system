import React from 'react';
import { Box, Typography, Avatar, Chip, Tooltip, TableCell, TableRow } from '@mui/material';
import FolderIcon          from '@mui/icons-material/Folder';
import PictureAsPdfIcon    from '@mui/icons-material/PictureAsPdf';
import ImageIcon           from '@mui/icons-material/Image';
import TableChartIcon      from '@mui/icons-material/TableChart';
import ArticleIcon         from '@mui/icons-material/Article';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import {
  getActivityMeta, timeAgo, formatTime,
  getFileIconConfig, getUserColor, getInitials,
} from '../../utils/activity.utils';
import type { DocumentActivity } from '../../types/activity.types';

function EntityIcon({ item }: { item: DocumentActivity }) {
  if (item.folder) {
    return <FolderIcon sx={{ fontSize: 18, color: '#1976d2', flexShrink: 0 }} />;
  }
  const cfg = getFileIconConfig(item.document?.fileType);
  const sx  = { fontSize: 18, color: cfg.color, flexShrink: 0 };
  const ft  = item.document?.fileType ?? '';
  if (ft === 'application/pdf')                              return <PictureAsPdfIcon sx={sx} />;
  if (ft.startsWith('image/'))                              return <ImageIcon sx={sx} />;
  if (ft.includes('sheet') || ft.includes('csv'))           return <TableChartIcon sx={sx} />;
  if (ft.includes('word') || ft.includes('document'))       return <ArticleIcon sx={sx} />;
  return <InsertDriveFileIcon sx={sx} />;
}

interface Props { item: DocumentActivity }

export const ActivityRow: React.FC<Props> = ({ item }) => {
  const meta   = getActivityMeta(item.activityType);
  const cfg    = getFileIconConfig(item.document?.fileType);
  const entityName = item.document?.fileName ?? item.folder?.name ?? '—';
  const userColor  = getUserColor(item.user.id);
  const initials   = getInitials(item.user.firstName, item.user.lastName);

  return (
    <TableRow
      hover
      sx={{
        '& td': { py: 1.1, borderBottom: '0.5px solid', borderColor: 'divider' },
        '&:last-child td': { borderBottom: 'none' },
      }}
    >
      {/* Action badge */}
      <TableCell sx={{ pl: 2, width: 120 }}>
        <Chip
          label={meta.label}
          size="small"
          sx={{
            height: 22, fontSize: 11, fontWeight: 600,
            bgcolor: meta.bg, color: meta.color, border: 'none',
            '& .MuiChip-label': { px: 1 },
          }}
        />
      </TableCell>

      {/* Name + folder/path */}
      <TableCell>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
          <EntityIcon item={item} />
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="body2" fontWeight={500} noWrap sx={{ fontSize: 13 }} title={entityName}>
              {entityName}
            </Typography>
            {item.document && item.folder === undefined && (
              <Typography variant="caption" color="text.secondary" noWrap sx={{ fontSize: 11 }}>
                {/* document w/o folder relation populated falls back silently */}
              </Typography>
            )}
            {item.folder && (
              <Typography variant="caption" color="text.secondary" noWrap
                sx={{ fontSize: 11, fontFamily: 'monospace' }}>
                {item.folder.path}
              </Typography>
            )}
          </Box>
        </Box>
      </TableCell>

      {/* Type badge */}
      <TableCell sx={{ width: 70 }}>
        {item.document && (
          <Chip label={cfg.label} size="small"
            sx={{ height: 20, fontSize: 10, fontWeight: 600, bgcolor: `${cfg.color}15`, color: cfg.color,
              border: 'none', '& .MuiChip-label': { px: 0.75 } }} />
        )}
        {item.folder && (
          <Chip label="Folder" size="small"
            sx={{ height: 20, fontSize: 10, fontWeight: 600, bgcolor: '#E6F1FB', color: '#1976d2',
              border: 'none', '& .MuiChip-label': { px: 0.75 } }} />
        )}
      </TableCell>

      {/* Description — comes pre-built from your backend */}
      <TableCell sx={{ maxWidth: 280 }}>
        <Typography variant="caption" color="text.secondary" noWrap sx={{ fontSize: 12 }} title={item.description}>
          {item.description}
        </Typography>
      </TableCell>

      {/* Performed by */}
      <TableCell sx={{ width: 160 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Avatar sx={{ bgcolor: userColor, width: 26, height: 26, fontSize: 10, fontWeight: 700, flexShrink: 0 }}>
            {initials}
          </Avatar>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="caption" fontWeight={500} noWrap sx={{ fontSize: 12, display: 'block' }}>
              {item.user.firstName} {item.user.lastName}
            </Typography>
            <Typography variant="caption" color="text.disabled" noWrap sx={{ fontSize: 10, display: 'block' }}>
              {item.user.email}
            </Typography>
          </Box>
        </Box>
      </TableCell>

      {/* Time */}
      <TableCell sx={{ width: 110 }}>
        <Tooltip title={new Date(item.createdAt).toLocaleString()} placement="left">
          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12, display: 'block' }}>
              {timeAgo(item.createdAt)}
            </Typography>
            <Typography variant="caption" color="text.disabled" sx={{ fontSize: 10 }}>
              {formatTime(item.createdAt)}
            </Typography>
          </Box>
        </Tooltip>
      </TableCell>
    </TableRow>
  );
};
