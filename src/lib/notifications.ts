import * as Notifications from "expo-notifications";
import { isAfter, parseISO, subMinutes } from "date-fns";
import { Platform } from "react-native";

import type { Goal } from "@/src/types/goal";
import type { Session } from "@/src/types/session";
import type { Task } from "@/src/types/task";

const CHANNEL_ID = "agendify-reminders";
const REMINDER_OFFSETS_MINUTES = [60, 30, 10, 3] as const;
type ReminderEntity = "goal" | "session" | "task";
export interface ReminderSnapshot {
  goals: Goal[];
  sessions: Session[];
  tasks: Task[];
}
const pendingResyncCallbacks: (() => Promise<void> | void)[] = [];
let notificationsReady = false;

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

async function ensureAndroidChannel(): Promise<void> {
  if (Platform.OS !== "android") {
    return;
  }

  await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
    name: "Agendify reminders",
    importance: Notifications.AndroidImportance.HIGH,
    vibrationPattern: [0, 250, 250, 250],
    lightColor: "#F4A437",
  });
}

function flushPendingResyncCallbacks(): void {
  const callbacks = pendingResyncCallbacks.splice(0, pendingResyncCallbacks.length);

  callbacks.forEach((callback) => {
    void Promise.resolve(callback()).catch(() => {
      // Ignore reminder sync failures during startup.
    });
  });
}

export async function initializeNotifications(): Promise<boolean> {
  await ensureAndroidChannel();

  const permissions = await Notifications.getPermissionsAsync();
  if ((permissions as { granted?: boolean }).granted) {
    notificationsReady = true;
    flushPendingResyncCallbacks();
    return true;
  }

  const result = await Notifications.requestPermissionsAsync();
  const granted = Boolean((result as { granted?: boolean }).granted);
  notificationsReady = granted;

  if (granted) {
    flushPendingResyncCallbacks();
  }

  return granted;
}

export function enqueueNotificationResync(
  callback: () => Promise<void> | void,
): void {
  if (notificationsReady) {
    void Promise.resolve(callback()).catch(() => {
      // Ignore reminder sync failures during startup.
    });
    return;
  }

  pendingResyncCallbacks.push(callback);
}

async function runQuietly(promise: Promise<void>): Promise<void> {
  await promise.catch(() => {
    // Ignore reminder sync failures during startup or foreground refresh.
  });
}

function isFutureDate(date: Date): boolean {
  return isAfter(date, new Date());
}

function formatOffsetLabel(minutesBefore: number): string {
  if (minutesBefore === 60) {
    return "1 hour";
  }

  return `${minutesBefore} minutes`;
}

function buildNotificationOptions(
  id: string,
  entity: ReminderEntity,
  title: string,
  body: string,
  triggerDate: Date,
): Notifications.NotificationRequestInput | null {
  if (!isFutureDate(triggerDate)) {
    return null;
  }

  return {
    content: {
      title,
      body,
      data: { entity, id },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: triggerDate,
      ...(Platform.OS === "android" ? { channelId: CHANNEL_ID } : {}),
    },
  };
}

export async function cancelReminder(identifier: string): Promise<void> {
  await Notifications.cancelScheduledNotificationAsync(identifier).catch(() => {
    // The reminder may already be gone; ignore.
  });
}

async function scheduleReminder(
  identifier: string,
  entity: ReminderEntity,
  title: string,
  body: string,
  triggerDate: Date,
): Promise<void> {
  const request = buildNotificationOptions(
    identifier,
    entity,
    title,
    body,
    triggerDate,
  );
  if (!request) {
    return;
  }

  await Notifications.scheduleNotificationAsync({
    identifier,
    ...request,
  });
}

async function syncTimedReminders(
  baseIdentifier: string,
  entity: ReminderEntity,
  title: string,
  messageBuilder: (minutesBefore: number) => string,
  targetIso: string,
): Promise<void> {
  const targetDate = parseISO(targetIso);

  await Promise.all(
    REMINDER_OFFSETS_MINUTES.map(async (minutesBefore) => {
      const reminderIdentifier = `${baseIdentifier}-${minutesBefore}`;
      await cancelReminder(reminderIdentifier);

      const triggerDate = subMinutes(targetDate, minutesBefore);
      if (!isFutureDate(triggerDate)) {
        return;
      }

      await scheduleReminder(
        reminderIdentifier,
        entity,
        title,
        messageBuilder(minutesBefore),
        triggerDate,
      );
    }),
  );
}

async function cancelTimedReminders(baseIdentifier: string): Promise<void> {
  await Promise.all(
    REMINDER_OFFSETS_MINUTES.map((minutesBefore) =>
      cancelReminder(`${baseIdentifier}-${minutesBefore}`),
    ),
  );
}

export async function cancelSessionReminders(sessionId: string): Promise<void> {
  await cancelTimedReminders(`session-${sessionId}`);
}

export async function cancelTaskReminders(taskId: string): Promise<void> {
  await cancelTimedReminders(`task-${taskId}`);
}

export async function cancelGoalReminders(goalId: string): Promise<void> {
  await cancelTimedReminders(`goal-${goalId}`);
}

export async function syncSessionReminder(session: Session): Promise<void> {
  const baseIdentifier = `session-${session.id}`;

  if (session.completed) {
    await cancelTimedReminders(baseIdentifier);
    return;
  }

  await syncTimedReminders(
    baseIdentifier,
    "session",
    "Session reminder",
    (minutesBefore) =>
      `${session.title} starts in ${formatOffsetLabel(minutesBefore)}.`,
    session.startTime,
  );
}

export async function syncTaskReminder(task: Task): Promise<void> {
  const baseIdentifier = `task-${task.id}`;

  if (task.completed || !task.dueDate) {
    await cancelTimedReminders(baseIdentifier);
    return;
  }

  await syncTimedReminders(
    baseIdentifier,
    "task",
    "Task reminder",
    (minutesBefore) =>
      `${task.title} is due in ${formatOffsetLabel(minutesBefore)}.`,
    task.dueDate,
  );
}

export async function syncGoalReminder(goal: Goal): Promise<void> {
  const baseIdentifier = `goal-${goal.id}`;

  if (goal.completed) {
    await cancelTimedReminders(baseIdentifier);
    return;
  }

  await syncTimedReminders(
    baseIdentifier,
    "goal",
    "Goal reminder",
    (minutesBefore) =>
      `${goal.title} is due in ${formatOffsetLabel(minutesBefore)}.`,
    goal.deadline,
  );
}

export async function syncReminderSnapshot(
  snapshot: ReminderSnapshot,
): Promise<void> {
  await Promise.all([
    ...snapshot.goals.map((goal) => runQuietly(syncGoalReminder(goal))),
    ...snapshot.sessions.map((session) =>
      runQuietly(syncSessionReminder(session)),
    ),
    ...snapshot.tasks.map((task) => runQuietly(syncTaskReminder(task))),
  ]);
}
