import { api } from '@api';

export const login = async (email: string, password: string) => {
  const response = await api.post('/api/login', { mail: email, password });
  return response.data;
};

export const register = async (
  name: string,
  email: string,
  password: string
) => {
  const response = await api.post('/api/register', {
    name,
    mail: email,
    password,
  });
  return response.data;
};
