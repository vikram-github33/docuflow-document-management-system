import {
  Document, Folder, User, Approval,
  ActivityItem, UploadStat, StorageDept
} from '../types';

export const mockDocuments: Document[] = [
  { id: 1,  name: 'Q3 Financial Report 2025.pdf',  type: 'pdf',   size: '4.2 MB',  department: 'Finance',    owner: 'Riya Desai',   modified: '2h ago',    status: 'approved', starred: true,  folder: 'Finance' },
  { id: 2,  name: 'Product Roadmap v2.docx',        type: 'docx',  size: '1.1 MB',  department: 'Product',    owner: 'Amir Khan',    modified: '5h ago',    status: 'approved', starred: false, folder: 'Product' },
  { id: 3,  name: 'Budget Forecast 2026.xlsx',      type: 'xlsx',  size: '2.8 MB',  department: 'Finance',    owner: 'Riya Desai',   modified: 'Yesterday', status: 'approved', starred: true,  folder: 'Finance' },
  { id: 4,  name: 'Board Deck — December.pptx',     type: 'pptx',  size: '8.4 MB',  department: 'Leadership', owner: 'Aisha Sharma', modified: '2d ago',    status: 'pending',  starred: false, folder: 'Leadership' },
  { id: 5,  name: 'Brand Guidelines 2026.png',      type: 'img',   size: '12 MB',   department: 'Marketing',  owner: 'Dev Mehta',    modified: '3d ago',    status: 'approved', starred: false, folder: 'Marketing' },
  { id: 6,  name: 'Vendor NDA — Globex.pdf',        type: 'pdf',   size: '890 KB',  department: 'Legal',      owner: 'Priya Nair',   modified: '4d ago',    status: 'pending',  starred: false, folder: 'Legal' },
  { id: 7,  name: 'Expense Tracker Oct 2025.xlsx',  type: 'xlsx',  size: '680 KB',  department: 'Finance',    owner: 'Riya Desai',   modified: '4d ago',    status: 'approved', starred: false, folder: 'Finance' },
  { id: 8,  name: 'Investor Deck Q4.pptx',          type: 'pptx',  size: '8.4 MB',  department: 'Finance',    owner: 'Aisha Sharma', modified: '5d ago',    status: 'rejected', starred: false, folder: 'Finance' },
  { id: 9,  name: 'Tax Returns 2024.pdf',           type: 'pdf',   size: '3.1 MB',  department: 'Finance',    owner: 'Riya Desai',   modified: '1w ago',    status: 'approved', starred: false, folder: 'Finance' },
  { id: 10, name: 'Employee Handbook v4.docx',      type: 'docx',  size: '2.2 MB',  department: 'HR',         owner: 'Priya Nair',   modified: '1w ago',    status: 'approved', starred: false, folder: 'HR' },
  { id: 11, name: 'Procurement Policy v3.docx',     type: 'docx',  size: '750 KB',  department: 'Procurement',owner: 'Amir Khan',    modified: '2w ago',    status: 'pending',  starred: false, folder: 'Procurement' },
  { id: 12, name: 'Archive Q2 2025.zip',            type: 'zip',   size: '24 MB',   department: 'Finance',    owner: 'Admin',        modified: '2w ago',    status: 'approved', starred: false, folder: 'Finance' },
];

export const mockFolders: Folder[] = [
  { id: 1, name: 'Finance',     items: 128, size: '340 MB', children: ['Q3 Reports', 'Invoices', 'Budgets', 'Audits'] },
  { id: 2, name: 'Legal',       items: 45,  size: '120 MB', children: ['Contracts', 'NDAs', 'Compliance'] },
  { id: 3, name: 'HR',          items: 67,  size: '89 MB',  children: ['Policies', 'Onboarding', 'Payroll'] },
  { id: 4, name: 'Product',     items: 34,  size: '210 MB', children: ['Roadmaps', 'Specs', 'Research'] },
  { id: 5, name: 'Marketing',   items: 89,  size: '450 MB', children: ['Campaigns', 'Assets', 'Reports'] },
  { id: 6, name: 'Leadership',  items: 23,  size: '67 MB',  children: ['Board Decks', 'Strategy'] },
];

