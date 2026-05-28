import { HomeGoalRing } from "@/components/home-goal-ring";
import SessionsSection from "@/components/sessions";
import UpcomingSessionSection from "@/components/upcoming-session";
import { color } from "@/constants/colors";
import { getTodayHeaderLabel } from "@/src/lib/date";
import {
  getDailyGoalPercentage,
  getFirstNameFromDisplayName,
  getGreetingLabel,
} from "@/src/lib/home";
import { getFirebaseAuth } from "@/src/lib/firebase";
import { getTaskCompletionPercentage } from "@/src/lib/tasks";
import { useEffect, useState } from "react";
import { useGoalStore } from "@/src/store/useGoalStore";
import { useTaskStore } from "@/src/store/useTaskStore";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export function HomeScreen() {
  const dailyGoalPercentage = useGoalStore((state) =>
    getDailyGoalPercentage(state.goals),
  );
  const taskCompletionPercentage = useTaskStore((state) =>
    getTaskCompletionPercentage(state.tasks),
  );
  const [firstName, setFirstName] = useState("there");

  useEffect(() => {
    const auth = getFirebaseAuth();

    if (!auth) {
      return;
    }

    const unsubscribe = auth.onAuthStateChanged((user) => {
      setFirstName(
        getFirstNameFromDisplayName(user?.displayName, user?.email),
      );
    });

    return unsubscribe;
  }, []);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.date}>{getTodayHeaderLabel()}</Text>
      <Text style={styles.greeting}>
        {getGreetingLabel()}, {firstName} 👋
      </Text>

      <View style={styles.ratingContainer}>
        <View style={styles.metricsRow}>
          <View style={styles.rating}>
            <HomeGoalRing
              percentage={dailyGoalPercentage}
              strokeColor={color.rateBorderColor}
            />
            <Text style={styles.ratePercent}>{dailyGoalPercentage}%</Text>
            <Text style={styles.rateText}>Daily goal</Text>
          </View>

          <View style={styles.rating}>
            <HomeGoalRing
              percentage={taskCompletionPercentage}
              strokeColor={color.goalCardSuccessText}
            />
            <Text style={styles.ratePercent}>{taskCompletionPercentage}%</Text>
            <Text style={styles.rateText}>Task done</Text>
          </View>
        </View>
      </View>

      <SessionsSection />
      <UpcomingSessionSection />
    </ScrollView>
  );
}

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.bgColor,
  },
  content: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  ratingContainer: {
    minHeight: 238,
    width: "100%",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: color.borderColor,
    backgroundColor: color.ratingBgColor,
    shadowColor: color.rateBorderColor,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.15,
    shadowRadius: 32,
    elevation: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  metricsRow: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  ratePercent: {
    color: color.textColor,
    fontFamily: "DMSans_700Bold",
    fontSize: 36,
    lineHeight: 40,
    letterSpacing: -0.9,
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
    marginTop: 5,
  },
  rating: {
    flex: 1,
    height: 160,
    alignItems: "center",
    justifyContent: "center",
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
    color: color.textColor,
    fontSize: 24,
    lineHeight: 32,
    letterSpacing: -0.6,
    fontFamily: "DMSans_700Bold",
    marginBottom: 28,
  },
});
