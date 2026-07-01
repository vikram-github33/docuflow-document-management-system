import React from 'react';
import { Box, Paper, Typography, Avatar, Skeleton } from '@mui/material';
import TimelineIcon from '@mui/icons-material/Timeline';
import type { ActivityItem } from '../../types/activity.types';
import { getActivityMeta, timeAgo, getUserColor, getInitials } from '../../utils/activity.utils';

interface ActivityFeedProps {
  items:   ActivityItem[];
  loading: boolean;
}

export const ActivityFeed: React.FC<ActivityFeedProps> = ({ items, loading }) => (
  <Paper variant="outlined" sx={{ borderRadius: 3, overflow: 'hidden' }}>
    <Box sx={{
      px: 2, py: 1.5,
      borderBottom: '0.5px solid', borderColor: 'divider',
      display: 'flex', alignItems: 'center', gap: 1,
    }}>
      <TimelineIcon sx={{ fontSize: 17, color: 'text.secondary' }} />
      <Typography variant="body2" fontWeight={600} sx={{ fontSize: 13 }}>
        Recent Activity
      </Typography>
    </Box>

    <Box sx={{ p: 1.5, display: 'flex', flexDirection: 'column', gap: 0 }}>
      {loading && Array.from({ length: 5 }).map((_, i) => (
        <Box key={i} sx={{ display: 'flex', gap: 1.5, py: 1 }}>
          <Skeleton variant="circular" width={32} height={32} sx={{ flexShrink: 0 }} />
          <Box sx={{ flex: 1 }}>
            <Skeleton width="70%" height={16} />
            <Skeleton width="40%" height={12} sx={{ mt: 0.5 }} />
          </Box>
        </Box>
      ))}

      {!loading && items.length === 0 && (
        <Box sx={{ py: 4, textAlign: 'center' }}>
          <Typography variant="caption" color="text.secondary">No recent activity</Typography>
        </Box>
      )}

      {!loading && items.map((item, idx) => {
        // ── Fixed: use real ActivityItem shape ──────────────────────────────
        const act    = getActivityMeta(item.activityType);                 // not item.type
        const name   = item.document?.fileName ?? item.folder?.name ?? ''; // not item.fileName / item.folderName
        const isLast = idx === items.length - 1;

        const userName     = `${item.user.firstName} ${item.user.lastName}`; // not item.userName
        const userInitials = getInitials(item.user.firstName, item.user.lastName); // not item.userInitials
        const userColor    = getUserColor(item.user.id);
        const timestamp    = item.createdAt; // not item.timestamp

        return (
          <Box
            key={item.id}
            sx={{
              display: 'flex', gap: 1.5, py: 1,
              borderBottom: isLast ? 'none' : '0.5px solid', borderColor: 'divider',
            }}
          >
            {/* User avatar */}
            <Avatar sx={{
              width: 30, height: 30, fontSize: 11, fontWeight: 600,
              bgcolor: userColor, color: '#fff', flexShrink: 0,
            }}>
              {userInitials}
            </Avatar>

            {/* Content */}
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, flexWrap: 'wrap' }}>
                <Typography sx={{ fontSize: 12, color: 'text.primary', fontWeight: 500 }}>
                  {userName}
                </Typography>
                <Box sx={{
                  fontSize: 11, px: 0.75, py: '1px',
                  borderRadius: 1, bgcolor: act.bg,
                  color: act.color, fontWeight: 500,
                }}>
                  {act.label}
                </Box>
                {name && (
                  <Typography sx={{ fontSize: 12, color: 'text.secondary' }} noWrap>
                    {name}
                  </Typography>
                )}
              </Box>
              <Typography variant="caption" color="text.disabled" sx={{ fontSize: 10 }}>
                {timeAgo(timestamp)}
              </Typography>
            </Box>
          </Box>
        );
      })}
    </Box>
  </Paper>
);
