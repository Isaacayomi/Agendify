import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import {
  cancelGoalReminders,
  enqueueNotificationResync,
  syncGoalReminder,
} from "@/src/lib/notifications";
import { getSafeStorage } from "@/src/lib/storage";
import type { Goal } from "@/src/types/goal";

interface GoalState {
  goals: Goal[];
  addGoal: (goal: Goal) => void;
  updateGoalProgress: (id: string, completedHours: number) => void;
  setGoalCompleted: (id: string, completed: boolean) => void;
  resetGoals: () => void;
}

function createInitialGoals(): Goal[] {
  return [];
}

export const useGoalStore = create<GoalState>()(
  persist(
    (set, get) => ({
      goals: createInitialGoals(),
      addGoal: (goal) => {
        set((state) => ({
          goals: [...state.goals, goal],
        }));
        void syncGoalReminder(goal);
      },
      updateGoalProgress: (id, completedHours) => {
        const current = get().goals.find((goal) => goal.id === id);
        if (!current) {
          return;
        }

        const nextGoal: Goal = {
          ...current,
          completedHours,
          completed: completedHours >= current.targetHours,
        };

        set((state) => ({
          goals: state.goals.map((goal) => (goal.id === id ? nextGoal : goal)),
        }));
        void syncGoalReminder(nextGoal);
      },
      setGoalCompleted: (id, completed) => {
        const current = get().goals.find((goal) => goal.id === id);
        if (!current) {
          return;
        }

        const nextGoal: Goal = {
          ...current,
          completed,
          completedHours: completed
            ? current.targetHours
            : Math.min(current.completedHours, current.targetHours - 0.1),
        };

        set((state) => ({
          goals: state.goals.map((goal) => (goal.id === id ? nextGoal : goal)),
        }));
        void syncGoalReminder(nextGoal);
      },
      resetGoals: () => {
        const currentGoals = get().goals;
        set(() => ({
          goals: createInitialGoals(),
        }));
        currentGoals.forEach((goal) => {
          void cancelGoalReminders(goal.id);
        });
      },
    }),
    {
      name: "goal-storage",
      version: 2,
      storage: createJSONStorage(() => getSafeStorage()),
      migrate: () => ({
        goals: [],
      }),
      onRehydrateStorage: () => (state) => {
        enqueueNotificationResync(async () => {
          state?.goals.forEach((goal) => {
            void syncGoalReminder(goal);
          });
        });
      },
    },
  ),
);
