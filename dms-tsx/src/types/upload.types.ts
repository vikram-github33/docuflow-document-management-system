export type UploadStatus =
  | 'pending'
  | 'initiating'
  | 'uploading'
  | 'confirming'
  | 'success'
  | 'error'
  | 'cancelled';

export type AllowedMimeType =
  | 'application/pdf'
  | 'image/jpeg'
  | 'image/png'
  | 'image/gif'
  | 'image/webp'
  | 'application/msword'
  | 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  | 'application/vnd.ms-excel'
  | 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  | 'text/plain'
  | 'text/csv';

export interface UploadFile {
  id: string;
  file: File;
  name: string;
  size: number;
  mimeType: string;
  status: UploadStatus;
  progress: number;
  errorMessage?: string;
  s3Key?: string;
  documentId?: string;
  //folderId?: string | null;
  //tags?: string[];
 // description?: string;
  addedAt: Date;
  completedAt?: Date;
}

export interface UploadSettings {
  folderId: string | null;
  tags: string[];
  description: string;
  overwriteExisting: boolean;
  notifyOnComplete: boolean;
}

export interface InitiateUploadRequest {
  file: any;
  // mimeType: string;
  // fileSize: number;
  ownerId:string;
  folderId?: string | null;
  tags?: string[];
  description?: string;
}

export interface InitiateUploadResponse {
  uploadId: string;
  presignedUrl: string;
  s3Key: string;
  expiresAt: string;
}

export interface ConfirmUploadRequest {
  uploadId: string;
  s3Key: string;
  checksum?: string;
}

export interface ConfirmUploadResponse {
  documentId: string;
  fileName: string;
  s3Key: string;
  createdAt: string;
  folderId: string | null;
  tags: string[];
}

export interface UploadKPIStats {
  total: number;
  pending: number;
  uploading: number;
  success: number;
  failed: number;
  totalSizeBytes: number;
  uploadedSizeBytes: number;
}

export interface FolderOption {
  id: string;
  name: string;
  path: string;
}
