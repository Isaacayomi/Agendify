import { ModalFieldError, ModalFieldLabel } from "@/components/ui/modal-field";
import { ModalOptionPill } from "@/components/ui/modal-option-pill";
import { ModalShell } from "@/components/ui/modal-shell";
import { ModalSubmitButton } from "@/components/ui/modal-submit-button";
import { color } from "@/constants/colors";
import {
  combineDateAndTime,
  getNowIso,
  getTomorrowDateString,
} from "@/src/lib/date";
import { useGoalStore } from "@/src/store/useGoalStore";
import { goalFormSchema, type GoalFormValues } from "@/src/validation/goal";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { Controller, useForm, type Resolver } from "react-hook-form";
import { ScrollView, StyleSheet, TextInput, View } from "react-native";

function createId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}`;
}

export function ModalGoalForm() {
  const addGoal = useGoalStore((state) => state.addGoal);
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<GoalFormValues>({
    resolver: zodResolver(goalFormSchema) as Resolver<GoalFormValues>,
    defaultValues: {
      title: "",
      category: "study",
      type: "daily",
      targetHours: 5,
      completedHours: 0,
    },
  });

  return (
    <ModalShell title="New goal" subtitle="Track a new target for the week.">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.form}
      >
        <ModalFieldLabel>Goal title</ModalFieldLabel>
        <Controller
          control={control}
          name="title"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              placeholder="Weekly study goal"
              placeholderTextColor={color.date}
              style={styles.input}
            />
          )}
        />
        <ModalFieldError message={errors.title?.message} />

        <ModalFieldLabel>Category</ModalFieldLabel>
        <Controller
          control={control}
          name="category"
          render={({ field: { onChange, value } }) => (
            <View style={styles.optionsRowWrap}>
              {(["study", "reading", "exercise", "personal"] as const).map(
                (category) => (
                  <ModalOptionPill
                    key={category}
                    value={category}
                    selectedValue={value}
                    onSelect={onChange}
                  />
                ),
              )}
            </View>
          )}
        />

        <ModalFieldLabel>Type</ModalFieldLabel>
        <Controller
          control={control}
          name="type"
          render={({ field: { onChange, value } }) => (
            <View style={styles.optionsRow}>
              {(["daily", "weekly", "monthly"] as const).map((type) => (
                <ModalOptionPill
                  key={type}
                  value={type}
                  selectedValue={value}
                  onSelect={onChange}
                />
              ))}
            </View>
          )}
        />

        <View style={styles.inlineRow}>
          <View style={styles.flexHalf}>
            <ModalFieldLabel>Target hrs</ModalFieldLabel>
            <Controller
              control={control}
              name="targetHours"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  value={String(value)}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  keyboardType="numeric"
                  placeholder="5"
                  placeholderTextColor={color.date}
                  style={styles.input}
                />
              )}
            />
          </View>

          <View style={styles.flexHalf}>
            <ModalFieldLabel>Completed hrs</ModalFieldLabel>
            <Controller
              control={control}
              name="completedHours"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  value={String(value)}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  keyboardType="numeric"
                  placeholder="0"
                  placeholderTextColor={color.date}
                  style={styles.input}
                />
              )}
            />
          </View>
        </View>

        <ModalSubmitButton
          label="Add goal"
          disabled={isSubmitting}
          onPress={handleSubmit((values) => {
        addGoal({
            id: createId("goal"),
            title: values.title.trim(),
            category: values.category,
            type: values.type,
            targetHours: values.targetHours,
            completedHours: values.completedHours,
            completed: values.completedHours >= values.targetHours,
            createdAt: getNowIso(),
            deadline: combineDateAndTime(getTomorrowDateString(), "23:59"),
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
  optionsRowWrap: {
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
