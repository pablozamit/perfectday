export interface Activity {
  id: string;
  name: string;
  description?: string;
  importance: number; // 1-5
  icon: string;
  category: string;
}

export interface DayEntry {
  date: string; // YYYY-MM-DD format
  completedActivities: string[]; // activity IDs
  score: number;
  notes?: string;
}

export interface PerfectDay {
  activities: Activity[];
  totalPossibleScore: number;
}