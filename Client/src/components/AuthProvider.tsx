import type React from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../store/store';
import { useEffect, useState } from 'react';
import { refreshTokenApi } from '../api/auth';
import { setUser } from '../store/features/auth/auth.slice';
import { Loader2 } from 'lucide-react';
import { useDispatch } from 'react-redux';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { token, user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token && user) {
      setLoading(false);
      return;
    }
    const checkAuth = async () => {
      try {
        const res = await refreshTokenApi();
        dispatch(setUser(res));
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="text-pink-500 text-center w-10 h-10 animate-spin" />
      </div>
    );
  }
  return <>{children}</>;
};
