import { GoalsCard } from "@/components/goals-card";
import { color } from "@/constants/colors";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

const goalCards = [
  {
    id: "daily-study",
    label: "Daily study hours",
    value: "3.2 / 5 hrs",
    status: "On track",
    progress: 64,
    tone: "primary" as const,
  },
  {
    id: "reading",
    label: "Reading streak",
    value: "5 / 7 days",
    status: "At risk",
    progress: 45,
    tone: "risk" as const,
  },
  {
    id: "revision",
    label: "Revision target",
    value: "9 / 10 hrs",
    status: "Completed",
    progress: 92,
    tone: "success" as const,
  },
];

export function GoalScreen() {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.heading}>Your goals</Text>
      <Text style={styles.subheading}>Small steps. Steady streaks.</Text>

      <View style={styles.headingContainer}>
        <Pressable>
          <Text style={styles.text}>Daily</Text>
        </Pressable>
        <Pressable>
          <Text style={styles.active}>Weekly</Text>
        </Pressable>
        <Pressable>
          <Text style={styles.text}>Monthly</Text>
        </Pressable>
      </View>

      <View style={styles.cards}>
        {goalCards.map((card) => (
          <GoalsCard key={card.id} {...card} />
        ))}
      </View>
    </ScrollView>
  );
}

export default GoalScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.bgColor,
  },

  content: {
    paddingHorizontal: 24,
    paddingBottom: 100,
    marginTop: 48,
  },

  heading: {
    color: "white",
    fontSize: 24,
    lineHeight: 32,
    letterSpacing: -0.6,
    fontFamily: "DMSans_700Bold",
    marginBottom: 4,
  },

  subheading: {
    fontFamily: "Inter400Regular",
    fontSize: 14,
    lineHeight: 20,
    color: color.date,
    marginBottom: 20,
  },

  headingContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    borderRadius: 50,
    borderWidth: 1,
    borderColor: color.borderColor,
    backgroundColor: color.calendarBackground,
    paddingHorizontal: 46,
    paddingVertical: 12,
    marginBottom: 24,
  },

  text: {
    fontFamily: "Inter_500Medium",
    fontSize: 12,
    lineHeight: 16,
    color: color.date,
    textAlign: "center",
  },

  active: {
    color: "white",
    fontFamily: "Inter_500Medium",
    fontSize: 12,
    lineHeight: 16,
    textAlign: "center",
    backgroundColor: color.rateBorderColor,
    paddingVertical: 7,
    paddingHorizontal: 33,
    borderRadius: 20,
  },

  cards: {
    gap: 12,
  },
});
