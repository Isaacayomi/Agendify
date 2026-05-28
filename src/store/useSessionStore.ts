import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import {
  cancelSessionReminders,
  enqueueNotificationResync,
  syncSessionReminder,
} from "@/src/lib/notifications";
import { getSafeStorage } from "@/src/lib/storage";
import type { Session } from "@/src/types/session";

interface SessionState {
  sessions: Session[];
  addSession: (session: Session) => void;
  toggleSessionCompletion: (id: string) => void;
  rescheduleSession: (id: string, startTime: string, endTime: string) => void;
  resetSessions: () => void;
}

function createInitialSessions(): Session[] {
  return [];
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set, get) => ({
      sessions: createInitialSessions(),
      addSession: (session) => {
        set((state) => ({
          sessions: [...state.sessions, session],
        }));
        void syncSessionReminder(session);
      },
      toggleSessionCompletion: (id) => {
        const current = get().sessions.find((session) => session.id === id);
        if (!current) {
          return;
        }

        const nextSession: Session = {
          ...current,
          completed: !current.completed,
        };

        set((state) => ({
          sessions: state.sessions.map((session) =>
            session.id === id ? nextSession : session,
          ),
        }));
        void syncSessionReminder(nextSession);
      },
      rescheduleSession: (id, startTime, endTime) => {
        const current = get().sessions.find((session) => session.id === id);
        if (!current) {
          return;
        }

        const nextSession: Session = {
          ...current,
          startTime,
          endTime,
          rescheduled: true,
          originalDate: current.originalDate ?? current.startTime,
        };

        set((state) => ({
          sessions: state.sessions.map((session) =>
            session.id === id ? nextSession : session,
          ),
        }));
        void syncSessionReminder(nextSession);
      },
      resetSessions: () => {
        const currentSessions = get().sessions;
        set(() => ({
          sessions: createInitialSessions(),
        }));
        currentSessions.forEach((session) => {
          void cancelSessionReminders(session.id);
        });
      },
    }),
    {
      name: "session-storage",
      version: 2,
      storage: createJSONStorage(() => getSafeStorage()),
      migrate: () => ({
        sessions: [],
      }),
      onRehydrateStorage: () => (state) => {
        enqueueNotificationResync(async () => {
          state?.sessions.forEach((session) => {
            void syncSessionReminder(session);
          });
        });
      },
    },
  ),
);
