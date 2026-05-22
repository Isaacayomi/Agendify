import { color } from "@/constants/colors";
import { StyleSheet, Text, View } from "react-native";

export interface TipsCardProps {
  topic: string;
  tip: string;
}

export function TipsCard({ topic, tip }: TipsCardProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.pillText}>{topic}</Text>

      <Text style={styles.tipHeading}>{tip}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 300,
    minHeight: 196,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: color.tipCardBorder,
    backgroundColor: color.tipCardBackground,
    paddingHorizontal: 25,
    paddingVertical: 27,
    marginRight: 16,
  },
  pillText: {
    alignSelf: "flex-start",
    minWidth: 68,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: color.tipCardPillBorder,
    backgroundColor: color.tipCardPillBackground,
    color: color.rateBorderColor,
    fontFamily: "Inter_500Medium",
    fontSize: 10,
    lineHeight: 15,
    letterSpacing: 1,
    textTransform: "uppercase",
    paddingHorizontal: 13,
    paddingVertical: 5,
    marginBottom: 19,
  },
  tipHeading: {
    color: color.textColor,
    fontFamily: "DMSans_700Bold",
    fontSize: 20,
    lineHeight: 28,
    letterSpacing: -0.4,
  },
});
