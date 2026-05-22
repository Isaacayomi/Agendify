import { color } from "@/constants/colors";
import { formatTimeRange } from "@/src/lib/date";
import { useSessionStore } from "@/src/store/useSessionStore";
import { Feather } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function SessionDetailScreen() {
  const params = useLocalSearchParams<{ id?: string | string[] }>();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const session = useSessionStore((state) =>
    state.sessions.find((item) => item.id === id),
  );
  const toggleSessionCompletion = useSessionStore(
    (state) => state.toggleSessionCompletion,
  );

  if (!session) {
    return (
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>Session not found</Text>
          <Text style={styles.subtitle}>
            That session may have been removed or moved.
          </Text>
          <Pressable style={styles.button} onPress={() => router.back()}>
            <Text style={styles.buttonText}>Go back</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  const isCompleted = session.completed;

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.headerRow}>
          <View style={styles.headerCopy}>
            <Text style={styles.kicker}>Session</Text>
            <Text style={styles.title}>{session.title}</Text>
            <Text style={styles.subtitle}>{session.subject}</Text>
          </View>

          <Pressable accessibilityRole="button" onPress={() => router.back()}>
            <Feather name="x" size={20} color={color.textColor} />
          </Pressable>
        </View>

        <View style={styles.infoBlock}>
          <Text style={styles.infoLabel}>Time</Text>
          <Text style={styles.infoValue}>
            {formatTimeRange(session.startTime, session.endTime)}
          </Text>
        </View>

        <View style={styles.infoBlock}>
          <Text style={styles.infoLabel}>Status</Text>
          <Text style={styles.infoValue}>
            {isCompleted ? "Completed" : "In progress"}
          </Text>
        </View>

        <Pressable
          style={styles.button}
          onPress={() => toggleSessionCompletion(session.id)}
        >
          <Text style={styles.buttonText}>
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
  infoBlock: {
    gap: 4,
  },
  infoLabel: {
    color: color.date,
    fontFamily: "Inter_500Medium",
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  infoValue: {
    color: color.textColor,
    fontFamily: "Inter_500Medium",
    fontSize: 14,
    lineHeight: 20,
  },
  button: {
    alignSelf: "flex-start",
    borderRadius: 999,
    backgroundColor: color.rateBorderColor,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  buttonText: {
    color: color.textColor,
    fontFamily: "Inter_500Medium",
    fontSize: 14,
    lineHeight: 20,
  },
});
