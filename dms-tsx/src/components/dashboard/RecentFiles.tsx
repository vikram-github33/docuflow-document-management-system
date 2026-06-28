import React from 'react';
import {
  Box, Paper, Typography, Chip, IconButton,
  Skeleton, Table, TableBody, TableCell,
  TableHead, TableRow, Tooltip,
} from '@mui/material';
import StarIcon       from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import MoreVertIcon   from '@mui/icons-material/MoreVert';
import OpenInNewIcon  from '@mui/icons-material/OpenInNew';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import PictureAsPdfIcon    from '@mui/icons-material/PictureAsPdf';
import ImageIcon           from '@mui/icons-material/Image';
import TableChartIcon      from '@mui/icons-material/TableChart';
import ArticleIcon         from '@mui/icons-material/Article';
import { getFileIconConfig, timeAgo, truncate } from '../../utils/dashboard.utils';
import type { RecentDocument } from '../../types/dashboard.types';

function FileIcon({ fileType, color }: { fileType: string; color: string }) {
  const sx = { fontSize: 18, color, flexShrink: 0 };
  if (fileType === 'application/pdf')                              return <PictureAsPdfIcon sx={sx} />;
  if (fileType.startsWith('image/'))                              return <ImageIcon sx={sx} />;
  if (fileType.includes('sheet') || fileType.includes('csv'))     return <TableChartIcon sx={sx} />;
  if (fileType.includes('word') || fileType.includes('document')) return <ArticleIcon sx={sx} />;
  return <InsertDriveFileIcon sx={sx} />;
}

interface RecentFilesProps {
  documents: RecentDocument[];
  loading:   boolean;
  onViewAll?: () => void;
}

export const RecentFiles: React.FC<RecentFilesProps> = ({ documents, loading, onViewAll }) => (
  <Paper variant="outlined" sx={{ borderRadius: 3, overflow: 'hidden' }}>
    {/* Header */}
    <Box sx={{
      px: 2, py: 1.5,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      borderBottom: '0.5px solid', borderColor: 'divider',
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <AccessTimeIcon sx={{ fontSize: 17, color: 'text.secondary' }} />
        <Typography variant="body2" fontWeight={600} sx={{ fontSize: 13 }}>
          Recent Files
        </Typography>
      </Box>
      {onViewAll && (
        <Typography
          variant="caption"
          onClick={onViewAll}
          sx={{ fontSize: 12, color: 'primary.main', cursor: 'pointer', fontWeight: 500,
            '&:hover': { textDecoration: 'underline' } }}
        >
          View all
        </Typography>
      )}
    </Box>

    {/* Loading skeletons */}
    {loading && (
      <Box sx={{ p: 1.5, display: 'flex', flexDirection: 'column', gap: 1 }}>
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} height={44} sx={{ borderRadius: 1 }} />
        ))}
      </Box>
    )}

    {/* Empty */}
    {!loading && documents.length === 0 && (
      <Box sx={{ py: 5, textAlign: 'center' }}>
        <InsertDriveFileIcon sx={{ fontSize: 36, color: 'text.disabled', mb: 1 }} />
        <Typography variant="body2" color="text.secondary">No recent files</Typography>
      </Box>
    )}

    {/* Table — matches your DocuFlow FILES table exactly */}
    {!loading && documents.length > 0 && (
      <Table size="small">
        <TableHead>
          <TableRow sx={{ bgcolor: 'grey.50' }}>
            <TableCell sx={{ fontSize: 10, fontWeight: 600, color: 'text.secondary',
              textTransform: 'uppercase', letterSpacing: '0.05em', pl: 2 }}>
              Name
            </TableCell>
            <TableCell sx={{ fontSize: 10, fontWeight: 600, color: 'text.secondary',
              textTransform: 'uppercase', letterSpacing: '0.05em', width: 70 }}>
              Type
            </TableCell>
            <TableCell sx={{ fontSize: 10, fontWeight: 600, color: 'text.secondary',
              textTransform: 'uppercase', letterSpacing: '0.05em', width: 70 }}>
              Favourite
            </TableCell>
            <TableCell sx={{ fontSize: 10, fontWeight: 600, color: 'text.secondary',
              textTransform: 'uppercase', letterSpacing: '0.05em', width: 100 }}>
              Modified
            </TableCell>
            <TableCell sx={{ width: 40 }} />
          </TableRow>
        </TableHead>
        <TableBody>
          {documents.map(doc => {
            const cfg = getFileIconConfig(doc.fileType);
            return (
              <TableRow
                key={doc.id}
                hover
                sx={{
                  cursor: 'pointer',
                  '& td': { py: 1, borderBottom: '0.5px solid', borderColor: 'divider' },
                  '&:last-child td': { borderBottom: 'none' },
                }}
                onClick={() => window.open(doc.fileUrl, '_blank')}
              >
                <TableCell sx={{ pl: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                    <FileIcon fileType={doc.fileType} color={cfg.color} />
                    <Box sx={{ minWidth: 0 }}>
                      <Typography variant="body2" noWrap fontWeight={500} sx={{ fontSize: 13 }}>
                        {truncate(doc.fileName)}
                      </Typography>
                      {doc.folderName && (
                        <Typography variant="caption" color="text.secondary" noWrap sx={{ fontSize: 11 }}>
                          📁 {doc.folderName}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip label={cfg.label} size="small"
                    sx={{ height: 20, fontSize: 10, fontWeight: 600,
                      bgcolor: `${cfg.color}15`, color: cfg.color,
                      border: 'none', '& .MuiChip-label': { px: 0.75 } }} />
                </TableCell>
                <TableCell onClick={e => e.stopPropagation()}>
                  <IconButton size="small" sx={{ p: 0.5 }}>
                    {doc.isFavourite
                      ? <StarIcon sx={{ fontSize: 16, color: '#F9A825' }} />
                      : <StarBorderIcon sx={{ fontSize: 16, color: 'text.disabled' }} />
                    }
                  </IconButton>
                </TableCell>
                <TableCell>
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12 }}>
                    {timeAgo(doc.updatedAt)}
                  </Typography>
                </TableCell>
                <TableCell onClick={e => e.stopPropagation()}>
                  <IconButton size="small" sx={{ p: 0.5 }}>
                    <MoreVertIcon sx={{ fontSize: 15 }} />
                  </IconButton>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    )}
  </Paper>
);
