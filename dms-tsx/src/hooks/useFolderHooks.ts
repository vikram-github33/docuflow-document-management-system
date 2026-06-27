import { useState, useCallback } from 'react';
import { folderService } from '../services/folderService';
import type { FolderTreeNode, Folder, CreateFolderPayload, UpdateFolderPayload } from '../types/folder.types';

// ── useFolderTree ─────────────────────────────────────────────────────────────
export function useFolderTree() {
  const [tree, setTree] = useState<FolderTreeNode[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const fetchTree = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await folderService.getFolderTree();
      setTree(data);
      // console.log("data===",data)
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'Failed to load folders');
    } finally {
      setLoading(false);
    }
  }, []);

  return { tree, loading, error, refetch: fetchTree };
}

// ── useFolderDetails ──────────────────────────────────────────────────────────
export function useFolderDetails() {
  const [folder, setFolder] = useState<Folder | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFolder = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await folderService.getFolderById(id);
      setFolder(data);
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'Failed to load folder details');
    } finally {
      setLoading(false);
    }
  }, []);

  const clearFolder = useCallback(() => setFolder(null), []);

  return { folder, loading, error, fetchFolder, clearFolder };
}

// ── useCreateFolder ───────────────────────────────────────────────────────────
export function useCreateFolder() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createFolder = useCallback(async (payload: CreateFolderPayload): Promise<Folder | null> => {
    setLoading(true);
    setError(null);
    try {
      return await folderService.createFolder(payload);
    } catch (err: any) {
      const msg = err?.response?.data?.message;
      setError(Array.isArray(msg) ? msg.join(', ') : (msg ?? 'Failed to create folder'));
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { createFolder, loading, error, clearError: () => setError(null) };
}

// ── useUpdateFolder ───────────────────────────────────────────────────────────
export function useUpdateFolder() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateFolder = useCallback(async (id: string, payload: UpdateFolderPayload): Promise<Folder | null> => {
    setLoading(true);
    setError(null);
    try {
      return await folderService.updateFolder(id, payload);
    } catch (err: any) {
      const msg = err?.response?.data?.message;
      setError(Array.isArray(msg) ? msg.join(', ') : (msg ?? 'Failed to update folder'));
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { updateFolder, loading, error };
}

// ── useDeleteFolder ───────────────────────────────────────────────────────────
export function useDeleteFolder() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteFolder = useCallback(async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await folderService.deleteFolder(id);
      return true;
    } catch (err: any) {
      const msg = err?.response?.data?.message;
      setError(Array.isArray(msg) ? msg.join(', ') : (msg ?? 'Failed to delete folder'));
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return { deleteFolder, loading, error };
}
