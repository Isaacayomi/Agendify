import { isTodayIso } from "@/src/lib/date";
import type { Task } from "@/src/types/task";

export type TaskGroupKey = "today" | "upcoming" | "completed";

export interface TaskGroup {
  id: TaskGroupKey;
  title: string;
  tasks: Task[];
}

export function groupTasks(tasks: Task[]): TaskGroup[] {
  const completed = tasks.filter((task) => task.completed);
  const today = tasks.filter(
    (task) => !task.completed && task.dueDate && isTodayIso(task.dueDate),
  );
  const upcoming = tasks.filter(
    (task) => !task.completed && (!task.dueDate || !isTodayIso(task.dueDate)),
  );

  return [
    {
      id: "today",
      title: "Today",
      tasks: today,
    },
    {
      id: "upcoming",
      title: "Upcoming",
      tasks: upcoming,
    },
    {
      id: "completed",
      title: "Completed",
      tasks: completed,
    },
  ];
}

export function getTaskStatusTone(task: Task): "danger" | "upcoming" | "success" {
  if (task.completed) {
    return "success";
  }

  if (task.dueDate && isTodayIso(task.dueDate)) {
    return "danger";
  }

  return "upcoming";
}

export function getTaskStatusLabel(task: Task, groupId: TaskGroupKey): string {
  if (groupId === "completed") {
    return "Completed";
  }

  if (groupId === "today") {
    return "Today";
  }

  return task.dueDate && isTodayIso(task.dueDate) ? "Today" : "Upcoming";
}

export function getTaskCompletionPercentage(tasks: Task[]): number {
  if (tasks.length === 0) {
    return 0;
  }

  const completedTasks = tasks.filter((task) => task.completed).length;

  return Math.max(0, Math.min(100, Math.round((completedTasks / tasks.length) * 100)));
}
