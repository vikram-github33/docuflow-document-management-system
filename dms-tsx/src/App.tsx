import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AppShell from "./components/layout/AppShell";
import Login from "./pages/auth/Login";
import Dashboard from "./pages/Dashboard";
import DocumentExplorer from "./pages/DocumentExplorer";
import { UploadCenterPage } from "./pages/UploadCenterPage";
import Approvals from "./pages/Approvals";
import UserManagement from "./pages/UserManagement";
import AuditLogs from "./pages/AuditLogs";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import Search from "./pages/Search";
import FolderCreation from "pages/FolderCreation";
import FolderExplorerPage from "pages/folders/FolderExplorerPage";
import { FolderManagementPage } from "pages/folder/FolderManagementPage";
import ComingSoon from "ComingSoon";
import TrashPage from "./pages/TrashPage";
import FavouritesPage from "pages/FavouritesPage";
import DashboardPage from "pages/DashboardPage";
import SignupForm from "pages/auth/SignupForm";
import RecentActivityPage from "pages/RecentActivityPage";
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("accessToken"),
  );
 
  return (
    <Routes>
      {!isLoggedIn ? (
        <>
          <Route
            path="/login"
            element={<Login onLogin={() => setIsLoggedIn(true)} />}
          />

          <Route path="/signup" element={<SignupForm />} />

          <Route path="*" element={<Navigate to="/login" replace />} />
        </>
      ) : (
        <Route
          path="/*"
          element={
            <AppShell>
              <Routes>
                <Route
                  path="/"
                  element={<Navigate to="/dashboard" replace />}
                />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/folder" element={<FolderManagementPage />} />
                <Route path="/documents" element={<DocumentExplorer />} />
                <Route path="/upload" element={<UploadCenterPage />} />
                <Route path="/approvals" element={<Approvals />} />
                <Route path="/users" element={<UserManagement />} />
                <Route path="/audit" element={<AuditLogs />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/search" element={<Search />} />
                <Route path="/trash" element={<TrashPage />} />
                <Route path="/favorites" element={<FavouritesPage />} />
                <Route path="/recent-activity" element={<RecentActivityPage/>} />
                <Route
                  path="*"
                  element={<Navigate to="/dashboard" replace />}
                />
              </Routes>
            </AppShell>
          }
        />
      )}
    </Routes>
  );
}

export default App;
