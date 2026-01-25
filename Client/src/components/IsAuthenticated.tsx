import { useSelector } from 'react-redux';
import type { RootState } from '../store/store';
import { Navigate, Outlet } from 'react-router-dom';

export const IsAuthenticated = () => {
  const { user, token } = useSelector((state: RootState) => state.auth);

  if (user && token) {
    return <Navigate to="/" />;
  }
  return <Outlet />;
};
