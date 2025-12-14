import { getCurrentUser } from '@api/auth';

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
};

export type AuthLoaderData = { user: User | null };

const authLoader = async (): Promise<AuthLoaderData> => {
  try {
    const response = await getCurrentUser();
    return { user: response.user };
  } catch (error) {
    return { user: null };
  }
};

export default authLoader;
