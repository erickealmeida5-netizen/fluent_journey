import type { IconName } from '../../components/Icon'
import Icon from '../../components/Icon'

interface DashboardStatCardProps {
  label: string
  value: string
  detail: string
  icon: IconName
  tone?: 'green' | 'blue' | 'amber'
}

function DashboardStatCard({
  label,
  value,
  detail,
  icon,
  tone = 'green',
}: DashboardStatCardProps) {
  return (
    <article className={`dashboard-stat-card stat-${tone}`}>
      <span aria-hidden="true" className="stat-icon">
        <Icon name={icon} />
      </span>
      <span className="stat-label">{label}</span>
      <strong className="stat-value">{value}</strong>
      <span className="stat-detail">{detail}</span>
    </article>
  )
}

export default DashboardStatCard
