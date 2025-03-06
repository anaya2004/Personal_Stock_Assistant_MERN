import { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
import Dashboard from 'layout/Dashboard';

const Color = Loadable(lazy(() => import('pages/component-overview/color')));
const Typography = Loadable(lazy(() => import('pages/component-overview/typography')));
const Shadow = Loadable(lazy(() => import('pages/component-overview/shadows')));
const DashboardDefault = Loadable(lazy(() => import('pages/dashboard/index')));
import ProtectedRoute from "../ProtectedRoute";
// render - sample page
const SamplePage = Loadable(lazy(() => import('pages/extra-pages/TotalInvestment')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: "/",
  element: <ProtectedRoute element={<Dashboard />} />, // Protect Dashboard
  children: [
    {
      path: "/",
      element: <DashboardDefault />
    },
    {
      path: "dashboard",
      children: [
        {
          path: "default",
          element: <DashboardDefault />
        }
      ]
    },
    {
      path: "color",
      element: <Color />
    },
    {
      path: "sample-page",
      element: <SamplePage />
    },
    {
      path: "shadow",
      element: <Shadow />
    },
    {
      path: "typography",
      element: <Typography />
    }
  ]
};


export default MainRoutes;
