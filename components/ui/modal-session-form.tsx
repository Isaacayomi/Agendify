import { ModalFieldError, ModalFieldLabel } from "@/components/ui/modal-field";
import { ModalShell } from "@/components/ui/modal-shell";
import { ModalSubmitButton } from "@/components/ui/modal-submit-button";
import { color } from "@/constants/colors";
import { combineDateAndTime, getTodayDateString } from "@/src/lib/date";
import { useSessionStore } from "@/src/store/useSessionStore";
import {
  sessionFormSchema,
  type SessionFormValues,
} from "@/src/validation/session";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { ScrollView, StyleSheet, TextInput, View } from "react-native";

function createId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}`;
}

export function ModalSessionForm() {
  const addSession = useSessionStore((state) => state.addSession);
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SessionFormValues>({
    resolver: zodResolver(sessionFormSchema),
    defaultValues: {
      title: "",
      subject: "",
      date: getTodayDateString(),
      startTime: "09:00",
      endTime: "10:30",
    },
  });

  return (
    <ModalShell
      title="New session"
      subtitle="Plan a study block for your calendar."
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.form}
      >
        <ModalFieldLabel>Session title</ModalFieldLabel>
        <Controller
          control={control}
          name="title"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              placeholder="Study session"
              placeholderTextColor={color.date}
              style={styles.input}
            />
          )}
        />
        <ModalFieldError message={errors.title?.message} />

        <ModalFieldLabel>Subject</ModalFieldLabel>
        <Controller
          control={control}
          name="subject"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              placeholder="Subject or course"
              placeholderTextColor={color.date}
              style={styles.input}
            />
          )}
        />
        <ModalFieldError message={errors.subject?.message} />

        <View style={styles.inlineRow}>
          <View style={styles.flexHalf}>
            <ModalFieldLabel>Date</ModalFieldLabel>
            <Controller
              control={control}
              name="date"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor={color.date}
                  style={styles.input}
                />
              )}
            />
            <ModalFieldError message={errors.date?.message} />
          </View>

          <View style={styles.flexHalf}>
            <ModalFieldLabel>Start</ModalFieldLabel>
            <Controller
              control={control}
              name="startTime"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  placeholder="09:00"
                  placeholderTextColor={color.date}
                  style={styles.input}
                />
              )}
            />
            <ModalFieldError message={errors.startTime?.message} />
          </View>
        </View>

        <ModalFieldLabel>End time</ModalFieldLabel>
        <Controller
          control={control}
          name="endTime"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              placeholder="10:30"
              placeholderTextColor={color.date}
              style={styles.input}
            />
          )}
        />
        <ModalFieldError message={errors.endTime?.message} />

        <ModalSubmitButton
          label="Add session"
          disabled={isSubmitting}
          onPress={handleSubmit((values) => {
            addSession({
              id: createId("session"),
              title: values.title.trim(),
              subject: values.subject.trim(),
              startTime: combineDateAndTime(values.date, values.startTime),
              endTime: combineDateAndTime(values.date, values.endTime),
              completed: false,
              rescheduled: false,
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
  inlineRow: {
    flexDirection: "row",
    gap: 12,
  },
  flexHalf: {
    flex: 1,
    gap: 8,
  },
});
