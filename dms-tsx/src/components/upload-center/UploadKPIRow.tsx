import React from 'react';
import { Box, Typography } from '@mui/material';
import type { UploadKPIStats } from '../../types/upload.types';

interface KPICardProps {
  label: string;
  value: string | number;
  valueColor?: string;
}

const KPICard: React.FC<KPICardProps> = ({ label, value, valueColor }) => (
  <Box
    sx={{
      flex: 1,
      p: 1.5,
      borderRadius: 2,
      bgcolor: 'grey.100',
    }}
  >
    <Typography
      variant="h5"
      fontWeight={500}
      lineHeight={1}
      sx={{ color: valueColor ?? 'text.primary' }}
    >
      {value}
    </Typography>
    <Typography variant="caption" color="text.secondary" display="block" mt={0.5}>
      {label}
    </Typography>
  </Box>
);

interface UploadKPIRowProps {
  stats: UploadKPIStats;
}

export const UploadKPIRow: React.FC<UploadKPIRowProps> = ({ stats }) => (
  <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1.5 }}>
    <KPICard label="Total" value={stats.total} />
    <KPICard label="Uploading" value={stats.uploading} valueColor="#BA7517" />
    <KPICard label="Done" value={stats.success} valueColor="#3B6D11" />
    <KPICard label="Failed" value={stats.failed} valueColor="#A32D2D" />
  </Box>
);
