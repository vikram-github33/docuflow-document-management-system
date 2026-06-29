export type ActivityType =
  | 'upload'
  | 'download'
  | 'delete'
  | 'restore'
  | 'share'
  | 'favourite'
  | 'unfavourite'
  | 'create_folder'
  | 'rename'
  | 'move'
  | 'view'
  | 'comment';

export type ActivityEntityType = 'document' | 'folder';

export interface ActivityItem {
  id:           string;
  type:         ActivityType;
  entityType:   ActivityEntityType;
  entityId:     string;
  entityName:   string;
  entityPath?:  string;
  fileType?:    string;        // for documents
  folderName?:  string;        // parent folder
  folderColor?: string;
  fromPath?:    string;        // for move/rename
  toPath?:      string;
  sharedWith?:  string;        // for share
  performedBy: {
    id:       string;
    name:     string;
    initials: string;
    role:     string;
    color:    string;
  };
  timestamp: string;
  ipAddress?: string;
}

export type DateFilter = 'today' | 'week' | 'month' | 'all';
export type TypeFilter = 'all' | ActivityType;
export type UserFilter = 'all' | string;

export interface ActivityFilters {
  dateRange:  DateFilter;
  type:       TypeFilter;
  entityType: 'all' | ActivityEntityType;
  userId:     UserFilter;
  search:     string;
}
