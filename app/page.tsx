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
      await loadUsers(); // Refresh the list
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
      await loadUsers(); // Refresh the list
    } catch (error) {
      console.error('Error toggling active status:', error);
      alert('Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  const filteredUsers = users.filter((u) => {
    if (filter === 'active') return u.isActive;
    if (filter === 'inactive') return !u.isActive;
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-28">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 text-gray-900">
            Meal Swipe Marketplace
          </h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            Connect with fellow UCI students to share meal swipes
          </p>
        </div>

        {/* User Quick Controls */}
        {user && userProfile && (
          <div className="bg-white rounded-xl p-6 mb-10 max-w-2xl mx-auto border border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">Quick Controls</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Location Toggle */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Your Location</label>
                <button
                  onClick={handleToggleLocation}
                  disabled={updating}
                  className={`w-full py-2 px-4 rounded-lg font-medium text-sm transition-all ${
                    userProfile.diningHall === 'Brandywine'
                      ? 'bg-purple-600 text-white hover:bg-purple-700'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  } ${updating ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {userProfile.diningHall === 'Brandywine' ? '🏢 Brandywine' : '🍽️ Anteatery'}
                </button>
              </div>

              {/* Active Status Toggle */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Visibility</label>
                <button
                  onClick={handleToggleActive}
                  disabled={updating}
                  className={`w-full py-2 px-4 rounded-lg font-medium text-sm transition-all ${
                    userProfile.isActive
                      ? 'bg-green-500 text-white hover:bg-green-600 animate-pulse'
                      : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                  } ${updating ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {userProfile.isActive ? '● Active' : '○ Inactive'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Call to Action */}
        {!user && (
          <div className="bg-white rounded-xl p-8 sm:p-10 mb-10 text-center max-w-2xl mx-auto border border-gray-200 shadow-sm">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              Share or Find Swipes
            </h2>
            <p className="text-gray-600 mb-6">
              Join the community and start connecting with other students
            </p>
            <a
              href="/auth"
              className="inline-block px-8 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-all"
            >
              Get Started →
            </a>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-xl p-2 mb-10 max-w-md mx-auto border border-gray-200 shadow-sm">
          <div className="flex gap-2 justify-center">
            <button
              onClick={() => setFilter('active')}
              className={`flex-1 px-4 py-2.5 rounded-lg font-medium transition-all ${
                filter === 'active'
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Active <span className="text-xs opacity-75">({users.filter((u) => u.isActive).length})</span>
            </button>
            <button
              onClick={() => setFilter('all')}
              className={`flex-1 px-4 py-2.5 rounded-lg font-medium transition-all ${
                filter === 'all'
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              All <span className="text-xs opacity-75">({users.length})</span>
            </button>
            <button
              onClick={() => setFilter('inactive')}
              className={`flex-1 px-4 py-2.5 rounded-lg font-medium transition-all ${
                filter === 'inactive'
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Inactive <span className="text-xs opacity-75">({users.filter((u) => !u.isActive).length})</span>
            </button>
          </div>
        </div>

        {/* Users Grid */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            <p className="mt-4 text-gray-600">Loading swipes...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl border border-gray-200 shadow-sm max-w-lg mx-auto">
            <div className="text-6xl mb-4">🍽️</div>
            <p className="text-xl text-gray-600">
              {filter === 'active'
                ? 'No active users right now'
                : 'No users found'}
            </p>
            <p className="text-sm text-gray-500 mt-2">Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUsers.map((user) => (
              <UserCard key={user.id} user={user} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
