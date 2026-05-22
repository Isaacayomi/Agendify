export type GoalCategory = "study" | "reading" | "exercise" | "personal";

export type GoalType = "daily" | "weekly" | "monthly";

export interface Goal {
  id: string;
  title: string;
  category: GoalCategory;
  type: GoalType;
  targetHours: number;
  completedHours: number;
  completed: boolean;
  createdAt: string;
  deadline: string;
}
