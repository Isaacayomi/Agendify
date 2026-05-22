import { color } from "@/constants/colors";
import { Feather } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

export interface RecommendedReadCardProps {
  category: string;
  title: string;
  summary: string;
  readTime: string;
}

export function RecommendedReadCard({
  category,
  title,
  summary,
  readTime,
}: RecommendedReadCardProps) {
  return (
    <Pressable accessibilityRole="button" style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.category}>{category}</Text>
        <Feather name="arrow-up-right" size={16} color={color.rateBorderColor} />
      </View>

      <Text style={styles.title}>{title}</Text>
      <Text style={styles.summary}>{summary}</Text>

      <View style={styles.footerRow}>
        <Text style={styles.readTime}>{readTime}</Text>
        <Text style={styles.cta}>Read now</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: 20,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: color.borderColor,
    backgroundColor: color.ratingBgColor,
    paddingVertical: 20,
    paddingHorizontal: 20,
    gap: 12,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  category: {
    color: color.rateBorderColor,
    fontFamily: "Inter_500Medium",
    fontSize: 10,
    lineHeight: 15,
    letterSpacing: 1,
    textTransform: "uppercase",
    backgroundColor: color.tipCardPillBackground,
    borderColor: color.tipCardPillBorder,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
    alignSelf: "flex-start",
  },
  title: {
    color: color.textColor,
    fontFamily: "DMSans_700Bold",
    fontSize: 20,
    lineHeight: 26,
    letterSpacing: -0.4,
  },
  summary: {
    color: color.date,
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    lineHeight: 20,
  },
  footerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 4,
  },
  readTime: {
    color: color.date,
    fontFamily: "JetBrainsMono_400Regular",
    fontSize: 11,
    lineHeight: 16,
  },
  cta: {
    color: color.rateBorderColor,
    fontFamily: "Inter_500Medium",
    fontSize: 12,
    lineHeight: 16,
  },
});
