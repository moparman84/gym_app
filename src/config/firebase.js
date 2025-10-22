import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Check if using test credentials
const isTestConfig = firebaseConfig.apiKey === 'test-key' || 
                     firebaseConfig.projectId === 'test-project';

if (isTestConfig) {
  console.warn(
    '⚠️ USING TEST FIREBASE CREDENTIALS!\n' +
    'Authentication will work but Firestore will timeout.\n' +
    'To fix: Create a real Firebase project and update .env file.\n' +
    'See INSTALLATION.md for instructions.'
  );
}

// Initialize Firebase
let app, auth, db, storage;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
} catch (error) {
  console.error('Firebase initialization error:', error);
  throw new Error('Failed to initialize Firebase. Check your .env configuration.');
}

export { auth, db, storage };
export default app;
