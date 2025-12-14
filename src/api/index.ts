import axios, { AxiosError } from 'axios';
import type { InternalAxiosRequestConfig } from 'axios';
import type { HttpErrorResponse } from '@api/types';

export const api = axios.create({
  baseURL: import.meta.env.DEV ? '' : 'https://debunk-api.onrender.com',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response) {
      const status = error.response.status;
      const errorData = error.response.data as HttpErrorResponse;

      console.error(
        `[Axios Interceptor] Błąd ${status}:`,
        errorData.error?.message || 'Unknown error'
      );

      if (
        (status === 401 || status === 403) &&
        !originalRequest._retry &&
        !originalRequest.url?.includes('/auth/refresh-token') &&
        !originalRequest.url?.includes('/auth/login') &&
        !originalRequest.url?.includes('/auth/register')
      ) {
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then(() => {
              return api(originalRequest);
            })
            .catch((err) => {
              return Promise.reject(err);
            });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          await api.post(
            '/api/v1/auth/refresh-token',
            {},
            {
              withCredentials: true,
            }
          );

          processQueue();
          isRefreshing = false;

          return api(originalRequest);
        } catch (refreshError) {
          processQueue(refreshError);
          isRefreshing = false;

          if (!originalRequest.url?.includes('/auth/me')) {
            window.location.href = '/login';
          }

          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    } else if (error.request) {
      console.error('[Axios Interceptor] Brak odpowiedzi od serwera.');
    } else {
      console.error('[Axios Interceptor] Błąd konfiguracyjny:', error.message);
    }

    return Promise.reject(error);
  }
);
