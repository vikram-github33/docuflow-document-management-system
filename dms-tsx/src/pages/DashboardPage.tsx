import React, { useCallback, useEffect, useState } from 'react';
import {
  Box, Typography, Alert, IconButton,
  Tooltip, Skeleton, Chip, Avatar,
} from '@mui/material';
import RefreshIcon             from '@mui/icons-material/Refresh';
import InsertDriveFileIcon     from '@mui/icons-material/InsertDriveFile';
import FolderIcon              from '@mui/icons-material/Folder';
import StarIcon                from '@mui/icons-material/Star';
import DeleteOutlineIcon       from '@mui/icons-material/DeleteOutline';
import PeopleIcon              from '@mui/icons-material/People';
import CloudUploadIcon         from '@mui/icons-material/CloudUpload';
import WavingHandIcon          from '@mui/icons-material/WavingHand';
import { useNavigate }         from 'react-router-dom';
import { StatsCard }           from '../components/dashboard/StatsCard';
import { StorageWidget }       from '../components/dashboard/StorageWidget';
import { RecentFiles }         from '../components/dashboard/RecentFiles';
import { RecentFolders }       from '../components/dashboard/RecentFolders';
import { ActivityFeed }        from '../components/dashboard/ActivityFeed';
import { QuickActions }        from '../components/dashboard/QuickActions';
import { dashboardService }    from '../services/dashboard.service';
import type { DashboardData, RecentFolder } from '../types/dashboard.types';

