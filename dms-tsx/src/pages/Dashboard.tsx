import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Grid, Paper, Typography, Button, LinearProgress } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import FolderIcon        from '@mui/icons-material/Folder';
import CloudUploadIcon   from '@mui/icons-material/CloudUpload';
import StorageIcon       from '@mui/icons-material/Storage';
import PeopleIcon        from '@mui/icons-material/People';
import { FileIcon, StatusPill, UserAvatar } from '../components/ui/SharedUI';
import {
  mockDocuments, mockActivity, mockApprovals, mockUploadStats,
} from '../data/mockData';
import { ActivityType } from '../types';

// ─── Activity dot colors ─────────────────────────────────────────────────────
const ACTIVITY_COLORS: Record<ActivityType, string> = {
  upload: '#3B82F6',
  share:  '#10B981',
  edit:   '#F59E0B',
  view:   '#8B5CF6',
  delete: '#EF4444',
};

const ACTIVITY_SYMBOLS: Record<ActivityType, string> = {
  upload: '↑', share: '⇌', edit: '✎', view: '👁', delete: '✕',
};

// ─── Metric Card ─────────────────────────────────────────────────────────────
interface MetricCardProps {
  title:   string;
  value:   string;
  sub:     string;
  icon:    React.ReactNode;
  iconBg:  string;
  iconColor: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, sub, icon, iconBg, iconColor }) => (
  <Paper elevation={0} sx={{ p: 2.5, border: '1px solid', borderColor: 'grey.200', borderRadius: 3, height: '100%' }}>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <Box>
        <Typography variant="overline" sx={{ color: 'text.secondary', lineHeight: 1, display: 'block', mb: 1, fontSize: '0.65rem' }}>{title}</Typography>
        <Typography sx={{ fontSize: 28, fontWeight: 600, color: 'text.primary', lineHeight: 1 }}>{value}</Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary', mt: 0.5, display: 'block' }}>{sub}</Typography>
      </Box>
      <Box sx={{ width: 40, height: 40, borderRadius: 2, bgcolor: iconBg, color: iconColor, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {icon}
      </Box>
    </Box>
  </Paper>
);

// ─── Dashboard ───────────────────────────────────────────────────────────────
const Dashboard: React.FC = () => {
  const navigate  = useNavigate();
  const recent    = mockDocuments.slice(0, 6);
  const pending   = mockApprovals.filter((a) => a.status === 'pending').slice(0, 3);

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 0.5, fontWeight: 600 }}>Dashboard</Typography>
      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
        Welcome back, Aisha. Here's what's happening today.
      </Typography>

      {/* KPI Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {([
          { title: 'Total Documents',    value: '12,481', sub: '↑ 8.2% vs last month', icon: <FolderIcon />,      iconBg: '#EFF6FF', iconColor: '#2563EB' },
          { title: 'Uploaded This Month',value: '1,034',  sub: '↑ 12% vs prior month', icon: <CloudUploadIcon />, iconBg: '#ECFDF5', iconColor: '#059669' },
          { title: 'Storage Used',       value: '340 GB', sub: 'of 500 GB total (68%)', icon: <StorageIcon />,    iconBg: '#FFFBEB', iconColor: '#D97706' },
          { title: 'Active Users',       value: '248',    sub: '↑ 4 new this week',     icon: <PeopleIcon />,     iconBg: '#EDE9FE', iconColor: '#7C3AED' },
        ] as MetricCardProps[]).map((m) => (
          <Grid item xs={12} sm={6} lg={3} key={m.title}>
            <MetricCard {...m} />
          </Grid>
        ))}
      </Grid>

      {/* Storage bar */}
      <Paper elevation={0} sx={{ p: 2, border: '1px solid', borderColor: 'grey.200', borderRadius: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
          <Typography variant="body2" sx={{ fontWeight: 500 }}>Storage usage</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>340 GB / 500 GB</Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={68}
          sx={{ height: 8, borderRadius: 4, bgcolor: 'grey.200', '& .MuiLinearProgress-bar': { borderRadius: 4 } }}
        />
      </Paper>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        {/* Recent Documents */}
        <Grid item xs={12} lg={8}>
          <Paper elevation={0} sx={{ p: 2.5, border: '1px solid', borderColor: 'grey.200', borderRadius: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>Recent documents</Typography>
              <Button size="small" onClick={() => navigate('/documents')}>View all →</Button>
            </Box>
            {recent.map((doc) => (
              <Box
                key={doc.id}
                sx={{
                  display: 'flex', alignItems: 'center', gap: 1.5, py: 1,
                  borderBottom: '1px solid', borderColor: 'grey.100',
                  '&:last-child': { borderBottom: 'none' }, cursor: 'pointer',
                  '&:hover .doc-name': { color: 'primary.main' },
                }}
              >
                <FileIcon type={doc.type} size={34} />
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography className="doc-name" sx={{ fontSize: '0.8125rem', fontWeight: 500, color: 'text.primary', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', transition: 'color .15s' }}>
                    {doc.name}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    {doc.department} · Modified {doc.modified}
                  </Typography>
                </Box>
                <Typography variant="caption" sx={{ color: 'text.secondary', flexShrink: 0 }}>{doc.size}</Typography>
                <StatusPill status={doc.status} />
              </Box>
            ))}
          </Paper>
        </Grid>

        {/* Right column */}
        <Grid item xs={12} lg={4}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Quick Actions */}
            <Paper elevation={0} sx={{ p: 2.5, border: '1px solid', borderColor: 'grey.200', borderRadius: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1.5 }}>Quick actions</Typography>
              <Grid container spacing={1}>
                {([
                  { label: 'Upload files',    path: '/upload',    bg: '#EFF6FF', color: '#2563EB' },
                  { label: 'New folder',      path: '/documents', bg: '#FFFBEB', color: '#D97706' },
                  { label: 'Share doc',       path: '/documents', bg: '#ECFDF5', color: '#059669' },
                  { label: 'Advanced search', path: '/search',    bg: '#EDE9FE', color: '#7C3AED' },
                ]).map((a) => (
                  <Grid item xs={6} key={a.label}>
                    <Button
                      onClick={() => navigate(a.path)} fullWidth variant="outlined"
                      sx={{ py: 1.2, fontSize: '0.75rem', fontWeight: 500, borderColor: 'grey.200', color: 'text.secondary', justifyContent: 'flex-start', '&:hover': { bgcolor: a.bg, borderColor: a.color, color: a.color } }}
                    >
                      {a.label}
                    </Button>
                  </Grid>
                ))}
              </Grid>
            </Paper>

            {/* Pending Approvals */}
            <Paper elevation={0} sx={{ p: 2.5, border: '1px solid', borderColor: 'grey.200', borderRadius: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>Pending approvals</Typography>
                <Button size="small" onClick={() => navigate('/approvals')}>View all →</Button>
              </Box>
              {pending.map((a) => (
                <Box key={a.id} sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 0.75, borderBottom: '1px solid', borderColor: 'grey.100', '&:last-child': { borderBottom: 'none' } }}>
                  <FileIcon type={a.type} size={28} />
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{a.name}</Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>by {a.requestedBy}</Typography>
                  </Box>
                  <StatusPill status={a.status} />
                </Box>
              ))}
            </Paper>
          </Box>
        </Grid>
      </Grid>

      {/* Activity + Chart */}
      <Grid container spacing={2}>
        <Grid item xs={12} lg={6}>
          <Paper elevation={0} sx={{ p: 2.5, border: '1px solid', borderColor: 'grey.200', borderRadius: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>Recent activity</Typography>
              <Button size="small" onClick={() => navigate('/audit')}>Audit logs →</Button>
            </Box>
            {mockActivity.map((a) => (
              <Box key={a.id} sx={{ display: 'flex', gap: 1.5, py: 1, borderBottom: '1px solid', borderColor: 'grey.100', '&:last-child': { borderBottom: 'none' } }}>
                <Box sx={{ width: 30, height: 30, borderRadius: '50%', bgcolor: `${ACTIVITY_COLORS[a.type]}20`, color: ACTIVITY_COLORS[a.type], display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, flexShrink: 0, mt: 0.25 }}>
                  {ACTIVITY_SYMBOLS[a.type]}
                </Box>
                <Box>
                  <Typography sx={{ fontSize: '0.8rem', color: 'text.secondary' }}>
                    <Box component="b" sx={{ fontWeight: 600 }}>{a.user}</Box> {a.action}{' '}
                    <Box component="b" sx={{ fontWeight: 600 }}>{a.target}</Box>
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>{a.time} · {a.dept}</Typography>
                </Box>
              </Box>
            ))}
          </Paper>
        </Grid>

        <Grid item xs={12} lg={6}>
          <Paper elevation={0} sx={{ p: 2.5, border: '1px solid', borderColor: 'grey.200', borderRadius: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Upload activity — last 7 days</Typography>
            <ResponsiveContainer width="100%" height={150}>
              <BarChart data={mockUploadStats} barSize={28}>
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #E5E7EB', boxShadow: 'none' }} />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {mockUploadStats.map((entry, i) => (
                    <Cell key={i} fill={entry.day === 'Wed' ? '#2563EB' : '#BFDBFE'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <Box sx={{ display: 'flex', gap: 3, mt: 1 }}>
              {[['Peak', 'Wed 100 docs'], ['Avg', '60 / day'], ['Total', '419 docs']].map(([k, v]) => (
                <Box key={k}>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>{k}: </Typography>
                  <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.primary' }}>{v}</Typography>
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
