import { color } from "@/constants/colors";
import { Pressable, StyleSheet, Text, View } from "react-native";

export type AuthButtonVariant = "primary" | "secondary";

export interface AuthButtonProps {
  label: string;
  subtitle?: string;
  variant?: AuthButtonVariant;
  size?: "normal" | "large";
  onPress: () => void;
}

export function AuthButton({
  label,
  subtitle,
  variant = "primary",
  size = "normal",
  onPress,
}: AuthButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        variant === "primary" ? styles.primaryButton : styles.secondaryButton,
        size === "large" && styles.largeButton,
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.textBlock}>
        <Text style={[styles.label, size === "large" && styles.largeLabel]}>
          {label}
        </Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  largeButton: {
    paddingVertical: 18,
  },
  primaryButton: {
    borderColor: color.rateBorderColor,
    backgroundColor: color.rateBorderColor,
  },
  secondaryButton: {
    borderColor: color.borderColor,
    backgroundColor: color.calendarBackground,
  },
  pressed: {
    opacity: 0.9,
  },
  textBlock: {
    gap: 2,
    alignItems: "center",
  },
  label: {
    color: color.textColor,
    fontFamily: "Inter_500Medium",
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
  },
  largeLabel: {
    fontSize: 18,
    lineHeight: 24,
  },
  subtitle: {
    color: color.date,
    fontFamily: "Inter_400Regular",
    fontSize: 11,
    lineHeight: 14,
    textAlign: "center",
  },
});
