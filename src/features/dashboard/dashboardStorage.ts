import {
  createEmptyDashboardData,
  englishLevels,
  type DashboardData,
} from './dashboardTypes'

const storageKey = 'fluent-journey:dashboard:v1'
const levelValues = new Set<string>(englishLevels.map((level) => level.value))

function isValidDateKey(value: unknown): value is string {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false
  }
  const parsedDate = new Date(`${value}T00:00:00`)
  return (
    !Number.isNaN(parsedDate.getTime()) &&
    parsedDate.getFullYear() === Number(value.slice(0, 4)) &&
    parsedDate.getMonth() + 1 === Number(value.slice(5, 7)) &&
    parsedDate.getDate() === Number(value.slice(8, 10))
  )
}

function isDashboardData(value: unknown): value is DashboardData {
  if (typeof value !== 'object' || value === null) return false

  const data = value as Record<string, unknown>
  if (typeof data.profile !== 'object' || data.profile === null) return false
  if (!Array.isArray(data.entries)) return false

  const profile = data.profile as Record<string, unknown>
  if (typeof profile.name !== 'string') return false
  if (
    profile.englishLevel !== null &&
    (typeof profile.englishLevel !== 'string' ||
      !levelValues.has(profile.englishLevel))
  ) {
    return false
  }
  if (
    profile.weeklyActivityGoal !== null &&
    (typeof profile.weeklyActivityGoal !== 'number' ||
      !Number.isInteger(profile.weeklyActivityGoal) ||
      profile.weeklyActivityGoal < 1 ||
      profile.weeklyActivityGoal > 50)
  ) {
    return false
  }

  return data.entries.every((entry: unknown) => {
    if (typeof entry !== 'object' || entry === null) return false

    const item = entry as Record<string, unknown>
    return (
      typeof item.id === 'string' &&
      typeof item.title === 'string' &&
      item.title.trim().length > 0 &&
      (item.kind === 'activity' || item.kind === 'lesson') &&
      isValidDateKey(item.date) &&
      typeof item.time === 'string' &&
      /^([01]\d|2[0-3]):[0-5]\d$/.test(item.time) &&
      typeof item.completed === 'boolean' &&
      (item.completedAt === null ||
        (typeof item.completedAt === 'string' &&
          !Number.isNaN(Date.parse(item.completedAt))))
    )
  })
}

export function loadDashboardData(): DashboardData {
  const storedValue = window.localStorage.getItem(storageKey)
  if (storedValue === null) return createEmptyDashboardData()

  let parsedValue: unknown
  try {
    parsedValue = JSON.parse(storedValue)
  } catch {
    throw new Error(
      'Os dados salvos do painel estão em um formato inválido. Eles foram preservados; revise os dados locais antes de continuar.',
    )
  }

  if (!isDashboardData(parsedValue)) {
    throw new Error(
      'Os dados salvos do painel não correspondem ao formato esperado. Eles foram preservados; revise os dados locais antes de continuar.',
    )
  }

  return parsedValue
}

export function saveDashboardData(data: DashboardData): void {
  window.localStorage.setItem(storageKey, JSON.stringify(data))
}
