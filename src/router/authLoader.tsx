import { api } from '@api';

const authLoader = async () => {
  try {
    const response = await api.get('');
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching auth status:', error);
    return { isAuthenticated: false };
  }
};

export default authLoader;
