import { color } from "@/constants/colors";
import type { ReactNode } from "react";
import { StyleSheet, Text } from "react-native";

interface ModalFieldLabelProps {
  children: ReactNode;
}

interface ModalFieldErrorProps {
  message?: string;
}

export function ModalFieldLabel({ children }: ModalFieldLabelProps) {
  return <Text style={styles.label}>{children}</Text>;
}

export function ModalFieldError({ message }: ModalFieldErrorProps) {
  if (!message) {
    return null;
  }

  return <Text style={styles.error}>{message}</Text>;
}

const styles = StyleSheet.create({
  label: {
    color: color.textColor,
    fontFamily: "Inter_500Medium",
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 1,
    textTransform: "uppercase",
    marginTop: 10,
  },
  error: {
    color: color.upcomingCardBorderPrimary,
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    lineHeight: 16,
  },
});
