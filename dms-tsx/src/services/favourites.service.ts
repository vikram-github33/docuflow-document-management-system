import axios from 'axios';
import type { FavouriteDocument, FavouriteFolder } from '../types/favourites.types';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL ?? 'http://localhost:7200',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token && config.headers) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const favouritesService = {
  /** GET /favourites/documents */
  async getFavouriteDocuments(): Promise<FavouriteDocument[]> {
    const { data } = await api.get<FavouriteDocument[]>('/favourites');
    return data;
  },

  async toggleFavouriteDoc(payload:any) {
    const { data } = await api.post('/favourites/toggle',payload);
    return data;
  },

  /** GET /favourites/folders */
  async getFavouriteFolders(): Promise<FavouriteFolder[]> {
    const { data } = await api.get<FavouriteFolder[]>('/favourites/folders');
    return data;
  },

  /** DELETE /favourites/documents/:id  — remove from favourites */
  async removeDocumentFavourite(id: string): Promise<void> {
    await api.delete(`/favourites/documents/${id}`);
  },

  /** DELETE /favourites/folders/:id */
  async removeFolderFavourite(id: string): Promise<void> {
    await api.delete(`/favourites/folders/${id}`);
  },
};
