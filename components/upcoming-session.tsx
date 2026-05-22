import { color } from "@/constants/colors";
import { StyleSheet, Text, View } from "react-native";
import UpcomingCard from "./upcoming-card";

export default function UpcomingSession() {
  return (
    <View>
      <Text style={styles.title}>Upcoming</Text>
      <UpcomingCard />
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    color: color.textColor,
    fontFamily: "DMSans_700Bold",
    fontSize: 16,
    lineHeight: 24,
    marginTop: 28,
    paddingBottom: 12,
  },
});
