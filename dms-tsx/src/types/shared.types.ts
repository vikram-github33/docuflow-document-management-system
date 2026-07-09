export interface SharedByUser {
  id:    string;
  name:  string;
  email: string;
}

export interface SharedDocument {
  id:       string;
  fileName: string;
  fileType: string;
  fileUrl:  string;
  sizeBytes: string;
}

export interface SharedWithMeItem {
  shareId:    string;
  sharedAt:   string;
  message?:   string;
  permissions: {
    canView:     boolean;
    canDownload: boolean;
    canEdit:     boolean;
    canDelete:   boolean;
  };
  document: SharedDocument;
  sharedBy: SharedByUser;
}

export type SortMode = 'newest' | 'oldest' | 'name';
export type TabFilter = 'all' | 'pdf' | 'image' | 'other';
