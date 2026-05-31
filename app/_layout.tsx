import {
  DMSans_400Regular,
  DMSans_700Bold,
  useFonts,
} from "@expo-google-fonts/dm-sans";
import { Inter_400Regular, Inter_500Medium } from "@expo-google-fonts/inter";
import {
  JetBrainsMono_400Regular,
  JetBrainsMono_500Medium,
  JetBrainsMono_700Bold,
} from "@expo-google-fonts/jetbrains-mono";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { router, Stack, useSegments } from "expo-router";
import * as Notifications from "expo-notifications";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useRef, useState } from "react";
import { AppState, StyleSheet } from "react-native";
import "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

import { color } from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { getFirebaseAuth } from "@/src/lib/firebase";
import {
  initializeNotifications,
  enqueueNotificationResync,
  syncReminderSnapshot,
} from "@/src/lib/notifications";
import { useGoalStore } from "@/src/store/useGoalStore";
import { useSessionStore } from "@/src/store/useSessionStore";
import { useTaskStore } from "@/src/store/useTaskStore";

export const unstable_settings = {
  anchor: "(tabs)",
};

void SplashScreen.preventAutoHideAsync();

interface NotificationPayload {
  entity?: string;
  id?: string;
}

function isNotificationPayload(value: unknown): value is NotificationPayload {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const payload = value as Record<string, unknown>;
  const entity = payload.entity;
  const id = payload.id;

  return (
    (entity === undefined || typeof entity === "string") &&
    (id === undefined || typeof id === "string")
  );
}

function getNotificationTarget(response: Notifications.NotificationResponse): void {
  const data = response.notification.request.content.data;
  if (!isNotificationPayload(data)) {
    return;
  }

  const targetId = typeof data.id === "string" ? data.id : undefined;

  if (data.entity === "task") {
    router.push("/task");
    return;
  }

  if (data.entity === "session" && targetId) {
    router.push({
      pathname: "/session/[id]",
      params: { id: targetId },
    });
    return;
  }

  if (data.entity === "goal" && targetId) {
    router.push({
      pathname: "/goal/[id]",
      params: { id: targetId },
    });
  }
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const segments = useSegments();
  const auth = getFirebaseAuth();
  const handledNotificationIdRef = useRef<string | null>(null);
  const [authReady, setAuthReady] = useState(auth === null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [loaded] = useFonts({
    DMSans_400Regular,
    DMSans_700Bold,
    Inter_400Regular,
    Inter_500Medium,
    JetBrainsMono_400Regular,
    JetBrainsMono_500Medium,
    JetBrainsMono_700Bold,
  });

  useEffect(() => {
    void initializeNotifications();
  }, []);

  useEffect(() => {
    if (!loaded || !authReady) {
      return;
    }

    const resyncReminders = (): void => {
      enqueueNotificationResync(async () => {
        await syncReminderSnapshot({
          goals: useGoalStore.getState().goals,
          sessions: useSessionStore.getState().sessions,
          tasks: useTaskStore.getState().tasks,
        });
      });
    };

    resyncReminders();

    const subscription = AppState.addEventListener("change", (nextState) => {
      if (nextState === "active") {
        resyncReminders();
      }
    });

    return () => {
      subscription.remove();
    };
  }, [authReady, loaded]);

  useEffect(() => {
    if (!loaded) {
      return;
    }

    const handleNotification = (
      response: Notifications.NotificationResponse,
    ): void => {
      const notificationId = response.notification.request.identifier;

      if (handledNotificationIdRef.current === notificationId) {
        return;
      }

      handledNotificationIdRef.current = notificationId;
      getNotificationTarget(response);
    };

    const subscription = Notifications.addNotificationResponseReceivedListener(
      handleNotification,
    );

    void Notifications.getLastNotificationResponseAsync().then((response) => {
      if (!response) {
        return;
      }

      handleNotification(response);
    });

    return () => {
      subscription.remove();
    };
  }, [loaded]);

  useEffect(() => {
    if (!auth) {
      setAuthReady(true);
      return;
    }

    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsAuthenticated(Boolean(user));
      setAuthReady(true);
    });

    return unsubscribe;
  }, [auth]);

  useEffect(() => {
    if (!loaded || !authReady) {
      return;
    }

    void SplashScreen.hideAsync();
  }, [loaded, authReady]);

  useEffect(() => {
    if (!authReady) {
      return;
    }

    const firstSegment = segments[0];
    const isAuthRoute = firstSegment === "(auth)";
    const isPublicRoute =
      !firstSegment ||
      isAuthRoute ||
      firstSegment === "onboarding" ||
      firstSegment === "setup";
    const isProtectedRoute =
      firstSegment === "(tabs)" ||
      firstSegment === "session" ||
      firstSegment === "goal" ||
      firstSegment === "modal";

    if (isAuthenticated && isPublicRoute) {
      router.replace("/(tabs)");
      return;
    }

    if (!isAuthenticated && isProtectedRoute) {
      router.replace("/onboarding");
    }
  }, [authReady, isAuthenticated, segments]);

  if (!loaded || !authReady) return null;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack
          screenOptions={{
            contentStyle: styles.contentStyle,
          }}
        >
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="session/[id]" options={{ headerShown: false }} />
          <Stack.Screen name="goal/[id]" options={{ headerShown: false }} />
          <Stack.Screen
            name="modal/[entity]"
            options={{ headerShown: false, presentation: "modal" }}
          />
          <Stack.Screen
            name="modal"
            options={{ headerShown: false, presentation: "modal" }}
          />
        </Stack>
        <StatusBar style="light" />
      </ThemeProvider>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: color.bgColor,
  },
  contentStyle: {
    backgroundColor: color.bgColor,
  },
});
