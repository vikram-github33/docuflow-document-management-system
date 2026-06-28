import type { UploadFile, UploadSettings, UploadKPIStats } from '../types/upload.types';
import { ALLOWED_MIME_TYPES, MAX_FILE_SIZE_BYTES, MIME_TYPE_LABELS } from '../constants/upload.constants';

// Use browser-native crypto instead of uuid package to avoid ESM issues
export function generateUploadId(): string {
  return crypto.randomUUID();
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export function validateFile(file: File): { valid: boolean; error?: string } {
  if (!ALLOWED_MIME_TYPES.includes(file.type as any)) {
    return { valid: false, error: `File type "${file.type || 'unknown'}" is not supported.` };
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return { valid: false, error: `File exceeds maximum size of ${formatFileSize(MAX_FILE_SIZE_BYTES)}.` };
  }
  if (file.size === 0) {
    return { valid: false, error: 'File is empty.' };
  }
  return { valid: true };
}

export function createUploadFile(file: File): UploadFile {
  return {
    id: generateUploadId(),
    file,
    name: file.name,
    size: file.size,
    mimeType: file.type,
    status: 'pending',
    progress: 0,
    addedAt: new Date(),
  };
}

export function getMimeTypeLabel(mimeType: string): string {
  return MIME_TYPE_LABELS[mimeType] ?? (mimeType.split('/')[1]?.toUpperCase() ?? 'FILE');
}

export function getFileExtension(fileName: string): string {
  return fileName.slice(fileName.lastIndexOf('.')).toLowerCase();
}

export function truncateFileName(name: string, maxLength = 38): string {
  if (name.length <= maxLength) return name;
  const ext = getFileExtension(name);
  const base = name.slice(0, name.length - ext.length);
  return `${base.slice(0, maxLength - ext.length - 3)}...${ext}`;
}

export function isTerminalStatus(status: UploadFile['status']): boolean {
  return status === 'success' || status === 'error' || status === 'cancelled';
}

export function computeKPIStats(files: UploadFile[]): UploadKPIStats {
  return {
    total: files.length,
    pending: files.filter((f) => f.status === 'pending' || f.status === 'initiating').length,
    uploading: files.filter((f) => f.status === 'uploading' || f.status === 'confirming').length,
    success: files.filter((f) => f.status === 'success').length,
    failed: files.filter((f) => f.status === 'error').length,
    totalSizeBytes: files.reduce((acc, f) => acc + f.size, 0),
    uploadedSizeBytes:
      files.filter((f) => f.status === 'success').reduce((acc, f) => acc + f.size, 0) +
      files.filter((f) => f.status === 'uploading').reduce((acc, f) => acc + f.size * (f.progress / 100), 0),
  };
}
