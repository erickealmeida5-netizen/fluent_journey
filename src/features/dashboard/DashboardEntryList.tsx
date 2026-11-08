import Icon from '../../components/Icon'
import type { DashboardEntry } from './dashboardTypes'
import { formatEntryDate } from './dashboardUtils'

interface DashboardEntryListProps {
  entries: DashboardEntry[]
  mode: 'activities' | 'calendar'
  disabled: boolean
  onToggle?: (entry: DashboardEntry) => void
  onEdit?: (entry: DashboardEntry) => void
  onDelete?: (entry: DashboardEntry) => void
}

function DashboardEntryList({
  entries,
  mode,
  disabled,
  onToggle,
  onEdit,
  onDelete,
}: DashboardEntryListProps) {
  return (
    <ul className="activity-list">
      {entries.map((entry) => (
        <li
          className={`activity-row${entry.completed ? ' activity-complete' : ''}`}
          key={entry.id}
        >
          {mode === 'activities' ? (
            <button
              aria-label={
                entry.completed
                  ? `Marcar ${entry.title} como pendente`
                  : `Marcar ${entry.title} como concluída`
              }
              aria-pressed={entry.completed}
              className="activity-check"
              disabled={disabled}
              onClick={() => onToggle?.(entry)}
              type="button"
            >
              {entry.completed ? <Icon name="check" /> : null}
            </button>
          ) : (
            <span aria-hidden="true" className="plan-kind-icon">
              <Icon name={entry.kind === 'lesson' ? 'book' : 'calendar'} />
            </span>
          )}
          <div className="activity-copy">
            <strong>{entry.title}</strong>
            <span>
              {mode === 'calendar'
                ? `${entry.kind === 'lesson' ? 'Aula' : 'Atividade'} · `
                : ''}
              {formatEntryDate(entry)} · {entry.time}
            </span>
          </div>
          {mode === 'calendar' && onToggle ? (
            <button
              aria-label={
                entry.completed
                  ? `Marcar ${entry.title} como pendente`
                  : `Marcar ${entry.title} como concluído`
              }
              aria-pressed={entry.completed}
              className={`activity-status activity-status-toggle${entry.completed ? ' status-done' : ''}`}
              disabled={disabled}
              onClick={() => onToggle(entry)}
              type="button"
            >
              {entry.completed ? 'Concluído' : 'Pendente'}
            </button>
          ) : (
            <span
              className={`activity-status${entry.completed ? ' status-done' : ''}`}
            >
              {entry.completed
                ? mode === 'calendar'
                  ? 'Concluído'
                  : 'Concluída'
                : 'Pendente'}
            </span>
          )}
          {onEdit || onDelete ? (
            <div className="activity-actions">
              {onEdit ? (
                <button
                  aria-label={`Editar ${entry.title}`}
                  className="icon-button"
                  disabled={disabled}
                  onClick={() => onEdit(entry)}
                  type="button"
                >
                  <Icon name="edit" />
                </button>
              ) : null}
              {onDelete ? (
                <button
                  aria-label={`Excluir ${entry.title}`}
                  className="icon-button"
                  disabled={disabled}
                  onClick={() => onDelete(entry)}
                  type="button"
                >
                  <Icon name="trash" />
                </button>
              ) : null}
            </div>
          ) : null}
        </li>
      ))}
    </ul>
  )
}

export default DashboardEntryList
