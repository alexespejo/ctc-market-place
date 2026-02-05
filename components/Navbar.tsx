'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const { user, signOut } = useAuth();
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2 group">
            <span className="text-xl sm:text-2xl font-bold text-purple-600 group-hover:text-purple-700 transition-colors">
            Meal Swipe Marketplace</span>
          </Link>

          <div className="flex items-center space-x-2 sm:space-x-3">
            {user ? (
              <>
                <Link
                  href="/profile"
                  className={`px-4 py-2 rounded-lg text-sm sm:text-base font-medium transition-all ${
                    pathname === '/profile'
                      ? 'bg-purple-600 text-white'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  Profile
                </Link>
                <button
                  onClick={signOut}
                  className="px-4 py-2 rounded-lg text-sm sm:text-base font-medium hover:bg-gray-100 text-gray-700 transition-all"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                href="/auth"
                className="px-5 py-2 rounded-lg text-sm sm:text-base font-semibold bg-purple-600 text-white hover:bg-purple-700 transition-all"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
