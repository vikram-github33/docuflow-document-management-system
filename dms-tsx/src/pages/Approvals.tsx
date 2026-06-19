// ─── Approvals.tsx ────────────────────────────────────────────────────────────
import React, { useState } from 'react';
import { Box, Paper, Typography, Button, Tabs, Tab, Avatar } from '@mui/material';
import { FileIcon, StatusPill } from '../components/ui/SharedUI';
import { mockApprovals } from '../data/mockData';
import { Approval, ApprovalStatus } from '../types';

const Approvals: React.FC = () => {
  const [tab,   setTab]   = useState<number>(0);
  const [items, setItems] = useState<Approval[]>(mockApprovals);

  const tabStatuses: (ApprovalStatus | 'all')[] = ['pending', 'approved', 'rejected', 'all'];
  const current = tab === 3 ? items : items.filter((a) => a.status === tabStatuses[tab]);

  const handleAction = (id: number, action: ApprovalStatus): void => {
    setItems((prev) => prev.map((a) => (a.id === id ? { ...a, status: action } : a)));
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 0.5, fontWeight: 600 }}>Approval Queue</Typography>
      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>Review and manage document approval requests.</Typography>

      <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'grey.200', borderRadius: 3, overflow: 'hidden' }}>
        <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'grey.200', display: 'flex', alignItems: 'center' }}>
          <Typography sx={{ fontWeight: 600 }}>Requests</Typography>
          <Button size="small" variant="outlined" sx={{ ml: 'auto', fontSize: '0.75rem', borderColor: 'grey.300', color: 'text.secondary' }}>Filter</Button>
        </Box>

        <Tabs value={tab} onChange={(_, v) => setTab(v as number)} sx={{ px: 2, borderBottom: '1px solid', borderColor: 'grey.200', '& .MuiTab-root': { fontSize: '0.8rem', textTransform: 'none', minHeight: 42 } }}>
          <Tab label={`Pending (${items.filter((a) => a.status === 'pending').length})`} />
          <Tab label={`Approved (${items.filter((a) => a.status === 'approved').length})`} />
          <Tab label={`Rejected (${items.filter((a) => a.status === 'rejected').length})`} />
          <Tab label="All" />
        </Tabs>

        {current.length === 0 ? (
          <Box sx={{ p: 6, textAlign: 'center', color: 'text.secondary' }}>
            <Typography>No {tabStatuses[tab]} requests</Typography>
          </Box>
        ) : (
          <Box>
            <Box sx={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 1fr', px: 2, py: 1, borderBottom: '1px solid', borderColor: 'grey.100', bgcolor: 'grey.50' }}>
              {['Document', 'Requested by', 'Department', 'Date', 'Priority', 'Actions'].map((h) => (
                <Typography key={h} variant="overline" sx={{ fontSize: '0.6rem', color: 'text.secondary' }}>{h}</Typography>
              ))}
            </Box>
            {current.map((a) => (
              <Box key={a.id} sx={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 1fr', px: 2, py: 1.25, borderBottom: '1px solid', borderColor: 'grey.100', alignItems: 'center', '&:hover': { bgcolor: 'grey.50' }, '&:last-child': { borderBottom: 'none' } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <FileIcon type={a.type} size={26} />
                  <Typography sx={{ fontSize: '0.8rem', fontWeight: 500 }}>{a.name}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                  <Avatar sx={{ width: 22, height: 22, fontSize: 9, bgcolor: '#DBEAFE', color: '#1D4ED8' }}>{a.requestedBy[0]}</Avatar>
                  <Typography sx={{ fontSize: '0.8rem' }}>{a.requestedBy}</Typography>
                </Box>
                <Typography sx={{ fontSize: '0.8rem', color: 'text.secondary' }}>{a.department}</Typography>
                <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>{a.date}</Typography>
                <StatusPill status={a.priority} />
                <Box sx={{ display: 'flex', gap: 0.75 }}>
                  {a.status === 'pending' ? (
                    <>
                      <Button size="small" onClick={() => handleAction(a.id, 'approved')} sx={{ fontSize: '0.7rem', bgcolor: '#ECFDF5', color: '#059669', border: '1px solid #A7F3D0', px: 1, minWidth: 0, '&:hover': { bgcolor: '#D1FAE5' } }}>Approve</Button>
                      <Button size="small" onClick={() => handleAction(a.id, 'rejected')} sx={{ fontSize: '0.7rem', bgcolor: '#FEF2F2', color: '#DC2626', border: '1px solid #FECACA', px: 1, minWidth: 0, '&:hover': { bgcolor: '#FEE2E2' } }}>Reject</Button>
                    </>
                  ) : (
                    <StatusPill status={a.status} />
                  )}
                </Box>
              </Box>
            ))}
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default Approvals;
