import React from 'react';
import { Box, Paper, Typography, Skeleton } from '@mui/material';
import CloudUploadIcon   from '@mui/icons-material/CloudUpload';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ShareIcon         from '@mui/icons-material/Share';
import StarIcon          from '@mui/icons-material/Star';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import type { ActivityItem } from '../../types/activity.types';

interface StatProps { label: string; value: number; icon: React.ReactNode; bg: string; color: string; loading: boolean }

function StatCard({ label, value, icon, bg, color, loading }: StatProps) {
  return (
    <Paper variant="outlined" sx={{ p: 2, borderRadius: 2.5, flex: 1 }}>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <Box>
          <Typography variant="caption" color="text.secondary"
            sx={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>
            {label}
          </Typography>
          {loading
            ? <Skeleton width={40} height={32} />
            : <Typography sx={{ fontSize: 26, fontWeight: 600, lineHeight: 1.1, color: 'text.primary' }}>
                {value}
              </Typography>
          }
        </Box>
        <Box sx={{ width: 36, height: 36, borderRadius: 2, bgcolor: bg,
          display: 'flex', alignItems: 'center', justifyContent: 'center', color }}>
          {icon}
        </Box>
      </Box>
    </Paper>
  );
}

interface Props { items: ActivityItem[]; loading: boolean }

export const ActivityStatsRow: React.FC<Props> = ({ items, loading }) => {
  const count = (type: string) => items.filter(i => i.type === type).length;

  const stats = [
    { label: 'Uploads',    value: count('upload'),        icon: <CloudUploadIcon sx={{ fontSize: 18 }} />,    bg: '#E6F1FB', color: '#1976d2' },
    { label: 'Downloads',  value: count('download'),      icon: <CloudDownloadIcon sx={{ fontSize: 18 }} />,  bg: '#E1F5FE', color: '#0288d1' },
    { label: 'Deletes',    value: count('delete'),        icon: <DeleteOutlineIcon sx={{ fontSize: 18 }} />,  bg: '#FEEBEB', color: '#e53935' },
    { label: 'Shares',     value: count('share'),         icon: <ShareIcon sx={{ fontSize: 18 }} />,          bg: '#F3E8FF', color: '#7b1fa2' },
    { label: 'Starred',    value: count('favourite'),     icon: <StarIcon sx={{ fontSize: 18 }} />,            bg: '#FFF9E6', color: '#F9A825' },
    { label: 'Folders',    value: count('create_folder'), icon: <CreateNewFolderIcon sx={{ fontSize: 18 }} />, bg: '#EAF3DE', color: '#2e7d32' },
  ];

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 1.5, mb: 2 }}>
      {stats.map(s => <StatCard key={s.label} {...s} loading={loading} />)}
    </Box>
  );
};
