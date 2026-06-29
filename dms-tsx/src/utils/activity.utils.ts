import type { ActivityType, ActivityItem } from '../types/activity.types';

export interface ActivityMeta {
  label:   string;
  color:   string;
  bg:      string;
  verb:    string;
}

export const ACTIVITY_META: Record<ActivityType, ActivityMeta> = {
  upload:        { label: 'Uploaded',       color: '#1976d2', bg: '#E6F1FB', verb: 'uploaded'        },
  download:      { label: 'Downloaded',     color: '#0288d1', bg: '#E1F5FE', verb: 'downloaded'      },
  delete:        { label: 'Deleted',        color: '#e53935', bg: '#FEEBEB', verb: 'deleted'         },
  restore:       { label: 'Restored',       color: '#2e7d32', bg: '#EAF3DE', verb: 'restored'        },
  share:         { label: 'Shared',         color: '#7b1fa2', bg: '#F3E8FF', verb: 'shared'          },
  favourite:     { label: 'Starred',        color: '#F9A825', bg: '#FFF9E6', verb: 'starred'         },
  unfavourite:   { label: 'Unstarred',      color: '#9e9e9e', bg: '#F5F5F5', verb: 'unstarred'       },
  create_folder: { label: 'Created folder', color: '#1976d2', bg: '#E6F1FB', verb: 'created folder'  },
  rename:        { label: 'Renamed',        color: '#e65100', bg: '#FFF3E0', verb: 'renamed'         },
  move:          { label: 'Moved',          color: '#00695c', bg: '#E0F2F1', verb: 'moved'           },
  view:          { label: 'Viewed',         color: '#546e7a', bg: '#ECEFF1', verb: 'viewed'          },
  comment:       { label: 'Commented',      color: '#6d4c41', bg: '#EFEBE9', verb: 'commented on'    },
};

export function getActivityMeta(type: ActivityType): ActivityMeta {
  return ACTIVITY_META[type] ?? { label: type, color: '#78909c', bg: '#ECEFF1', verb: type };
}

export function formatActivityDescription(item: ActivityItem): string {
  const meta = getActivityMeta(item.type);
  const name = item.entityName;
  switch (item.type) {
    case 'move':     return `Moved "${name}" → ${item.toPath ?? ''}`;
    case 'rename':   return `Renamed "${item.fromPath}" → "${name}"`;
    case 'share':    return `Shared "${name}" with ${item.sharedWith ?? 'team'}`;
    case 'restore':  return `Restored "${name}" from trash`;
    default:         return `${meta.verb.charAt(0).toUpperCase() + meta.verb.slice(1)} "${name}"`;
  }
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

export function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-IN', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });
}

export function groupByDate(items: ActivityItem[]): Map<string, ActivityItem[]> {
  const map = new Map<string, ActivityItem[]>();
  for (const item of items) {
    const key = new Date(item.timestamp).toDateString();
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(item);
  }
  return map;
}

export function getFileIconConfig(fileType?: string): { color: string; label: string } {
  if (!fileType) return { color: '#78909c', label: 'FILE' };
  if (fileType === 'application/pdf')                              return { color: '#e53935', label: 'PDF'  };
  if (fileType.startsWith('image/'))                              return { color: '#1e88e5', label: 'IMG'  };
  if (fileType.includes('sheet') || fileType.includes('csv'))     return { color: '#43a047', label: 'XLS'  };
  if (fileType.includes('word') || fileType.includes('document')) return { color: '#1565c0', label: 'DOC'  };
  if (fileType.includes('presentation'))                          return { color: '#e65100', label: 'PPT'  };
  if (fileType === 'text/plain')                                  return { color: '#546e7a', label: 'TXT'  };
  return { color: '#78909c', label: fileType.split('/')[1]?.toUpperCase()?.slice(0, 4) ?? 'FILE' };
}

// ── Mock data ─────────────────────────────────────────────────────────────────
const USERS = [
  { id: 'u1', name: 'Aisha Sharma',  initials: 'AS', role: 'Administrator', color: '#1976d2' },
  { id: 'u2', name: 'Rahul Mehta',   initials: 'RM', role: 'Manager',       color: '#7b1fa2' },
  { id: 'u3', name: 'Priya Nair',    initials: 'PN', role: 'User',          color: '#2e7d32' },
];

