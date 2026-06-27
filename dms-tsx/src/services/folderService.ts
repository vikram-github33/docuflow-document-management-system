import axios from 'axios';
import type {
  Folder,
  FolderTreeNode,
  CreateFolderPayload,
  UpdateFolderPayload,
} from '../types/folder.types';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL ?? 'http://localhost:7200',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token && config.headers) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const folderService = {
  async getFolderTree(): Promise<FolderTreeNode[]> {
    const { data } = await api.get<FolderTreeNode[]>('/folders/tree');
    return data;
  },

  async getFolders(): Promise<Folder[]> {
    const { data } = await api.get<Folder[]>('/folders');
    return data;
  },

  async getFolderById(id: string): Promise<Folder> {
    const { data } = await api.get<Folder>(`/folders/${id}`);
    return data;
  },

  async aiPoweredSearch(query: string): Promise<Folder> {
    const { data } = await api.get<Folder>(`/documents/search?query=${query}`);
    return data;
  },

  async getFolderChildren(id: string): Promise<Folder[]> {
    const { data } = await api.get<Folder[]>(`/folders/${id}/children`);
    return data;
  },

  async createFolder(payload: CreateFolderPayload): Promise<Folder> {
    const { data } = await api.post<Folder>('/folders', payload);
    return data;
  },

  async updateFolder(id: string, payload: UpdateFolderPayload): Promise<Folder> {
    const { data } = await api.patch<Folder>(`/folders/${id}`, payload);
    return data;
  },

  async deleteFolder(id: string): Promise<{ message: string }> {
    const { data } = await api.delete<{ message: string }>(`/folders/${id}`);
    return data;
  },
};
