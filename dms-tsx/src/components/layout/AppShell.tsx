import React, { useState } from 'react';
import { Box } from '@mui/material';
import Sidebar from './Sidebar';
import TopBar  from './TopBar';

interface AppShellProps { children: React.ReactNode }

const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);

  return (
    <Box sx={{ display: 'flex', height: '100vh', bgcolor: 'background.default' }}>
      <Sidebar open={sidebarOpen} />
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>
        <TopBar onMenuClick={() => setSidebarOpen((p) => !p)} />
        <Box sx={{ flex: 1, overflow: 'auto', p: 3 }}>{children}</Box>
      </Box>
    </Box>
  );
};

export default AppShell;
