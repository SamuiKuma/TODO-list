export type RecurrenceType = 'none' | 'daily' | 'weekly' | 'monthly';

export interface Card {
  id: string;
  title: string;
  description?: string;
  labels?: Label[];
  dueDate?: string;
  checklists?: Checklist[];
  comments?: Comment[];
  completed?: boolean;
  completedAt?: string;
  xpValue?: number;
  recurrence?: RecurrenceType;
  lastRecurredAt?: string;
}

export interface Label {
  id: string;
  text: string;
  color: string;
}

export interface Checklist {
  id: string;
  title: string;
  items: ChecklistItem[];
}

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface Comment {
  id: string;
  text: string;
  createdAt: string;
}

export interface List {
  id: string;
  title: string;
  cards: Card[];
}

export interface Board {
  id: string;
  title: string;
  lists: List[];
}

export interface UserProgress {
  totalXP: number;
  currentXP: number;
  level: number;
  eggProgress: number;
  eggStage: number; // 0 = Egg, 1 = Baby, 2 = Adult
  creatureName: string;
  tasksCompleted: number;
}

export const EGG_STAGES = [
  { name: "Egg", xpRequired: 0, emoji: "🥚" },
  { name: "Baby", xpRequired: 100, emoji: "🐣" },
  { name: "Adult", xpRequired: 300, emoji: "🐉" },
];

export const XP_VALUES = {
  TASK_COMPLETE: 10,
  TASK_BEFORE_DUE_DATE: 5, // bonus
  LIST_COMPLETE: 20,
};
