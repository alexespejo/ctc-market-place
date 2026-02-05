'use client';

import { useEffect, useState } from 'react';
import { getAllUsers, getUserProfile, updateDiningHall, toggleActiveStatus } from '@/lib/firestore';
import { UserProfile, DiningHall } from '@/lib/types';
import UserCard from '@/components/UserCard';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/contexts/AuthContext';

export default function Home() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [updating, setUpdating] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    if (user) {
      loadUserProfile();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const loadUsers = async () => {
    try {
      const fetchedUsers = await getAllUsers();
      setUsers(fetchedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserProfile = async () => {
    if (!user) return;
    try {
      const profile = await getUserProfile(user.uid);
      setUserProfile(profile);
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  const handleToggleLocation = async () => {
    if (!userProfile || !user || updating) return;
    setUpdating(true);
    try {
      const newHall: DiningHall = userProfile.diningHall === 'Brandywine' ? 'Anteatery' : 'Brandywine';
      await updateDiningHall(user.uid, newHall);
      setUserProfile({ ...userProfile, diningHall: newHall });
      await loadUsers();
    } catch (error) {
      console.error('Error updating dining hall:', error);
      alert('Failed to update dining hall');
    } finally {
      setUpdating(false);
    }
  };

  const handleToggleActive = async () => {
    if (!userProfile || !user || updating) return;
    setUpdating(true);
    try {
      const newStatus = !userProfile.isActive;
      await toggleActiveStatus(user.uid, newStatus);
      setUserProfile({ ...userProfile, isActive: newStatus });
      await loadUsers();
    } catch (error) {
      console.error('Error toggling active status:', error);
      alert('Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  const filteredUsers = users.filter((u) => {
    if (u.userType === 'swiped') return false;
    if (filter === 'active') return u.isActive;
    if (filter === 'inactive') return !u.isActive;
    return true;
  });

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24">
        {/* Hero Section */}
        <div className="text-center mb-16 sm:mb-20 max-w-4xl mx-auto">
          <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 tracking-tight" style={{ color: 'var(--foreground)' }}>
            Share meals,<br />build community
          </h1>
          <p className="text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed" style={{ color: 'var(--muted)', fontStyle: 'italic' }}>
           Something like that  
          </p>
        </div>

        {/* User Quick Controls - Only for Swipers */}
        {user && userProfile && userProfile.userType === 'swiper' && (
          <div className="bento-card p-6 sm:p-8 mb-12 max-w-2xl mx-auto">
            <h3 className="font-serif text-xl font-semibold mb-6 text-center" style={{ color: 'var(--foreground)' }}>
              Your Quick Controls
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Location Toggle */}
              <div>
                <label className="block text-sm font-medium mb-3" style={{ color: 'var(--muted)' }}>Location</label>
                <button
                  onClick={handleToggleLocation}
                  disabled={updating}
                  className={`soft-button w-full ${updating ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <span className="mr-2">{userProfile.diningHall === 'Brandywine' ? '🏢' : '🍽️'}</span>
                  {userProfile.diningHall}
                </button>
              </div>

              {/* Active Status Toggle */}
              <div>
                <label className="block text-sm font-medium mb-3" style={{ color: 'var(--muted)' }}>Visibility</label>
                <button
                  onClick={handleToggleActive}
                  disabled={updating}
                  className={`soft-button w-full ${userProfile.isActive ? 'border-emerald-400 bg-emerald-50' : ''} ${updating ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <span className="mr-2">{userProfile.isActive ? '●' : '○'}</span>
                  {userProfile.isActive ? 'Active' : 'Inactive'}
                  {userProfile.isActive && <span className="ml-2 inline-block w-2 h-2 rounded-full bg-emerald-500 pulse-soft"></span>}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Call to Action - Bento Style */}
        {!user && (
          <div className="bento-card p-8 sm:p-12 mb-12 text-center max-w-2xl mx-auto relative overflow-hidden">
            {/* Organic background shape */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[--accent-light]/10 organic-shape -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-[--accent]/5 organic-shape translate-y-12 -translate-x-12"></div>
            
            <div className="relative">
              <h2 className="font-serif text-3xl sm:text-4xl font-semibold mb-4 tracking-tight" style={{ color: 'var(--foreground)' }}>
                Join the marketplace
              </h2>
              <p className="mb-8 leading-relaxed" style={{ color: 'var(--muted)' }}>
                Share your extra swipes or find someone nearby.<br />
                It takes less than a minute to get started.
              </p>
              <a
                href="/auth"
                className="accent-button inline-block"
              >
                Sign in with Google →
              </a>
            </div>
          </div>
        )}

        {/* Filter Pills */}
        <div className="flex gap-3 justify-center mb-12 flex-wrap">
          <button
            onClick={() => setFilter('active')}
            className={`px-6 py-2.5 rounded-full font-medium transition-all text-sm cursor-pointer ${
              filter === 'active'
                ? 'text-white shadow-md'
                : 'soft-button'
            }`}
            style={filter === 'active' ? { backgroundColor: 'var(--accent)' } : undefined}
          >
            Active
            <span className="ml-2 opacity-70 text-xs">
              {users.filter((u) => u.userType === 'swiper' && u.isActive).length}
            </span>
          </button>
          <button
            onClick={() => setFilter('all')}
            className={`px-6 py-2.5 rounded-full font-medium transition-all text-sm cursor-pointer ${
              filter === 'all'
                ? 'text-white shadow-md'
                : 'soft-button'
            }`}
            style={filter === 'all' ? { backgroundColor: 'var(--accent)' } : undefined}
          >
            All
            <span className="ml-2 opacity-70 text-xs">
              {users.filter((u) => u.userType === 'swiper').length}
            </span>
          </button>
          <button
            onClick={() => setFilter('inactive')}
            className={`px-6 py-2.5 rounded-full font-medium transition-all text-sm cursor-pointer ${
              filter === 'inactive'
                ? 'text-white shadow-md'
                : 'soft-button'
            }`}
            style={filter === 'inactive' ? { backgroundColor: 'var(--accent)' } : undefined}
          >
            Inactive
            <span className="ml-2 opacity-70 text-xs">
              {users.filter((u) => u.userType === 'swiper' && !u.isActive).length}
            </span>
          </button>
        </div>

        {/* Users Grid */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-2 border-[--accent] border-t-transparent"></div>
            <p className="mt-6 font-medium" style={{ color: 'var(--muted)' }}>Loading swipes...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="bento-card text-center py-16 max-w-lg mx-auto">
            <div className="text-6xl mb-4 opacity-30">🍽️</div>
            <h3 className="font-serif text-2xl font-semibold mb-2" style={{ color: 'var(--foreground)' }}>
              No swipes available
            </h3>
            <p style={{ color: 'var(--muted)' }}>
              {filter === 'active'
                ? 'No active users right now. Check back soon!'
                : 'Be the first to share your swipes'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUsers.map((userData) => (
              <UserCard key={userData.id} user={userData} isViewerSignedIn={!!user} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
