'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import {
  getUserProfile,
  updateSwipeCount,
  toggleActiveStatus,
  updateDiningHall,
} from '@/lib/firestore';
import { UserProfile, DiningHall } from '@/lib/types';
import Navbar from '@/components/Navbar';

const formatPhoneNumber = (phone: string) => {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  return phone;
};

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      loadProfile();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;
    try {
      const userProfile = await getUserProfile(user.uid);
      if (!userProfile) {
        router.push('/profile/create');
      } else {
        setProfile(userProfile);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSwipeChange = async (delta: number) => {
    if (!profile || updating) return;
    setUpdating(true);
    try {
      const newCount = Math.max(0, profile.swipeCount + delta);
      await updateSwipeCount(profile.id, newCount);
      setProfile({ ...profile, swipeCount: newCount });
    } catch (error) {
      console.error('Error updating swipe count:', error);
      alert('Failed to update swipe count');
    } finally {
      setUpdating(false);
    }
  };

  const handleToggleActive = async () => {
    if (!profile || updating) return;
    setUpdating(true);
    try {
      const newStatus = !profile.isActive;
      await toggleActiveStatus(profile.id, newStatus);
      setProfile({ ...profile, isActive: newStatus });
    } catch (error) {
      console.error('Error toggling active status:', error);
      alert('Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  const handleDiningHallChange = async (newHall: DiningHall) => {
    if (!profile || updating || profile.diningHall === newHall) return;
    setUpdating(true);
    try {
      await updateDiningHall(profile.id, newHall);
      setProfile({ ...profile, diningHall: newHall });
    } catch (error) {
      console.error('Error updating dining hall:', error);
      alert('Failed to update dining hall');
    } finally {
      setUpdating(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-[--background]">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-2 border-[--accent] border-t-transparent"></div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
      <Navbar />
      
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24">
        {/* Back Button */}
        <button
          onClick={() => router.push('/')}
          className="flex items-center gap-2 mb-8 px-4 py-2 text-sm font-medium transition-all hover:opacity-70 cursor-pointer"
          style={{ color: 'var(--muted)' }}
        >
          <span className="text-lg">←</span>
          Back to Home
        </button>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 
            className="font-serif text-5xl font-bold mb-3 tracking-tight"
            style={{ color: 'var(--foreground)' }}
          >
            Your Profile
          </h1>
          <p style={{ color: 'var(--muted)' }}>Manage your meal swipe settings</p>
        </div>

        <div className="space-y-6">
          {/* Profile Info Card */}
          <div className="bento-card p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[--accent-light]/10 organic-shape -translate-y-8 translate-x-8"></div>
            
            {/* Edit Button - Top Right */}
            <button
              onClick={() => router.push('/profile/create')}
              className="absolute top-6 right-6 z-10 p-2.5 rounded-xl transition-all hover:scale-105 hover:shadow-md"
              style={{ 
                backgroundColor: 'var(--accent)',
                color: 'white'
              }}
              title="Edit Profile"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5" 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
            </button>
            
            <div className="relative flex items-start gap-6">
              {profile.photoURL ? (
                <img
                  src={profile.photoURL}
                  alt={profile.displayName}
                  className="w-20 h-20 rounded-2xl object-cover border-2 border-[--border] shrink-0"
                />
              ) : (
                <div className="w-20 h-20 rounded-2xl bg-[--accent] flex items-center justify-center border-2 border-[--border] shrink-0">
                  <span className="text-3xl font-serif font-bold text-white">
                    {profile.displayName.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h2 className="font-serif text-3xl font-semibold text-[--foreground] mb-2 tracking-tight">
                  {profile.displayName}
                </h2>
                <p className="text-sm text-[--muted] mb-3">{profile.email}</p>
                <div className="flex items-center gap-2 text-[--foreground]">
                  <span className="text-base">📞</span>
                  <span className="text-sm font-semibold">{formatPhoneNumber(profile.phone)}</span>
                </div>
              </div>
            </div>

            {/* User Type Badge */}
            <div className="mt-6 pt-6 border-t border-[--border]">
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm ${
                profile.userType === 'swiper'
                  ? 'bg-[--accent-light]/20 text-[--accent]'
                  : 'bg-blue-100 text-blue-700'
              }`}>
                {profile.userType === 'swiper' ? '🎫 Swiper' : '🔍 Swiped'}
              </div>
              <p className="text-sm text-[--muted] mt-3">
                {profile.userType === 'swiper' 
                  ? 'You are sharing swipes with others'
                  : 'You are looking for swipes'}
              </p>
            </div>
          </div>

          {/* Swiper-specific Controls */}
          {profile.userType === 'swiper' && (
            <>
              {/* Dining Hall Selection */}
              <div className="bento-card p-8">
                <h3 className="font-serif text-xl font-semibold text-[--foreground] mb-6">
                  Nearest Dining Hall
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => handleDiningHallChange('Brandywine')}
                    disabled={updating}
                    className={`p-5 rounded-xl font-semibold transition-all border-2 ${
                      profile.diningHall === 'Brandywine'
                        ? 'bg-[--accent] text-white border-[--accent] shadow-md'
                        : 'bg-[--paper] text-[--foreground] border-[--border] hover:border-[--accent-light]'
                    } ${updating ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    🏢 Brandywine
                  </button>
                  <button
                    onClick={() => handleDiningHallChange('Anteatery')}
                    disabled={updating}
                    className={`p-5 rounded-xl font-semibold transition-all border-2 ${
                      profile.diningHall === 'Anteatery'
                        ? 'bg-[--accent] text-white border-[--accent] shadow-md'
                        : 'bg-[--paper] text-[--foreground] border-[--border] hover:border-[--accent-light]'
                    } ${updating ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    🍽️ Anteatery
                  </button>
                </div>
              </div>

              {/* Active Status Toggle */}
              <div className="bento-card p-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-serif text-xl font-semibold text-[--foreground] mb-2">
                      Marketplace Visibility
                    </h3>
                    <p className="text-sm text-[--muted]">
                      {profile.isActive
                        ? 'You are visible to other students'
                        : 'You are hidden from the marketplace'}
                    </p>
                  </div>
                  <button
                    onClick={handleToggleActive}
                    disabled={updating}
                    className={`relative inline-flex h-12 w-24 items-center rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                      profile.isActive 
                        ? 'bg-emerald-500 focus:ring-emerald-500' 
                        : 'bg-gray-300 focus:ring-gray-400'
                    } ${updating ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <span
                      className={`inline-block h-10 w-10 transform rounded-full bg-white shadow-lg transition-transform ${
                        profile.isActive ? 'translate-x-13' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Swipe Counter */}
              <div className="bento-card p-10 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-48 h-48 bg-[--accent]/5 organic-shape -translate-y-12 -translate-x-12"></div>
                
                <div className="relative">
                  <h3 className="font-serif text-xl font-semibold text-[--foreground] mb-8 text-center">
                    Available Meal Swipes
                  </h3>
                  <div className="flex items-center justify-center gap-8">
                    <button
                      onClick={() => handleSwipeChange(-1)}
                      disabled={updating || profile.swipeCount === 0}
                      className="w-16 h-16 rounded-2xl bg-red-500 text-white text-3xl font-bold hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg active:scale-95"
                    >
                      −
                    </button>
                    <div className="text-center min-w-[140px]">
                      <div className="text-7xl font-serif font-bold text-[--accent]">
                        {profile.swipeCount}
                      </div>
                      <div className="text-sm text-[--muted] mt-2 font-medium">Swipes</div>
                    </div>
                    <button
                      onClick={() => handleSwipeChange(1)}
                      disabled={updating}
                      className="w-16 h-16 rounded-2xl bg-emerald-500 text-white text-3xl font-bold hover:bg-emerald-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg active:scale-95"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Payment Rate */}
              <div className="bento-card p-8 text-center bg-linear-to-br from-emerald-50/50 to-white">
                <h3 className="font-serif text-xl font-semibold text-[--foreground] mb-3">
                  Payment Rate
                </h3>
                {profile.paymentRate && profile.paymentRate > 0 ? (
                  <div className="text-5xl font-serif font-bold text-emerald-600">
                    ${profile.paymentRate.toFixed(2)}
                    <span className="text-base font-normal text-[--muted] ml-2">per swipe</span>
                  </div>
                ) : (
                  <div className="text-3xl font-serif font-semibold text-[--muted]">
                    Free
                  </div>
                )}
                <p className="text-xs text-[--muted] mt-4">
                  Edit in profile settings to change
                </p>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
