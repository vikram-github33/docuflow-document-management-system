import axios from "axios";
import { API_ENDPOINTS } from "constants/document..constant";

const api = axios.create({
  baseURL: process.env.VITE_API_URL ?? "http://localhost:7200",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token && config.headers) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export async function moveFilesInTrash(id: string): Promise<any> {
    const { data } = await api.delete<any>(API_ENDPOINTS.MOVE_DOCUMENT_TRASH(id));
    return data;
  }
