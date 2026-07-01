// Matches src/enum/activity.enum.ts exactly
export enum ActivityType {
  UPLOADED            = 'UPLOADED',
  VIEWED              = 'VIEWED',
  UPDATED             = 'UPDATED',
  SHARED              = 'SHARED',
  DOWNLOADED          = 'DOWNLOADED',
  RESTORED            = 'RESTORED',
  MOVED               = 'MOVED',
  FAVORITED           = 'FAVORITED',
  UNFAVORITED         = 'UNFAVORITED',
  DELETED             = 'DELETED',
  CREATED             = 'CREATED',
  MOVED_TO_TRASH      = 'MOVED_TO_TRASH',
  PERMANENTLY_DELETED = 'PERMANENTLY_DELETED',
}
export interface ActivityItem {
  id: string;
  activityType: ActivityType;
  description: string;
  createdAt: string;
  user: ActivityUser;
  document?: ActivityDocument;
  folder?: ActivityFolder;
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

// Raw shape exactly as returned by GET /document-activity
export interface DocumentActivity {
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
  data: DocumentActivity[];
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
