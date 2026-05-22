import { TaskItem } from "@/components/task-item";
import { FloatingActionButton } from "@/components/ui/floating-action-button";
import { color } from "@/constants/colors";
import {
  getTaskStatusLabel,
  getTaskStatusTone,
  groupTasks,
} from "@/src/lib/tasks";
import { useTaskStore } from "@/src/store/useTaskStore";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { useMemo } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export function TaskScreen() {
  const tasks = useTaskStore((state) => state.tasks);
  const toggleTask = useTaskStore((state) => state.toggleTask);
  const groupedTasks = useMemo(() => groupTasks(tasks), [tasks]);

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.completed).length;

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerTextBlock}>
          <Text style={styles.heading}>Tasks</Text>
          <Text style={styles.subheading}>
            {totalTasks} tasks today. {completedTasks} already done.
          </Text>
        </View>

        {totalTasks > 0 ? (
          groupedTasks.map((group) => (
            <View key={group.id} style={styles.section}>
              <Text style={styles.sectionTitle}>{group.title}</Text>

              {group.tasks.length > 0 ? (
                group.tasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    title={task.title}
                    statusLabel={getTaskStatusLabel(task, group.id)}
                    statusTone={getTaskStatusTone(task)}
                    checked={task.completed}
                    onToggle={() => toggleTask(task.id)}
                  />
                ))
              ) : (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyStateText}>
                    No tasks in this section.
                  </Text>
                </View>
              )}
            </View>
          ))
        ) : (
          <View style={styles.pageEmptyState}>
            <View style={styles.emptyIconWrap}>
              <Feather name="check-square" size={18} color={color.seeAll} />
            </View>
            <Text style={styles.pageEmptyTitle}>No tasks yet</Text>
            <Text style={styles.pageEmptySubtitle}>
              Add your first task to get started.
            </Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.fabWrap}>
        <FloatingActionButton
          accessibilityLabel="Add task"
          onPress={() =>
            router.push({
              pathname: "/modal/[entity]",
              params: { entity: "task" },
            })
          }
        />
      </View>
    </View>
  );
}

export default TaskScreen;

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
  section: {
    gap: 12,
  },
  pageEmptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 28,
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
  pageEmptyTitle: {
    color: color.textColor,
    fontFamily: "DMSans_700Bold",
    fontSize: 14,
    lineHeight: 20,
  },
  pageEmptySubtitle: {
    color: color.date,
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    lineHeight: 16,
    textAlign: "center",
  },
  sectionTitle: {
    color: color.textColor,
    fontFamily: "Inter_500Medium",
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    marginTop: 26,
  },
  emptyState: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: color.borderColor,
    backgroundColor: color.ratingBgColor,
    paddingHorizontal: 17,
    paddingVertical: 19,
  },
  emptyStateText: {
    color: color.date,
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    lineHeight: 16,
  },
  fabWrap: {
    position: "absolute",
    right: 24,
    bottom: 24,
  },
});
