import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box, List, ListItemButton, ListItemIcon, ListItemText,
  Typography, Divider, Avatar, Collapse,
} from '@mui/material';
import DashboardIcon       from '@mui/icons-material/Dashboard';
import FolderOpenIcon      from '@mui/icons-material/FolderOpen';
import ShareIcon           from '@mui/icons-material/Share';
import StarIcon            from '@mui/icons-material/Star';
import AccessTimeIcon      from '@mui/icons-material/AccessTime';
import DeleteIcon          from '@mui/icons-material/Delete';
import CloudUploadIcon     from '@mui/icons-material/CloudUpload';
import ChecklistIcon       from '@mui/icons-material/Checklist';
import SearchIcon          from '@mui/icons-material/Search';
import PeopleIcon          from '@mui/icons-material/People';
import BarChartIcon        from '@mui/icons-material/BarChart';
import ListAltIcon         from '@mui/icons-material/ListAlt';
import SettingsIcon        from '@mui/icons-material/Settings';
import ExpandMoreIcon      from '@mui/icons-material/ExpandMore';
import ExpandLessIcon      from '@mui/icons-material/ExpandLess';

interface NavItem {
  label:  string;
  icon:   React.ReactNode;
  path:   string;
  badge?: string;
  badgeColor?: 'primary' | 'warning' | 'error';
}

interface NavSection { title: string; items: NavItem[] }

const NAV: NavSection[] = [
  {
    title: 'Main',
    items: [
      { label: 'Dashboard',     icon: <DashboardIcon />,   path: '/dashboard' },
      { label: 'Documents',     icon: <FolderOpenIcon />,  path: '/documents', badge: '1.2k' },
      { label: 'Shared with me',icon: <ShareIcon />,       path: '/coming-soon' },
      { label: 'Favorites',     icon: <StarIcon />,        path: '/favorites' },
      { label: 'Recent',        icon: <AccessTimeIcon />,  path: '/recent-activity' },
      { label: 'Trash',         icon: <DeleteIcon />,      path: '/trash' },
    ],
  },
  {
    title: 'Work',
    items: [
      { label: 'Upload Center', icon: <CloudUploadIcon />, path: '/upload',    badge: '3', badgeColor: 'warning' },
      { label: 'Approvals',     icon: <ChecklistIcon />,   path: '/approvals', badge: '7', badgeColor: 'error' },
      { label: 'Search',        icon: <SearchIcon />,      path: '/search' },
    ],
  },
  {
    title: 'Admin',
    items: [
      { label: 'User Management', icon: <PeopleIcon />,    path: '/users' },
      { label: 'Reports',         icon: <BarChartIcon />,  path: '/reports' },
      { label: 'Audit Logs',      icon: <ListAltIcon />,   path: '/audit' },
      { label: 'Settings',        icon: <SettingsIcon />,  path: '/settings' },
    ],
  },
];

interface SidebarProps { open: boolean }

const Sidebar: React.FC<SidebarProps> = ({ open }) => {
  const navigate  = useNavigate();
  const location  = useLocation();

  if (!open) return null;

  return (
    <Box
      component="nav"
      sx={{
        width: 220, flexShrink: 0,
        bgcolor: 'background.paper',
        borderRight: '1px solid', borderColor: 'grey.200',
        display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden',
      }}
    >
      {/* Logo */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: '13px 16px', borderBottom: '1px solid', borderColor: 'grey.200' }}>
        <Box sx={{ width: 30, height: 30, bgcolor: 'primary.main', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography sx={{ color: '#fff', fontSize: 16, fontWeight: 700 }}>D</Typography>
        </Box>
        <Typography sx={{ fontWeight: 600, fontSize: 15, color: 'text.primary' }}>DocuFlow</Typography>
        <Box sx={{ ml: 'auto', bgcolor: '#EFF6FF', color: 'primary.main', fontSize: 10, fontWeight: 600, px: 0.8, py: 0.2, borderRadius: 10, border: '1px solid #BFDBFE' }}>
          Pro
        </Box>
      </Box>

      {/* Navigation */}
      <Box sx={{ flex: 1, overflowY: 'auto', py: 1, px: 0.75, '&::-webkit-scrollbar': { width: 3 }, '&::-webkit-scrollbar-thumb': { bgcolor: 'grey.300', borderRadius: 2 } }}>
        {NAV.map((section) => (
          <Box key={section.title}>
            <Typography variant="overline" sx={{ px: 1, py: 0.5, display: 'block', color: 'grey.400', fontSize: '0.6rem' }}>
              {section.title}
            </Typography>
            <List dense disablePadding>
              {section.items.map((item) => {
                const active = location.pathname === item.path;
                return (
                  <ListItemButton
                    key={item.label}
                    selected={active}
                    onClick={() => navigate(item.path)}
                    sx={{
                      borderRadius: 2, mb: 0.25, py: 0.75,
                      '&.Mui-selected':       { bgcolor: '#EFF6FF', color: 'primary.main', '& .MuiListItemIcon-root': { color: 'primary.main' } },
                      '&.Mui-selected:hover': { bgcolor: '#DBEAFE' },
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 32, color: 'grey.500', '& svg': { fontSize: 18 } }}>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.label}
                      primaryTypographyProps={{ fontSize: '0.8125rem', fontWeight: active ? 500 : 400 }}
                    />
                    {item.badge && (
                      <Box sx={{
                        bgcolor: item.badgeColor === 'warning' ? '#F59E0B' : item.badgeColor === 'error' ? '#EF4444' : 'primary.main',
                        color: '#fff', fontSize: 10, fontWeight: 600,
                        px: 0.8, py: 0.1, borderRadius: 10, minWidth: 20, textAlign: 'center',
                      }}>
                        {item.badge}
                      </Box>
                    )}
                  </ListItemButton>
                );
              })}
            </List>
          </Box>
        ))}
      </Box>

      {/* User footer */}
      <Divider />
      <Box sx={{ p: 1 }}>
        <ListItemButton sx={{ borderRadius: 2 }}>
          <Avatar sx={{ width: 30, height: 30, bgcolor: '#DBEAFE', color: 'primary.dark', fontSize: 12, fontWeight: 600, mr: 1 }}>AS</Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography sx={{ fontSize: 12, fontWeight: 500, color: 'text.primary', lineHeight: 1.2 }}>Aisha Sharma</Typography>
            <Typography sx={{ fontSize: 11, color: 'text.secondary' }}>Administrator</Typography>
          </Box>
        </ListItemButton>
      </Box>
    </Box>
  );
};

export default Sidebar;
