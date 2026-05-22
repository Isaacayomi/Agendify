import type { Goal, GoalType } from "@/src/types/goal";

export interface GoalCardViewModel {
  id: string;
  label: string;
  value: string;
  status: string;
  progress: number;
  completed: boolean;
  tone: "primary" | "risk" | "success";
}

const goalToneMap: Record<GoalType, GoalCardViewModel["tone"]> = {
  daily: "primary",
  weekly: "risk",
  monthly: "success",
};

function formatGoalValue(goal: Goal): string {
  const unit = goal.category === "reading" ? "days" : "hrs";
  const completed = Number.isInteger(goal.completedHours)
    ? goal.completedHours.toFixed(0)
    : goal.completedHours.toFixed(1);
  const target = Number.isInteger(goal.targetHours)
    ? goal.targetHours.toFixed(0)
    : goal.targetHours.toFixed(1);

  return `${completed} / ${target} ${unit}`;
}

function getGoalStatus(progress: number, completed: boolean): string {
  if (completed || progress >= 100) {
    return "Completed";
  }

  if (progress >= 60) {
    return "On track";
  }

  return "At risk";
}

export function toGoalCard(goal: Goal): GoalCardViewModel {
  const progress =
    goal.targetHours === 0
      ? 0
      : Math.round((goal.completedHours / goal.targetHours) * 100);

  return {
    id: goal.id,
    label: goal.title,
    value: formatGoalValue(goal),
    status: getGoalStatus(progress, goal.completed),
    progress,
    completed: goal.completed || progress >= 100,
    tone: goalToneMap[goal.type],
  };
}
