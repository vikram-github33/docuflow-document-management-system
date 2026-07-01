import { ActivityType } from "./activity.types";

export interface DashboardStats {
  totalDocuments:           number;
  totalFolders:             number;
  favouritesCount:          number;
  trashedCount:             number;
  sharedWithMeCount:        number; // always 0 until Share entity exists
  uploadedThisMonth:        number;
  uploadedLastMonth:        number;
  documentsGrowthPercent:   number;
  foldersCreatedThisMonth:  number;
  foldersCreatedLastMonth:  number;
  foldersGrowthPercent:     number;
  uploadsGrowthPercent:     number;
}


export interface StorageBreakdownItem {
  label:     string;
  sizeBytes: number;
  percent:   number;
  color:     string;
}

export interface StorageStats {
  usedBytes:   number;
  limitBytes:  number;
  usedPercent: number;
  breakdown:   StorageBreakdownItem[];
}

export interface RecentDocument {
  id:          string;
  fileName:    string;
  fileType:    string;
  sizeBytes:   string;
  fileUrl:     string;
  folderId:    string | null;
  folderName:  string | null;
  folderColor: string | null;
  isFavourite: boolean;
  updatedAt:   string;
}

export interface RecentFolder {
  id:            string;
  name:          string;
  path:          string;
  color:         string | null;
  documentCount: number;
  updatedAt:     string;
}

export interface DashboardData {
  stats:           DashboardStats;
  storage:         StorageStats;
  recentDocuments: RecentDocument[];
  recentFolders:   RecentFolder[];
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data:    T;
}



export interface ActivityUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}
 
export interface ActivityDocument {
  id: string;
  fileName: string;
  fileType: string;
  fileUrl: string;
}
 
export interface ActivityFolder {
  id: string;
  name: string;
  path: string;
}
 
// Raw shape exactly as returned by GET /document-activity (matches DocumentActivity entity)
export interface ActivityItem {
  id: string;
  activityType: ActivityType;
  description: string;
  createdAt: string;
  user: ActivityUser;
  document?: ActivityDocument;
  folder?: ActivityFolder;
}
 
export interface ActivityListResponse {
  success: boolean;
  message: string;
  data: ActivityItem[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
 
export interface ActivitySummaryResponse {
  success: boolean;
  message: string;
  data: Record<ActivityType, number>;
}
 
export type DateFilter = 'today' | 'week' | 'month' | 'all';
export type TypeFilter = 'all' | ActivityType;
export type EntityTypeFilter = 'all' | 'document' | 'folder';
 
export interface ActivityFilters {
  dateRange:  DateFilter;
  type:       TypeFilter;
  entityType: EntityTypeFilter;
  userId:     string; // 'all' or specific user id
  search:     string;
}