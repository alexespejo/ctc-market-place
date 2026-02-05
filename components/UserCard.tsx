'use client';

import { UserProfile } from '@/lib/types';

interface UserCardProps {
  user: UserProfile;
  isViewerSignedIn?: boolean;
}

const formatPhoneNumber = (phone: string) => {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  return phone;
};

export default function UserCard({ user, isViewerSignedIn = false }: UserCardProps) {
  return (
    <div className={`bento-card overflow-hidden relative ${!user.isActive ? 'opacity-60' : ''}`}>
      {/* Unavailable chip for inactive users */}
      {!user.isActive && (
        <div className="absolute top-4 right-4 z-10">
          <div 
            className="px-3 py-1.5 rounded-full text-xs font-semibold shadow-md"
            style={{ 
              backgroundColor: 'rgba(107, 114, 128, 0.9)',
              color: 'white'
            }}
          >
            Unavailable
          </div>
        </div>
      )}
      
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
          {user.photoURL ? (
            <img
              src={user.photoURL}
              alt={user.displayName}
              className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
            />
          ) : (
            <div 
              className="w-24 h-24 rounded-full flex items-center justify-center border-4 border-white shadow-lg"
              style={{ backgroundColor: 'var(--accent)' }}
            >
              <span className="text-3xl font-serif font-bold text-white">
                {user.displayName.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          
          {/* Active status badge */}
          {user.isActive && (
            <div className="absolute -top-1 -right-1">
              <div className="relative">
                <div className="w-4 h-4 rounded-full bg-emerald-500 border-2 border-white shadow-sm"></div>
                <div className="absolute inset-0 w-4 h-4 rounded-full bg-emerald-500 pulse-soft"></div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Info Section */}
      <div className="p-6 pt-4 space-y-4">
        {/* Name */}
        <h3 
          className="font-serif text-2xl font-semibold text-center -tracking-tight"
          style={{ color: 'var(--foreground)' }}
        >
          {user.displayName}
        </h3>

        {/* Phone */}
        <div 
          className="flex items-center justify-center gap-2"
          style={{ color: 'var(--muted)' }}
        >
          <span className="text-base">📞</span>
          {isViewerSignedIn ? (
            <span className="text-sm font-medium">{formatPhoneNumber(user.phone)}</span>
          ) : (
            <span className="text-sm font-medium italic">Sign in to view</span>
          )}
        </div>

        {/* Details Row */}
        <div 
          className="flex items-center justify-between pt-2"
          style={{ borderTop: '1px solid var(--border)' }}
        >
          {/* Location */}
          <div className="flex items-center gap-2">
            <span className="text-base">📍</span>
            <span 
              className="text-sm font-medium"
              style={{ color: 'var(--foreground)' }}
            >
              {user.diningHall}
            </span>
          </div>

          {/* Swipes */}
          <div className="flex items-center gap-2">
            <span className="text-base">🎫</span>
            <span 
              className="text-sm font-semibold"
              style={{ color: 'var(--accent)' }}
            >
              {user.swipeCount}
            </span>
          </div>

          {/* Payment Rate */}
          {user.paymentRate && user.paymentRate > 0 ? (
            <div className="flex items-center gap-1">
              <span className="text-sm font-semibold text-emerald-600">
                ${user.paymentRate.toFixed(2)}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-1">
              <span 
                className="text-sm font-medium"
                style={{ color: 'var(--muted)' }}
              >
                Free
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
