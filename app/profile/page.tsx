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
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-28">
        <div className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm">
          {/* Header */}
          <div className="bg-purple-600 p-8 sm:p-10 text-white">
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">My Profile</h1>
            <p className="text-purple-100 text-sm">{profile.email}</p>
          </div>

          {/* Profile Content */}
          <div className="p-6 sm:p-10 space-y-6">
            {/* Profile Photo and Name */}
            <div className="flex items-center gap-6 bg-gray-50 rounded-lg p-6 border border-gray-200">
              {profile.photoURL ? (
                <img
                  src={profile.photoURL}
                  alt={profile.displayName}
                  className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-purple-100 flex items-center justify-center border-2 border-gray-200">
                  <span className="text-3xl font-bold text-purple-600">
                    {profile.displayName.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">{profile.displayName}</h2>
                {profile.phone && (
                  <p className="text-gray-600 text-sm">
                    <span className="font-semibold">Phone:</span> {profile.phone}
                  </p>
                )}
              </div>
            </div>

            {/* Active Status Toggle - Only for Swipers */}
            {profile.userType === 'swiper' && (
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Visibility Status</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {profile.isActive
                        ? '● Visible to students'
                        : '○ Hidden from marketplace'}
                    </p>
                  </div>
                  <button
                    onClick={handleToggleActive}
                    disabled={updating}
                    className={`relative inline-flex h-11 w-20 items-center rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                      profile.isActive 
                        ? 'bg-green-500 focus:ring-green-500' 
                        : 'bg-gray-300 focus:ring-gray-400'
                    } ${updating ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <span
                      className={`inline-block h-9 w-9 transform rounded-full bg-white shadow-lg transition-transform ${
                        profile.isActive ? 'translate-x-10' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            )}

            {/* Dining Hall Selection */}
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Nearest Dining Hall</h3>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleDiningHallChange('Brandywine')}
                  disabled={updating}
                  className={`p-4 rounded-lg font-semibold transition-all border-2 ${
                    profile.diningHall === 'Brandywine'
                      ? 'bg-purple-600 text-white border-purple-600'
                      : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-100'
                  } ${updating ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  🏢 Brandywine
                </button>
                <button
                  onClick={() => handleDiningHallChange('Anteatery')}
                  disabled={updating}
                  className={`p-4 rounded-lg font-semibold transition-all border-2 ${
                    profile.diningHall === 'Anteatery'
                      ? 'bg-purple-600 text-white border-purple-600'
                      : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-100'
                  } ${updating ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  🍽️ Anteatery
                </button>
              </div>
            </div>

            {/* User Type Badge */}
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 text-center">
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-semibold ${
                profile.userType === 'swiper'
                  ? 'bg-purple-100 text-purple-700'
                  : 'bg-blue-100 text-blue-700'
              }`}>
                {profile.userType === 'swiper' ? '🎫 Swiper' : '🔍 Swiped'}
              </div>
              <p className="text-sm text-gray-600 mt-2">
                {profile.userType === 'swiper' 
                  ? 'You are sharing swipes with others'
                  : 'You are looking for swipes'}
              </p>
            </div>

            {/* Swipe Counter - Only for Swipers */}
            {profile.userType === 'swiper' && (
              <div className="bg-purple-50 rounded-lg p-8 border border-purple-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-6 text-center">Available Meal Swipes</h3>
                <div className="flex items-center justify-center space-x-6 sm:space-x-8">
                  <button
                    onClick={() => handleSwipeChange(-1)}
                    disabled={updating || profile.swipeCount === 0}
                    className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-red-500 text-white text-2xl sm:text-3xl font-bold hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all"
                  >
                    −
                  </button>
                  <div className="text-center min-w-[120px]">
                    <div className="text-6xl sm:text-7xl font-bold text-purple-600">
                      {profile.swipeCount}
                    </div>
                    <div className="text-sm text-gray-600 mt-2 font-medium">Swipes</div>
                  </div>
                  <button
                    onClick={() => handleSwipeChange(1)}
                    disabled={updating}
                    className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-green-500 text-white text-2xl sm:text-3xl font-bold hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all"
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            {/* Edit Profile Button */}
            <div className="pt-2">
              <button
                onClick={() => router.push('/profile/create')}
                className="w-full py-3 px-6 bg-gray-100 rounded-lg font-semibold text-gray-700 hover:bg-gray-200 transition-all"
              >
                ✏️ Edit Profile Information
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
