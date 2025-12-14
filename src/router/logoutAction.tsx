import { redirect } from 'react-router';
import { toast } from 'react-toastify';
import { logout } from '@api/auth';

const logoutAction = async () => {
  try {
    await logout();
    toast.success('Wylogowano pomyślnie');
  } catch (error) {
    console.error('Logout error:', error);
    toast.success('Wylogowano pomyślnie');
  }
  return redirect('/');
};

export default logoutAction;
