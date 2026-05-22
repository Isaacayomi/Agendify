export interface Session {
  id: string;
  title: string;
  subject: string;
  startTime: string;
  endTime: string;
  completed: boolean;
  rescheduled: boolean;
  originalDate?: string;
}
