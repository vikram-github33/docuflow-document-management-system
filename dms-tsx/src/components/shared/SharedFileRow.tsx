import React from 'react';
import {
  Box, Typography, Chip, Avatar,
  IconButton, Tooltip, TableRow, TableCell,
} from '@mui/material';
import DownloadIcon        from '@mui/icons-material/Download';
import VisibilityIcon      from '@mui/icons-material/Visibility';
import CloseIcon           from '@mui/icons-material/Close';
import PictureAsPdfIcon    from '@mui/icons-material/PictureAsPdf';
import ImageIcon           from '@mui/icons-material/Image';
import TableChartIcon      from '@mui/icons-material/TableChart';
import ArticleIcon         from '@mui/icons-material/Article';
import SlideshowIcon       from '@mui/icons-material/Slideshow';
import TextSnippetIcon     from '@mui/icons-material/TextSnippet';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import {
  getFileTypeConfig, formatFileSize, timeAgo,
  getAvatarColors, getInitials,
} from '../../utils/shared.utils';
import type { SharedWithMeItem } from '../../types/shared.types';

function FileIcon({ fileType, color }: { fileType: string; color: string }) {
  const sx = { fontSize: 20, color };
  if (fileType === 'application/pdf')                               return <PictureAsPdfIcon sx={sx} />;
  if (fileType.startsWith('image/'))                               return <ImageIcon sx={sx} />;
  if (fileType.includes('sheet') || fileType.includes('csv'))      return <TableChartIcon sx={sx} />;
  if (fileType.includes('word') || fileType.includes('document'))  return <ArticleIcon sx={sx} />;
  if (fileType.includes('presentation'))                           return <SlideshowIcon sx={sx} />;
  if (fileType === 'text/plain')                                   return <TextSnippetIcon sx={sx} />;
  return <InsertDriveFileIcon sx={sx} />;
}

interface Props {
  item:       any;
  onView:     (item: SharedWithMeItem) => void;
  onDownload: (item: SharedWithMeItem) => void;
  onRemove:   (item: SharedWithMeItem) => void;
}

export const SharedFileRow: React.FC<Props> = ({ item, onView, onDownload, onRemove }) => {
  const cfg    = getFileTypeConfig(item.document.fileType);
  const av     = getAvatarColors(item.sharedBy.name);
  const initials = getInitials(item?.firstName, item?.lastName);

  return (
    <TableRow
      hover
      sx={{
        cursor: 'pointer',
        '& td': { py: 1.25, borderBottom: '0.5px solid', borderColor: 'divider' },
        '&:last-child td': { borderBottom: 'none' },
        '& .row-actions': { opacity: 0 },
        '&:hover .row-actions': { opacity: 1 },
      }}
      onClick={() => onView(item)}
    >
      {/* Name */}
      <TableCell sx={{ pl: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
          <Box sx={{
            width: 36, height: 36, borderRadius: 1.5, flexShrink: 0,
            bgcolor: cfg.bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <FileIcon fileType={item.document.fileType} color={cfg.color} />
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="body2" noWrap fontWeight={500} sx={{ fontSize: 13 }}
              title={item.document.fileName}>
              {item.document.fileName}
            </Typography>
            {/* {item.message
              ? <Typography variant="caption" color="text.secondary" noWrap
                  sx={{ fontSize: 11, fontStyle: 'italic' }}>
                  "{item.message}"
                </Typography>
              : <Typography variant="caption" color="text.disabled" sx={{ fontSize: 11 }}>
                  {formatFileSize(item.document.sizeBytes)}
                </Typography>
            } */}
          </Box>
        </Box>
      </TableCell>

      {/* Type */}
      <TableCell sx={{ width: 72 }}>
        <Chip
          label={cfg.label}
          size="small"
          sx={{
            height: 20, fontSize: 10, fontWeight: 600,
            bgcolor: cfg.bg, color: cfg.color,
            border: 'none', '& .MuiChip-label': { px: 0.75 },
          }}
        />
      </TableCell>

      {/* Shared by */}
      <TableCell sx={{ width: 150 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Avatar sx={{ bgcolor: av.bg, color: av.color, width: 26, height: 26, fontSize: 10, fontWeight: 700 }}>
            {initials}
          </Avatar>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="caption" fontWeight={500} noWrap sx={{ fontSize: 12, display: 'block' }}>
              {item.sharedBy.name}
            </Typography>
            <Typography variant="caption" color="text.disabled" noWrap sx={{ fontSize: 10, display: 'block' }}>
              {item.sharedBy.email}
            </Typography>
          </Box>
        </Box>
      </TableCell>

      {/* Shared at */}
      <TableCell sx={{ width: 100 }}>
        <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12 }}>
          {timeAgo(item.sharedAt)}
        </Typography>
      </TableCell>

      {/* Actions */}
      <TableCell sx={{ width: 100 }} onClick={e => e.stopPropagation()}>
        <Box className="" sx={{ display: 'flex', gap: 0.5, transition: 'opacity 0.15s' }}>
          <Tooltip title="Download">
            <IconButton size="small" onClick={() => onDownload(item)} sx={{ p: 0.6 }}>
              <DownloadIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Tooltip>
          <Tooltip title="View">
            <IconButton size="small" color="primary" onClick={() => onView(item)} sx={{ p: 0.6 }}>
              <VisibilityIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Tooltip>
          {/* <Tooltip title="Remove access">
            <IconButton size="small" color="error" onClick={() => onRemove(item)} sx={{ p: 0.6 }}>
              <CloseIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Tooltip> */}
        </Box>
      </TableCell>
    </TableRow>
  );
};
