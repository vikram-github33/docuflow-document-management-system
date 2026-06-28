export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export function storagePercent(used: number, limit: number): number {
  if (!limit) return 0;
  return Math.min(100, Math.round((used / limit) * 100));
}

export function timeAgo(iso?: string): string {
  if (!iso) return '—';
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1)  return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)  return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(iso).toLocaleDateString();
}

export function formatDate(iso?: string): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
}

export interface FileIconConfig { color: string; label: string }

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
  if (fileType === 'text/plain' || fileType === 'text/csv')
    return { color: '#546e7a', label: 'TXT' };
  return { color: '#78909c', label: fileType.split('/')[1]?.toUpperCase()?.slice(0, 4) ?? 'FILE' };
}

export function truncate(s: string, n = 36): string {
  return s.length > n ? s.slice(0, n - 1) + '…' : s;
}

export function getActivityIcon(type: string): { icon: string; color: string; label: string } {
  switch (type) {
    case 'upload':        return { icon: '↑', color: '#1976d2', label: 'Uploaded' };
    case 'delete':        return { icon: '🗑', color: '#e53935', label: 'Deleted' };
    case 'restore':       return { icon: '↺', color: '#43a047', label: 'Restored' };
    case 'share':         return { icon: '⇗', color: '#7b1fa2', label: 'Shared' };
    case 'favourite':     return { icon: '★', color: '#F9A825', label: 'Starred' };
    case 'create_folder': return { icon: '📁', color: '#1976d2', label: 'Created folder' };
    case 'move':          return { icon: '→', color: '#e65100', label: 'Moved' };
    default:              return { icon: '·', color: '#78909c', label: type };
  }
}
