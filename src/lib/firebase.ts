import { Platform } from "react-native";
import auth from "@react-native-firebase/auth";

type FirebaseAuthInstance = ReturnType<typeof auth>;

let cachedAuth: FirebaseAuthInstance | null = null;

export function getFirebaseAuth(): FirebaseAuthInstance | null {
  if (Platform.OS === "web") {
    return null;
  }

  if (!cachedAuth) {
    cachedAuth = auth();
  }

  return cachedAuth;
}
