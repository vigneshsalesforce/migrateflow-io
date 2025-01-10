import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout';
import Dashboard from '@/pages/Dashboard';
import ActiveMigrations from '@/pages/ActiveMigrations';
import History from '@/pages/History';
import Connections from '@/pages/Connections';
import { APP_CONSTANTS } from '@/constants';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        path: APP_CONSTANTS.ROUTES.DASHBOARD,
        element: <Dashboard />,
      },
      {
        path: APP_CONSTANTS.ROUTES.ACTIVE_MIGRATIONS,
        element: <ActiveMigrations />,
      },
      {
        path: APP_CONSTANTS.ROUTES.HISTORY,
        element: <History />,
      },
      {
        path: APP_CONSTANTS.ROUTES.CONNECTIONS,
        element: <Connections />,
      },
    ],
  },
]);