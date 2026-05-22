import { color } from "@/constants/colors";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import type { ReactNode } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface ModalShellProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

export function ModalShell({ title, subtitle, children }: ModalShellProps) {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.headerRow}>
          <View style={styles.headerTextBlock}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subtitle}>{subtitle}</Text>
          </View>

          <Pressable accessibilityRole="button" onPress={() => router.back()}>
            <Feather name="x" size={20} color={color.textColor} />
          </Pressable>
        </View>

        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: color.bgColor,
    justifyContent: "center",
  },
  card: {
    width: "100%",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: color.borderColor,
    backgroundColor: color.ratingBgColor,
    padding: 24,
    flexGrow: 0,
    maxHeight: "100%",
    gap: 16,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 16,
  },
  headerTextBlock: {
    flex: 1,
    gap: 6,
  },
  title: {
    color: color.textColor,
    fontFamily: "DMSans_700Bold",
    fontSize: 24,
    lineHeight: 32,
    letterSpacing: -0.6,
  },
  subtitle: {
    color: color.date,
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    lineHeight: 20,
  },
});
