// ══════════════════════════════════════════════════════════
// TYPES — Gym Tracker Multi-Profile
// ══════════════════════════════════════════════════════════

export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: string;
  description: string;
  videoQuery: string;
  muscleGroup: string;
  animationType: string;
}

export interface PlanDay {
  id: string;
  name: string;       // es. "Lunedì", "Giorno 1"
  title: string;      // es. "Petto + Core"
  exercises: Exercise[];
}

export interface PlanWeek {
  id: string;
  label: string;      // es. "Settimana 1"
  days: PlanDay[];
}

export interface WorkoutPlan {
  id: string;
  name: string;
  createdAt: string;
  weeks: PlanWeek[];
}

// ── Tracking ──

export interface SetLog {
  completed: boolean;
  reps: number | null;
  weight: number | null;
}

export interface ExerciseLog {
  exerciseId: string;
  exerciseName: string;
  sets: SetLog[];
}

export interface WorkoutSession {
  id: string;
  planId: string;
  weekId: string;
  dayId: string;
  date: string;
  exercises: ExerciseLog[];
  duration?: number;
}

export interface DayProgress {
  dayId: string;
  completed: boolean;
  sessionId: string | null;
}

export interface WeekProgress {
  weekId: string;
  dayProgress: DayProgress[];
}

export interface CycleProgress {
  planId: string;
  cycleNumber: number;
  startedAt: string;
  completedAt: string | null;
  weekProgress: WeekProgress[];
}

// ── Profile ──

export interface Profile {
  id: string;
  displayName: string;
  photoDataUrl: string | null;
}

export interface ProfileData {
  activePlanId: string | null;
  plans: WorkoutPlan[];
  sessions: WorkoutSession[];
  cycleProgress: CycleProgress | null;
  cycleHistory: CycleProgress[];
  customValues: Record<string, { reps?: string; weight?: string }>;
  changeLog: ChangeLogEntry[];
}

export interface ChangeLogEntry {
  date: string;
  type: "add" | "remove" | "edit";
  planName?: string;
  dayName?: string;
  exerciseName: string;
  details: string;
}

export const emptyProfileData: ProfileData = {
  activePlanId: null,
  plans: [],
  sessions: [],
  cycleProgress: null,
  cycleHistory: [],
  customValues: {},
  changeLog: [],
};
