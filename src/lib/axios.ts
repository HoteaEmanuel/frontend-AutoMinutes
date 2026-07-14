import { useAuthStore } from '@/features/auth/stores/auth.store';
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { redirect } from 'react-router';
const API_URL = import.meta.env.VITE_REACT_API_URL;
export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const accessToken = useAuthStore.getState().accessToken;
    config.headers.Authorization = `Bearer ${accessToken}`;

    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as
      | (InternalAxiosRequestConfig & { _retry?: boolean })
      | undefined;
    const isRefreshCall = original?.url?.includes('/auth/refresh');

    if (error.response?.status === 401 && original && !original._retry && !isRefreshCall) {
      original._retry = true;
      try {
        const { data } = await api.post('/auth/refresh');
        useAuthStore.getState().setSession({ accessToken: data.accessToken, user: data.user });
        original.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(original);
      } catch (refreshError) {
        useAuthStore.getState().clearSession();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);
