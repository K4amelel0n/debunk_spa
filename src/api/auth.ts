import { api } from '@api';

export const login = async (email: string, password: string) => {
  const response = await api.post('/api/login', { mail: email, password });
  return response.data;
};
