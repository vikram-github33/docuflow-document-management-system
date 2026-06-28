import { useState, useCallback, useRef } from "react";
// import { uploadFileToS3 } from '../services/upload.service';
import { useInitiateUpload } from "./useInitiateUpload";
import { useConfirmUpload } from "./useConfirmUpload";
import {
  createUploadFile,
  validateFile,
  isTerminalStatus,
} from "../utils/upload.utils";
import {
  MAX_CONCURRENT_UPLOADS,
  MAX_FILES_PER_BATCH,
} from "../constants/upload.constants";
import type { UploadFile, UploadSettings } from "../types/upload.types";
import Settings from "pages/Settings";

interface UseUploadQueueResult {
  files: UploadFile[];
  addFiles: (newFiles: File[], settings: UploadSettings) => void;
  removeFile: (id: string) => void;
  retryFile: (id: string) => void;
  clearCompleted: () => void;
  clearAll: () => void;
  startPending: (settings: UploadSettings) => void;
  isProcessing: boolean;
}

export function useUploadQueue(): UseUploadQueueResult {
  const [files, setFiles] = useState<UploadFile[]>([]);
  const activeUploads = useRef<Set<string>>(new Set());
  const filesRef = useRef<UploadFile[]>([]);
  const { initiate } = useInitiateUpload();
  const { confirm } = useConfirmUpload();
const settingsRef = useRef<UploadSettings>();
  // Keep ref in sync so processFile closure can read latest files
  const setFilesSync = useCallback(
    (updater: (prev: UploadFile[]) => UploadFile[]) => {
      setFiles((prev) => {
        const next = updater(prev);
        filesRef.current = next;
        return next;
      });
    },
    [],
  );
  // console.log("files",files)
  const updateFile = useCallback(
    (id: string, patch: Partial<UploadFile>) => {
      setFilesSync((prev) =>
        prev.map((f) => (f.id === id ? { ...f, ...patch } : f)),
      );
    },
    [setFilesSync],
  );

 const processFile = async (uploadFile: UploadFile) => {
  const settings = settingsRef.current;

  if (!settings) return;

  if (activeUploads.current.has(uploadFile.id)) return;

  activeUploads.current.add(uploadFile.id);

  try {
    updateFile(uploadFile.id, { status: "initiating" });

    await initiate({
      file: uploadFile.file,
      folderId: settings.folderId,
      ownerId: "8f6d1d1f-5f6b-4d1c-a7f2-9b8d3e7c4a21",
      tags: settings.tags,
      description: settings.description,
    });

    updateFile(uploadFile.id, {
      status: "success",
      completedAt: new Date(),
    });
  } catch (err) {
    updateFile(uploadFile.id, {
      status: "error",
      errorMessage: err instanceof Error ? err.message : "Upload failed",
    });
  } finally {
    activeUploads.current.delete(uploadFile.id);

    const nextPending = filesRef.current.find(
      (f) => f.status === "pending" && !activeUploads.current.has(f.id)
    );

    if (nextPending && activeUploads.current.size < MAX_CONCURRENT_UPLOADS) {
      processFile(nextPending);
    }
  }
};

  const addFiles = useCallback(
    (newFiles: File[], settings: UploadSettings) => {
      const valid: UploadFile[] = [];
      console.log("settings add filessss", settings);
      newFiles.slice(0, MAX_FILES_PER_BATCH).forEach((file) => {
        const { valid: ok } = validateFile(file);
        if (ok) valid.push(createUploadFile(file));
      });
      if (!valid.length) return;
      setFilesSync((prev) => {
        const next = [...prev, ...valid];
        filesRef.current = next;
        return next;
      });
      newFiles.forEach((file) => {
        console.log("settings before create", settings);

        const uploadFile = createUploadFile(file);

        console.log("created upload file", uploadFile);

        valid.push(uploadFile);
      });
      // Do NOT auto-start — user clicks "Start upload"
    },
    [setFilesSync],
  );

const startPending = useCallback(
  (settings: UploadSettings) => {
    settingsRef.current = settings;

    const pending = filesRef.current.filter(
      (f) => f.status === "pending" && !activeUploads.current.has(f.id)
    );

    const slots =
      MAX_CONCURRENT_UPLOADS - activeUploads.current.size;

    pending.slice(0, slots).forEach((f) => processFile(f));
  },
  [processFile]
);

  const removeFile = useCallback(
    (id: string) => {
      setFilesSync((prev) => prev.filter((f) => f.id !== id));
      activeUploads.current.delete(id);
    },
    [setFilesSync],
  );

  const retryFile = useCallback(
    (id: string) => {
      setFilesSync((prev) =>
        prev.map((f) =>
          f.id === id
            ? { ...f, status: "pending", progress: 0, errorMessage: undefined }
            : f,
        ),
      );
      setTimeout(() => {
        const target = filesRef.current.find((f) => f.id === id);
        if (target) processFile(target);
      }, 50);
    },
    [setFilesSync, processFile],
  );

  const clearCompleted = useCallback(() => {
    setFilesSync((prev) => prev.filter((f) => !isTerminalStatus(f.status)));
  }, [setFilesSync]);

  const clearAll = useCallback(() => {
    setFilesSync(() => []);
    activeUploads.current.clear();
  }, [setFilesSync]);

  const isProcessing = files.some(
    (f) =>
      f.status === "initiating" ||
      f.status === "uploading" ||
      f.status === "confirming",
  );

  return {
    files,
    addFiles,
    removeFile,
    retryFile,
    clearCompleted,
    clearAll,
    startPending,
    isProcessing,
  };
}
