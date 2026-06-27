export type TrashedItemType = 'folder' | 'document';

export interface TrashedDocument {
  id: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize?: number;
  folderId?: string | null;
  folderName?: string;
  deletedAt: string;
  originalPath?: string;
}

export interface TrashedFolder {
  id: string;
  name: string;
  path: string;
  color?: string;
  icon?: string;
  documentCount: number;
  deletedAt: string;
}

export type TrashedItem =
  | { type: 'document'; data: TrashedDocument }
  | { type: 'folder';   data: TrashedFolder   };
