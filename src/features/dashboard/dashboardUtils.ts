import type { DashboardEntry } from './dashboardTypes'

export function formatEntryDate(entry: DashboardEntry): string {
  const date = new Date(`${entry.date}T${entry.time}`)
  return new Intl.DateTimeFormat('pt-BR', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  }).format(date)
}

export function formatDate(date: Date): string {
  const formatted = new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(date)
  return formatted.charAt(0).toUpperCase() + formatted.slice(1)
}
