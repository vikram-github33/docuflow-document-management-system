import { apiClient, s3Client } from '../config/axios.config';
import { API_ENDPOINTS } from '../constants/upload.constants';
import type {
  InitiateUploadRequest,
  InitiateUploadResponse,
  ConfirmUploadRequest,
  ConfirmUploadResponse,
  FolderOption,
} from '../types/upload.types';

export type UploadProgressCallback = (progressPercent: number) => void;

export async function initiateUpload(payload: InitiateUploadRequest): Promise<InitiateUploadResponse> {
  console.log("payload",payload)
  const { data } = await apiClient.post<InitiateUploadResponse>(API_ENDPOINTS.INITIATE_UPLOAD, payload,{
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  return data;
}

export async function uploadFileToS3(
  presignedUrl: string,
  file: File,
  onProgress?: UploadProgressCallback
): Promise<void> {
  await s3Client.put(presignedUrl, file, {
    headers: { 'Content-Type': file.type },
    onUploadProgress: (event) => {
      if (onProgress && event.total) {
        onProgress(Math.round((event.loaded * 100) / event.total));
      }
    },
  });
}

export async function confirmUpload(payload: ConfirmUploadRequest): Promise<ConfirmUploadResponse> {
  const { data } = await apiClient.post<ConfirmUploadResponse>(API_ENDPOINTS.CONFIRM_UPLOAD, payload);
  return data;
}

export async function fetchFolders(): Promise<FolderOption[]> {
  const { data } = await apiClient.get<FolderOption[]>(API_ENDPOINTS.FOLDERS);
  return data;
}
