import apiClient from "config/axios.config";

export const getVersionHistory = async (documentId: string) => {
  const res = await apiClient.get(`/documents/${documentId}/versions`);
  return res.data;
};


export const downloadCurrentVersion = async (documentId: string,versionId:string) => {
  const res = await apiClient.get(`documents/${documentId}/versions/${versionId}/download`);
  return res.data;
};