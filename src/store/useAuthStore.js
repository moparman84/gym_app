import { create } from 'zustand';
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, getDoc, setDoc, addDoc, collection } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

const useAuthStore = create((set, get) => ({
  user: null,
  userProfile: null,
  loading: true,
  error: null,

  // Initialize auth listener
  initAuth: () => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Fetch user profile from Firestore
        const userProfile = await get().fetchUserProfile(user.uid);
        set({ user, userProfile, loading: false });
      } else {
        set({ user: null, userProfile: null, loading: false });
      }
    });
    return unsubscribe;
  },

  // Fetch user profile from Firestore
  fetchUserProfile: async (uid) => {
    try {
      const docRef = doc(db, 'users', uid);
      
      // Add timeout to prevent hanging
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Firestore timeout')), 5000)
      );
      
      const docSnap = await Promise.race([
        getDoc(docRef),
        timeoutPromise
      ]);
      
      if (docSnap.exists()) {
        return docSnap.data();
      }
      return null;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      // Return basic profile if Firestore fails
      return {
        uid,
        displayName: 'User',
        role: 'member'
      };
    }
  },

  // Track login activity
  trackLogin: async (userId) => {
    try {
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Firestore timeout')), 5000)
      );
      
      await Promise.race([
        addDoc(collection(db, 'loginHistory'), {
          userId,
          timestamp: new Date().toISOString(),
          type: 'login'
        }),
        timeoutPromise
      ]);
    } catch (error) {
      console.warn('Failed to track login:', error);
    }
  },

  // Sign in
  signIn: async (email, password) => {
    try {
      set({ loading: true, error: null });
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userProfile = await get().fetchUserProfile(userCredential.user.uid);
      
      // Track login
      get().trackLogin(userCredential.user.uid);
      
      set({ user: userCredential.user, userProfile, loading: false });
      return { success: true };
    } catch (error) {
      set({ error: error.message, loading: false });
      return { success: false, error: error.message };
    }
  },

  // Sign up
  signUp: async (email, password, displayName, role = 'member') => {
    try {
      set({ loading: true, error: null });
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Create user profile in Firestore
      const userProfile = {
        uid: userCredential.user.uid,
        email,
        displayName,
        role,
        createdAt: new Date().toISOString()
      };
      
      // Try to save to Firestore with timeout
      try {
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Firestore timeout')), 5000)
        );
        
        await Promise.race([
          setDoc(doc(db, 'users', userCredential.user.uid), userProfile),
          timeoutPromise
        ]);
      } catch (firestoreError) {
        console.warn('Firestore save failed, continuing with local profile:', firestoreError);
      }
      
      set({ user: userCredential.user, userProfile, loading: false });
      return { success: true };
    } catch (error) {
      set({ error: error.message, loading: false });
      return { success: false, error: error.message };
    }
  },

  // Sign out
  signOut: async () => {
    try {
      await firebaseSignOut(auth);
      set({ user: null, userProfile: null, loading: false });
    } catch (error) {
      set({ error: error.message });
    }
  },

  // Clear error
  clearError: () => set({ error: null })
}));

export default useAuthStore;
