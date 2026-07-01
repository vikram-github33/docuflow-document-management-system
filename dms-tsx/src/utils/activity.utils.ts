import { ActivityType } from '../types/activity.types';
import type { DocumentActivity } from '../types/activity.types';

export interface ActivityMeta {
  label: string;
  color: string;
  bg:    string;
}

// Mapped to your exact 13 enum values
export const ACTIVITY_META: Record<ActivityType, ActivityMeta> = {
  [ActivityType.UPLOADED]:            { label: 'Uploaded',    color: '#1976d2', bg: '#E6F1FB' },
  [ActivityType.VIEWED]:              { label: 'Viewed',      color: '#546e7a', bg: '#ECEFF1' },
  [ActivityType.UPDATED]:             { label: 'Updated',     color: '#e65100', bg: '#FFF3E0' },
  [ActivityType.SHARED]:              { label: 'Shared',      color: '#7b1fa2', bg: '#F3E8FF' },
  [ActivityType.DOWNLOADED]:          { label: 'Downloaded',  color: '#0288d1', bg: '#E1F5FE' },
  [ActivityType.RESTORED]:            { label: 'Restored',    color: '#2e7d32', bg: '#EAF3DE' },
  [ActivityType.MOVED]:               { label: 'Moved',       color: '#00695c', bg: '#E0F2F1' },
  [ActivityType.FAVORITED]:           { label: 'Starred',     color: '#F9A825', bg: '#FFF9E6' },
  [ActivityType.UNFAVORITED]:         { label: 'Unstarred',   color: '#9e9e9e', bg: '#F5F5F5' },
  [ActivityType.DELETED]:             { label: 'Deleted',     color: '#e53935', bg: '#FEEBEB' },
  [ActivityType.CREATED]:             { label: 'Created',     color: '#1976d2', bg: '#E6F1FB' },
  [ActivityType.MOVED_TO_TRASH]:      { label: 'Trashed',     color: '#e53935', bg: '#FEEBEB' },
  [ActivityType.PERMANENTLY_DELETED]: { label: 'Deleted',     color: '#b71c1c', bg: '#FFEBEE' },
};

export function getActivityMeta(type: ActivityType): ActivityMeta {
  return ACTIVITY_META[type] ?? { label: type, color: '#78909c', bg: '#ECEFF1' };
}

// Stat cards shown at top of page — pick the 6 most relevant types to summarise
export const SUMMARY_TYPES: ActivityType[] = [
  ActivityType.UPLOADED,
  ActivityType.DOWNLOADED,
  ActivityType.DELETED,
  ActivityType.SHARED,
  ActivityType.FAVORITED,
  ActivityType.CREATED,
];

export function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1)  return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)  return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7)  return `${days}d ago`;
  return new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
}

export function groupByDate(items: DocumentActivity[]): Map<string, DocumentActivity[]> {
  const map = new Map<string, DocumentActivity[]>();
  for (const item of items) {
    const key = new Date(item.createdAt).toDateString();
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(item);
  }
  return map;
}

export function getDateGroupLabel(dateKey: string): string {
  const d     = new Date(dateKey);
  const today = new Date().toDateString();
  const yest  = new Date(Date.now() - 86400000).toDateString();
  if (d.toDateString() === today) return 'Today';
  if (d.toDateString() === yest)  return 'Yesterday';
  return d.toLocaleDateString('en-IN', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });
}

export interface FileIconConfig { color: string; label: string }

export function getFileIconConfig(fileType?: string): FileIconConfig {
  if (!fileType) return { color: '#78909c', label: 'FILE' };
  if (fileType === 'application/pdf')                              return { color: '#e53935', label: 'PDF' };
  if (fileType.startsWith('image/'))                              return { color: '#1e88e5', label: 'IMG' };
  if (fileType.includes('sheet') || fileType.includes('csv'))     return { color: '#43a047', label: 'XLS' };
  if (fileType.includes('word') || fileType.includes('document')) return { color: '#1565c0', label: 'DOC' };
  if (fileType.includes('presentation'))                          return { color: '#e65100', label: 'PPT' };
  if (fileType === 'text/plain')                                  return { color: '#546e7a', label: 'TXT' };
  return { color: '#78909c', label: fileType.split('/')[1]?.toUpperCase()?.slice(0, 4) ?? 'FILE' };
}

// Deterministic avatar color from user id — same user always gets same color
const AVATAR_PALETTE = ['#1976d2', '#7b1fa2', '#2e7d32', '#e65100', '#c62828', '#00695c'];

export function getUserColor(userId: string): string {
  let hash = 0;
  for (let i = 0; i < userId.length; i++) hash = userId.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_PALETTE[Math.abs(hash) % AVATAR_PALETTE.length];
}

export function getInitials(firstName: string, lastName: string): string {
  return `${firstName?.[0] ?? ''}${lastName?.[0] ?? ''}`.toUpperCase();
}
