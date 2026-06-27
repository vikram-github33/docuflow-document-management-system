import React from 'react';
import { Box, Typography } from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

export const TrashEmptyState: React.FC = () => (
  <Box sx={{
    py: 8,
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center', gap: 1.5,
  }}>
    <Box sx={{
      width: 64, height: 64, borderRadius: 3,
      bgcolor: 'grey.100',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <DeleteOutlineIcon sx={{ fontSize: 34, color: 'text.disabled' }} />
    </Box>
    <Typography variant="body1" fontWeight={500} color="text.secondary">
      Trash is empty
    </Typography>
    <Typography variant="caption" color="text.disabled" textAlign="center">
      Deleted files and folders will appear here for 30 days before being permanently removed.
    </Typography>
  </Box>
);
