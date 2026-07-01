import axios from 'axios';
import type { FavouriteDocument, FavouriteFolder } from '../types/favourites.types';
import apiClient from 'config/axios.config';


export const favouritesService = {
  /** GET /favourites/documents */
  async getFavouriteDocuments(): Promise<FavouriteDocument[]> {
    const { data } = await apiClient.get<FavouriteDocument[]>('/favourites');
    return data;
  },

  async toggleFavouriteDoc(payload:any) {
    const { data } = await apiClient.post('/favourites/toggle',payload);
    return data;
  },

  /** GET /favourites/folders */
  async getFavouriteFolders(): Promise<FavouriteFolder[]> {
    const { data } = await apiClient.get<FavouriteFolder[]>('/favourites/folders');
    return data;
  },

  /** DELETE /favourites/documents/:id  — remove from favourites */
  async removeDocumentFavourite(id: string): Promise<void> {
    await apiClient.delete(`/favourites/documents/${id}`);
  },

  /** DELETE /favourites/folders/:id */
  async removeFolderFavourite(id: string): Promise<void> {
    await apiClient.delete(`/favourites/folders/${id}`);
  },
};
