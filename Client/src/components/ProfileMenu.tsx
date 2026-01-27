import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { LogOut, KeyRound } from 'lucide-react';
import type { RootState } from '../store/store';
import { clearUser } from '../store/features/auth/auth.slice';
import { logoutApi } from '../api/auth';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

export default function ProfileMenu() {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  if (!user) return null;

  const getInitials = (email: string) => {
    const name = email.split('@')[0];
    return name.slice(0, 2).toUpperCase();
  };

  const handleLogout = async () => {
    try {
      await logoutApi();
    } catch (error) {
    } finally {
      dispatch(clearUser());
      navigate('/login', { replace: true });
    }
  };

  const handleResetPassword = () => {
    navigate('/forgot-password');
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="flex h-9 w-9 items-center justify-center rounded-full bg-black cursor-pointer text-sm font-semibold text-white transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2">
          {getInitials(user.email)}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-0 border-0" align="end">
        <div className="px-3 py-2">
          <p className="text-sm font-medium text-slate-900 truncate">
            {user.email}
          </p>
          <p className="text-xs text-slate-500 truncate">{user.phone}</p>
        </div>

        {/* Menu Items */}
        <div className="p-1">
          <button
            onClick={handleResetPassword}
            className="cursor-pointer flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 transition"
          >
            <KeyRound className="h-4 w-4" />
            Reset Password
          </button>
          <button
            onClick={handleLogout}
            className=" cursor-pointer flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
