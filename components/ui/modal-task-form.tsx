import { ModalFieldError, ModalFieldLabel } from "@/components/ui/modal-field";
import { ModalOptionPill } from "@/components/ui/modal-option-pill";
import { ModalShell } from "@/components/ui/modal-shell";
import { ModalSubmitButton } from "@/components/ui/modal-submit-button";
import { color } from "@/constants/colors";
import { combineDateAndTime, getNowIso, getTodayDateString } from "@/src/lib/date";
import { useTaskStore } from "@/src/store/useTaskStore";
import { taskFormSchema, type TaskFormValues } from "@/src/validation/task";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { ScrollView, StyleSheet, TextInput, View } from "react-native";

function createId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}`;
}

export function ModalTaskForm() {
  const addTask = useTaskStore((state) => state.addTask);
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: "",
      priority: "medium",
      dueDate: getTodayDateString(),
      dueTime: "18:00",
    },
  });

  return (
    <ModalShell title="New task" subtitle="Add a focused task to your day.">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.form}
      >
        <ModalFieldLabel>Task title</ModalFieldLabel>
        <Controller
          control={control}
          name="title"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              placeholder="Revise lecture notes"
              placeholderTextColor={color.date}
              style={styles.input}
            />
          )}
        />
        <ModalFieldError message={errors.title?.message} />

        <ModalFieldLabel>Priority</ModalFieldLabel>
        <Controller
          control={control}
          name="priority"
          render={({ field: { onChange, value } }) => (
            <View style={styles.optionsRow}>
              {(["low", "medium", "high"] as const).map((priority) => (
                <ModalOptionPill
                  key={priority}
                  value={priority}
                  selectedValue={value}
                  onSelect={onChange}
                />
              ))}
            </View>
          )}
        />

        <View style={styles.inlineRow}>
          <View style={styles.flexHalf}>
            <ModalFieldLabel>Due date</ModalFieldLabel>
            <Controller
              control={control}
              name="dueDate"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  value={value ?? ""}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor={color.date}
                  style={styles.input}
                />
              )}
            />
          </View>

          <View style={styles.flexHalf}>
            <ModalFieldLabel>Due time</ModalFieldLabel>
            <Controller
              control={control}
              name="dueTime"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  value={value ?? ""}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  placeholder="18:00"
                  placeholderTextColor={color.date}
                  style={styles.input}
                />
              )}
            />
          </View>
        </View>

        <ModalSubmitButton
          label="Add task"
          disabled={isSubmitting}
          onPress={handleSubmit((values) => {
            addTask({
              id: createId("task"),
              title: values.title.trim(),
              completed: false,
              priority: values.priority,
              dueDate:
                values.dueDate && values.dueTime
                  ? combineDateAndTime(values.dueDate, values.dueTime)
                  : undefined,
              createdAt: getNowIso(),
            });
            router.back();
          })}
        />
      </ScrollView>
    </ModalShell>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: 10,
    paddingBottom: 8,
  },
  input: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: color.borderColor,
    backgroundColor: color.calendarBackground,
    color: color.textColor,
    fontFamily: "Inter_500Medium",
    fontSize: 14,
    lineHeight: 20,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  optionsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  inlineRow: {
    flexDirection: "row",
    gap: 12,
  },
  flexHalf: {
    flex: 1,
    gap: 8,
  },
});
