import React from 'react';
import { Box, Paper, Typography, Skeleton } from '@mui/material';

interface StatsCardProps {
  label:     string;
  value:     string | number;
  icon:      React.ReactNode;
  iconBg:    string;
  iconColor: string;
  sub?:      string;
  trend?:    { value: number; label: string };
  loading?:  boolean;
  onClick?:  () => void;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  label, value, icon, iconBg, iconColor, sub, trend, loading, onClick,
}) => (
  <Paper
    variant="outlined"
    onClick={onClick}
    sx={{
      p: 2.25,
      borderRadius: 3,
      cursor: onClick ? 'pointer' : 'default',
      transition: 'all 0.15s',
      '&:hover': onClick ? {
        borderColor: iconColor,
        boxShadow: `0 4px 20px ${iconColor}18`,
        transform: 'translateY(-1px)',
      } : {},
    }}
  >
    <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
      <Box>
        <Typography variant="caption" color="text.secondary"
          sx={{ fontSize: 11, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          {label}
        </Typography>
        {loading
          ? <Skeleton width={60} height={36} />
          : (
            <Typography sx={{ fontSize: 28, fontWeight: 600, lineHeight: 1.2, color: 'text.primary', mt: 0.25 }}>
              {value}
            </Typography>
          )
        }
        {sub && (
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: 11, mt: 0.25, display: 'block' }}>
            {sub}
          </Typography>
        )}
        {trend && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
            <Typography sx={{
              fontSize: 11, fontWeight: 600,
              color: trend.value >= 0 ? '#16a34a' : '#dc2626',
            }}>
              {trend.value >= 0 ? '↑' : '↓'} {Math.abs(trend.value)}%
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: 11 }}>
              {trend.label}
            </Typography>
          </Box>
        )}
      </Box>

      <Box sx={{
        width: 44, height: 44, borderRadius: 2.5,
        bgcolor: iconBg,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        <Box sx={{ color: iconColor, display: 'flex' }}>{icon}</Box>
      </Box>
    </Box>
  </Paper>
);
