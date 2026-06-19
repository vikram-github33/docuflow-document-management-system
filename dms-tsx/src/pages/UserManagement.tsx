import React, { useState } from 'react';
import {
  Box, Paper, Typography, Button, Chip, TextField, InputAdornment,
  Dialog, DialogTitle, DialogContent, DialogActions, MenuItem,
} from '@mui/material';
import SearchIcon    from '@mui/icons-material/Search';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import EditIcon      from '@mui/icons-material/Edit';
import MoreVertIcon  from '@mui/icons-material/MoreVert';
import { UserAvatar, StatusPill } from '../components/ui/SharedUI';
import { mockUsers } from '../data/mockData';
import { User, UserRole } from '../types';

const ROLE_STYLES: Record<UserRole, { bg: string; color: string; border: string }> = {
  Administrator: { bg: '#EDE9FE', color: '#5B21B6', border: '#DDD6FE' },
  Manager:       { bg: '#EFF6FF', color: '#1D4ED8', border: '#BFDBFE' },
  Employee:      { bg: '#F3F4F6', color: '#374151', border: '#E5E7EB' },
};

const COLS = ['User', 'Role', 'Department', 'Status', 'Last Active', 'Actions'];

const UserManagement: React.FC = () => {
  const [search, setSearch]   = useState<string>('');
  const [open,   setOpen]     = useState<boolean>(false);

  const filtered = mockUsers.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 0.5, fontWeight: 600 }}>User Management</Typography>
      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>Manage users, roles, and permissions.</Typography>

      <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'grey.200', borderRadius: 3, overflow: 'hidden' }}>
        {/* Header */}
        <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'grey.200', display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography sx={{ fontWeight: 600 }}>Users</Typography>
          <TextField
            size="small" placeholder="Search users…" value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: 16 }} /></InputAdornment> }}
            sx={{ ml: 'auto', width: 220, '& .MuiOutlinedInput-root': { borderRadius: 6, fontSize: '0.8125rem' } }}
          />
          <Button variant="contained" size="small" startIcon={<PersonAddIcon />} onClick={() => setOpen(true)}>
            Add user
          </Button>
        </Box>

        {/* Column headers */}
        <Box sx={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 1fr', px: 2, py: 1, borderBottom: '1px solid', borderColor: 'grey.100', bgcolor: 'grey.50' }}>
          {COLS.map((h) => (
            <Typography key={h} variant="overline" sx={{ fontSize: '0.6rem', color: 'text.secondary' }}>{h}</Typography>
          ))}
        </Box>

        {/* Rows */}
        {filtered.map((u) => {
          const rc = ROLE_STYLES[u.role] ?? ROLE_STYLES.Employee;
          return (
            <Box
              key={u.id}
              sx={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 1fr', px: 2, py: 1.25, borderBottom: '1px solid', borderColor: 'grey.100', alignItems: 'center', '&:hover': { bgcolor: 'grey.50' }, '&:last-child': { borderBottom: 'none' } }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <UserAvatar initials={u.initials} bg={u.color} textColor={u.textColor} size={32} />
                <Box>
                  <Typography sx={{ fontSize: '0.8125rem', fontWeight: 500 }}>{u.name}</Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>{u.email}</Typography>
                </Box>
              </Box>
              <Chip label={u.role} size="small" sx={{ bgcolor: rc.bg, color: rc.color, border: `1px solid ${rc.border}`, fontWeight: 600, height: 20 }} />
              <Typography sx={{ fontSize: '0.8rem', color: 'text.secondary' }}>{u.department}</Typography>
              <StatusPill status={u.status} />
              <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>{u.lastActive}</Typography>
              <Box sx={{ display: 'flex', gap: 0.75 }}>
                <Button size="small" variant="outlined" startIcon={<EditIcon sx={{ fontSize: 12 }} />} sx={{ fontSize: '0.7rem', minWidth: 0, px: 1, borderColor: 'grey.300', color: 'text.secondary' }}>Edit</Button>
                <Button size="small" variant="outlined" sx={{ fontSize: '0.7rem', minWidth: 0, px: 1, borderColor: 'grey.300', color: 'text.secondary' }}>···</Button>
              </Box>
            </Box>
          );
        })}
      </Paper>

      {/* Add User Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 600, fontSize: '1rem' }}>Add new user</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '8px !important' }}>
          <TextField label="Full name"   size="small" fullWidth />
          <TextField label="Work email"  size="small" fullWidth />
          <TextField label="Department"  size="small" fullWidth />
          <TextField select label="Role" size="small" fullWidth defaultValue="Employee">
            <MenuItem value="Employee">Employee</MenuItem>
            <MenuItem value="Manager">Manager</MenuItem>
            <MenuItem value="Administrator">Administrator</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setOpen(false)} sx={{ color: 'text.secondary' }}>Cancel</Button>
          <Button variant="contained" onClick={() => setOpen(false)}>Invite user</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserManagement;
