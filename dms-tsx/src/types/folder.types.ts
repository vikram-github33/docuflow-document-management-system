export interface FolderOwner {
  id: string;
  name: string;
  email: string;
}

export interface Folder {
  id: string;
  name: string;
  description: string | null;
  path: string;
  parentId: string | null;
  color: string;
  icon: string;
  isArchived: boolean;
  documentCount: number;
  totalSize: number;
  owner: FolderOwner;
  children: Folder[];
  createdAt: string;
  updatedAt: string;
}

export interface FolderTreeNode {
  id: string;
  name: string;
  path: string;
  parentId: string | null;
  color: string;
  icon: string;
  isArchived: boolean;
  documentCount: number;
  children: FolderTreeNode[];
}

export interface CreateFolderPayload {
  name: string;
  description?: string;
  parentId?: string | null;
  color?: string;
  icon?: string;
}

export interface UpdateFolderPayload {
  name?: string;
  description?: string;
  color?: string;
  icon?: string;
  isArchived?: boolean;
}

export const FOLDER_COLORS: { label: string; value: string }[] = [
  { label: 'Blue',   value: '#1976d2' },
  { label: 'Purple', value: '#7b1fa2' },
  { label: 'Green',  value: '#2e7d32' },
  { label: 'Orange', value: '#e65100' },
  { label: 'Red',    value: '#c62828' },
  { label: 'Teal',   value: '#00695c' },
  { label: 'Pink',   value: '#ad1457' },
  { label: 'Indigo', value: '#283593' },
  { label: 'Grey',   value: '#546e7a' },
  { label: 'Amber',  value: '#f57f17' },
];

export const FOLDER_ICONS: { label: string; value: string }[] = [
  { label: 'Folder',      value: 'folder'      },
  { label: 'Work',        value: 'work'        },
  { label: 'People',      value: 'people'      },
  { label: 'Description', value: 'description' },
  { label: 'Analytics',   value: 'analytics'   },
  { label: 'Gavel',       value: 'gavel'       },
  { label: 'Inventory',   value: 'inventory'   },
  { label: 'School',      value: 'school'      },
  { label: 'Star',        value: 'star'        },
  { label: 'Settings',    value: 'settings'    },
];
