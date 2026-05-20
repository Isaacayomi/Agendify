import Sessions from "@/components/sessions";
import UpcomingSession from "@/components/upcoming-session";
import { color } from "@/constants/colors";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export function HomeScreen() {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.date}>FRIDAY, MAY 15</Text>
      <Text style={styles.greeting}>Good morning, Prime 👋</Text>

      <View style={styles.ratingContainer}>
        <View style={styles.rating}>
          <Text style={styles.ratePercent}>64%</Text>
          <Text style={styles.rateText}>of daily goal</Text>
        </View>
      </View>

      <Sessions />
      <UpcomingSession />
    </ScrollView>
  );
}

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0C0D12",
  },

  content: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },

  ratingContainer: {
    height: 238,
    width: "100%",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: color.borderColor,
    backgroundColor: color.ratingBgColor,
    boxShadow: "0 0 32px 0 rgba(124, 110, 245, 0.15)",
  },

  ratePercent: {
    color: "white",
    fontFamily: "DMSans_700Bold",
    fontSize: 36,
    lineHeight: 40,
    letterSpacing: -0.9,
    paddingTop: 45.75,
    paddingBottom: 3,
    textAlign: "center",
  },

  rateText: {
    textAlign: "center",
    fontFamily: "Inter_400Regular",
    fontSize: 11,
    lineHeight: 16.5,
    letterSpacing: 1.1,
    textTransform: "uppercase",
    color: color.ratingText,
    paddingBottom: 45.75,
  },

  rating: {
    borderWidth: 12,
    borderColor: color.rateBorderColor,
    borderRadius: 100,
    width: 160,
    height: 160,
    margin: "auto",
  },

  date: {
    color: color.date,
    fontFamily: "Inter_500Medium",
    fontSize: 12,
    textTransform: "uppercase",
    lineHeight: 16,
    letterSpacing: 1.2,
    marginBottom: 4,
    marginTop: 48,
  },

  greeting: {
    color: "white",
    fontSize: 24,
    lineHeight: 32,
    letterSpacing: -0.6,
    fontFamily: "DMSans_700Bold",
    marginBottom: 28,
    // marginHorizontal: "auto",
  },
});
