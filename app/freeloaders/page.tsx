'use client';

import { useEffect, useState } from 'react';
import { getAllUsers } from '@/lib/firestore';
import { UserProfile } from '@/lib/types';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/contexts/AuthContext';

export default function FreeloadersPage() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    loadFreeloaders();
  }, []);

  const loadFreeloaders = async () => {
    try {
      const fetchedUsers = await getAllUsers();
      const freeloaders = fetchedUsers.filter((u) => u.userType === 'swiped');
      setUsers(freeloaders);
    } catch (error) {
      console.error('Error fetching freeloaders:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPhoneNumber = (phone: string) => {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
    return phone;
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24">
        {/* Hero Section */}
        <div className="text-center mb-16 sm:mb-20 max-w-4xl mx-auto">
          <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 tracking-tight" style={{ color: 'var(--foreground)' }}>
            🎉 Freeloaders
          </h1>
          <p className="text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed" style={{ color: 'var(--muted)', fontStyle: 'italic' }}>
            The lucky ones who got swiped in
          </p>
        </div>

        {/* Stats Card */}
        <div className="bento-card p-6 sm:p-8 mb-12 max-w-2xl mx-auto text-center">
          <div className="flex items-center justify-center gap-4">
            <div>
              <div className="text-4xl font-serif font-bold" style={{ color: 'var(--accent)' }}>
                {users.length}
              </div>
              <div className="text-sm font-medium mt-1" style={{ color: 'var(--muted)' }}>
                Total Freeloaders
              </div>
            </div>
          </div>
        </div>

        {/* Users Grid */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-2 border-[--accent] border-t-transparent"></div>
            <p className="mt-6 font-medium" style={{ color: 'var(--muted)' }}>Loading freeloaders...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="bento-card text-center py-16 max-w-lg mx-auto">
            <div className="text-6xl mb-4 opacity-30">🎫</div>
            <h3 className="font-serif text-2xl font-semibold mb-2" style={{ color: 'var(--foreground)' }}>
              No freeloaders yet
            </h3>
            <p style={{ color: 'var(--muted)' }}>
            CTCs biggests
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map((freeloader) => (
              <div key={freeloader.id} className="bento-card overflow-hidden relative">
                {/* Profile Photo Section */}
                <div 
                  className="relative p-8 pb-6"
                  style={{ 
                    background: 'linear-gradient(to bottom right, rgba(196, 181, 160, 0.2), rgba(196, 181, 160, 0.05))' 
                  }}
                >
                  {/* Organic background shape */}
                  <div 
                    className="absolute top-0 right-0 w-32 h-32 organic-shape -translate-y-8 translate-x-8"
                    style={{ backgroundColor: 'rgba(196, 181, 160, 0.1)' }}
                  ></div>
                  
                  <div className="relative flex flex-col items-center">
                    {freeloader.photoURL ? (
                      <img
                        src={freeloader.photoURL}
                        alt={freeloader.displayName}
                        className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                      />
                    ) : (
                      <div 
                        className="w-24 h-24 rounded-full flex items-center justify-center border-4 border-white shadow-lg"
                        style={{ backgroundColor: 'var(--accent)' }}
                      >
                        <span className="text-3xl font-serif font-bold text-white">
                          {freeloader.displayName.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    
                    {/* Freeloader badge */}
                    <div className="absolute -top-1 -right-1">
                      <div className="px-2.5 py-1 rounded-full text-xl font-bold bg-purple-500 text-white shadow-lag">
                       🫄 
                      </div>
                    </div>
                  </div>
                </div>

                {/* Info Section */}
                <div className="p-6 pt-4 space-y-4">
                  {/* Name */}
                  <h3 
                    className="font-serif text-2xl font-semibold text-center -tracking-tight"
                    style={{ color: 'var(--foreground)' }}
                  >
                    {freeloader.displayName}
                  </h3>

                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
