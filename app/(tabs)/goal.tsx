import { GoalsCard } from "@/components/goals-card";
import { FloatingActionButton } from "@/components/ui/floating-action-button";
import { color } from "@/constants/colors";
import { toGoalCard } from "@/src/lib/goals";
import { useGoalStore } from "@/src/store/useGoalStore";
import type { GoalType } from "@/src/types/goal";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

const goalTabs: GoalType[] = ["daily", "weekly", "monthly"];

export function GoalScreen() {
  const goals = useGoalStore((state) => state.goals);
  const setGoalCompleted = useGoalStore((state) => state.setGoalCompleted);
  const [selectedPeriod, setSelectedPeriod] = useState<GoalType>("weekly");

  const goalCards = useMemo(
    () =>
      goals
        .filter((goal) => goal.type === selectedPeriod)
        .map((goal) => toGoalCard(goal)),
    [goals, selectedPeriod],
  );

  const selectedLabel =
    selectedPeriod.charAt(0).toUpperCase() + selectedPeriod.slice(1);

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerTextBlock}>
          <Text style={styles.heading}>Your goals</Text>
          <Text style={styles.subheading}>
            {selectedLabel} focus, steady progress.
          </Text>
        </View>

        <View style={styles.headingContainer}>
          {goalTabs.map((period) => {
            const isActive = period === selectedPeriod;
            return (
              <Pressable key={period} onPress={() => setSelectedPeriod(period)}>
                <Text style={isActive ? styles.active : styles.text}>
                  {period.charAt(0).toUpperCase() + period.slice(1)}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.cards}>
          {goalCards.length > 0 ? (
            goalCards.map((card) => (
              <GoalsCard
                key={card.id}
                {...card}
                onPress={() =>
                  router.push({
                    pathname: "/goal/[id]",
                    params: { id: card.id },
                  })
                }
                onMarkComplete={
                  card.completed
                    ? undefined
                    : () => setGoalCompleted(card.id, true)
                }
              />
            ))
          ) : (
            <View style={styles.emptyState}>
              <View style={styles.emptyIconWrap}>
                <Feather name="target" size={18} color={color.seeAll} />
              </View>
              <Text style={styles.emptyTitle}>No goals yet</Text>
              <Text style={styles.emptySubtitle}>
                Add your first goal to start tracking progress.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      <View style={styles.fabWrap}>
        <FloatingActionButton
          accessibilityLabel="Add goal"
          onPress={() =>
            router.push({
              pathname: "/modal/[entity]",
              params: { entity: "goal" },
            })
          }
        />
      </View>
    </View>
  );
}

export default GoalScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.bgColor,
    position: "relative",
  },
  content: {
    paddingHorizontal: 24,
    paddingBottom: 100,
    marginTop: 48,
  },
  heading: {
    color: color.textColor,
    fontSize: 24,
    lineHeight: 32,
    letterSpacing: -0.6,
    fontFamily: "DMSans_700Bold",
    marginBottom: 4,
  },
  headerTextBlock: {
    flex: 1,
  },
  subheading: {
    fontFamily: "Inter_400Regular",
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
    color: color.textColor,
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
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 24,
    gap: 6,
  },
  emptyIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: color.borderColor,
    backgroundColor: color.calendarBackground,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyTitle: {
    color: color.textColor,
    fontFamily: "DMSans_700Bold",
    fontSize: 14,
    lineHeight: 20,
  },
  emptySubtitle: {
    color: color.date,
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    lineHeight: 16,
    textAlign: "center",
  },
  fabWrap: {
    position: "absolute",
    right: 24,
    bottom: 24,
  },
});
