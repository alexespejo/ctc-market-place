import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  where,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import { UserProfile, UserProfileInput } from './types';

const USERS_COLLECTION = 'users';

// Convert Firestore data to UserProfile
const convertToUserProfile = (id: string, data: any): UserProfile => {
  return {
    id,
    email: data.email,
    displayName: data.displayName,
    phone: data.phone,
    photoURL: data.photoURL,
    diningHall: data.diningHall,
    userType: data.userType || 'swiper',
    swipeCount: data.swipeCount || 0,
    paymentRate: data.paymentRate,
    isActive: data.isActive ?? true,
    createdAt: data.createdAt?.toDate() || new Date(),
    updatedAt: data.updatedAt?.toDate() || new Date(),
  };
};

// Create or update user profile
export async function createOrUpdateUserProfile(
  userId: string,
  email: string,
  profileData: UserProfileInput
): Promise<void> {
  const userRef = doc(db, USERS_COLLECTION, userId);
  const userDoc = await getDoc(userRef);

  const timestamp = Timestamp.now();

  if (userDoc.exists()) {
    // Update existing profile
    await updateDoc(userRef, {
      ...profileData,
      updatedAt: timestamp,
    });
  } else {
    // Create new profile
    await setDoc(userRef, {
      email,
      ...profileData,
      createdAt: timestamp,
      updatedAt: timestamp,
    });
  }
}

// Get user profile
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const userRef = doc(db, USERS_COLLECTION, userId);
  const userDoc = await getDoc(userRef);

  if (!userDoc.exists()) {
    return null;
  }

  return convertToUserProfile(userDoc.id, userDoc.data());
}

// Get all active users (for marketplace)
export async function getActiveUsers(): Promise<UserProfile[]> {
  const usersRef = collection(db, USERS_COLLECTION);
  const q = query(
    usersRef,
    where('isActive', '==', true),
    orderBy('updatedAt', 'desc')
  );

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => convertToUserProfile(doc.id, doc.data()));
}

// Get all users (active first)
export async function getAllUsers(): Promise<UserProfile[]> {
  const usersRef = collection(db, USERS_COLLECTION);
  const querySnapshot = await getDocs(usersRef);
  
  const users = querySnapshot.docs.map((doc) => convertToUserProfile(doc.id, doc.data()));
  
  // Sort by isActive (true first), then by updatedAt
  return users.sort((a, b) => {
    if (a.isActive === b.isActive) {
      return b.updatedAt.getTime() - a.updatedAt.getTime();
    }
    return a.isActive ? -1 : 1;
  });
}

// Update swipe count
export async function updateSwipeCount(userId: string, newCount: number): Promise<void> {
  const userRef = doc(db, USERS_COLLECTION, userId);
  await updateDoc(userRef, {
    swipeCount: newCount,
    updatedAt: Timestamp.now(),
  });
}

// Toggle active status
export async function toggleActiveStatus(userId: string, isActive: boolean): Promise<void> {
  const userRef = doc(db, USERS_COLLECTION, userId);
  await updateDoc(userRef, {
    isActive,
    updatedAt: Timestamp.now(),
  });
}

// Update dining hall
export async function updateDiningHall(userId: string, diningHall: string): Promise<void> {
  const userRef = doc(db, USERS_COLLECTION, userId);
  await updateDoc(userRef, {
    diningHall,
    updatedAt: Timestamp.now(),
  });
}
