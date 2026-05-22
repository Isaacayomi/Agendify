import { ModalGoalForm } from "@/components/ui/modal-goal-form";
import { ModalSessionForm } from "@/components/ui/modal-session-form";
import { ModalTaskForm } from "@/components/ui/modal-task-form";
import { useLocalSearchParams } from "expo-router";

type ModalEntity = "task" | "goal" | "session";

function isModalEntity(value: string | undefined): value is ModalEntity {
  return value === "task" || value === "goal" || value === "session";
}

export default function ModalEntityScreen() {
  const params = useLocalSearchParams<{ entity?: string | string[] }>();
  const entity = Array.isArray(params.entity)
    ? params.entity[0]
    : params.entity;

  if (!isModalEntity(entity)) {
    return <ModalTaskForm />;
  }

  if (entity === "goal") {
    return <ModalGoalForm />;
  }

  if (entity === "session") {
    return <ModalSessionForm />;
  }

  return <ModalTaskForm />;
}
