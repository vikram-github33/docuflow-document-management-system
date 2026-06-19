import { useState, useCallback, useRef } from 'react';
import { uploadFileToS3 } from '../services/upload.service';
import { useInitiateUpload } from './useInitiateUpload';
import { useConfirmUpload } from './useConfirmUpload';
import { createUploadFile, validateFile, isTerminalStatus } from '../utils/upload.utils';
import { MAX_CONCURRENT_UPLOADS, MAX_FILES_PER_BATCH } from '../constants/upload.constants';
import type { UploadFile, UploadSettings } from '../types/upload.types';

interface UseUploadQueueResult {
  files: UploadFile[];
  addFiles: (newFiles: File[], settings: UploadSettings) => void;
  removeFile: (id: string) => void;
  retryFile: (id: string) => void;
  clearCompleted: () => void;
  clearAll: () => void;
  startPending: () => void;
  isProcessing: boolean;
}

export function useUploadQueue(): UseUploadQueueResult {
  const [files, setFiles] = useState<UploadFile[]>([]);
  const activeUploads = useRef<Set<string>>(new Set());
  const filesRef = useRef<UploadFile[]>([]);
  const { initiate } = useInitiateUpload();
  const { confirm } = useConfirmUpload();

  // Keep ref in sync so processFile closure can read latest files
  const setFilesSync = useCallback((updater: (prev: UploadFile[]) => UploadFile[]) => {
    setFiles((prev) => {
      const next = updater(prev);
      filesRef.current = next;
      return next;
    });
  }, []);

  const updateFile = useCallback((id: string, patch: Partial<UploadFile>) => {
    setFilesSync((prev) => prev.map((f) => (f.id === id ? { ...f, ...patch } : f)));
  }, [setFilesSync]);

  const processFile = useCallback(async (uploadFile: UploadFile) => {
    if (activeUploads.current.has(uploadFile.id)) return;
    activeUploads.current.add(uploadFile.id);
    console.log("uploadFile",uploadFile)
    try {
      // Step 1: Initiate — get presigned URL
      updateFile(uploadFile.id, { status: 'initiating' });
      const initiated = await initiate({
        file: uploadFile.file,
        // mimeType: uploadFile.mimeType,
        // fileSize: uploadFile.size,
        folderId: uploadFile.folderId,
        ownerId:"8f6d1d1f-5f6b-4d1c-a7f2-9b8d3e7c4a21",
        tags: uploadFile.tags,
        description: uploadFile.description,
      });

      if (!initiated) {
        updateFile(uploadFile.id, { status: 'error', errorMessage: 'Failed to get upload URL.' });
        return;
      }

      // Step 2: PUT directly to S3
      updateFile(uploadFile.id, { status: 'uploading', s3Key: initiated.s3Key });
      await uploadFileToS3(initiated.presignedUrl, uploadFile.file, (progress) => {
        updateFile(uploadFile.id, { progress });
      });

      // Step 3: Confirm with backend
      updateFile(uploadFile.id, { status: 'confirming', progress: 100 });
      const confirmed = await confirm({ uploadId: initiated.uploadId, s3Key: initiated.s3Key });

      if (!confirmed) {
        updateFile(uploadFile.id, { status: 'error', errorMessage: 'Upload confirmation failed.' });
        return;
      }

      updateFile(uploadFile.id, { status: 'success', documentId: confirmed.documentId, completedAt: new Date() });
    } catch (err) {
      updateFile(uploadFile.id, {
        status: 'error',
        errorMessage: err instanceof Error ? err.message : 'Upload failed.',
      });
    } finally {
      activeUploads.current.delete(uploadFile.id);
      // Pick up next pending item
      const nextPending = filesRef.current.find(
        (f) => f.status === 'pending' && !activeUploads.current.has(f.id)
      );
      if (nextPending && activeUploads.current.size < MAX_CONCURRENT_UPLOADS) {
        processFile(nextPending);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initiate, confirm, updateFile]);

  const addFiles = useCallback((newFiles: File[], settings: UploadSettings) => {
    const valid: UploadFile[] = [];
    newFiles.slice(0, MAX_FILES_PER_BATCH).forEach((file) => {
      const { valid: ok } = validateFile(file);
      if (ok) valid.push(createUploadFile(file, settings));
    });
    if (!valid.length) return;
    setFilesSync((prev) => {
      const next = [...prev, ...valid];
      filesRef.current = next;
      return next;
    });
    // Do NOT auto-start — user clicks "Start upload"
  }, [setFilesSync]);

  const startPending = useCallback(() => {
    const pending = filesRef.current.filter(
      (f) => f.status === 'pending' && !activeUploads.current.has(f.id)
    );
    const slots = MAX_CONCURRENT_UPLOADS - activeUploads.current.size;
    pending.slice(0, slots).forEach((f) => processFile(f));
  }, [processFile]);

  const removeFile = useCallback((id: string) => {
    setFilesSync((prev) => prev.filter((f) => f.id !== id));
    activeUploads.current.delete(id);
  }, [setFilesSync]);

  const retryFile = useCallback((id: string) => {
    setFilesSync((prev) =>
      prev.map((f) => f.id === id ? { ...f, status: 'pending', progress: 0, errorMessage: undefined } : f)
    );
    setTimeout(() => {
      const target = filesRef.current.find((f) => f.id === id);
      if (target) processFile(target);
    }, 50);
  }, [setFilesSync, processFile]);

  const clearCompleted = useCallback(() => {
    setFilesSync((prev) => prev.filter((f) => !isTerminalStatus(f.status)));
  }, [setFilesSync]);

  const clearAll = useCallback(() => {
    setFilesSync(() => []);
    activeUploads.current.clear();
  }, [setFilesSync]);

  const isProcessing = files.some(
    (f) => f.status === 'initiating' || f.status === 'uploading' || f.status === 'confirming'
  );

  return { files, addFiles, removeFile, retryFile, clearCompleted, clearAll, startPending, isProcessing };
}
