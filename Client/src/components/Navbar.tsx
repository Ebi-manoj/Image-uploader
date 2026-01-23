import { ImageUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';

export default function Navbar() {
  return (
    <nav
      className={cn(
        'sticky top-0 z-50 w-full  bg-white/95 backdrop-blur supports-backdrop-filter:bg-white/60',
      )}
    >
      <div className="container flex h-14 items-center mx-auto px-4 md:px-8">
        <Link to="/" className="mr-6 flex items-center space-x-2">
          <ImageUp className="h-6 w-6" />
          <span className="hidden font-bold sm:inline-block">
            Image Uploader
          </span>
        </Link>
      </div>
    </nav>
  );
}
