export const API_ENDPOINTS = {
  CREATE_USER: "/user",
  GET_ALL_USER: "/user",
  GET_USER_BY_ID: (id: string) => `/user/${id}`,
  UPDATE_USER: (id: string) => `/user/${id}`,
} as const;
    