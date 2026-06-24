import type { AllowedMimeType } from '../types/upload.types';

export const MAX_FILE_SIZE_BYTES = 100 * 1024 * 1024; // 100 MB
export const MAX_CONCURRENT_UPLOADS = 3;
export const MAX_FILES_PER_BATCH = 20;

export const ALLOWED_MIME_TYPES: AllowedMimeType[] = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/plain',
  'text/csv',
];

export const ALLOWED_EXTENSIONS = [
  '.pdf',
  '.jpg',
  '.jpeg',
  '.png',
  '.gif',
  '.webp',
  '.doc',
  '.docx',
  '.xls',
  '.xlsx',
  '.txt',
  '.csv',
];

export const MIME_TYPE_LABELS: Record<string, string> = {
  'application/pdf': 'PDF',
  'image/jpeg': 'JPEG',
  'image/png': 'PNG',
  'image/gif': 'GIF',
  'image/webp': 'WebP',
  'application/msword': 'DOC',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'DOCX',
  'application/vnd.ms-excel': 'XLS',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'XLSX',
  'text/plain': 'TXT',
  'text/csv': 'CSV',
};

export const STATUS_LABELS: Record<string, string> = {
  pending: 'Pending',
  initiating: 'Preparing',
  uploading: 'Uploading',
  confirming: 'Confirming',
  success: '✓ Done',
  error: '✗ Failed',
  cancelled: 'Cancelled',
};

export const TOAST_DURATION_MS = 4000;

export const API_ENDPOINTS = {
  INITIATE_UPLOAD: '/documents/upload',
  CONFIRM_UPLOAD: '/api/uploads/confirm',
  FOLDERS: '/folders',
} as const;
