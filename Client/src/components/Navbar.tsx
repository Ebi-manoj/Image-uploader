import { ImageUp, Upload } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../lib/utils';
import ProfileMenu from './ProfileMenu';
import { useSelector } from 'react-redux';
import type { RootState } from '../store/store';

export default function Navbar() {
  const location = useLocation();
  const { user } = useSelector((state: RootState) => state.auth);
  const isUploadPage = location.pathname === '/upload';

  return (
    <nav
      className={cn(
        'sticky top-0 z-50 w-full  bg-white/95 backdrop-blur supports-backdrop-filter:bg-white/60',
      )}
    >
      <div className="container flex h-14 items-center justify-between mx-auto px-4 md:px-8">
        <Link to="/" className="mr-6 flex items-center space-x-2">
          <ImageUp className="h-6 w-6" />
          <span className="hidden font-bold sm:inline-block">
            Image Uploader
          </span>
        </Link>

        <div className="flex items-center gap-4">
          {user && (
            <Link
              to="/upload"
              className={cn(
                'flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors border-b-2',
                isUploadPage
                  ? 'border-pink-500 text-pink-600'
                  : 'border-transparent text-slate-700 hover:text-pink-600 hover:border-pink-300'
              )}
            >
              <Upload className="h-4 w-4" />
              Upload
            </Link>
          )}
          
          <ProfileMenu />
        </div>
      </div>
    </nav>
  );
}
