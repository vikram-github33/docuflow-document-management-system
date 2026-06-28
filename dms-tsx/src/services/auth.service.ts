import { API_ENDPOINTS } from 'constants/auth.constant';
import { apiClient, s3Client } from '../config/axios.config';


export async function signUpUser(payload:any): Promise<any> {
  const { data } = await apiClient.post<any>(API_ENDPOINTS.SIGN_UP_USER, payload);
  return data;
}

export async function loginUser(payload:any): Promise<any> {
  const { data } = await apiClient.post<any>(API_ENDPOINTS.LOG_IN_USER, payload);
  return data;
}