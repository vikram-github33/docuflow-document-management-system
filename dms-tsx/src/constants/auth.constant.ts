export const API_ENDPOINTS = {
  SIGN_UP_USER: "/auth/register",
  LOG_IN_USER: "/auth/login",
  GET_USER_BY_ID: (id: string) => `/user/${id}`,
  UPDATE_USER: (id: string) => `/user/${id}`,
} as const;
    