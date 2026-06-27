export type FavouriteItemType = 'document' | 'folder';

export interface FavouriteDocument {
  id: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize?: number;
  folderId?: string | null;
  folderName?: string;
  folderPath?: string;
  createdAt?: string;
  updatedAt?: string;
  markedFavouriteAt?: string;
  document:any
}

export interface ToggleFavoriteDoc{
  folderId?: string | null;
  fileId?: string | null;
}

export interface FavouriteFolder {
  id: string;
  name: string;
  path: string;
  color?: string;
  icon?: string;
  documentCount: number;
  createdAt?: string;
  updatedAt?: string;
  markedFavouriteAt?: string;
}

export type SortField = 'name' | 'type' | 'size' | 'modified';
export type SortDir   = 'asc' | 'desc';

export type ViewMode = 'list' | 'grid';
