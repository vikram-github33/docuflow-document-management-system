import axios from 'axios';
import type { SharedWithMeItem } from '../types/shared.types';

import apiClient from "config/axios.config";

export const sharedService = {
  /** GET /share/with-me */
  async getSharedWithMe(): Promise<SharedWithMeItem[]> {
    const { data } = await apiClient.get<{ success: boolean; data: SharedWithMeItem[] }>('/document-share/shared-with-me');
    return data.data;
  },

  /** DELETE /share/:shareId — remove my access */
  async removeAccess(shareId: string): Promise<void> {
    await apiClient.delete(`/share/${shareId}`);
  },
};
