import axios from 'axios';
import type {
  ActivityListResponse,
  ActivitySummaryResponse,
  ActivityType,
} from '../types/activity.types';
import apiClient from 'config/axios.config';
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
    const { data } = await apiClient.get<ActivityListResponse>('/document-activity', { params });
    return data;
  },

  /** GET /document-activity/summary */
  async getSummary(dateFrom?: string): Promise<ActivitySummaryResponse> {
    const { data } = await apiClient.get<ActivitySummaryResponse>('/document-activity/summary', {
      params: dateFrom ? { dateFrom } : {},
    });
    return data;
  },
};
