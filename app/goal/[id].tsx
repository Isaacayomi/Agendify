import { color } from "@/constants/colors";
import { Feather } from "@expo/vector-icons";
import { toGoalCard } from "@/src/lib/goals";
import { useGoalStore } from "@/src/store/useGoalStore";
import { router, useLocalSearchParams } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

const QUICK_LOG_HOURS = [0.5, 1];

export default function GoalDetailScreen() {
  const params = useLocalSearchParams<{ id?: string | string[] }>();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const goal = useGoalStore((state) =>
    state.goals.find((item) => item.id === id),
  );
  const updateGoalProgress = useGoalStore((state) => state.updateGoalProgress);
  const setGoalCompleted = useGoalStore((state) => state.setGoalCompleted);

  if (!goal) {
    return (
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.kicker}>Goal</Text>
          <Text style={styles.title}>Goal not found</Text>
          <Text style={styles.subtitle}>
            That goal may have been removed or is no longer available.
          </Text>
          <Pressable style={styles.primaryButton} onPress={() => router.back()}>
            <Text style={styles.primaryButtonText}>Go back</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  const currentGoal = goal;
  const viewModel = toGoalCard(currentGoal);
  const progressPercent = Math.max(0, Math.min(viewModel.progress, 100));
  const progressHoursLeft = Math.max(
    currentGoal.targetHours - currentGoal.completedHours,
    0,
  );
  const isCompleted = currentGoal.completed || progressPercent >= 100;
  const accentColor =
    viewModel.tone === "primary"
      ? color.goalCardPrimaryText
      : viewModel.tone === "risk"
        ? color.goalCardRiskText
        : color.goalCardSuccessText;

  function logProgress(hours: number) {
    const nextCompletedHours = Math.min(
      currentGoal.completedHours + hours,
      currentGoal.targetHours,
    );
    updateGoalProgress(currentGoal.id, nextCompletedHours);
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.headerRow}>
          <View style={styles.headerCopy}>
            <Text style={styles.kicker}>Goal</Text>
            <Text style={styles.title}>{currentGoal.title}</Text>
            <Text style={styles.subtitle}>
              {currentGoal.type.charAt(0).toUpperCase() +
                currentGoal.type.slice(1)}{" "}
              focus
            </Text>
          </View>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Close goal details"
            hitSlop={10}
            onPress={() => router.back()}
            style={styles.closeButton}
          >
            <Feather name="x" size={20} color={color.textColor} />
          </Pressable>
        </View>

        <View style={styles.summary}>
          <View style={styles.summaryItem}>
            <Text style={styles.label}>Progress</Text>
            <Text style={styles.value}>{viewModel.value}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.label}>Status</Text>
            <Text style={styles.value}>{viewModel.status}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.label}>Left</Text>
            <Text style={styles.value}>{progressHoursLeft.toFixed(1)} hrs left</Text>
          </View>
        </View>

        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${progressPercent}%`,
                backgroundColor: accentColor,
              },
            ]}
          />
        </View>

        <View style={styles.actions}>
          {QUICK_LOG_HOURS.map((hours) => (
            <Pressable
              key={hours}
              accessibilityRole="button"
              onPress={() => logProgress(hours)}
              style={styles.secondaryButton}
            >
              <Text style={styles.secondaryButtonText}>+{hours}h</Text>
            </Pressable>
          ))}
        </View>

        <Pressable
          accessibilityRole="button"
          onPress={() =>
            isCompleted
              ? setGoalCompleted(currentGoal.id, false)
              : setGoalCompleted(currentGoal.id, true)
          }
          style={[styles.primaryButton, isCompleted && styles.completedButton]}
        >
          <Text style={styles.primaryButtonText}>
            {isCompleted ? "Mark incomplete" : "Mark complete"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.bgColor,
    padding: 20,
    justifyContent: "center",
  },
  card: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: color.borderColor,
    backgroundColor: color.ratingBgColor,
    padding: 24,
    gap: 20,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 16,
  },
  headerCopy: {
    flex: 1,
    gap: 6,
  },
  kicker: {
    color: color.rateBorderColor,
    fontFamily: "Inter_500Medium",
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 1,
    textTransform: "uppercase",
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
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: color.borderColor,
    backgroundColor: color.calendarBackground,
    alignItems: "center",
    justifyContent: "center",
  },
  summary: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  summaryItem: {
    flexGrow: 1,
    flexBasis: "30%",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: color.borderColor,
    backgroundColor: color.calendarBackground,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 4,
  },
  label: {
    color: color.date,
    fontFamily: "Inter_500Medium",
    fontSize: 11,
    lineHeight: 14,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  value: {
    color: color.textColor,
    fontFamily: "Inter_500Medium",
    fontSize: 14,
    lineHeight: 20,
  },
  progressTrack: {
    height: 12,
    borderRadius: 999,
    backgroundColor: color.goalCardTrackBackground,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 999,
  },
  actions: {
    flexDirection: "row",
    gap: 10,
  },
  secondaryButton: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: color.borderColor,
    backgroundColor: color.calendarBackground,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  secondaryButtonText: {
    color: color.textColor,
    fontFamily: "Inter_500Medium",
    fontSize: 12,
    lineHeight: 16,
  },
  primaryButton: {
    alignSelf: "flex-start",
    borderRadius: 999,
    backgroundColor: color.rateBorderColor,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  completedButton: {
    backgroundColor: color.goalCardSuccessText,
  },
  primaryButtonText: {
    color: color.textColor,
    fontFamily: "Inter_500Medium",
    fontSize: 14,
    lineHeight: 20,
  },
});
