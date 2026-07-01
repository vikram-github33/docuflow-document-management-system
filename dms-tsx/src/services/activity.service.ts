import axios from 'axios';
import type {
  ActivityListResponse,
  ActivitySummaryResponse,
  ActivityType,
} from '../types/activity.types';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL ?? 'http://localhost:7200',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token && config.headers) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export interface GetActivitiesParams {
  page?:         number;
  limit?:        number;
  activityType?: ActivityType;
  entityType?:   'document' | 'folder';
  userId?:       string;
  search?:       string;
  dateFrom?:     string; // ISO date string
}

export const activityService = {
  /** GET /document-activity */
  async getActivities(params: GetActivitiesParams = {}): Promise<ActivityListResponse> {
    const { data } = await api.get<ActivityListResponse>('/document-activity', { params });
    return data;
  },

  /** GET /document-activity/summary */
  async getSummary(dateFrom?: string): Promise<ActivitySummaryResponse> {
    const { data } = await api.get<ActivitySummaryResponse>('/document-activity/summary', {
      params: dateFrom ? { dateFrom } : {},
    });
    return data;
  },
};
