import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import {
  cancelTaskReminders,
  syncTaskReminder,
} from "@/src/lib/notifications";
import { getSafeStorage } from "@/src/lib/storage";
import type { Task } from "@/src/types/task";

interface TaskState {
  tasks: Task[];
  addTask: (task: Task) => void;
  toggleTask: (id: string) => void;
  removeTask: (id: string) => void;
  resetTasks: () => void;
}

function createInitialTasks(): Task[] {
  return [];
}

export const useTaskStore = create<TaskState>()(
  persist(
    (set, get) => ({
      tasks: createInitialTasks(),
      addTask: (task) => {
        set((state) => ({
          tasks: [...state.tasks, task],
        }));
        void syncTaskReminder(task);
      },
      toggleTask: (id) => {
        const current = get().tasks.find((task) => task.id === id);
        if (!current) {
          return;
        }

        const nextTask: Task = {
          ...current,
          completed: !current.completed,
        };

        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? nextTask : task,
          ),
        }));
        void syncTaskReminder(nextTask);
      },
      removeTask: (id) => {
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
        }));
        void cancelTaskReminders(id);
      },
      resetTasks: () => {
        const currentTasks = get().tasks;
        set(() => ({
          tasks: createInitialTasks(),
        }));
        currentTasks.forEach((task) => {
          void cancelTaskReminders(task.id);
        });
      },
    }),
    {
      name: "task-storage",
      version: 2,
      storage: createJSONStorage(() => getSafeStorage()),
      migrate: () => ({
        tasks: [],
      }),
    },
  ),
);
