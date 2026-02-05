export type DiningHall = 'Brandywine' | 'Anteatery';
export type UserType = 'swiper' | 'swiped';

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  phone: string;
  photoURL?: string;
  diningHall: DiningHall;
  userType: UserType;
  swipeCount: number;
  paymentRate?: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfileInput {
  displayName: string;
  phone: string;
  photoURL?: string;
  diningHall: DiningHall;
  userType: UserType;
  swipeCount: number;
  paymentRate?: number;
  isActive: boolean;
}
