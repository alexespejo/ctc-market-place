'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getUserProfile, createOrUpdateUserProfile } from '@/lib/firestore';
import { DiningHall, UserType } from '@/lib/types';
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
    userType: 'swiper' as UserType,
    swipeCount: 0,
    paymentRate: undefined as number | undefined,
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
          phone: profile.phone,
          photoURL: profile.photoURL || '',
          diningHall: profile.diningHall,
          userType: profile.userType,
          swipeCount: profile.swipeCount,
          paymentRate: profile.paymentRate,
          isActive: profile.isActive,
        });
      } else {
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
      const photoURL = user.photoURL || formData.photoURL;

      // Clean the form data to remove undefined values
      const cleanedData = {
        displayName: formData.displayName,
        phone: formData.phone,
        photoURL,
        diningHall: formData.diningHall,
        userType: formData.userType,
        swipeCount: formData.swipeCount,
        isActive: formData.isActive,
        ...(formData.paymentRate !== undefined && { paymentRate: formData.paymentRate }),
      };

      await createOrUpdateUserProfile(user.uid, user.email || '', cleanedData);
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
      <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <div 
            className="inline-block animate-spin rounded-full h-12 w-12 border-2 border-t-transparent"
            style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }}
          ></div>
        </div>
      </div>
    );
  }

  const displayPhotoURL = user?.photoURL || formData.photoURL;

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
      <Navbar />
      
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 
            className="font-serif text-5xl font-bold mb-3 tracking-tight"
            style={{ color: 'var(--foreground)' }}
          >
            {formData.displayName ? 'Edit Your Profile' : 'Create Your Profile'}
          </h1>
          <p className="leading-relaxed" style={{ color: 'var(--muted)' }}>
            {formData.displayName 
              ? 'Update your information to keep the community connected'
              : 'Tell us about yourself and start connecting with students'}
          </p>
        </div>

        <div className="bento-card overflow-hidden relative">
          {/* Organic background shapes */}
          <div 
            className="absolute top-0 right-0 w-64 h-64 organic-shape -translate-y-20 translate-x-20"
            style={{ backgroundColor: 'rgba(196, 181, 160, 0.1)' }}
          ></div>
          
          {/* Form */}
          <form onSubmit={handleSubmit} className="relative p-8 sm:p-10 space-y-8">
            {/* Profile Photo Preview */}
            <div>
              <label 
                className="block text-sm font-semibold mb-4"
                style={{ color: 'var(--foreground)' }}
              >
                Profile Photo
              </label>
              <div 
                className="flex items-center gap-6 p-5 rounded-xl"
                style={{ 
                  backgroundColor: 'var(--background)', 
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  borderColor: 'var(--border)' 
                }}
              >
                <div className="shrink-0">
                  {displayPhotoURL ? (
                    <img
                      src={displayPhotoURL}
                      alt="Profile"
                      className="w-20 h-20 rounded-2xl object-cover border-2 shrink-0"
                      style={{ borderColor: 'var(--border)' }}
                    />
                  ) : (
                    <div 
                      className="w-20 h-20 rounded-2xl flex items-center justify-center border-2"
                      style={{ 
                        backgroundColor: 'rgba(139, 115, 85, 0.2)', 
                        borderColor: 'var(--border)' 
                      }}
                    >
                      <span 
                        className="text-3xl font-serif font-bold"
                        style={{ color: 'var(--accent)' }}
                      >
                        {formData.displayName ? formData.displayName.charAt(0).toUpperCase() : '?'}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm" style={{ color: 'var(--muted)' }}>
                    {displayPhotoURL 
                      ? 'Using your Google account photo' 
                      : 'Sign in with Google to add a profile photo'}
                  </p>
                </div>
              </div>
            </div>

            {/* User Type Toggle */}
            <div>
              <label 
                className="block text-sm font-semibold mb-4"
                style={{ color: 'var(--foreground)' }}
              >
                I am a *
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, userType: 'swiper' })}
                  className={`p-5 rounded-xl font-semibold transition-all border-2 ${
                    formData.userType === 'swiper'
                      ? 'text-white shadow-md'
                      : 'hover:opacity-80'
                  }`}
                  style={formData.userType === 'swiper' 
                    ? { 
                        backgroundColor: 'var(--accent)', 
                        borderColor: 'var(--accent)' 
                      }
                    : { 
                        backgroundColor: 'var(--paper)', 
                        color: 'var(--foreground)', 
                        borderColor: 'var(--border)' 
                      }
                  }
                >
                  <div className="text-2xl mb-2">🎫</div>
                  <div className="font-semibold">Swiper</div>
                  <p className="text-xs mt-1 opacity-80">I have swipes to share</p>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, userType: 'swiped' })}
                  className={`p-5 rounded-xl font-semibold transition-all border-2 ${
                    formData.userType === 'swiped'
                      ? 'text-white shadow-md'
                      : 'hover:opacity-80'
                  }`}
                  style={formData.userType === 'swiped'
                    ? { 
                        backgroundColor: 'var(--accent)', 
                        borderColor: 'var(--accent)' 
                      }
                    : { 
                        backgroundColor: 'var(--paper)', 
                        color: 'var(--foreground)', 
                        borderColor: 'var(--border)' 
                      }
                  }
                >
                  <div className="text-2xl mb-2">🔍</div>
                  <div className="font-semibold">Swiped</div>
                  <p className="text-xs mt-1 opacity-80">I&apos;m looking for swipes</p>
                </button>
              </div>
            </div>

            {/* Display Name */}
            <div>
              <label 
                htmlFor="displayName" 
                className="block text-sm font-semibold mb-3"
                style={{ color: 'var(--foreground)' }}
              >
                Display Name *
              </label>
              <input
                type="text"
                id="displayName"
                required
                value={formData.displayName}
                onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                className="w-full px-4 py-3.5 rounded-xl focus:ring-2 focus:border-transparent outline-none transition"
                style={{ 
                  backgroundColor: 'var(--paper)', 
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  borderColor: 'var(--border)',
                  color: 'var(--foreground)'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--accent)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
                placeholder="How should we call you?"
              />
            </div>

            {/* Phone */}
            <div>
              <label 
                htmlFor="phone" 
                className="block text-sm font-semibold mb-3"
                style={{ color: 'var(--foreground)' }}
              >
                Phone Number *
              </label>
              <input
                type="tel"
                id="phone"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-3.5 rounded-xl focus:ring-2 focus:border-transparent outline-none transition"
                style={{ 
                  backgroundColor: 'var(--paper)', 
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  borderColor: 'var(--border)',
                  color: 'var(--foreground)'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--accent)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
                placeholder="(123) 456-7890"
              />
              <p className="mt-2 text-xs" style={{ color: 'var(--muted)' }}>
                Students will contact you at this number
              </p>
            </div>

            {/* Dining Hall - Only for Swipers */}
            {formData.userType === 'swiper' && (
              <div>
                <label 
                  className="block text-sm font-semibold mb-4"
                  style={{ color: 'var(--foreground)' }}
                >
                  Nearest Dining Hall *
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, diningHall: 'Brandywine' })}
                    className={`p-5 rounded-xl font-semibold transition-all border-2 ${
                      formData.diningHall === 'Brandywine'
                        ? 'text-white shadow-md'
                        : 'hover:opacity-80'
                    }`}
                    style={formData.diningHall === 'Brandywine'
                      ? { backgroundColor: 'var(--accent)', borderColor: 'var(--accent)' }
                      : { backgroundColor: 'var(--paper)', color: 'var(--foreground)', borderColor: 'var(--border)' }
                    }
                  >
                    🏢 Brandywine
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, diningHall: 'Anteatery' })}
                    className={`p-5 rounded-xl font-semibold transition-all border-2 ${
                      formData.diningHall === 'Anteatery'
                        ? 'text-white shadow-md'
                        : 'hover:opacity-80'
                    }`}
                    style={formData.diningHall === 'Anteatery'
                      ? { backgroundColor: 'var(--accent)', borderColor: 'var(--accent)' }
                      : { backgroundColor: 'var(--paper)', color: 'var(--foreground)', borderColor: 'var(--border)' }
                    }
                  >
                    🍽️ Anteatery
                  </button>
                </div>
              </div>
            )}

            {/* Swipe Count - Only for Swipers */}
            {formData.userType === 'swiper' && (
              <>
                <div>
                  <label 
                    htmlFor="swipeCount" 
                    className="block text-sm font-semibold mb-4"
                    style={{ color: 'var(--foreground)' }}
                  >
                    Initial Swipe Count *
                  </label>
                  <div className="flex items-center gap-2 sm:gap-4">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, swipeCount: Math.max(0, formData.swipeCount - 1) })}
                      className="w-14 h-14 sm:w-14 sm:h-14 rounded-2xl bg-red-500 text-white text-2xl font-bold hover:bg-red-600 active:bg-red-700 transition-all shadow-md active:scale-95 flex-shrink-0 touch-manipulation"
                    >
                      −
                    </button>
                    <input
                      type="number"
                      id="swipeCount"
                      min="0"
                      value={formData.swipeCount}
                      onChange={(e) => setFormData({ ...formData, swipeCount: Math.max(0, parseInt(e.target.value) || 0) })}
                      className="flex-1 min-w-0 px-4 py-4 border-2 rounded-xl text-center text-3xl font-serif font-bold focus:ring-2 focus:border-transparent outline-none transition touch-manipulation"
                      style={{
                        backgroundColor: 'var(--paper)',
                        borderColor: 'var(--border)',
                        color: 'var(--accent)',
                        height: '56px'
                      }}
                      onFocus={(e) => e.target.style.borderColor = 'var(--accent)'}
                      onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
                    />
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, swipeCount: formData.swipeCount + 1 })}
                      className="w-14 h-14 sm:w-14 sm:h-14 rounded-2xl bg-emerald-500 text-white text-2xl font-bold hover:bg-emerald-600 active:bg-emerald-700 transition-all shadow-md active:scale-95 flex-shrink-0 touch-manipulation"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Payment Rate */}
                <div>
                  <label 
                    htmlFor="paymentRate" 
                    className="block text-sm font-semibold mb-3"
                    style={{ color: 'var(--foreground)' }}
                  >
                    Payment Rate (Optional)
                  </label>
                  <div className="relative">
                    <span 
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold"
                      style={{ color: 'var(--muted)' }}
                    >$</span>
                    <input
                      type="number"
                      id="paymentRate"
                      min="0"
                      step="0.50"
                      value={formData.paymentRate || ''}
                      onChange={(e) => setFormData({ ...formData, paymentRate: e.target.value ? parseFloat(e.target.value) : undefined })}
                      className="w-full pl-10 pr-4 py-3.5 rounded-xl focus:ring-2 focus:border-transparent outline-none transition"
                      style={{
                        backgroundColor: 'var(--paper)',
                        borderWidth: '1px',
                        borderStyle: 'solid',
                        borderColor: 'var(--border)',
                        color: 'var(--foreground)'
                      }}
                      onFocus={(e) => e.target.style.borderColor = 'var(--accent)'}
                      onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
                      placeholder="0.00"
                    />
                  </div>
                  <p className="mt-2 text-xs" style={{ color: 'var(--muted)' }}>
                    How much you charge per swipe (leave empty for free)
                  </p>
                </div>
              </>
            )}

            {/* Active Status - Only for Swipers */}
            {formData.userType === 'swiper' && (
              <div 
                className="rounded-xl p-6"
                style={{
                  backgroundColor: 'var(--background)',
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  borderColor: 'var(--border)'
                }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <label 
                      className="text-sm font-semibold"
                      style={{ color: 'var(--foreground)' }}
                    >Start as Active</label>
                    <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>
                      Make your profile visible immediately
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
                    className={`relative inline-flex h-11 w-20 items-center rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                      formData.isActive 
                        ? 'bg-emerald-500 focus:ring-emerald-500' 
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
            )}

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={submitting}
                className="accent-button w-full py-4 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Saving...' : formData.displayName ? '✓ Update Profile' : '→ Create Profile'}
              </button>
            </div>
          </form>
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-center">
          <p className="text-sm" style={{ color: 'var(--muted)' }}>
            * Required fields. Your information will be visible to other UCI students.
          </p>
        </div>
      </main>
    </div>
  );
}
