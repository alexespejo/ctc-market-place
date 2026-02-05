export type DiningHall = 'Brandywine' | 'Anteatery';

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  phone?: string;
  photoURL?: string;
  diningHall: DiningHall;
  swipeCount: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfileInput {
  displayName: string;
  phone?: string;
  photoURL?: string;
  diningHall: DiningHall;
  swipeCount: number;
  isActive: boolean;
}
