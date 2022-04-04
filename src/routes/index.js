import { Suspense, lazy } from 'react';
import { Navigate, useRoutes, useLocation } from 'react-router-dom';
// layouts
import MainLayout from '../layouts/main';
import DashboardLayout from '../layouts/dashboard';
import LogoOnlyLayout from '../layouts/LogoOnlyLayout';
// guards
import GuestGuard from '../guards/GuestGuard';
import AuthGuard from '../guards/AuthGuard';
// import RoleBasedGuard from '../guards/RoleBasedGuard';
// config
import { PATH_AFTER_LOGIN } from '../config';
// components
import LoadingScreen from '../components/LoadingScreen';

// ----------------------------------------------------------------------

const Loadable = (Component) => (props) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { pathname } = useLocation();

  return (
    <Suspense fallback={<LoadingScreen isDashboard={pathname.includes('/dashboard')} />}>
      <Component {...props} />
    </Suspense>
  );
};

export default function Router() {
  return useRoutes([
    {
      path: 'auth',
      children: [
        {
          path: 'login',
          element: (
            <GuestGuard>
              <Login />
            </GuestGuard>
          ),
        },
        {
          path: 'register',
          element: (
            <GuestGuard>
              <Register />
            </GuestGuard>
          ),
        },
        // { path: 'login-unprotected', element: <Login /> },
        // { path: 'register-unprotected', element: <Register /> },
        { path: 'reset-password', element: <ResetPassword /> },
        { path: 'verify', element: <VerifyCode /> },
      ],
    },

    // Dashboard Routes
    {
      path: 'dashboard',
      element: (
        <AuthGuard>
          <DashboardLayout />
        </AuthGuard>
      ),
      children: [
        { element: <Navigate to={PATH_AFTER_LOGIN} replace />, index: true },
        { path: 'app', element: <GeneralApp /> },
        {
          path: 'user',
          children: [
            { path: 'list', element: <UserListPage /> },
            { path: 'new', element: <UserFormPage /> },
            { path: ':id/edit', element: <UserFormPage /> },
            { path: 'account', element: <UserAccount /> },
          ],
        },
        {
          path: 'exercise',
          children: [
            { path: 'list', element: <ExerciseListPage /> },
            { path: 'new', element: <ExerciseFormPage /> },
            { path: ':id/edit', element: <ExerciseFormPage /> },
            { path: 'categories', element: <CategoriesExerciseListPage /> },
          ],
        },
      ],
    },

    // Main Routes
    {
      path: '*',
      element: <LogoOnlyLayout />,
      children: [
        { path: '500', element: <Page500 /> },
        { path: '404', element: <NotFound /> },
        { path: '*', element: <Navigate to="/404" replace /> },
      ],
    },
    {
      path: '/',
      element: <MainLayout />,
      children: [{ element: <HomePage />, index: true }],
    },
    { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}

// IMPORT COMPONENTS

// Authentication
const Login = Loadable(lazy(() => import('../pages/auth/Login')));
const Register = Loadable(lazy(() => import('../pages/auth/Register')));
const ResetPassword = Loadable(lazy(() => import('../pages/auth/ResetPassword')));
const VerifyCode = Loadable(lazy(() => import('../pages/auth/VerifyCode')));

// Dashboard
const GeneralApp = Loadable(lazy(() => import('../pages/dashboard/GeneralApp')));
const UserAccount = Loadable(lazy(() => import('../pages/dashboard/UserAccount')));

// User
const UserListPage = Loadable(lazy(() => import('../pages/user/UserListPage')));
const UserFormPage = Loadable(lazy(() => import('../pages/user/UserFormPage')));

// Exercise
const ExerciseListPage = Loadable(lazy(() => import('../pages/exercises/ExerciseListPage')));
const ExerciseFormPage = Loadable(lazy(() => import('../pages/exercises/ExerciseFormPage')));
const CategoriesExerciseListPage = Loadable(lazy(() => import('../pages/exercises/CategoriesExerciseListPage')));

// Main
const HomePage = Loadable(lazy(() => import('../pages/Home')));
const Page500 = Loadable(lazy(() => import('../pages/Page500')));
const NotFound = Loadable(lazy(() => import('../pages/Page404')));
