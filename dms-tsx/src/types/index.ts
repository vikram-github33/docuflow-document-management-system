// ─── Document Types ──────────────────────────────────────────────────────────
export type DocType = 'pdf' | 'docx' | 'doc' | 'xlsx' | 'xls' | 'pptx' | 'ppt' | 'img' | 'png' | 'jpg' | 'zip' | 'folder';
export type DocStatus = 'approved' | 'pending' | 'rejected';
export type ApprovalStatus = 'pending' | 'approved' | 'rejected';
export type ActivityType = 'upload' | 'share' | 'edit' | 'view' | 'delete';
export type UserRole = 'Administrator' | 'Manager' | 'Employee';
export type UserStatus = 'active' | 'inactive';

// ─── Document ────────────────────────────────────────────────────────────────
export interface Document {
  id: number;
  name: string;
  type: DocType;
  size: string;
  department: string;
  owner: string;
  modified: string;
  status: DocStatus;
  starred: boolean;
  folder: string;
}

// ─── Folder ──────────────────────────────────────────────────────────────────
export interface Folder {
  id: number;
  name: string;
  items: number;
  size: string;
  children: string[];
}

// ─── User ────────────────────────────────────────────────────────────────────
export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  status: UserStatus;
  lastActive: string;
  initials: string;
  color: string;
  textColor: string;
}

// ─── Approval ────────────────────────────────────────────────────────────────
export interface Approval {
  id: number;
  name: string;
  type: DocType;
  requestedBy: string;
  department: string;
  date: string;
  priority: 'urgent' | 'normal';
  status: ApprovalStatus;
}

// ─── Activity ────────────────────────────────────────────────────────────────
export interface ActivityItem {
  id: number;
  user: string;
  action: string;
  target: string;
  dept: string;
  time: string;
  type: ActivityType;
}

// ─── Upload Queue Item ───────────────────────────────────────────────────────
export interface UploadQueueItem {
  id: number;
  name: string;
  type: DocType;
  size: string;
  progress: number;
  status: 'uploading' | 'done' | 'failed' | 'queued';
  error?: string;
}

// ─── Chart Data ──────────────────────────────────────────────────────────────
export interface UploadStat {
  day: string;
  count: number;
}

export interface StorageDept {
  name: string;
  used: number;
  total: number;
  color: string;
}
