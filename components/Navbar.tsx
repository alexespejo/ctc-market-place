'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const { user, signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/auth');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <nav 
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl"
      style={{ 
        borderBottom: '1px solid var(--border)',
        backgroundColor: 'rgba(250, 248, 245, 0.8)'
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-lg transition-transform group-hover:scale-105"
              style={{ backgroundColor: 'var(--accent)' }}
            >
              🍽
            </div>
            <span 
              className="font-serif text-xl font-semibold tracking-tight"
              style={{ color: 'var(--foreground)' }}
            >
              Meal Swipes
            </span>
          </Link>

          {/* Navigation */}
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <Link
                  href="/profile"
                  className="px-4 py-2 text-sm font-medium transition-colors hover:opacity-80"
                  style={{ color: 'var(--muted)' }}
                >
                  Profile
                </Link>
                <button
                  onClick={handleSignOut}
                  className="px-4 py-2 text-sm font-medium transition-colors hover:opacity-80"
                  style={{ color: 'var(--muted)' }}
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                href="/auth"
                className="px-5 py-2 text-sm font-medium text-white rounded-full transition-all shadow-sm hover:shadow-md hover:opacity-90"
                style={{ backgroundColor: 'var(--accent)' }}
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
