import { login } from '@api/auth';
import type { AxiosError } from 'axios';
import { redirect } from 'react-router';
import type { ActionFunctionArgs } from 'react-router';

const authLoader = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  try {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await login(email, password);
    localStorage.setItem('token', JSON.stringify({ role: 'user' }));
    return redirect('/');
  } catch (error: AxiosError | any) {
    if (error.response && error.response.status === 401) {
      return {
        generalError: 'Nieprawidłowa nazwa użytkownika lub hasło.',
        status: 401,
      };
    }
  }
};

export default authLoader;
