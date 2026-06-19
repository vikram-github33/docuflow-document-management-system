import React, { useState } from 'react';
import {
  Box, Paper, Typography, TextField, Button,
  Switch, Divider, Grid, MenuItem,
} from '@mui/material';

interface ToggleRowProps { label: string; desc: string; defaultOn: boolean }
const ToggleRow: React.FC<ToggleRowProps> = ({ label, desc, defaultOn }) => {
  const [on, setOn] = useState<boolean>(defaultOn);
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 1.25, borderBottom: '1px solid', borderColor: 'grey.100', '&:last-child': { borderBottom: 'none' } }}>
      <Box>
        <Typography sx={{ fontSize: '0.8125rem', fontWeight: 500 }}>{label}</Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>{desc}</Typography>
      </Box>
      <Switch size="small" checked={on} onChange={() => setOn(!on)} />
    </Box>
  );
};

const NAV_ITEMS = ['General', 'Storage', 'Security', 'User Roles', 'API Keys', 'Notifications'];

const Settings: React.FC = () => {
  const [active, setActive] = useState<string>('General');

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 0.5, fontWeight: 600 }}>Settings</Typography>
      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>Configure your DocVault workspace.</Typography>

      <Box sx={{ display: 'flex', gap: 2 }}>
        {/* Settings nav */}
        <Paper elevation={0} sx={{ width: 180, flexShrink: 0, border: '1px solid', borderColor: 'grey.200', borderRadius: 3, p: 1, alignSelf: 'flex-start' }}>
          {NAV_ITEMS.map((n) => (
            <Box
              key={n}
              onClick={() => setActive(n)}
              sx={{
                px: 1.5, py: 1, borderRadius: 1.5, cursor: 'pointer',
                fontSize: '0.8125rem',
                fontWeight: active === n ? 500 : 400,
                color: active === n ? 'primary.main' : 'text.secondary',
                bgcolor: active === n ? '#EFF6FF' : 'transparent',
                '&:hover': { bgcolor: active === n ? '#EFF6FF' : 'grey.50' },
                mb: 0.25,
              }}
            >
              {n}
            </Box>
          ))}
        </Paper>

        {/* Content */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* Organization */}
          <Paper elevation={0} sx={{ p: 2.5, border: '1px solid', borderColor: 'grey.200', borderRadius: 3 }}>
            <Typography sx={{ fontWeight: 600, mb: 2, fontSize: '0.9rem' }}>Organization</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField label="Organization name" size="small" defaultValue="Acme Corp" fullWidth />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label="Subdomain" size="small" defaultValue="acme.docvault.io" fullWidth />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField select label="Timezone" size="small" defaultValue="IST" fullWidth>
                  <MenuItem value="IST">IST (UTC+5:30)</MenuItem>
                  <MenuItem value="UTC">UTC</MenuItem>
                  <MenuItem value="EST">EST</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField select label="Language" size="small" defaultValue="en" fullWidth>
                  <MenuItem value="en">English (US)</MenuItem>
                  <MenuItem value="hi">हिन्दी</MenuItem>
                </TextField>
              </Grid>
            </Grid>
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <Button variant="contained" size="small">Save changes</Button>
            </Box>
          </Paper>

          {/* Features toggles */}
          <Paper elevation={0} sx={{ p: 2.5, border: '1px solid', borderColor: 'grey.200', borderRadius: 3 }}>
            <Typography sx={{ fontWeight: 600, mb: 1, fontSize: '0.9rem' }}>Features</Typography>
            <ToggleRow label="OCR text extraction"       desc="Auto-extract text from uploaded PDFs and images"      defaultOn={true}  />
            <ToggleRow label="Version history"           desc="Keep all versions of edited documents"                defaultOn={true}  />
            <ToggleRow label="Require approval workflow" desc="Documents need manager approval before publishing"    defaultOn={false} />
            <ToggleRow label="Two-factor authentication" desc="Enforce 2FA for all users"                           defaultOn={true}  />
            <ToggleRow label="Email notifications"       desc="Send email alerts for uploads and approvals"         defaultOn={true}  />
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default Settings;
