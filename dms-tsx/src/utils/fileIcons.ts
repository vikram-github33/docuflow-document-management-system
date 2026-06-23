// File type → icon name + color mapping
// Uses @mui/icons-material names conceptually; components import directly

export interface FileIconConfig {
  color: string;
  label: string;
}

export function getFileIconConfig(fileType: string): FileIconConfig {
  if (fileType === 'application/pdf')
    return { color: '#e53935', label: 'PDF' };
  if (fileType.startsWith('image/'))
    return { color: '#1e88e5', label: fileType.split('/')[1]?.toUpperCase() ?? 'IMG' };
  if (fileType.includes('spreadsheet') || fileType.includes('csv') || fileType.includes('excel'))
    return { color: '#43a047', label: 'XLS' };
  if (fileType.includes('word') || fileType.includes('document'))
    return { color: '#1565c0', label: 'DOC' };
  if (fileType.includes('presentation') || fileType.includes('powerpoint'))
    return { color: '#e65100', label: 'PPT' };
  if (fileType === 'text/plain')
    return { color: '#546e7a', label: 'TXT' };
  if (fileType === 'text/csv')
    return { color: '#43a047', label: 'CSV' };
  return { color: '#78909c', label: fileType.split('/')[1]?.toUpperCase()?.slice(0, 4) ?? 'FILE' };
}

export function formatFileSize(bytes?: number): string {
  if (!bytes) return '—';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

export function formatSizeBytes(sizeBytes: string): string {
  return formatFileSize(parseInt(sizeBytes, 10));
}

export function timeAgo(iso?: string): string {
  if (!iso) return '—';
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(iso).toLocaleDateString();
}

export function getExtension(fileName: string): string {
  const parts = fileName.split('.');
  return parts.length > 1 ? `.${parts[parts.length - 1].toLowerCase()}` : '';
}

// Flatten a tree into searchable list
export interface FlatNode {
  id: string;
  name: string;
  path: string;
  type: 'folder';
}

import type { FolderTreeNode } from '../types/folder.types';

export function flattenTree(nodes: FolderTreeNode[], acc: FlatNode[] = []): FlatNode[] {
  for (const n of nodes) {
    acc.push({ id: n.id, name: n.name, path: n.path, type: 'folder' });
    flattenTree(n.children, acc);
  }
  return acc;
}

export function findNodeById(nodes: FolderTreeNode[], id: string): FolderTreeNode | null {
  for (const n of nodes) {
    if (n.id === id) return n;
    const found = findNodeById(n.children, id);
    if (found) return found;
  }
  return null;
}

export function findAncestorIds(nodes: FolderTreeNode[], targetId: string, acc: string[] = []): string[] | null {
  for (const n of nodes) {
    if (n.id === targetId) return acc;
    const found = findAncestorIds(n.children, targetId, [...acc, n.id]);
    if (found) return found;
  }
  return null;
}
