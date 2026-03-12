import { initializeApp, getApps, getApp, type FirebaseApp, type FirebaseOptions } from "firebase/app";
import { getAnalytics, isSupported, Analytics } from "firebase/analytics";

const firebaseConfig: FirebaseOptions | null =
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID &&
  process.env.NEXT_PUBLIC_FIREBASE_APP_ID
    ? {
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
        ...(process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
          ? { authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN }
          : {}),
        ...(process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
          ? { storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET }
          : {}),
        ...(process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
          ? { messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID }
          : {}),
        ...(process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
          ? { measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID }
          : {}),
      }
    : null;

const app: FirebaseApp | null =
  firebaseConfig &&
  (getApps().length === 0 ? initializeApp(firebaseConfig) : getApp());

let analyticsInstance: Analytics | null = null;

export const getFirebaseAnalytics = async (): Promise<Analytics | null> => {
  if (typeof window === 'undefined' || !app) return null;
  if (analyticsInstance) return analyticsInstance;
  const supported = await isSupported();
  if (supported) {
    analyticsInstance = getAnalytics(app);
  }
  return analyticsInstance;
};

export default app;
