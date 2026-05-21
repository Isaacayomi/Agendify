import { TaskItem } from "@/components/task-item";
import { color } from "@/constants/colors";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export function TaskScreen() {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View>
        <Text style={styles.heading}>Tasks</Text>
        <Text style={styles.subheading}>3 for today. 1 done</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Today</Text>
        <TaskItem
          title="Finish chapter 4 notes"
          statusLabel="Today"
          statusTone="danger"
          initialChecked={false}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Upcoming</Text>
        <TaskItem
          title="Review anatomy slides"
          statusLabel="Upcoming"
          statusTone="danger"
          initialChecked={false}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Completed</Text>
        <TaskItem
          title="Submit biochem quiz"
          statusLabel="Completed"
          statusTone="success"
          initialChecked
        />
      </View>
    </ScrollView>
  );
}

export default TaskScreen;

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

  section: {
    gap: 12,
  },

  sectionTitle: {
    color: color.textColor,
    fontFamily: "Inter600SemiBold",
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    marginTop: 26,
  },
});
