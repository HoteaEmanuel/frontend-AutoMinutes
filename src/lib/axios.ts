import { useAuthStore } from '@/features/auth/stores/auth.store';
import axios from 'axios';
const API_URL = import.meta.env.VITE_REACT_API_URL;
export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
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
  (error) => {
    if (error.response?.status === 401) {
      // TODO: handle token refresh / logout
    }
    return Promise.reject(error);
  },
);
