import { AuthButton } from "@/components/ui/auth-button";
import { AuthField } from "@/components/ui/auth-field";
import { color } from "@/constants/colors";
import { authFormSchema, type AuthFormValues } from "@/src/validation/auth";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

export default function AuthSetupScreen() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthFormValues>({
    resolver: zodResolver(authFormSchema),
    defaultValues: {
      email: "",
    },
  });

  const handleEmailContinue = handleSubmit(() => {
    router.replace("/(tabs)");
  });

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>Join Agendify</Text>

      <Pressable
        accessibilityRole="button"
        onPress={() => router.replace("/(tabs)")}
        style={({ pressed }) => [
          styles.googleButton,
          pressed && styles.pressed,
        ]}
      >
        <MaterialCommunityIcons
          name="google"
          size={20}
          color={color.textColor}
        />
        <Text style={styles.googleButtonText}>Continue with Google</Text>
      </Pressable>

      <View style={styles.dividerRow}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>or</Text>
        <View style={styles.dividerLine} />
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

        <AuthButton label="Continue ->" onPress={handleEmailContinue} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.bgColor,
  },
  content: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 32,
    gap: 20,
  },
  title: {
    color: color.textColor,
    fontFamily: "DMSans_700Bold",
    fontSize: 30,
    lineHeight: 36,
    letterSpacing: -0.75,
    textAlign: "center",
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: color.borderColor,
    backgroundColor: color.calendarBackground,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  pressed: {
    opacity: 0.9,
  },
  googleButtonText: {
    color: color.textColor,
    fontFamily: "Inter_500Medium",
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: color.borderColor,
  },
  dividerText: {
    color: color.textColor,
    fontFamily: "Inter_500Medium",
    fontSize: 11,
    lineHeight: 14,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  form: {
    gap: 14,
  },
});