function ago(minutes: number): string {
  return new Date(Date.now() - minutes * 60000).toISOString();
}

export const MOCK_ACTIVITY: ActivityItem[] = [
  { id:'1',  type:'upload',        entityType:'document', entityId:'d1', entityName:'Sanjana morade -CV.pdf',      fileType:'application/pdf',  folderName:'Tree 2',  folderColor:'#1976d2', performedBy: USERS[0], timestamp: ago(5)        },
  { id:'2',  type:'favourite',     entityType:'document', entityId:'d2', entityName:'Resume_bec0b8d6.pdf',         fileType:'application/pdf',  folderName:'Tree 2',  folderColor:'#1976d2', performedBy: USERS[0], timestamp: ago(20)       },
  { id:'3',  type:'share',         entityType:'document', entityId:'d3', entityName:'Q3_Report.xlsx',              fileType:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', folderName:'Finance', folderColor:'#2e7d32', sharedWith:'Rahul Mehta', performedBy: USERS[2], timestamp: ago(120)     },
  { id:'4',  type:'create_folder', entityType:'folder',   entityId:'f1', entityName:'Tree 2',                     entityPath:'/Tree/Tree 2',    folderColor:'#1976d2', performedBy: USERS[1], timestamp: ago(180)      },
  { id:'5',  type:'upload',        entityType:'document', entityId:'d4', entityName:'bank statement.pdf',          fileType:'application/pdf',  folderName:'Finance', folderColor:'#2e7d32', performedBy: USERS[0], timestamp: ago(240)      },
  { id:'6',  type:'download',      entityType:'document', entityId:'d5', entityName:'Payslip_Jul_2022.pdf',        fileType:'application/pdf',  folderName:'Tree 2',  folderColor:'#1976d2', performedBy: USERS[1], timestamp: ago(300)      },
  { id:'7',  type:'move',          entityType:'document', entityId:'d6', entityName:'screenshot.png',             fileType:'image/png',         folderName:'Images',  fromPath:'/Temp/screenshot.png', toPath:'/Images/', performedBy: USERS[0], timestamp: ago(400)  },
  { id:'8',  type:'delete',        entityType:'document', entityId:'d7', entityName:'old_draft.docx',             fileType:'application/msword', folderName:'Projects', folderColor:'#e65100', performedBy: USERS[0], timestamp: ago(1440)   },
  { id:'9',  type:'restore',       entityType:'document', entityId:'d8', entityName:'bank statement.pdf',         fileType:'application/pdf',  folderName:'Finance', folderColor:'#2e7d32', performedBy: USERS[1], timestamp: ago(2880)     },
  { id:'10', type:'rename',        entityType:'folder',   entityId:'f2', entityName:'Finance Q3',                 entityPath:'/Finance Q3',    fromPath:'Finance',   performedBy: USERS[0], timestamp: ago(4320)     },
  { id:'11', type:'upload',        entityType:'document', entityId:'d9', entityName:'A520XXXXXXXXXXXXXXX4724.pdf', fileType:'application/pdf',  folderName:'Tree 2',  folderColor:'#1976d2', performedBy: USERS[2], timestamp: ago(5760)    },
  { id:'12', type:'view',          entityType:'document', entityId:'d2', entityName:'Resume_bec0b8d6.pdf',        fileType:'application/pdf',  folderName:'Tree 2',  folderColor:'#1976d2', performedBy: USERS[1], timestamp: ago(7200)    },
  { id:'13', type:'comment',       entityType:'document', entityId:'d3', entityName:'Q3_Report.xlsx',             fileType:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', folderName:'Finance', folderColor:'#2e7d32', performedBy: USERS[2], timestamp: ago(8640) },
  { id:'14', type:'unfavourite',   entityType:'document', entityId:'d4', entityName:'bank statement.pdf',         fileType:'application/pdf',  folderName:'Finance', folderColor:'#2e7d32', performedBy: USERS[0], timestamp: ago(10080)   },
];

export { USERS };
