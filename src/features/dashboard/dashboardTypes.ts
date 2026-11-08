export const englishLevels = [
  { value: 'A1', label: 'Beginner (A1)' },
  { value: 'A2', label: 'Elementary (A2)' },
  { value: 'B1', label: 'Intermediate (B1)' },
  { value: 'B2', label: 'Upper Intermediate (B2)' },
  { value: 'C1', label: 'Advanced (C1)' },
  { value: 'C2', label: 'Proficiency (C2)' },
] as const

export type EnglishLevel = (typeof englishLevels)[number]['value']
export type EntryKind = 'activity' | 'lesson'

export interface DashboardEntry {
  id: string
  title: string
  kind: EntryKind
  date: string
  time: string
  completed: boolean
  completedAt: string | null
}

export interface DashboardProfile {
  name: string
  englishLevel: EnglishLevel | null
  weeklyActivityGoal: number | null
}

export interface DashboardData {
  profile: DashboardProfile
  entries: DashboardEntry[]
}

export function createEmptyDashboardData(): DashboardData {
  return {
    profile: {
      name: '',
      englishLevel: null,
      weeklyActivityGoal: null,
    },
    entries: [],
  }
}
