export interface FileTypeConfig {
  label: string;
  bg:    string;
  color: string;
  icon:  string; // MUI icon component name
}

export function getFileTypeConfig(fileType: string): FileTypeConfig {
  if (fileType === 'application/pdf')
    return { label: 'PDF',  bg: '#FEEBEB', color: '#A32D2D', icon: 'PictureAsPdf' };
  if (fileType.startsWith('image/'))
    return { label: fileType.split('/')[1]?.toUpperCase() ?? 'IMG', bg: '#E6F1FB', color: '#185FA5', icon: 'Image' };
  if (fileType.includes('sheet') || fileType.includes('csv') || fileType.includes('excel'))
    return { label: fileType.includes('csv') ? 'CSV' : 'XLS', bg: '#EAF3DE', color: '#27500A', icon: 'TableChart' };
  if (fileType.includes('word') || fileType.includes('document'))
    return { label: 'DOCX', bg: '#E6F1FB', color: '#0C447C', icon: 'Article' };
  if (fileType.includes('presentation') || fileType.includes('powerpoint'))
    return { label: 'PPT',  bg: '#FFF3E0', color: '#e65100', icon: 'Slideshow' };
  if (fileType === 'text/plain')
    return { label: 'TXT',  bg: '#ECEFF1', color: '#546e7a', icon: 'TextSnippet' };
  return { label: 'FILE', bg: '#F5F5F5', color: '#78909c', icon: 'InsertDriveFile' };
}

export function formatFileSize(sizeBytes: string): string {
  const bytes = parseInt(sizeBytes, 10);
  if (!bytes) return '—';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

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

// Deterministic avatar color from initials string
const AVATAR_PALETTE: [string, string][] = [
  ['#E6F1FB', '#0C447C'],
  ['#F3E8FF', '#5B21B6'],
  ['#EAF3DE', '#27500A'],
  ['#FFF9E6', '#854F0B'],
  ['#FCE7F3', '#9D174D'],
];

export function getAvatarColors(name: string): { bg: string; color: string } {
  let hash = 0;
  for (let i = 0; i < name?.length; i++) hash = name?.charCodeAt(i) + ((hash << 5) - hash);
  const [bg, color] = AVATAR_PALETTE[Math.abs(hash) % AVATAR_PALETTE.length];
  return { bg, color };
}

 export function getInitials(firstName?: string, lastName?: string): string {
  return `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`.toUpperCase();
}

export function matchesTab(fileType: string, tab: string): boolean {
  if (tab === 'all') return true;
  if (tab === 'pdf') return fileType === 'application/pdf';
  if (tab === 'image') return fileType.startsWith('image/');
  // 'other'
  return fileType !== 'application/pdf' && !fileType.startsWith('image/');
}
