import type { User, Session } from '../types';
import { auth, db } from '../lib/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { updatePassword as firebaseUpdatePassword } from 'firebase/auth';

export interface UpdateProfilePayload {
  name?: string;
  email?: string;
  phone?: string;
  location?: string;
  currency?: User['currency'];
}

export interface UpdatePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export const userService = {
  /** Fetch the authenticated user's full profile from Firestore. */
  async getProfile(): Promise<User> {
    const firebaseUser = auth.currentUser;
    if (!firebaseUser) {
      throw new Error('No authenticated Firebase user found.');
    }

    const userDocRef = doc(db, 'users', firebaseUser.uid);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      throw new Error('User profile not found in Firestore.');
    }

    return userDoc.data() as User;
  },

  /** Update profile fields in Firestore. */
  async updateProfile(data: UpdateProfilePayload): Promise<User> {
    const firebaseUser = auth.currentUser;
    if (!firebaseUser) {
      throw new Error('No authenticated Firebase user found.');
    }

    const userDocRef = doc(db, 'users', firebaseUser.uid);
    const updateData = {
      ...data,
      updatedAt: new Date().toISOString()
    };

    await updateDoc(userDocRef, updateData);

    const updatedDoc = await getDoc(userDocRef);
    return updatedDoc.data() as User;
  },

  /** Change password using Firebase Auth. */
  async updatePassword(data: UpdatePasswordPayload): Promise<void> {
    const firebaseUser = auth.currentUser;
    if (!firebaseUser) {
      throw new Error('No authenticated Firebase user found.');
    }
    // Note: Firebase requires a recent login for password changes. If this fails, the error will bubble up.
    await firebaseUpdatePassword(firebaseUser, data.newPassword);
  },

  /** Fetch all active sessions (simulated client-side details). */
  async getSessions(): Promise<Session[]> {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const isChrome = navigator.userAgent.includes('Chrome');
    const isSafari = navigator.userAgent.includes('Safari') && !isChrome;
    const isFirefox = navigator.userAgent.includes('Firefox');
    
    const browserName = 
      isChrome ? 'Chrome' :
      isSafari ? 'Safari' :
      isFirefox ? 'Firefox' : 'Web Browser';
      
    const os = 
      navigator.userAgent.includes('Mac OS X') ? 'macOS' :
      navigator.userAgent.includes('Windows') ? 'Windows' :
      navigator.userAgent.includes('Linux') ? 'Linux' : 'OS';

    return [
      {
        id: 'current-session',
        device: `${os} (${browserName})`,
        type: isMobile ? 'mobile' : 'desktop',
        ip: '127.0.0.1',
        location: 'London, United Kingdom',
        current: true,
      }
    ];
  },

  /** Revoke a session by ID (simulated success). */
  async revokeSession(_id: string): Promise<void> {
    // Simulated success
  },
};
