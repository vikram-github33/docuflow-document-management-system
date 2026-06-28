export interface DashboardStats {
  totalDocuments:   number;
  totalFolders:     number;
  storageUsedBytes: number;
  storageLimitBytes: number;
  favouritesCount:  number;
  trashedCount:     number;
  sharedWithMeCount: number;
  uploadedThisMonth: number;
}

export interface RecentDocument {
  id:         string;
  fileName:   string;
  fileType:   string;
  fileSize?:  number;
  fileUrl:    string;
  folderName?: string;
  folderPath?: string;
  updatedAt:  string;
  isFavourite?: boolean;
}

export interface RecentFolder {
  id:            string;
  name:          string;
  path:          string;
  color?:        string;
  documentCount: number;
  updatedAt:     string;
}

export interface ActivityItem {
  id:        string;
  type:      'upload' | 'delete' | 'restore' | 'share' | 'favourite' | 'create_folder' | 'move';
  fileName?: string;
  folderName?: string;
  userName:  string;
  userInitials: string;
  timestamp: string;
}

export interface StorageBreakdown {
  label:     string;
  sizeBytes: number;
  color:     string;
}

export interface DashboardData {
  stats:           DashboardStats;
  recentDocuments: RecentDocument[];
  recentFolders:   RecentFolder[];
  activity:        ActivityItem[];
  storageBreakdown: StorageBreakdown[];
}