// ── Mock data — replace with real API calls ────────────────────────────────────
const MOCK: DashboardData = {
  stats: {
    totalDocuments:    1247,
    totalFolders:       84,
    storageUsedBytes:  4.2 * 1024 * 1024 * 1024,
    storageLimitBytes: 10 * 1024 * 1024 * 1024,
    favouritesCount:   23,
    trashedCount:       8,
    sharedWithMeCount: 15,
    uploadedThisMonth: 136,
  },
  recentDocuments: [
    { id:'1', fileName:'Sanjana morade -CV.pdf',     fileType:'application/pdf',  fileUrl:'#', folderName:'Tree 2',  updatedAt: new Date(Date.now()-5*60000).toISOString(),   isFavourite: true  },
    { id:'2', fileName:'bank statement.pdf',          fileType:'application/pdf',  fileUrl:'#', folderName:'Finance', updatedAt: new Date(Date.now()-2*3600000).toISOString(),  isFavourite: false },
    { id:'3', fileName:'Payslip_Jul_2022.pdf',        fileType:'application/pdf',  fileUrl:'#', folderName:'Tree 2',  updatedAt: new Date(Date.now()-86400000).toISOString(),   isFavourite: false },
    { id:'4', fileName:'screenshot.png',              fileType:'image/png',        fileUrl:'#', folderName:'Images',  updatedAt: new Date(Date.now()-2*86400000).toISOString(), isFavourite: false },
    { id:'5', fileName:'Q3_Report.xlsx',              fileType:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', fileUrl:'#', folderName:'Finance', updatedAt: new Date(Date.now()-3*86400000).toISOString(), isFavourite: false },
    { id:'6', fileName:'Resume_bec0b8d6.pdf',         fileType:'application/pdf',  fileUrl:'#', folderName:'Tree 2',  updatedAt: new Date(Date.now()-4*86400000).toISOString(), isFavourite: true  },
  ],
  recentFolders: [
    { id:'f1', name:'Tree 2',   path:'/Tree/Tree 2',   color:'#1976d2', documentCount: 8, updatedAt: new Date(Date.now()-30*60000).toISOString() },
    { id:'f2', name:'Finance',  path:'/Finance',       color:'#2e7d32', documentCount: 24, updatedAt: new Date(Date.now()-2*3600000).toISOString() },
    { id:'f3', name:'HR Docs',  path:'/HR Docs',       color:'#7b1fa2', documentCount: 12, updatedAt: new Date(Date.now()-86400000).toISOString() },
    { id:'f4', name:'Projects', path:'/Projects',      color:'#e65100', documentCount: 37, updatedAt: new Date(Date.now()-2*86400000).toISOString() },
  ],
  activity: [
    { id:'a1', type:'upload',        fileName:'Sanjana morade -CV.pdf',   userName:'Aisha Sharma',  userInitials:'AS', timestamp: new Date(Date.now()-5*60000).toISOString() },
    { id:'a2', type:'favourite',     fileName:'Resume_bec0b8d6.pdf',      userName:'Aisha Sharma',  userInitials:'AS', timestamp: new Date(Date.now()-20*60000).toISOString() },
    { id:'a3', type:'create_folder', folderName:'Tree 2',                 userName:'Rahul Mehta',   userInitials:'RM', timestamp: new Date(Date.now()-2*3600000).toISOString() },
    { id:'a4', type:'share',         fileName:'Q3_Report.xlsx',           userName:'Priya Nair',    userInitials:'PN', timestamp: new Date(Date.now()-4*3600000).toISOString() },
    { id:'a5', type:'delete',        fileName:'old_draft.docx',           userName:'Aisha Sharma',  userInitials:'AS', timestamp: new Date(Date.now()-86400000).toISOString() },
    { id:'a6', type:'restore',       fileName:'bank statement.pdf',       userName:'Rahul Mehta',   userInitials:'RM', timestamp: new Date(Date.now()-2*86400000).toISOString() },
  ],
  storageBreakdown: [],
};

// ── Greeting based on time of day ──────────────────────────────────────────────
function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

// ── Main Dashboard ─────────────────────────────────────────────────────────────
const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [data,    setData]    = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      // Swap with: const result = await dashboardService.getDashboardData();
      await new Promise(r => setTimeout(r, 600)); // simulates network
      setData(MOCK);
    } catch {
      setError('Failed to load dashboard data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const stats = data?.stats;

  const STAT_CARDS = [
    {
      label:   'Total Documents',
      value:   loading ? '—' : (stats?.totalDocuments ?? 0).toLocaleString(),
      icon:    <InsertDriveFileIcon sx={{ fontSize: 22 }} />,
      iconBg:  '#E6F1FB', iconColor: '#1976d2',
      sub:     `${stats?.uploadedThisMonth ?? 0} uploaded this month`,
      trend:   { value: 12, label: 'vs last month' },
      onClick: () => navigate('/documents'),
    },
    {
      label:   'Total Folders',
      value:   loading ? '—' : (stats?.totalFolders ?? 0).toLocaleString(),
      icon:    <FolderIcon sx={{ fontSize: 22 }} />,
      iconBg:  '#EAF3DE', iconColor: '#2e7d32',
      sub:     'Organised in hierarchy',
      trend:   { value: 4, label: 'vs last month' },
      onClick: () => navigate('/documents'),
    },
    {
      label:   'Favourites',
      value:   loading ? '—' : (stats?.favouritesCount ?? 0).toLocaleString(),
      icon:    <StarIcon sx={{ fontSize: 22 }} />,
      iconBg:  '#FFF9E6', iconColor: '#F9A825',
      sub:     'Starred files & folders',
      onClick: () => navigate('/favourites'),
    },
    {
      label:   'Shared with Me',
      value:   loading ? '—' : (stats?.sharedWithMeCount ?? 0).toLocaleString(),
      icon:    <PeopleIcon sx={{ fontSize: 22 }} />,
      iconBg:  '#F3E8FF', iconColor: '#7b1fa2',
      sub:     'From team members',
      onClick: () => navigate('/shared'),
    },
    {
      label:   'In Trash',
      value:   loading ? '—' : (stats?.trashedCount ?? 0).toLocaleString(),
      icon:    <DeleteOutlineIcon sx={{ fontSize: 22 }} />,
      iconBg:  '#FEF2F2', iconColor: '#e53935',
      sub:     'Recoverable within 30d',
      onClick: () => navigate('/trash'),
    },
    {
      label:   'Uploads This Month',
      value:   loading ? '—' : (stats?.uploadedThisMonth ?? 0).toLocaleString(),
      icon:    <CloudUploadIcon sx={{ fontSize: 22 }} />,
      iconBg:  '#E6F1FB', iconColor: '#0288d1',
      sub:     'Via Upload Center',
      trend:   { value: 8, label: 'vs last month' },
      onClick: () => navigate('/upload-center'),
    },
  ];

  return (
    <Box>
      {/* ── Page header ──────────────────────────────────────────────────── */}
      <Box sx={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', mb: 3 }}>
        <Box sx={{ display:'flex', alignItems:'center', gap: 1.5 }}>
          <Avatar sx={{ bgcolor:'#E6F1FB', width: 44, height: 44, border:'0.5px solid #BFDBFE' }}>
            <WavingHandIcon sx={{ color:'#1976d2', fontSize: 22 }} />
          </Avatar>
          <Box>
            <Typography variant="h5" fontWeight={600} lineHeight={1.2}>
              {getGreeting()}, Aisha 👋
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13 }}>
              Here's what's happening in your workspace today.
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display:'flex', alignItems:'center', gap: 1 }}>
          <Chip
            label={new Date().toLocaleDateString('en-IN', { weekday:'short', day:'2-digit', month:'short', year:'numeric' })}
            size="small"
            sx={{ bgcolor:'grey.100', fontSize: 11, fontWeight: 500 }}
          />
          <Tooltip title="Refresh">
            <IconButton size="small" onClick={fetchData} disabled={loading}>
              <RefreshIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>{error}</Alert>
      )}

      {/* ── KPI stats grid ───────────────────────────────────────────────── */}
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 2, mb: 2.5,
      }}>
        {STAT_CARDS.map(card => (
          <StatsCard key={card.label} loading={loading} {...card} />
        ))}
      </Box>

      {/* ── Row 2: Recent Files (wide) + Storage (narrow) ─────────────────── */}
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 2, mb: 2.5 }}>
        <RecentFiles
          documents={data?.recentDocuments ?? []}
          loading={loading}
          onViewAll={() => navigate('/documents')}
        />
        <StorageWidget
          usedBytes={stats?.storageUsedBytes ?? 0}
          limitBytes={stats?.storageLimitBytes ?? 1}
          loading={loading}
        />
      </Box>

      {/* ── Row 3: Recent Folders + Activity + Quick Actions ─────────────── */}
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 280px', gap: 2 }}>
        <RecentFolders
          folders={data?.recentFolders ?? []}
          loading={loading}
          onOpen={(f: RecentFolder) => navigate('/documents')}
          onViewAll={() => navigate('/documents')}
        />
        <ActivityFeed
          items={data?.activity ?? []}
          loading={loading}
        />
        <QuickActions />
      </Box>
    </Box>
  );
};

export default DashboardPage;
