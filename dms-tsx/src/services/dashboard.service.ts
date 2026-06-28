import axios from 'axios';
import type { DashboardData, DashboardStats, RecentDocument, RecentFolder, ActivityItem } from '../types/dashboard.types';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL ?? 'http://localhost:3000',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token && config.headers) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const dashboardService = {
  async getStats(): Promise<DashboardStats> {
    const { data } = await api.get<DashboardStats>('/dashboard/stats');
    return data;
  },

  async getRecentDocuments(limit = 8): Promise<RecentDocument[]> {
    const { data } = await api.get<RecentDocument[]>(`/documents/recent?limit=${limit}`);
    return data;
  },

  async getRecentFolders(limit = 6): Promise<RecentFolder[]> {
    const { data } = await api.get<RecentFolder[]>(`/folders/recent?limit=${limit}`);
    return data;
  },

  async getActivity(limit = 10): Promise<ActivityItem[]> {
    const { data } = await api.get<ActivityItem[]>(`/activity?limit=${limit}`);
    return data;
  },

  // Convenience — fetch everything in parallel
  async getDashboardData(): Promise<DashboardData> {
    const [stats, recentDocuments, recentFolders, activity] = await Promise.all([
      dashboardService.getStats(),
      dashboardService.getRecentDocuments(),
      dashboardService.getRecentFolders(),
      dashboardService.getActivity(),
    ]);
    return {
      stats,
      recentDocuments,
      recentFolders,
      activity,
      storageBreakdown: [],
    };
  },
};
