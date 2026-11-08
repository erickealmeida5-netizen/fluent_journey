import { useEffect, type FormEvent } from 'react'
import Icon from '../../components/Icon'
import {
  englishLevels,
  type DashboardEntry,
  type DashboardProfile,
  type EnglishLevel,
} from './dashboardTypes'

type DialogMode = 'entry' | 'settings'

interface DashboardDialogProps {
  mode: DialogMode
  profile: DashboardProfile
  entryToEdit: DashboardEntry | null
  onClose: () => void
  onSaveEntry: (
    entry: DashboardEntry,
    previousId: string | null,
  ) => boolean
  onSaveProfile: (profile: DashboardProfile) => boolean
}

function DashboardDialog({
  mode,
  profile,
  entryToEdit,
  onClose,
  onSaveEntry,
  onSaveProfile,
}: DashboardDialogProps) {
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [onClose])

  function handleEntrySubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const title = String(formData.get('title') ?? '').trim()
    const date = String(formData.get('date') ?? '')
    const time = String(formData.get('time') ?? '')
    const kind = String(formData.get('kind') ?? 'activity')
    if (
      !title ||
      !date ||
      !time ||
      (kind !== 'activity' && kind !== 'lesson')
    ) {
      return
    }

    const entry: DashboardEntry = entryToEdit
      ? { ...entryToEdit, title, date, time, kind }
      : {
          id: crypto.randomUUID(),
          title,
          date,
          time,
          kind,
          completed: false,
          completedAt: null,
        }

    if (onSaveEntry(entry, entryToEdit?.id ?? null)) onClose()
  }

  function handleSettingsSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const name = String(formData.get('name') ?? '').trim()
    const levelValue = String(formData.get('level') ?? '')
    const goalValue = String(formData.get('weeklyGoal') ?? '')
    const validLevel = englishLevels.some((level) => level.value === levelValue)
    const nextProfile: DashboardProfile = {
      name,
      englishLevel: validLevel ? (levelValue as EnglishLevel) : null,
      weeklyActivityGoal: goalValue ? Number(goalValue) : null,
    }

    if (onSaveProfile(nextProfile)) onClose()
  }

  const isSettings = mode === 'settings'
  const title = isSettings
    ? 'Perfil e metas'
    : entryToEdit
      ? 'Editar item'
      : 'Adicionar ao plano'

  return (
    <div
      className="dashboard-modal-backdrop"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
      role="presentation"
    >
      <section
        aria-labelledby="dashboard-modal-title"
        aria-modal="true"
        className="dashboard-modal"
        role="dialog"
      >
        <div className="modal-heading">
          <div>
            <span className="eyebrow">
              {isSettings ? 'Seu espaço' : 'Organize sua jornada'}
            </span>
            <h2 id="dashboard-modal-title">{title}</h2>
          </div>
          <button
            aria-label="Fechar janela"
            className="modal-close"
            onClick={onClose}
            type="button"
          >
            ×
          </button>
        </div>

        {isSettings ? (
          <form className="dashboard-form" onSubmit={handleSettingsSubmit}>
            <label>
              Como podemos chamar você?
              <input
                autoComplete="name"
                defaultValue={profile.name}
                maxLength={60}
                name="name"
                placeholder="Seu nome"
                type="text"
              />
            </label>
            <label>
              Nível atual de inglês
              <select defaultValue={profile.englishLevel ?? ''} name="level">
                <option value="">Ainda não definido</option>
                {englishLevels.map((level) => (
                  <option key={level.value} value={level.value}>
                    {level.label}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Meta semanal de atividades
              <span className="form-hint">
                Quantas atividades você gostaria de concluir por semana?
              </span>
              <input
                defaultValue={profile.weeklyActivityGoal ?? ''}
                max={50}
                min={1}
                name="weeklyGoal"
                placeholder="Ex.: 3"
                type="number"
              />
            </label>
            <div className="modal-actions">
              <button
                className="button button-secondary"
                onClick={onClose}
                type="button"
              >
                Cancelar
              </button>
              <button className="button button-primary" type="submit">
                Salvar alterações
              </button>
            </div>
          </form>
        ) : (
          <form className="dashboard-form" onSubmit={handleEntrySubmit}>
            <label>
              O que você quer registrar?
              <input
                autoFocus
                defaultValue={entryToEdit?.title ?? ''}
                maxLength={100}
                name="title"
                placeholder="Ex.: Revisar simple past"
                required
                type="text"
              />
            </label>
            <label>
              Tipo
              <select defaultValue={entryToEdit?.kind ?? 'activity'} name="kind">
                <option value="activity">Atividade de estudo</option>
                <option value="lesson">Aula</option>
              </select>
            </label>
            <div className="form-field-row">
              <label>
                Data
                <input
                  defaultValue={entryToEdit?.date ?? ''}
                  name="date"
                  required
                  type="date"
                />
              </label>
              <label>
                Horário
                <input
                  defaultValue={entryToEdit?.time ?? ''}
                  name="time"
                  required
                  type="time"
                />
              </label>
            </div>
            <div className="modal-actions">
              <button
                className="button button-secondary"
                onClick={onClose}
                type="button"
              >
                Cancelar
              </button>
              <button className="button button-primary" type="submit">
                {entryToEdit ? 'Salvar alterações' : 'Adicionar ao plano'}
                <Icon name="arrow" />
              </button>
            </div>
          </form>
        )}
      </section>
    </div>
  )
}

export default DashboardDialog
