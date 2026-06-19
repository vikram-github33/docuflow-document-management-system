import React, { useState } from 'react';
import {
  Box, Paper, Typography, Button,
  TextField, InputAdornment, Select, MenuItem, SelectChangeEvent,
} from '@mui/material';
import SearchIcon    from '@mui/icons-material/Search';
import DownloadIcon  from '@mui/icons-material/Download';
import { mockActivity } from '../data/mockData';
import { ActivityItem, ActivityType } from '../types';

const ACTION_COLORS: Record<ActivityType, string> = {
  upload: '#3B82F6',
  share:  '#10B981',
  edit:   '#F59E0B',
  view:   '#8B5CF6',
  delete: '#EF4444',
};

const EXTRA_LOGS: ActivityItem[] = [
  { id: 6, user: 'Aisha Sharma', action: 'approved', target: 'Vendor NDA — Globex.pdf',    dept: 'Legal',     time: '4 hours ago', type: 'view'   },
  { id: 7, user: 'Dev Mehta',    action: 'uploaded', target: 'Brand Guidelines 2026.png',  dept: 'Marketing', time: '5 hours ago', type: 'upload' },
  { id: 8, user: 'Priya Nair',   action: 'shared',   target: 'Employee Handbook v4.docx',  dept: 'HR',        time: '1 day ago',   type: 'share'  },
];

const ALL_LOGS: ActivityItem[] = [...mockActivity, ...EXTRA_LOGS];

const AuditLogs: React.FC = () => {
  const [search,       setSearch]       = useState<string>('');
  const [actionFilter, setActionFilter] = useState<string>('all');

  const filtered = ALL_LOGS.filter((l) => {
    const matchSearch = l.user.toLowerCase().includes(search.toLowerCase()) || l.target.toLowerCase().includes(search.toLowerCase());
    const matchAction = actionFilter === 'all' || l.type === actionFilter;
    return matchSearch && matchAction;
  });

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 0.5, fontWeight: 600 }}>Audit Logs</Typography>
      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>Track all user activity and document events.</Typography>

      <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'grey.200', borderRadius: 3, overflow: 'hidden' }}>
        <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'grey.200', display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
          <Typography sx={{ fontWeight: 600 }}>Activity timeline</Typography>

          <TextField
            size="small" placeholder="Search activity…" value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: 16 }} /></InputAdornment> }}
            sx={{ width: 220, ml: 'auto', '& .MuiOutlinedInput-root': { borderRadius: 6, fontSize: '0.8125rem' } }}
          />

          <Select
            size="small"
            value={actionFilter}
            onChange={(e: SelectChangeEvent) => setActionFilter(e.target.value)}
            sx={{ fontSize: '0.8rem', minWidth: 130 }}
          >
            <MenuItem value="all">All actions</MenuItem>
            {(['upload', 'share', 'edit', 'view', 'delete'] as ActivityType[]).map((a) => (
              <MenuItem key={a} value={a}>{a.charAt(0).toUpperCase() + a.slice(1)}</MenuItem>
            ))}
          </Select>

          <Button size="small" variant="outlined" startIcon={<DownloadIcon sx={{ fontSize: 15 }} />}
            sx={{ borderColor: 'grey.300', color: 'text.secondary', fontSize: '0.75rem' }}>
            Export CSV
          </Button>
        </Box>

        {filtered.map((log) => (
          <Box
            key={log.id}
            sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, px: 2, py: 1.5, borderBottom: '1px solid', borderColor: 'grey.100', '&:hover': { bgcolor: 'grey.50' }, '&:last-child': { borderBottom: 'none' } }}
          >
            <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: ACTION_COLORS[log.type], flexShrink: 0, mt: 0.75 }} />
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography sx={{ fontSize: '0.8125rem', color: 'text.primary' }}>
                <Box component="b" sx={{ fontWeight: 600 }}>{log.user}</Box>
                {' '}{log.action}{' '}
                <Box component="b" sx={{ fontWeight: 600 }}>{log.target}</Box>
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                IP 192.168.1.{(log.id * 17 + 20) % 200} · Chrome 120 · {log.dept}
              </Typography>
            </Box>
            <Typography variant="caption" sx={{ color: 'text.secondary', flexShrink: 0 }}>{log.time}</Typography>
          </Box>
        ))}

        <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'grey.100', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            Showing {filtered.length} of 8,421 entries · Logs retained for 365 days
          </Typography>
          <Button size="small" sx={{ fontSize: '0.75rem', color: 'primary.main' }}>Load more</Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default AuditLogs;
