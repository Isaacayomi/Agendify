import { AuthButton } from "@/components/ui/auth-button";
import { color } from "@/constants/colors";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

const highlights = [
  {
    icon: "target" as const,
    title: "Goals",
    description: "Keep your study targets in one place.",
  },
  {
    icon: "check-square" as const,
    title: "Tasks",
    description: "See what needs doing and what is done.",
  },
  {
    icon: "clock" as const,
    title: "Sessions",
    description: "Know what is next without the noise.",
  },
];

export default function OnboardingScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.hero}>
        <Text style={styles.title}>Stay on top of your study day.</Text>
        <Text style={styles.subtitle}>
          A clean place to track goals, tasks, and sessions.
        </Text>
      </View>

      <View style={styles.cards}>
        {highlights.map((item) => (
          <View key={item.title} style={styles.cardRow}>
            <View style={styles.cardIcon}>
              <Feather name={item.icon} size={18} color={color.textColor} />
            </View>
            <View style={styles.cardText}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardDescription}>{item.description}</Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.actions}>
        <AuthButton
          label="Get started ->"
          size="large"
          onPress={() => router.replace("/setup")}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.bgColor,
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 32,
    justifyContent: "center",
    gap: 4,
  },
  hero: {
    alignItems: "center",
    gap: 6,
  },
  title: {
    color: color.textColor,
    fontFamily: "DMSans_700Bold",
    fontSize: 32,
    lineHeight: 38,
    letterSpacing: -0.8,
    textAlign: "center",
  },
  subtitle: {
    color: color.ratingText,
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    lineHeight: 22,
    textAlign: "center",
    maxWidth: 280,
    marginBottom: 8,
  },
  cards: {
    gap: 12,
  },
  cardRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: color.borderColor,
    backgroundColor: color.ratingBgColor,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  cardIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: color.rateBorderColor,
    alignItems: "center",
    justifyContent: "center",
  },
  cardText: {
    flex: 1,
    gap: 4,
  },
  cardTitle: {
    color: color.textColor,
    fontFamily: "DMSans_700Bold",
    fontSize: 14,
    lineHeight: 20,
  },
  cardDescription: {
    color: color.ratingText,
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    lineHeight: 18,
  },
  actions: {
    gap: 12,
    marginTop: 12,
  },
});
