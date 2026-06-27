import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AppShell          from './components/layout/AppShell';
import Login             from './pages/auth/Login';
import Dashboard         from './pages/Dashboard';
import DocumentExplorer  from './pages/DocumentExplorer';
import {UploadCenterPage}      from './pages/UploadCenterPage';
import Approvals         from './pages/Approvals';
import UserManagement    from './pages/UserManagement';
import AuditLogs         from './pages/AuditLogs';
import Reports           from './pages/Reports';
import Settings          from './pages/Settings';
import Search            from './pages/Search';
import FolderCreation from 'pages/FolderCreation';
import FolderExplorerPage from 'pages/folders/FolderExplorerPage';
import { FolderManagementPage } from 'pages/folder/FolderManagementPage';
import ComingSoon from 'ComingSoon';
import TrashPage from './pages/TrashPage';
import FavouritesPage from 'pages/FavouritesPage';
const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  if (!isLoggedIn) {
    return <Login onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <AppShell>
      <Routes>
        <Route path="/"           element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard"  element={<ComingSoon />} />
        <Route path="/folder"  element={<FolderManagementPage/>} />
        <Route path="/documents"  element={<DocumentExplorer />} />
        <Route path="/upload"     element={<UploadCenterPage />} />
        <Route path="/approvals"  element={<Approvals />} />
        <Route path="/users"      element={<UserManagement />} />
        <Route path="/audit"      element={<AuditLogs />} />
        <Route path="/reports"    element={<Reports />} />
        <Route path="/settings"   element={<Settings />} />
        <Route path="/search"     element={<Search />} />
        <Route path="/trash"     element={<TrashPage/>} />
        <Route path="/favorites"     element={<FavouritesPage/>} />
        <Route path="*"           element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AppShell>
  );
};

export default App;
