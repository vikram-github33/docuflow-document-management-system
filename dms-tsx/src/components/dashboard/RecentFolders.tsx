import React from 'react';
import { Box, Paper, Typography, Skeleton } from '@mui/material';
import FolderIcon        from '@mui/icons-material/Folder';
import FolderOpenIcon    from '@mui/icons-material/FolderOpen';
import ChevronRightIcon  from '@mui/icons-material/ChevronRight';
import type { RecentFolder } from '../../types/dashboard.types';
import { timeAgo } from '../../utils/dashboard.utils';

interface RecentFoldersProps {
  folders:   RecentFolder[];
  loading:   boolean;
  onOpen?:   (folder: RecentFolder) => void;
  onViewAll?: () => void;
}

export const RecentFolders: React.FC<RecentFoldersProps> = ({
  folders, loading, onOpen, onViewAll,
}) => (
  <Paper variant="outlined" sx={{ borderRadius: 3, overflow: 'hidden' }}>
    <Box sx={{
      px: 2, py: 1.5,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      borderBottom: '0.5px solid', borderColor: 'divider',
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <FolderOpenIcon sx={{ fontSize: 17, color: 'text.secondary' }} />
        <Typography variant="body2" fontWeight={600} sx={{ fontSize: 13 }}>
          Recent Folders
        </Typography>
      </Box>
      {onViewAll && (
        <Typography variant="caption" onClick={onViewAll}
          sx={{ fontSize: 12, color: 'primary.main', cursor: 'pointer', fontWeight: 500,
            '&:hover': { textDecoration: 'underline' } }}>
          View all
        </Typography>
      )}
    </Box>

    <Box sx={{ p: 1.5, display: 'flex', flexDirection: 'column', gap: 0.75 }}>
      {loading && Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} height={52} sx={{ borderRadius: 2 }} />
      ))}

      {!loading && folders.length === 0 && (
        <Box sx={{ py: 4, textAlign: 'center' }}>
          <FolderIcon sx={{ fontSize: 32, color: 'text.disabled', mb: 0.5 }} />
          <Typography variant="caption" color="text.secondary" display="block">
            No recent folders
          </Typography>
        </Box>
      )}

      {!loading && folders.map(f => {
        const color = f.color ?? '#1976d2';
        return (
          <Box
            key={f.id}
            onClick={() => onOpen?.(f)}
            sx={{
              display: 'flex', alignItems: 'center', gap: 1.25,
              p: 1.25, borderRadius: 2,
              border: '0.5px solid', borderColor: 'divider',
              cursor: 'pointer',
              transition: 'all 0.12s',
              '&:hover': { borderColor: color, bgcolor: `${color}08`, '& .arrow': { opacity: 1 } },
            }}
          >
            {/* Folder icon */}
            <Box sx={{
              width: 36, height: 36, borderRadius: 1.5,
              bgcolor: `${color}15`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <FolderIcon sx={{ fontSize: 20, color }} />
            </Box>

            {/* Info */}
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="body2" noWrap fontWeight={500} sx={{ fontSize: 13 }}>
                {f.name}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: 11 }}>
                  {f.documentCount} file{f.documentCount !== 1 ? 's' : ''}
                </Typography>
                <Typography variant="caption" color="text.disabled" sx={{ fontSize: 11 }}>
                  · {timeAgo(f.updatedAt)}
                </Typography>
              </Box>
            </Box>

            <ChevronRightIcon
              className="arrow"
              sx={{ fontSize: 18, color: 'text.disabled', opacity: 0, transition: 'opacity 0.12s', flexShrink: 0 }}
            />
          </Box>
        );
      })}
    </Box>
  </Paper>
);
