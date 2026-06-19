# DocVault DMS — TypeScript + React + MUI

A full enterprise Document Management System built with **React 18 + TypeScript 5 + Material UI v5**.

## 🚀 Quick Start

```bash
npm install
npm start
```

Open → **http://localhost:3000**

**Login:** any email + password → click **Verify & Sign in** on the MFA screen.

---

## 📁 Project Structure

```
src/
├── App.tsx                          ← Root with routing
├── index.tsx                        ← Entry point
├── types/
│   └── index.ts                     ← All TypeScript interfaces & types
├── data/
│   └── mockData.ts                  ← Typed mock data
├── theme/
│   └── index.ts                     ← MUI theme tokens
├── components/
│   ├── layout/
│   │   ├── AppShell.tsx             ← Root layout (sidebar + topbar)
│   │   ├── Sidebar.tsx              ← Left navigation
│   │   └── TopBar.tsx               ← Header bar
│   └── ui/
│       └── SharedUI.tsx             ← FileIcon, StatusPill, UserAvatar, StorageBar, BoolIcon
└── pages/
    ├── auth/
    │   └── Login.tsx                ← Login + MFA screens
    ├── Dashboard.tsx                ← KPI cards, activity, charts
    ├── DocumentExplorer.tsx         ← Grid/list view, detail panel
    ├── UploadCenter.tsx             ← Drag-and-drop + upload queue
    ├── Approvals.tsx                ← Approve/reject workflow
    ├── UserManagement.tsx           ← User table + add user dialog
    ├── AuditLogs.tsx                ← Activity timeline
    ├── Reports.tsx                  ← Bar, pie, line charts
    ├── Settings.tsx                 ← Toggle settings panel
    └── Search.tsx                   ← Full-text document search
```

---

## 🎨 Tech Stack

| Technology          | Version |
|---------------------|---------|
| React               | 18.x    |
| TypeScript          | 5.x     |
| Material UI         | 5.x     |
| React Router        | 6.x     |
| Recharts            | 2.x     |

## 🔑 All TypeScript (no .js / .jsx files)

Every file uses `.tsx` or `.ts` extension with strict types enabled.
