import { color } from "@/constants/colors";

import {
  formatDurationLabel,
  formatTimeRange,
  formatUpcomingDateLabel,
  isSameIsoDate,
  isTodayIso,
} from "@/src/lib/date";
import type { Goal } from "@/src/types/goal";
import type { Session } from "@/src/types/session";

export type HomeSessionCardType = "anatomy" | "biochem" | "biology";

export interface HomeSessionCard {
  id: string;
  title: string;
  time: string;
  duration: string;
  type: HomeSessionCardType;
  completed: boolean;
}

export interface HomeUpcomingCard {
  id: string;
  title: string;
  time: string;
  borderColor: string;
}

function getSessionType(subject: string): HomeSessionCardType {
  const normalizedSubject = subject.trim().toLowerCase();

  if (normalizedSubject.includes("biochem")) {
    return "biochem";
  }

  if (normalizedSubject.includes("biology")) {
    return "biology";
  }

  return "anatomy";
}

function getUpcomingBorderColor(subject: string): string {
  const normalizedSubject = subject.trim().toLowerCase();

  if (normalizedSubject.includes("biochem")) {
    return color.upcomingCardBorderSecondary;
  }

  if (normalizedSubject.includes("biology")) {
    return color.upcomingCardBorderSuccess;
  }

  if (normalizedSubject.includes("revision")) {
    return color.upcomingCardBorderInfo;
  }

  return color.upcomingCardBorderPrimary;
}

export function getDailyGoalPercentage(goals: Goal[]): number {
  const dailyGoals = goals.filter((goal) => goal.type === "daily");

  if (dailyGoals.length === 0) {
    return 0;
  }

  const targetHours = dailyGoals.reduce(
    (total, goal) => total + goal.targetHours,
    0,
  );
  const completedHours = dailyGoals.reduce(
    (total, goal) => total + goal.completedHours,
    0,
  );

  if (targetHours === 0) {
    return 0;
  }

  return Math.max(
    0,
    Math.min(100, Math.round((completedHours / targetHours) * 100)),
  );
}

export function getTodaySessionCards(sessions: Session[]): HomeSessionCard[] {
  return sessions
    .filter((session) => isTodayIso(session.startTime) && !session.completed)
    .sort((left, right) => left.startTime.localeCompare(right.startTime))
    .map((session) => ({
      id: session.id,
      title: session.title,
      time: formatTimeRange(session.startTime, session.endTime),
      duration: formatDurationLabel(session.startTime, session.endTime),
      type: getSessionType(session.subject),
      completed: session.completed,
    }));
}

export function getCompletedSessionCards(
  sessions: Session[],
): HomeSessionCard[] {
  return sessions
    .filter((session) => session.completed)
    .sort((left, right) => left.startTime.localeCompare(right.startTime))
    .map((session) => ({
      id: session.id,
      title: session.title,
      time: formatTimeRange(session.startTime, session.endTime),
      duration: formatDurationLabel(session.startTime, session.endTime),
      type: getSessionType(session.subject),
      completed: session.completed,
    }));
}

export function getUpcomingCards(
  sessions: Session[],
  selectedDate?: string,
): HomeUpcomingCard[] {
  return sessions
    .filter((session) => !session.completed)
    .filter((session) =>
      selectedDate
        ? isSameIsoDate(session.startTime, selectedDate)
        : !isTodayIso(session.startTime),
    )
    .sort((left, right) => left.startTime.localeCompare(right.startTime))
    .map((session) => ({
      id: session.id,
      title: session.title,
      time: selectedDate
        ? formatTimeRange(session.startTime, session.endTime)
        : formatUpcomingDateLabel(session.startTime),
      borderColor: getUpcomingBorderColor(session.subject),
    }));
}
