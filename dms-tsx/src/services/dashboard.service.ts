import axios from 'axios';
import type {
  ApiResponse,
  DashboardData,
  DashboardStats,
  StorageStats,
  RecentDocument,
  RecentFolder,
} from '../types/dashboard.types';
import apiClient from 'config/axios.config';

export const dashboardService = {
  /** GET /dashboard — single call, everything the page needs */
  async getDashboard(): Promise<DashboardData> {
    const { data } = await apiClient.get<ApiResponse<DashboardData>>('/dashboard');
    return data.data;
  },

  /** GET /dashboard/stats */
  async getStats(): Promise<DashboardStats> {
    const { data } = await apiClient.get<ApiResponse<DashboardStats>>('/dashboard/stats');
    return data.data;
  },

  /** GET /dashboard/storage */
  async getStorage(): Promise<StorageStats> {
    const { data } = await apiClient.get<ApiResponse<StorageStats>>('/dashboard/storage');
    return data.data;
  },

  /** GET /dashboard/recent-files */
  async getRecentFiles(limit = 8): Promise<RecentDocument[]> {
    const { data } = await apiClient.get<ApiResponse<RecentDocument[]>>('/dashboard/recent-files', {
      params: { limit },
    });
    return data.data;
  },

  /** GET /dashboard/recent-folders */
  async getRecentFolders(limit = 6): Promise<RecentFolder[]> {
    const { data } = await apiClient.get<ApiResponse<RecentFolder[]>>('/dashboard/recent-folders', {
      params: { limit },
    });
    return data.data;
  },
};
