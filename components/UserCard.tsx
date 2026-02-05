'use client';

import { UserProfile } from '@/lib/types';

interface UserCardProps {
  user: UserProfile;
}

const formatPhoneNumber = (phone: string) => {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  return phone;
};

export default function UserCard({ user }: UserCardProps) {
  return (
    <div className={`group bg-white rounded-xl border border-gray-200 overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1 ${
      !user.isActive ? 'opacity-50' : ''
    }`}>
      {/* Profile Photo on Top */}
      <div className="relative">
        {user.photoURL ? (
          <img
            src={user.photoURL}
            alt={user.displayName}
            className="w-full h-48 object-cover"
          />
        ) : (
          <div className="w-full h-48 bg-purple-100 flex items-center justify-center">
            <span className="text-6xl font-bold text-purple-600">
              {user.displayName.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        {/* Status Badge */}
        <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm ${
          user.isActive
            ? 'bg-green-500/90 text-white animate-pulse'
            : 'bg-gray-500/90 text-white'
        }`}>
          {user.isActive ? '● Active' : '○ Inactive'}
        </div>
      </div>

      {/* Info at Bottom */}
      <div className="p-5">
        <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">{user.displayName}</h3>

        {/* Dining Hall, Swipes & Payment Rate */}
        <div className="grid grid-cols-3 gap-2 mb-4 pb-4 border-b border-gray-200">
          <div className="text-center">
            <div className="text-xl mb-1">📍</div>
            <div className="font-bold text-gray-900 text-xs">{user.diningHall}</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-purple-600 text-2xl mb-1">
              {user.swipeCount}
            </div>
            <div className="text-xs text-gray-600">Swipes</div>
          </div>
          <div className="text-center">
            {user.paymentRate ? (
              <>
                <div className="font-bold text-green-600 text-xl mb-1">${user.paymentRate}</div>
                <div className="text-xs text-gray-600">per swipe</div>
              </>
            ) : (
              <>
                <div className="font-bold text-green-600 text-xl mb-1">FREE</div>
                <div className="text-xs text-gray-600">no charge</div>
              </>
            )}
          </div>
        </div>

        {/* Phone Number */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 text-gray-700 font-semibold">
            📞 {formatPhoneNumber(user.phone)}
          </div>
        </div>

        {/* Timestamp */}
        <div className="mt-4 text-xs text-gray-400 text-center">
          Updated {new Date(user.updatedAt).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
}
