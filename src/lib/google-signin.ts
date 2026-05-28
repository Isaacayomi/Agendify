import { GoogleSignin } from "@react-native-google-signin/google-signin";

import { getFirebaseAuth } from "@/src/lib/firebase";

const GOOGLE_WEB_CLIENT_ID =
  "830454734282-knepr4j8dd86t0ifk089c2apddp0ja70.apps.googleusercontent.com";

let isConfigured = false;

function ensureGoogleSignInConfigured(): void {
  if (isConfigured) {
    return;
  }

  GoogleSignin.configure({
    webClientId: GOOGLE_WEB_CLIENT_ID,
  });

  isConfigured = true;
}

export async function signInWithGoogle(): Promise<void> {
  const firebaseAuth = getFirebaseAuth();

  if (!firebaseAuth) {
    throw new Error("Firebase auth is only available on native builds.");
  }

  ensureGoogleSignInConfigured();

  await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

  const response = await GoogleSignin.signIn();
  if (response.type !== "success") {
    throw new Error("Google sign in was cancelled.");
  }

  const idToken = response.data.idToken;
  if (!idToken) {
    throw new Error("Google sign in did not return an ID token.");
  }

  const credential = firebaseAuth.GoogleAuthProvider.credential(idToken);
  await firebaseAuth.signInWithCredential(credential);
}
