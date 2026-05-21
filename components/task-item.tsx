import { color } from "@/constants/colors";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface TaskItemProps {
  title: string;
  statusLabel: string;
  statusTone: "danger" | "success";
  initialChecked?: boolean;
}

export function TaskItem({
  title,
  statusLabel,
  statusTone,
  initialChecked = false,
}: TaskItemProps) {
  const [checked, setChecked] = useState(initialChecked);

  return (
    <View style={styles.row}>
      <Pressable
        accessibilityRole="checkbox"
        accessibilityState={{ checked }}
        onPress={() => setChecked((current) => !current)}
        style={styles.checkbox}
      >
        {checked ? <Text style={styles.checkmark}>✓</Text> : null}
      </Pressable>

      <View style={styles.taskPill}>
        <Text style={styles.taskText}>{title}</Text>
      </View>

      <View style={styles.metaWrap}>
        <View style={styles.todayPill}>
          <Text style={styles.todayText}>{statusLabel}</Text>
        </View>

        <View
          style={[
            styles.statusDot,
            statusTone === "success"
              ? styles.statusDotSuccess
              : styles.statusDotDanger,
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    width: "100%",
    paddingVertical: 19,
    paddingHorizontal: 17,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: color.taskCardBorder,
    backgroundColor: color.taskCardBackground,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: color.taskCheckboxBorder,
    backgroundColor: color.taskCheckboxBackground,
    alignItems: "center",
    justifyContent: "center",
  },
  checkmark: {
    color: color.textColor,
    fontSize: 14,
    lineHeight: 14,
    fontFamily: "Inter_500Medium",
  },
  taskPill: {
    flex: 1,
    minHeight: 24,
    justifyContent: "center",
    paddingHorizontal: 12,
  },
  taskText: {
    color: color.textColor,
    fontFamily: "DMSans_700Bold",
    fontSize: 14,
    lineHeight: 20,
  },
  metaWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  todayPill: {
    borderRadius: 33554400,
    backgroundColor: color.taskTodayPillBackground,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  todayText: {
    color: color.taskTodayPillText,
    fontFamily: "JetBrainsMono_400Regular",
    fontSize: 10,
    lineHeight: 15,
    textTransform: "uppercase",
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 33554400,
  },
  statusDotDanger: {
    backgroundColor: color.taskStatusDot,
    shadowColor: color.taskStatusDot,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 6,
  },
  statusDotSuccess: {
    backgroundColor: color.taskCompletedDot,
    shadowColor: color.taskCompletedDot,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 6,
  },
});
