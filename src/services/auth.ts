import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  getIdToken 
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import type { User } from '../types';
import { setTokens, clearTokens } from './api';

export interface AuthResponse {
  token: string;
  user: User;
}

export interface SignupPayload {
  name: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export const authService = {
  /**
   * Authenticate with email/password using Firebase.
   */
  async login(payload: LoginPayload): Promise<AuthResponse> {
    const email = payload.email.trim();
    const userCredential = await signInWithEmailAndPassword(auth, email, payload.password);
    const firebaseUser = userCredential.user;

    // Fetch user profile from Firestore
    const userDocRef = doc(db, 'users', firebaseUser.uid);
    const userDoc = await getDoc(userDocRef);

    let profile: any;

    if (!userDoc.exists()) {
      // Auto-create user profile in Firestore if missing
      const isNewAdmin = email.toLowerCase().includes('admin');
      profile = {
        id: firebaseUser.uid,
        name: email.split('@')[0],
        email: email,
        role: isNewAdmin ? 'ADMIN' : 'USER',
        balance: 1000.00,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        _count: { investments: 0, transactions: 0 }
      };
      await setDoc(userDocRef, profile);
    } else {
      profile = userDoc.data();
    }

    const token = await getIdToken(firebaseUser);
    sessionStorage.setItem('current_user_email', profile.email);
    setTokens(token, token);

    return {
      token,
      user: profile as unknown as User,
    };
  },

  /**
   * Register a new account.
   */
  async signup(payload: SignupPayload): Promise<AuthResponse> {
    const email = payload.email.trim();
    const userCredential = await createUserWithEmailAndPassword(auth, email, payload.password);
    const firebaseUser = userCredential.user;

    // Create user profile document in Firestore
    const isNewAdmin = email.toLowerCase().includes('admin');
    const profile = {
      id: firebaseUser.uid,
      name: payload.name,
      email: email,
      role: isNewAdmin ? 'ADMIN' : 'USER',
      balance: 1000.00,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      _count: { investments: 0, transactions: 0 }
    };

    await setDoc(doc(db, 'users', firebaseUser.uid), profile);

    const token = await getIdToken(firebaseUser);
    sessionStorage.setItem('current_user_email', profile.email);
    setTokens(token, token);

    return {
      token,
      user: profile as unknown as User,
    };
  },

  /**
   * Retrieve the currently authenticated user's profile.
   */
  async getCurrentUser(): Promise<User> {
    return new Promise((resolve, reject) => {
      const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
        unsubscribe();
        if (firebaseUser) {
          try {
            const userDocRef = doc(db, 'users', firebaseUser.uid);
            const userDoc = await getDoc(userDocRef);
            if (userDoc.exists()) {
              resolve(userDoc.data() as User);
            } else {
              reject(new Error('User profile does not exist in Firestore.'));
            }
          } catch (err) {
            reject(err);
          }
        } else {
          reject(new Error('No authenticated Firebase user found.'));
        }
      });
    });
  },

  /**
   * Clear tokens and log out of Firebase.
   */
  async logout(): Promise<void> {
    await signOut(auth);
    clearTokens();
    sessionStorage.removeItem('current_user_email');
    window.location.href = '/login';
  },
};
