import { AuthButton } from "@/components/ui/auth-button";
import { AuthField } from "@/components/ui/auth-field";
import { getFirebaseAuth } from "@/src/lib/firebase";
import { authFormSchema, type AuthFormValues } from "@/src/validation/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

type AuthMode = "signIn" | "signUp";

function getFirebaseAuthErrorMessage(error: unknown): string {
  if (typeof error !== "object" || error === null) {
    return "Something went wrong. Please try again.";
  }

  const authError = error as { code?: unknown };
  const code = typeof authError.code === "string" ? authError.code : "";

  switch (code) {
    case "auth/invalid-email":
      return "Enter a valid email address.";
    case "auth/missing-password":
      return "Enter your password.";
    case "auth/weak-password":
      return "Use a stronger password.";
    case "auth/email-already-in-use":
      return "That email is already registered.";
    case "auth/user-not-found":
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return "Incorrect email or password.";
    case "auth/operation-not-allowed":
      return "Email/password sign in is not enabled in Firebase.";
    case "auth/network-request-failed":
      return "Check your connection and try again.";
    default:
      return "Could not complete sign in. Please try again.";
  }
}

export function AuthScreen() {
  const [mode, setMode] = useState<AuthMode>("signIn");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthFormValues>({
    resolver: zodResolver(authFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleAuth = handleSubmit(async ({ email, password }) => {
    const auth = getFirebaseAuth();
    if (!auth) {
      setSubmitError("Firebase auth is only available on native builds.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const normalizedEmail = email.trim();

      if (mode === "signIn") {
        await auth.signInWithEmailAndPassword(normalizedEmail, password);
      } else {
        await auth.createUserWithEmailAndPassword(normalizedEmail, password);
      }

      router.replace("/(tabs)");
    } catch (error: unknown) {
      setSubmitError(getFirebaseAuthErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  });

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.hero}>
        <Text style={styles.kicker}>
          {mode === "signIn" ? "Welcome back" : "Create your account"}
        </Text>
        <Text style={styles.title}>
          {mode === "signIn"
            ? "Sign in to keep your study plan in sync."
            : "Set up Agendify and start tracking your day."}
        </Text>
        <Text style={styles.subtitle}>
          Your goals, tasks, and sessions stay connected once you sign in with
          Firebase.
        </Text>
      </View>

      <View style={styles.form}>
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <AuthField
              label="Email"
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              placeholder="name@example.com"
              keyboardType="email-address"
              errorMessage={errors.email?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <AuthField
              label="Password"
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              placeholder="At least 6 characters"
              secureTextEntry
              errorMessage={errors.password?.message}
            />
          )}
        />

        {submitError ? <Text style={styles.submitError}>{submitError}</Text> : null}

        <AuthButton
          label={
            isSubmitting
              ? "Please wait..."
              : mode === "signIn"
                ? "Sign in ->"
                : "Create account ->"
          }
          size="large"
          onPress={handleAuth}
          disabled={isSubmitting}
        />

        <Pressable
          accessibilityRole="button"
          onPress={() => setMode((currentMode) => (currentMode === "signIn" ? "signUp" : "signIn"))}
          style={styles.modeToggle}
        >
          <Text style={styles.modeToggleText}>
            {mode === "signIn"
              ? "Need an account? Create one"
              : "Already have an account? Sign in"}
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0C0D12",
  },
  content: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 32,
    gap: 24,
  },
  hero: {
    gap: 10,
  },
  kicker: {
    color: "#877AF7",
    fontFamily: "Inter_500Medium",
    fontSize: 12,
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
  title: {
    color: "#F1F1F5",
    fontFamily: "DMSans_700Bold",
    fontSize: 30,
    lineHeight: 36,
    letterSpacing: -0.75,
  },
  subtitle: {
    color: "#8C8E9F",
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    lineHeight: 22,
  },
  form: {
    gap: 14,
  },
  submitError: {
    color: "#F94144",
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    lineHeight: 18,
  },
  modeToggle: {
    alignSelf: "center",
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  modeToggleText: {
    color: "#8C8E9F",
    fontFamily: "Inter_500Medium",
    fontSize: 13,
    lineHeight: 18,
  },
});