export const mockUsers: User[] = [
  { id: 1, name: 'Aisha Sharma', email: 'aisha@company.com', role: 'Administrator', department: 'IT',          status: 'active',   lastActive: 'Now',     initials: 'AS', color: '#DBEAFE', textColor: '#1D4ED8' },
  { id: 2, name: 'Riya Desai',   email: 'riya@company.com',  role: 'Manager',       department: 'Finance',    status: 'active',   lastActive: '2h ago',  initials: 'RD', color: '#DCFCE7', textColor: '#15803D' },
  { id: 3, name: 'Amir Khan',    email: 'amir@company.com',  role: 'Employee',      department: 'Product',    status: 'active',   lastActive: '1d ago',  initials: 'AK', color: '#FEF9C3', textColor: '#A16207' },
  { id: 4, name: 'Priya Nair',   email: 'priya@company.com', role: 'Employee',      department: 'HR',         status: 'inactive', lastActive: '1w ago',  initials: 'PN', color: '#F3E8FF', textColor: '#7C3AED' },
  { id: 5, name: 'Dev Mehta',    email: 'dev@company.com',   role: 'Employee',      department: 'Marketing',  status: 'active',   lastActive: '3h ago',  initials: 'DM', color: '#FFEDD5', textColor: '#C2410C' },
];

export const mockApprovals: Approval[] = [
  { id: 1, name: 'NDA_Globex_2026.pdf',          type: 'pdf',  requestedBy: 'R. Sharma', department: 'Legal',       date: 'Today, 09:14',  priority: 'urgent', status: 'pending' },
  { id: 2, name: 'Procurement_Policy_v3.docx',   type: 'docx', requestedBy: 'A. Patel',  department: 'Procurement', date: 'Today, 08:40',  priority: 'normal', status: 'pending' },
  { id: 3, name: 'Salary_Revision_2026.xlsx',    type: 'xlsx', requestedBy: 'HR Team',   department: 'HR',          date: 'Yesterday',     priority: 'normal', status: 'approved' },
  { id: 4, name: 'Board_Minutes_Nov.pdf',        type: 'pdf',  requestedBy: 'Aisha S.',  department: 'Leadership',  date: '2 days ago',    priority: 'urgent', status: 'approved' },
  { id: 5, name: 'Vendor_Contract_Acme.pdf',     type: 'pdf',  requestedBy: 'Dev M.',    department: 'Finance',     date: '3 days ago',    priority: 'normal', status: 'rejected' },
];

export const mockActivity: ActivityItem[] = [
  { id: 1, user: 'Riya Desai',   action: 'uploaded', target: 'Q3 Financial Report 2025.pdf', dept: 'Finance',    time: '2 minutes ago',  type: 'upload' },
  { id: 2, user: 'Amir Khan',    action: 'shared',   target: 'Product Roadmap v2.docx',       dept: 'Product',    time: '18 minutes ago', type: 'share' },
  { id: 3, user: 'Priya Nair',   action: 'edited',   target: 'Budget Forecast 2026.xlsx',     dept: 'Finance',    time: '1 hour ago',     type: 'edit' },
  { id: 4, user: 'Dev Mehta',    action: 'viewed',   target: 'Board Deck — December.pptx',    dept: 'Leadership', time: '2 hours ago',    type: 'view' },
  { id: 5, user: 'Admin',        action: 'deleted',  target: 'Old Archives.zip',              dept: 'Admin',      time: 'Yesterday',      type: 'delete' },
];

export const mockUploadStats: UploadStat[] = [
  { day: 'Mon', count: 62 },
  { day: 'Tue', count: 84 },
  { day: 'Wed', count: 100 },
  { day: 'Thu', count: 72 },
  { day: 'Fri', count: 52 },
  { day: 'Sat', count: 28 },
  { day: 'Sun', count: 21 },
];

export const mockStorageByDept: StorageDept[] = [
  { name: 'Finance',   used: 140, total: 200, color: '#2563EB' },
  { name: 'Legal',     used: 65,  total: 120, color: '#7C3AED' },
  { name: 'HR',        used: 34,  total: 90,  color: '#059669' },
  { name: 'Marketing', used: 90,  total: 200, color: '#D97706' },
  { name: 'Product',   used: 11,  total: 80,  color: '#0891B2' },
];
