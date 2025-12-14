import { createBrowserRouter } from 'react-router';

import RootLayout from '@layouts/RootLayout';
import MainLayout from '@layouts/MainLayout';
import App from '../App';
import authLoader from './authLoader';
import AuthLayout from '@layouts/AuthLayout';
import LoginPage from '@pages/auth/login/LoginPage';
import loginAction from '@pages/auth/login/action';
import RegisterPage from '@pages/auth/register/RegisterPage';
import registerAction from '@pages/auth/register/action';
import logoutAction from './logoutAction';

export const router = createBrowserRouter([
  {
    id: 'root',
    element: <RootLayout />,
    children: [
      {
        path: '/',
        element: <MainLayout />,
        loader: authLoader,
        children: [
          {
            index: true,
            element: <App />,
          },
        ],
      },
      {
        path: 'logout',
        action: logoutAction,
      },
      {
        element: <AuthLayout />,
        children: [
          {
            path: 'login',
            element: <LoginPage />,
            action: loginAction,
          },
          {
            path: 'register',
            element: <RegisterPage />,
            action: registerAction,
          },
        ],
      },
    ],
  },
]);
