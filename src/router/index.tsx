import { createBrowserRouter } from 'react-router';

import RootLayout from '@layouts/RootLayout';
import MainLayout from '@layouts/MainLayout';
import App from '../App';
import authLoader from './authLoader';

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
        ],
      },
    ],
  },
]);
