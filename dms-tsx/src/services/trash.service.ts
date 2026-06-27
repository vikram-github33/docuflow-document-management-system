import axios from 'axios';
import type { TrashedDocument, TrashedFolder } from '../types/trash.types';
console.log("process.env.REACT_APP_API_URL",process.env.VITE_API_URL)
const api = axios.create({
  // baseURL: process.env.REACT_APP_API_URL ?? 'http://localhost:3000',
  baseURL:'http://localhost:7200',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token && config.headers) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const trashService = {
  // GET all soft-deleted documents
  async getTrashedDocuments(): Promise<TrashedDocument[]> {
    const { data } = await api.get<TrashedDocument[]>('/documents/trash');
    return data;
  },

  // GET all soft-deleted folders
  async getTrashedFolders(): Promise<TrashedFolder[]> {
    const { data } = await api.get<TrashedFolder[]>('/folders/trash');
    return data;
  },

  // Restore a document
  async restoreDocument(id: string): Promise<void> {
    await api.post(`/documents/${id}/restore`);
  },

  // Restore a folder
  async restoreFolder(id: string): Promise<void> {
    await api.patch(`/folders/${id}/restore`);
  },

  // Permanently delete a document
  async permanentlyDeleteDocument(id: string): Promise<void> {
    await api.delete(`/documents/${id}/permanent`);
  },

  // Permanently delete a folder
  async permanentlyDeleteFolder(id: string): Promise<void> {
    await api.delete(`/folders/${id}/permanent`);
  },

  // Empty entire trash
  async emptyTrash(): Promise<void> {
    await api.delete('/trash/empty');
  },

  // // Empty deleted files
  // export const getDeletedFiles(): Promise<void> {
  //   await api.get('/documents/trash');
  // },


  // GET all soft-deleted documents
  async getDeletedFiles(): Promise<any[]> {
    const { data } = await api.get<any[]>('/documents/trash');
    return data;
  },
};
