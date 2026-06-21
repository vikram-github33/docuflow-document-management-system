import { apiClient, s3Client } from '../config/axios.config';
import { API_ENDPOINTS } from '../constants/user.create';


export enum UserRole {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  USER = 'USER',
}

export interface CreateUserPayload {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  department?: string;
  employeeId?: string;
  phone?: string;
  designation?: string;
  role?: UserRole;
  isActive?: boolean;
}

export interface UpdateUserPayload {
  firstName: string;
  lastName: string;
  email: string;
  employeeId?: string;
  phone?: string;
  department?: string;
  designation?: string;
  role?: string;
  isActive?: boolean;
}


export async function createUser(payload:CreateUserPayload): Promise<any> {
  const { data } = await apiClient.post<CreateUserPayload>(API_ENDPOINTS.CREATE_USER, payload);
  return data;
}

export async function getAlluser(): Promise<any> {
  const { data } = await apiClient.get<any>(API_ENDPOINTS.GET_ALL_USER);
  return data;
}

export async function getUserById(id:string): Promise<any> {
  const { data } = await apiClient.get(
    API_ENDPOINTS.GET_USER_BY_ID(id)
  );

  return data;
}

export async function updateUser(
  id: string,
  payload: UpdateUserPayload
): Promise<any> {
  const { data } = await apiClient.put(
    API_ENDPOINTS.UPDATE_USER(id),
    payload
  );
  return data
}