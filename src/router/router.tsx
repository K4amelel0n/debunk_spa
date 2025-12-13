import { createBrowserRouter } from 'react-router';

import RootLayout from '@layouts/RootLayout';
import MainLayout from '@layouts/MainLayout';
import App from '../App';
import authLoader from './authLoader';
import AuthLayout from '@layouts/AuthLayout';
import LoginPage from '@pages/auth/login/LoginPage';
import loginAction from '@pages/auth/login/action';
import logoutAction from './logoutAction';
import AddPostPage from '@pages/posts/AddPostPage';
import addPostAction from '@pages/posts/addPostAction';

export const router = createBrowserRouter([
  {
    id: 'root',
    element: <RootLayout />,
    loader: authLoader,
    children: [
      {
        path: '/',
        element: <MainLayout />,
        children: [
          {
            index: true,
            element: <App />,
          },
          {
            path: 'posts/add',
            element: <AddPostPage />,
            action: addPostAction,
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
        ],
      },
    ],
  },
]);
