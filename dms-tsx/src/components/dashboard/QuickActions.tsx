import React from 'react';
import { Box, Paper, Typography, ButtonBase } from '@mui/material';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import UploadFileIcon      from '@mui/icons-material/UploadFile';
import PeopleIcon          from '@mui/icons-material/People';
import SearchIcon          from '@mui/icons-material/Search';
import { useNavigate }     from 'react-router-dom';

interface Action {
  icon:  React.ReactNode;
  label: string;
  sub:   string;
  bg:    string;
  color: string;
  path:  string;
}

const ACTIONS: Action[] = [
  {
    icon:  <CreateNewFolderIcon sx={{ fontSize: 22 }} />,
    label: 'New Folder',
    sub:   'Create a folder',
    bg:    '#E6F1FB', color: '#1976d2',
    path:  '/documents',
  },
  {
    icon:  <UploadFileIcon sx={{ fontSize: 22 }} />,
    label: 'Upload',
    sub:   'Add files',
    bg:    '#EAF3DE', color: '#2e7d32',
    path:  '/upload-center',
  },
  {
    icon:  <PeopleIcon sx={{ fontSize: 22 }} />,
    label: 'Share',
    sub:   'Invite members',
    bg:    '#F3E8FF', color: '#7b1fa2',
    path:  '/shared',
  },
  {
    icon:  <SearchIcon sx={{ fontSize: 22 }} />,
    label: 'Search',
    sub:   'Find anything',
    bg:    '#FFF9E6', color: '#F9A825',
    path:  '/search',
  },
];

export const QuickActions: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Paper variant="outlined" sx={{ p: 2, borderRadius: 3 }}>
      <Typography variant="body2" fontWeight={600} sx={{ fontSize: 13, mb: 1.5 }}>
        Quick Actions
      </Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
        {ACTIONS.map(a => (
          <ButtonBase
            key={a.label}
            onClick={() => navigate(a.path)}
            sx={{
              display: 'flex', alignItems: 'center', gap: 1.25,
              p: 1.25, borderRadius: 2,
              border: '0.5px solid', borderColor: 'divider',
              textAlign: 'left', width: '100%',
              transition: 'all 0.15s',
              '&:hover': { borderColor: a.color, bgcolor: `${a.bg}80`, transform: 'translateY(-1px)' },
            }}
          >
            <Box sx={{
              width: 36, height: 36, borderRadius: 1.5,
              bgcolor: a.bg, color: a.color,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              {a.icon}
            </Box>
            <Box>
              <Typography sx={{ fontSize: 12, fontWeight: 600, color: 'text.primary', lineHeight: 1.2 }}>
                {a.label}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: 11 }}>
                {a.sub}
              </Typography>
            </Box>
          </ButtonBase>
        ))}
      </Box>
    </Paper>
  );
};
