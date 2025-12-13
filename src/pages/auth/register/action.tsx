import { register } from '@api/auth';
import type { AxiosError } from 'axios';
import { redirect } from 'react-router';
import type { ActionFunctionArgs } from 'react-router';
import { toast } from 'react-toastify';

const registerAction = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const confirmPassword = formData.get('confirmPassword') as string;

  if (password !== confirmPassword) {
    return {
      generalError: 'Hasła nie są identyczne.',
      status: 400,
    };
  }

  if (password.length < 8) {
    return {
      generalError: 'Hasło musi mieć co najmniej 8 znaków.',
      status: 400,
    };
  }

  try {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await register(name, email, password);
    toast.success('Konto zostało utworzone. Możesz się teraz zalogować.');
    return redirect('/login');
  } catch (error: AxiosError | any) {
    if (error.response) {
      if (error.response.status === 409) {
        return {
          generalError: 'Użytkownik o podanym adresie email już istnieje.',
          status: 409,
        };
      }
      if (error.response.status === 400) {
        return {
          generalError: error.response.data?.error || 'Nieprawidłowe dane.',
          status: 400,
        };
      }
    }
    return {
      generalError: 'Wystąpił błąd podczas rejestracji. Spróbuj ponownie.',
      status: 500,
    };
  }
};

export default registerAction;
