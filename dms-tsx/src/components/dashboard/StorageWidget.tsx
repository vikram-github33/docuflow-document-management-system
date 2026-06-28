import React from 'react';
import { Box, Paper, Typography, LinearProgress, Skeleton } from '@mui/material';
import StorageIcon from '@mui/icons-material/Storage';
import { formatBytes, storagePercent } from '../../utils/dashboard.utils';

interface StorageWidgetProps {
  usedBytes:  number;
  limitBytes: number;
  loading?:   boolean;
}

export const StorageWidget: React.FC<StorageWidgetProps> = ({
  usedBytes, limitBytes, loading,
}) => {
  const pct   = storagePercent(usedBytes, limitBytes);
  const color = pct > 90 ? '#e53935' : pct > 70 ? '#F9A825' : '#1976d2';

  return (
    <Paper variant="outlined" sx={{ p: 2.25, borderRadius: 3, height: '100%' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <StorageIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
        <Typography variant="body2" fontWeight={600} sx={{ fontSize: 13 }}>
          Storage
        </Typography>
      </Box>

      {loading ? (
        <>
          <Skeleton height={12} sx={{ borderRadius: 2, mb: 1 }} />
          <Skeleton width={120} height={20} />
        </>
      ) : (
        <>
          {/* Progress bar */}
          <Box sx={{ mb: 1.5 }}>
            <LinearProgress
              variant="determinate"
              value={pct}
              sx={{
                height: 8, borderRadius: 4,
                bgcolor: 'grey.100',
                '& .MuiLinearProgress-bar': { bgcolor: color, borderRadius: 4 },
              }}
            />
          </Box>

          {/* Labels */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <Box>
              <Typography sx={{ fontSize: 20, fontWeight: 600, lineHeight: 1.1, color }}>
                {pct}%
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: 11 }}>
                {formatBytes(usedBytes)} of {formatBytes(limitBytes)} used
              </Typography>
            </Box>
            {pct > 80 && (
              <Typography variant="caption" sx={{ fontSize: 11, color: 'warning.main', fontWeight: 500 }}>
                Running low
              </Typography>
            )}
          </Box>

          {/* Breakdown */}
          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 0.75 }}>
            {[
              { label: 'Documents', pct: 55, color: '#1976d2' },
              { label: 'Images',    pct: 28, color: '#1e88e5' },
              { label: 'Other',     pct: 17, color: '#90caf9' },
            ].map(item => (
              <Box key={item.label}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.25 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: 11 }}>
                    {item.label}
                  </Typography>
                  <Typography variant="caption" sx={{ fontSize: 11, fontWeight: 500, color: item.color }}>
                    {item.pct}%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={item.pct}
                  sx={{
                    height: 3, borderRadius: 2,
                    bgcolor: 'grey.100',
                    '& .MuiLinearProgress-bar': { bgcolor: item.color, borderRadius: 2 },
                  }}
                />
              </Box>
            ))}
          </Box>
        </>
      )}
    </Paper>
  );
};
