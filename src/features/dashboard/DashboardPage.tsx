import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Brand from '../../components/Brand'
import Icon from '../../components/Icon'
import DashboardEmptyState from './DashboardEmptyState'
import DashboardDialog from './DashboardDialog'
import DashboardEntryList from './DashboardEntryList'
import DashboardStatCard from './DashboardStatCard'
import {
  loadDashboardData,
  saveDashboardData,
} from './dashboardStorage'
import {
  englishLevels,
  type DashboardData,
  type DashboardEntry,
  type DashboardProfile,
} from './dashboardTypes'
import { formatDate, formatEntryDate } from './dashboardUtils'

type Modal = 'entry' | 'settings' | null
type Shortcut =
  | 'lessons'
  | 'activities'
  | 'calendar'
  | 'progress'
  | 'vocabulary'
  | 'settings'

const xpPerActivity = 10
const emptyProfile: DashboardProfile = {
  name: '',
  englishLevel: null,
  weeklyActivityGoal: null,
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error
    ? error.message
    : 'Não foi possível acessar os dados do painel neste navegador.'
}

function getGreeting(hour: number): string {
  if (hour < 12) return 'Bom dia'
  if (hour < 18) return 'Boa tarde'
  return 'Boa noite'
}

function toLocalDateKey(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function getWeekStart(date: Date): Date {
  const start = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  const weekdayFromMonday = (start.getDay() + 6) % 7
  start.setDate(start.getDate() - weekdayFromMonday)
  return start
}

function getStudyStreak(entries: DashboardEntry[], today: Date): number {
  const completedDays = new Set(
    entries
      .filter((entry) => entry.completed && entry.completedAt)
      .map((entry) => toLocalDateKey(new Date(entry.completedAt!))),
  )

  const cursor = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  if (!completedDays.has(toLocalDateKey(cursor))) {
    cursor.setDate(cursor.getDate() - 1)
  }

  let streak = 0
  while (completedDays.has(toLocalDateKey(cursor))) {
    streak += 1
    cursor.setDate(cursor.getDate() - 1)
  }
  return streak
}

function readDashboardState(): {
  data: DashboardData | null
  error: string | null
} {
  try {
    return { data: loadDashboardData(), error: null }
  } catch (error) {
    return { data: null, error: getErrorMessage(error) }
  }
}

function DashboardPage() {
  const [storedState, setStoredState] = useState(readDashboardState)
  const [today, setToday] = useState(() => new Date())
  const [modal, setModal] = useState<Modal>(null)
  const [entryToEdit, setEntryToEdit] = useState<DashboardEntry | null>(null)
  const [notice, setNotice] = useState('')
  const data = storedState.data
  const weekStart = getWeekStart(today)
  const weekStartKey = toLocalDateKey(weekStart)
  const todayKey = toLocalDateKey(today)
  const now = today.getTime()
  const entries = data?.entries ?? []
  const activityEntries = entries.filter((entry) => entry.kind === 'activity')
  const pendingActivities = activityEntries.filter((entry) => !entry.completed)
  const completedActivities = activityEntries.filter((entry) => entry.completed)
  const completedThisWeek = activityEntries.filter((entry) => {
    if (!entry.completedAt) return false
    const completedDate = toLocalDateKey(new Date(entry.completedAt))
    return completedDate >= weekStartKey && completedDate <= todayKey
  }).length
  const weeklyGoal = data?.profile.weeklyActivityGoal ?? null
  const weeklyProgress =
    weeklyGoal === null
      ? 0
      : Math.min(100, Math.round((completedThisWeek / weeklyGoal) * 100))
  const xp = completedActivities.length * xpPerActivity
  const streak = getStudyStreak(entries, today)
  const nextLesson = entries
    .filter(
      (entry) =>
        entry.kind === 'lesson' &&
        !entry.completed &&
        new Date(`${entry.date}T${entry.time}`).getTime() >= now,
    )
    .sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time))[0]
  const visibleActivities = [...activityEntries].sort(
    (a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time),
  )
  const earnedAchievements = [
    completedActivities.length >= 1 ? 'Primeira atividade' : null,
    completedActivities.length >= 5 ? 'Cinco passos concluídos' : null,
  ].filter((achievement): achievement is string => achievement !== null)
  const greetingName = data?.profile.name.trim() || 'professor'
  const levelLabel = englishLevels.find(
    (level) => level.value === data?.profile.englishLevel,
  )?.label

  function commitData(nextData: DashboardData, successMessage: string): boolean {
    try {
      saveDashboardData(nextData)
      setStoredState({ data: nextData, error: null })
      setNotice(successMessage)
      return true
    } catch (error) {
      setStoredState((current) => ({
        ...current,
        error: getErrorMessage(error),
      }))
      return false
    }
  }

  useEffect(() => {
    const timer = window.setInterval(() => setToday(new Date()), 60_000)
    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    function handleStorageChange(event: StorageEvent) {
      if (event.key === null || event.key.startsWith('fluent-journey:')) {
        setStoredState(readDashboardState())
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  const closeModal = useCallback(() => {
    setModal(null)
    setEntryToEdit(null)
  }, [])

  function openSettings() {
    setNotice('')
    setModal('settings')
  }

  function openEntryForm(entry?: DashboardEntry) {
    setNotice('')
    setEntryToEdit(entry ?? null)
    setModal('entry')
  }

  function handleShortcut(shortcut: Shortcut) {
    setNotice('')
    if (shortcut === 'calendar') {
      openEntryForm()
      return
    }
    if (shortcut === 'settings') {
      openSettings()
      return
    }
    if (shortcut === 'vocabulary') {
      setNotice(
        'A área de vocabulário ainda não foi implementada. Ela será adicionada em uma próxima etapa.',
      )
      return
    }

    const targetId = shortcut === 'lessons' ? 'next-lesson' : shortcut
    document.getElementById(targetId)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  }

  function saveEntry(entry: DashboardEntry, previousId: string | null): boolean {
    if (!data) return false

    const nextEntries = previousId
      ? entries.map((item) => (item.id === previousId ? entry : item))
      : [...entries, entry]
    return commitData(
      { ...data, entries: nextEntries },
      previousId ? 'Item atualizado.' : 'Item adicionado ao seu plano.',
    )
  }

  function saveProfile(profile: DashboardProfile): boolean {
    if (!data) return false
    return commitData(
      { ...data, profile },
      'Seu perfil e suas metas foram atualizados.',
    )
  }

  function toggleEntry(entry: DashboardEntry) {
    if (!data) return
    const completed = !entry.completed
    const updatedEntry: DashboardEntry = {
      ...entry,
      completed,
      completedAt: completed ? new Date().toISOString() : null,
    }
    const nextEntries = entries.map((item) =>
      item.id === entry.id ? updatedEntry : item,
    )
    commitData(
      { ...data, entries: nextEntries },
      completed
        ? entry.kind === 'activity'
          ? `Atividade concluída: +${xpPerActivity} XP.`
          : 'Aula marcada como concluída.'
        : 'Item voltou para pendente.',
    )
  }

  function deleteEntry(entry: DashboardEntry) {
    if (!data) return
    commitData(
      { ...data, entries: entries.filter((item) => item.id !== entry.id) },
      'Item removido do seu plano.',
    )
  }

  const shortcuts: {
    id: Shortcut
    icon: 'book' | 'sparkle' | 'calendar' | 'chart' | 'target'
    title: string
    description: string
  }[] = [
    {
      id: 'lessons',
      icon: 'book',
      title: 'Minhas aulas',
      description: 'Veja sua próxima aula planejada',
    },
    {
      id: 'activities',
      icon: 'sparkle',
      title: 'Atividades',
      description: 'Organize e conclua suas atividades',
    },
    {
      id: 'calendar',
      icon: 'calendar',
      title: 'Calendário',
      description: 'Adicione um item ao seu plano',
    },
    {
      id: 'progress',
      icon: 'chart',
      title: 'Meu progresso',
      description: 'Acompanhe seus registros de estudo',
    },
    {
      id: 'vocabulary',
      icon: 'book',
      title: 'Vocabulário',
      description: 'Área em preparação',
    },
    {
      id: 'settings',
      icon: 'target',
      title: 'Configurações',
      description: 'Atualize seu perfil e suas metas',
    },
  ]

  return (
    <div className="dashboard-shell">
      <div className="dashboard-container">
        <header className="dashboard-header">
          <Brand />
          <div className="dashboard-header-actions">
            <span className="dashboard-date">{formatDate(today)}</span>
            <button
              aria-label="Abrir configurações do perfil"
              className="profile-button"
              disabled={!data}
              onClick={openSettings}
              type="button"
            >
              {data?.profile.name.trim()
                ? data.profile.name
                    .trim()
                    .split(/\s+/)
                    .slice(0, 2)
                    .map((part) => part[0]?.toUpperCase())
                    .join('')
                : 'FJ'}
            </button>
          </div>
        </header>

        <main className="dashboard-main">
          {storedState.error ? (
            <div aria-live="assertive" className="dashboard-error" role="alert">
              <strong>Não foi possível carregar o painel.</strong>
              <p>{storedState.error}</p>
              <button
                className="text-button"
                onClick={() => setStoredState(readDashboardState())}
                type="button"
              >
                Tentar novamente
              </button>
            </div>
          ) : null}
          {notice ? (
            <div aria-live="polite" className="dashboard-notice" role="status">
              <span>{notice}</span>
              <button
                aria-label="Dispensar aviso"
                onClick={() => setNotice('')}
                type="button"
              >
                ×
              </button>
            </div>
          ) : null}

          <section aria-labelledby="dashboard-greeting-title" className="dashboard-greeting">
            <div>
              <span className="eyebrow">
                <span aria-hidden="true" className="eyebrow-dot" />
                Seu espaço de aprendizagem
              </span>
              <h1 id="dashboard-greeting-title">
                {getGreeting(today.getHours())}, {greetingName}.
              </h1>
              <p>
                Cada passo da sua jornada começa com aquilo que você escolhe
                estudar hoje.
              </p>
            </div>
            <button
              className="button button-primary add-entry-button"
              disabled={!data}
              onClick={() => openEntryForm()}
              type="button"
            >
              <Icon name="plus" />
              Adicionar ao plano
            </button>
          </section>

          <section aria-label="Resumo das atividades" className="dashboard-stats">
            <DashboardStatCard
              detail={
                pendingActivities.length
                  ? 'Na sua lista de estudos'
                  : 'Nenhuma atividade pendente'
              }
              icon="calendar"
              label="Atividades pendentes"
              tone="amber"
              value={data ? String(pendingActivities.length) : '—'}
            />
            <DashboardStatCard
              detail={
                completedActivities.length
                  ? 'Registradas como concluídas'
                  : 'Ainda sem atividades concluídas'
              }
              icon="check"
              label="Atividades concluídas"
              value={data ? String(completedActivities.length) : '—'}
            />
            <DashboardStatCard
              detail={
                streak === 1
                  ? 'dia de estudo consecutivo'
                  : 'dias de estudo consecutivos'
              }
              icon="flame"
              label="Sequência de estudos"
              tone="blue"
              value={data ? String(streak) : '—'}
            />
          </section>

          <div className="dashboard-overview-grid">
            <section
              aria-labelledby="weekly-goal-title"
              className="dashboard-panel weekly-goal-panel"
            >
              <div className="panel-heading">
                <div>
                  <span className="panel-eyebrow">Constância, um passo por vez</span>
                  <h2 id="weekly-goal-title">Meta da semana</h2>
                </div>
                <span aria-hidden="true" className="panel-icon">
                  <Icon name="target" />
                </span>
              </div>
              {weeklyGoal === null ? (
                <DashboardEmptyState
                  action={
                    <button
                      className="text-button"
                      disabled={!data}
                      onClick={openSettings}
                      type="button"
                    >
                      Definir uma meta semanal
                      <Icon name="arrow" />
                    </button>
                  }
                  compact
                  description="Escolha quantas atividades quer concluir nesta semana. O painel acompanhará apenas o que você registrar."
                  icon={<Icon name="target" />}
                  title="Sua meta começa com você"
                />
              ) : (
                <div className="goal-progress">
                  <div className="goal-count">
                    <strong>{completedThisWeek}</strong>
                    <span>de {weeklyGoal} atividades concluídas nesta semana</span>
                  </div>
                  <div
                    aria-label={`${weeklyProgress}% da meta semanal`}
                    className="progress-track"
                    role="progressbar"
                    aria-valuemax={100}
                    aria-valuemin={0}
                    aria-valuenow={weeklyProgress}
                  >
                    <span style={{ width: `${weeklyProgress}%` }} />
                  </div>
                  <div className="goal-footer">
                    <span>
                      {weeklyProgress >= 100
                        ? 'Meta alcançada. Excelente constância!'
                        : `${Math.max(weeklyGoal - completedThisWeek, 0)} para alcançar sua meta`}
                    </span>
                    <button
                      className="text-button"
                      disabled={!data}
                      onClick={openSettings}
                      type="button"
                    >
                      Editar
                    </button>
                  </div>
                </div>
              )}
            </section>

            <section
              aria-labelledby="next-lesson-title"
              className="dashboard-panel next-lesson-panel"
              id="next-lesson"
            >
              <div className="panel-heading">
                <div>
                  <span className="panel-eyebrow">Seu próximo encontro</span>
                  <h2 id="next-lesson-title">Próxima aula</h2>
                </div>
                <span aria-hidden="true" className="panel-icon">
                  <Icon name="book" />
                </span>
              </div>
              {nextLesson ? (
                <div className="next-lesson-details">
                  <span className="lesson-date-chip">
                    <Icon name="calendar" />
                    {formatEntryDate(nextLesson)}
                  </span>
                  <h3>{nextLesson.title}</h3>
                  <p>
                    <Icon name="clock" />
                    {nextLesson.time}
                  </p>
                  <button
                    className="text-button"
                    onClick={() => openEntryForm(nextLesson)}
                    type="button"
                  >
                    Editar aula
                  </button>
                </div>
              ) : (
                <DashboardEmptyState
                  action={
                    <button
                      className="text-button"
                      disabled={!data}
                      onClick={() => openEntryForm()}
                      type="button"
                    >
                      Planejar uma aula
                      <Icon name="arrow" />
                    </button>
                  }
                  compact
                  description="Quando você registrar uma aula futura, ela aparecerá aqui."
                  icon={<Icon name="book" />}
                  title="Nenhuma aula planejada"
                />
              )}
            </section>
          </div>

          <div className="dashboard-learning-grid">
            <section
              aria-labelledby="activities-title"
              className="dashboard-panel activities-panel"
              id="activities"
            >
              <div className="panel-heading">
                <div>
                  <span className="panel-eyebrow">Seu plano de estudo</span>
                  <h2 id="activities-title">Atividades</h2>
                </div>
                <button
                  className="panel-action"
                  disabled={!data}
                  onClick={() => openEntryForm()}
                  type="button"
                >
                  <Icon name="plus" />
                  Adicionar
                </button>
              </div>
              {visibleActivities.length === 0 ? (
                <DashboardEmptyState
                  action={
                    <button
                      className="text-button"
                      disabled={!data}
                      onClick={() => openEntryForm()}
                      type="button"
                    >
                      Registrar a primeira atividade
                      <Icon name="arrow" />
                    </button>
                  }
                  description="As atividades que você adicionar serão listadas aqui. Não há itens de demonstração."
                  icon={<Icon name="sparkle" />}
                  title="Seu espaço está pronto"
                />
              ) : (
                <DashboardEntryList
                  disabled={!data}
                  entries={visibleActivities}
                  mode="activities"
                  onDelete={deleteEntry}
                  onEdit={openEntryForm}
                  onToggle={toggleEntry}
                />
              )}
            </section>

            <section
              aria-labelledby="progress-title"
              className="dashboard-panel progress-panel"
              id="progress"
            >
              <div className="panel-heading">
                <div>
                  <span className="panel-eyebrow">Aprender com intenção</span>
                  <h2 id="progress-title">Meu progresso</h2>
                </div>
                <span aria-hidden="true" className="panel-icon">
                  <Icon name="chart" />
                </span>
              </div>
              <div className="level-card">
                <span className="level-card-label">Nível atual de inglês</span>
                {levelLabel ? (
                  <>
                    <strong className="level-value">
                      {data?.profile.englishLevel}
                    </strong>
                    <span className="level-description">{levelLabel}</span>
                  </>
                ) : (
                  <>
                    <strong className="level-unset">Ainda não definido</strong>
                    <button
                      className="text-button"
                      disabled={!data}
                      onClick={openSettings}
                      type="button"
                    >
                      Definir meu nível
                      <Icon name="arrow" />
                    </button>
                  </>
                )}
              </div>
              <div className="progress-facts">
                <div>
                  <span>Atividades concluídas</span>
                  <strong>{data ? completedActivities.length : '—'}</strong>
                </div>
                <div>
                  <span>Experiência acumulada</span>
                  <strong>{data ? `${xp} XP` : '—'}</strong>
                </div>
              </div>
              <p className="progress-explainer">
                O XP é calculado com base nas atividades que você marca como
                concluídas ({xpPerActivity} XP por atividade). Ainda não é uma
                avaliação do seu nível de inglês.
              </p>
            </section>
          </div>

          <section
            aria-labelledby="achievements-title"
            className="dashboard-panel achievements-panel"
          >
            <div className="panel-heading">
              <div>
                <span className="panel-eyebrow">Reconhecendo cada passo</span>
                <h2 id="achievements-title">Conquistas</h2>
              </div>
              <span aria-hidden="true" className="panel-icon">
                <Icon name="award" />
              </span>
            </div>
            {earnedAchievements.length ? (
              <div className="achievement-list">
                {earnedAchievements.map((achievement) => (
                  <div className="achievement-badge" key={achievement}>
                    <span aria-hidden="true">
                      <Icon name="award" />
                    </span>
                    <div>
                      <strong>{achievement}</strong>
                      <span>Conquista desbloqueada</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <DashboardEmptyState
                compact
                description="Suas conquistas serão desbloqueadas conforme você registrar atividades concluídas."
                icon={<Icon name="award" />}
                title="Toda jornada tem um primeiro passo"
              />
            )}
          </section>

          <section aria-labelledby="shortcuts-title" className="dashboard-shortcuts">
            <div className="panel-heading">
              <div>
                <span className="panel-eyebrow">Tudo em um só lugar</span>
                <h2 id="shortcuts-title">Acesso rápido</h2>
              </div>
            </div>
            <div className="shortcut-grid">
              {shortcuts.map((shortcut) => (
                <button
                  className="shortcut-card"
                  disabled={
                    !data &&
                    (shortcut.id === 'calendar' || shortcut.id === 'settings')
                  }
                  key={shortcut.id}
                  onClick={() => handleShortcut(shortcut.id)}
                  type="button"
                >
                  <span aria-hidden="true" className="shortcut-icon">
                    <Icon name={shortcut.icon} />
                  </span>
                  <span className="shortcut-copy">
                    <strong>{shortcut.title}</strong>
                    <span>{shortcut.description}</span>
                  </span>
                  <Icon className="shortcut-arrow" name="arrow" />
                </button>
              ))}
            </div>
          </section>

          <section
            aria-labelledby="study-plan-title"
            className="dashboard-panel study-plan-panel"
            id="lessons"
          >
            <div className="panel-heading">
              <div>
                <span className="panel-eyebrow">Aulas e atividades planejadas</span>
                <h2 id="study-plan-title">Seu calendário</h2>
              </div>
              <button
                className="panel-action"
                disabled={!data}
                onClick={() => openEntryForm()}
                type="button"
              >
                <Icon name="plus" />
                Adicionar item
              </button>
            </div>
            {entries.length === 0 ? (
              <DashboardEmptyState
                action={
                  <button
                    className="text-button"
                    disabled={!data}
                    onClick={() => openEntryForm()}
                    type="button"
                  >
                    Planejar minha semana
                    <Icon name="arrow" />
                  </button>
                }
                compact
                description="Aulas e atividades que você planejar aparecerão aqui. Seu calendário está vazio por enquanto."
                icon={<Icon name="calendar" />}
                title="Nenhum compromisso adicionado"
              />
            ) : (
              <DashboardEntryList
                disabled={!data}
                entries={[...entries]
                  .sort(
                    (a, b) =>
                      a.date.localeCompare(b.date) ||
                      a.time.localeCompare(b.time),
                  )}
                mode="calendar"
                onDelete={deleteEntry}
                onEdit={openEntryForm}
                onToggle={toggleEntry}
              />
            )}
          </section>
        </main>

        <footer className="site-footer dashboard-footer">
          <Link to="/welcome">Fluent Journey</Link>
          <span>
            Seus dados ficam salvos neste navegador. Não há conta ou banco de
            dados conectado.
          </span>
        </footer>
      </div>
      {modal ? (
        <DashboardDialog
          entryToEdit={modal === 'entry' ? entryToEdit : null}
          mode={modal}
          onClose={closeModal}
          onSaveEntry={saveEntry}
          onSaveProfile={saveProfile}
          profile={data?.profile ?? emptyProfile}
        />
      ) : null}
    </div>
  )
}

export default DashboardPage
