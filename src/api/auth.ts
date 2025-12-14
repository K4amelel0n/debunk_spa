import { api } from '@api';
import type { ApiResponse } from './types';

const ROUTE = '/api/v1/auth';

type LoginResponse = {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
};

export const login = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  try {
    const response = await api.post<ApiResponse<LoginResponse>>(
      `${ROUTE}/login`,
      {
        email,
        password,
      }
    );
    return response.data.data as LoginResponse;
  } catch (error) {
    throw error;
  }
};

export const register = async (
  name: string,
  email: string,
  password: string
) => {
  const response = await api.post(`${ROUTE}/register`, {
    name,
    email,
    password,
  });
  return response.data;
};

export const getCurrentUser = async (): Promise<LoginResponse> => {
  try {
    const response = await api.get<ApiResponse<LoginResponse>>(`${ROUTE}/me`);
    return response.data.data as LoginResponse;
  } catch (error) {
    throw error;
  }
};

export const refreshToken = async (): Promise<void> => {
  try {
    await api.post(`${ROUTE}/refresh-token`, {});
  } catch (error) {
    throw error;
  }
};

export const logout = async (): Promise<void> => {
  try {
    await api.post(`${ROUTE}/logout`, {});
  } catch (error) {
    throw error;
  }
};
