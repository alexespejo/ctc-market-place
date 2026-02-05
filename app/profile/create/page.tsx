'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getUserProfile, createOrUpdateUserProfile } from '@/lib/firestore';
import { DiningHall } from '@/lib/types';
import Navbar from '@/components/Navbar';

export default function CreateProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    displayName: '',
    phone: '',
    photoURL: '',
    diningHall: 'Brandywine' as DiningHall,
    swipeCount: 0,
    isActive: true,
  });

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      loadExistingProfile();
    }
  }, [user]);

  const loadExistingProfile = async () => {
    if (!user) return;
    try {
      const profile = await getUserProfile(user.uid);
      if (profile) {
        setFormData({
          displayName: profile.displayName,
          phone: profile.phone || '',
          photoURL: profile.photoURL || '',
          diningHall: profile.diningHall,
          swipeCount: profile.swipeCount,
          isActive: profile.isActive,
        });
      } else {
        // Set defaults from Google account if available
        setFormData(prev => ({
          ...prev,
          displayName: user.displayName || '',
          photoURL: user.photoURL || '',
        }));
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || submitting) return;

    setSubmitting(true);
    try {
      // Use the user's Google photo URL
      const photoURL = user.photoURL || formData.photoURL;

      await createOrUpdateUserProfile(user.uid, user.email || '', {
        ...formData,
        photoURL,
      });
      router.push('/profile');
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Failed to save profile. Please try again.');
    } finally {
      setSubmitting(false);
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

  const displayPhotoURL = user?.photoURL || formData.photoURL;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-28">
        <div className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm">
          {/* Header */}
          <div className="bg-purple-600 p-8 sm:p-10 text-white">
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">
              {formData.displayName ? 'Edit Profile' : 'Create Profile'}
            </h1>
            <p className="text-purple-100">
              Set up your profile to start sharing meal swipes
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 sm:p-10 space-y-6">
            {/* Profile Photo Preview */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Profile Photo
              </label>
              <div className="flex items-center gap-6">
                <div className="flex-shrink-0">
                  {displayPhotoURL ? (
                    <img
                      src={displayPhotoURL}
                      alt="Profile"
                      className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-purple-100 flex items-center justify-center border-2 border-gray-200">
                      <span className="text-3xl font-bold text-purple-600">
                        {formData.displayName ? formData.displayName.charAt(0).toUpperCase() : '?'}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600">
                    {displayPhotoURL 
                      ? 'Using your Google account photo' 
                      : 'Sign in with Google to add a profile photo'}
                  </p>
                </div>
              </div>
            </div>

            {/* Display Name */}
            <div>
              <label htmlFor="displayName" className="block text-sm font-semibold text-gray-700 mb-2">
                Display Name *
              </label>
              <input
                type="text"
                id="displayName"
                required
                value={formData.displayName}
                onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition text-gray-900"
                placeholder="How should we call you?"
              />
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                Phone Number (Optional)
              </label>
              <input
                type="tel"
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition text-gray-900"
                placeholder="(123) 456-7890"
              />
              <p className="mt-2 text-xs text-gray-500">
                Students will be able to contact you at this number
              </p>
            </div>

            {/* Dining Hall */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Nearest Dining Hall *
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, diningHall: 'Brandywine' })}
                  className={`p-4 rounded-lg font-semibold transition-all border-2 ${
                    formData.diningHall === 'Brandywine'
                      ? 'bg-purple-600 text-white border-purple-600'
                      : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  🏢 Brandywine
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, diningHall: 'Anteatery' })}
                  className={`p-4 rounded-lg font-semibold transition-all border-2 ${
                    formData.diningHall === 'Anteatery'
                      ? 'bg-purple-600 text-white border-purple-600'
                      : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  🍽️ Anteatery
                </button>
              </div>
            </div>

            {/* Swipe Count */}
            <div>
              <label htmlFor="swipeCount" className="block text-sm font-semibold text-gray-700 mb-2">
                Initial Swipe Count *
              </label>
              <div className="flex items-center space-x-4">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, swipeCount: Math.max(0, formData.swipeCount - 1) })}
                  className="w-12 h-12 rounded-full bg-red-500 text-white text-xl font-bold hover:bg-red-600 transition-all"
                >
                  −
                </button>
                <input
                  type="number"
                  id="swipeCount"
                  min="0"
                  value={formData.swipeCount}
                  onChange={(e) => setFormData({ ...formData, swipeCount: Math.max(0, parseInt(e.target.value) || 0) })}
                  className="flex-1 px-4 py-3 bg-white border border-gray-300 rounded-lg text-center text-3xl font-bold focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition text-purple-600"
                />
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, swipeCount: formData.swipeCount + 1 })}
                  className="w-12 h-12 rounded-full bg-green-500 text-white text-xl font-bold hover:bg-green-600 transition-all"
                >
                  +
                </button>
              </div>
            </div>

            {/* Active Status */}
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-semibold text-gray-700">Start as Active</label>
                  <p className="text-xs text-gray-500 mt-1">
                    Make your profile visible immediately
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
                  className={`relative inline-flex h-11 w-20 items-center rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    formData.isActive 
                      ? 'bg-green-500 focus:ring-green-500' 
                      : 'bg-gray-300 focus:ring-gray-400'
                  }`}
                >
                  <span
                    className={`inline-block h-9 w-9 transform rounded-full bg-white shadow-lg transition-transform ${
                      formData.isActive ? 'translate-x-10' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 px-6 bg-purple-600 text-white rounded-lg font-bold text-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all"
              >
                {submitting ? 'Saving...' : formData.displayName ? '✓ Update Profile' : '→ Create Profile'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
