import type { ReactNode } from 'react'

interface DashboardEmptyStateProps {
  icon: ReactNode
  title: string
  description: string
  action?: ReactNode
  compact?: boolean
}

function DashboardEmptyState({
  icon,
  title,
  description,
  action,
  compact = false,
}: DashboardEmptyStateProps) {
  return (
    <div className={`dashboard-empty${compact ? ' empty-compact' : ''}`}>
      <span aria-hidden="true" className="empty-icon">
        {icon}
      </span>
      <div>
        <h3>{title}</h3>
        <p>{description}</p>
        {action ? <div className="empty-action">{action}</div> : null}
      </div>
    </div>
  )
}

export default DashboardEmptyState
