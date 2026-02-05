'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';

export default function AuthPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user, signInWithGoogle } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push('/profile');
    }
  }, [user, router]);

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    try {
      await signInWithGoogle();
      router.push('/profile');
    } catch (err: any) {
      setError(err.message || 'Google sign-in failed');
    } finally {
      setLoading(false);
    }
  };

  if (user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[--background]">
      <Navbar />
      
      <main className="max-w-lg mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24">
        <div className="bento-card overflow-hidden relative">
          {/* Organic background shapes */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-[--accent-light]/10 organic-shape -translate-y-12 translate-x-12"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-[--accent]/5 organic-shape translate-y-10 -translate-x-10"></div>
          
          {/* Header */}
          <div className="relative p-8 sm:p-12 text-center border-b border-[--border]">
            <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-[--accent] flex items-center justify-center text-3xl">
              🍽
            </div>
            <h1 className="font-serif text-4xl font-bold mb-3 text-[--foreground] tracking-tight">
              Welcome back
            </h1>
            <p className="text-[--muted] leading-relaxed">
              Sign in with your UCI account to access<br />the meal swipe marketplace
            </p>
          </div>

          <div className="relative p-8 sm:p-10">
            {error && (
              <div className="mb-6 p-4 bg-red-50/50 rounded-xl border border-red-200">
                <p className="text-sm text-red-700 font-medium text-center">{error}</p>
              </div>
            )}

            {/* Google Sign In */}
            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 py-4 px-6 bg-[--paper] border-2 border-[--border] rounded-xl hover:border-[--accent] hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium text-[--foreground]"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span className="font-semibold">
                {loading ? 'Signing in...' : 'Continue with Google'}
              </span>
            </button>

            <div className="mt-6 p-5 bg-amber-50/50 border border-amber-200/50 rounded-xl">
              <div className="flex gap-3">
                <span className="text-lg flex-shrink-0">⚠️</span>
                <div>
                  <p className="font-semibold text-sm text-amber-900 mb-1">
                    UCI Students Only
                  </p>
                  <p className="text-sm text-amber-800 leading-relaxed">
                    You must sign in with your UCI Google account ending in <span className="font-mono font-semibold">@uci.edu</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional context */}
        <div className="mt-8 text-center">
          <p className="text-sm text-[--muted]">
            By signing in, you agree to connect with fellow UCI students<br />
            and follow community guidelines.
          </p>
        </div>
      </main>
    </div>
  );
}
