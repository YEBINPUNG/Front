import ErrorBanner from '../../components/ErrorBanner.jsx'
import PageHeader from '../../components/PageHeader.jsx'
import { chipStyle } from '../../constants/ui.js'

export default function DashboardView({
  description,
  dashboard,
  loading,
  error,
  memberCount,
  onOpenDelay,
}) {
  const statusCounts = dashboard?.statusCounts ?? { TODO: 0, IN_PROGRESS: 0, DONE: 0 }
  const riskyTasks = dashboard?.riskyTasks ?? []
  const upcomingTasks = dashboard?.upcomingTasks ?? []
  const overdueTasks = dashboard?.overdueTasks ?? []

  const stats = [
    { label: '진행 중 태스크', value: statusCounts.TODO + statusCounts.IN_PROGRESS, icon: '\u{1F4C8}', color: 'sky' },
    { label: '지연 위험 태스크', value: riskyTasks.length, icon: '\u{23F3}', color: 'pink' },
    { label: '이번 주 마감', value: upcomingTasks.length, icon: '\u{1F4C5}', color: 'amber' },
    { label: '팀원 수', value: memberCount, icon: '\u{1F465}', color: 'mint' },
  ]

  const high = riskyTasks.filter((r) => r.riskLevel === 'HIGH').length
  const medium = riskyTasks.filter((r) => r.riskLevel === 'MEDIUM').length
  const hasRisk = high + medium > 0

  return (
    <div className="notion-page">
      <PageHeader
        icon={'\u{1F4CA}'}
        color="sky"
        title="대시보드"
        description={description}
      />

      <ErrorBanner message={error} />
      {loading && <p className="hint-text">불러오는 중...</p>}

      {hasRisk && (
        <div className="ai-callout">
          <span className="ai-callout-icon">{'✨'}</span>
          <div className="ai-callout-body">
            <p className="ai-callout-title">AI 지연 인사이트</p>
            <p className="ai-callout-text">
              지연 위험 <strong>높음 {high}건</strong>, 보통 {medium}건이 감지됐어요.
            </p>
          </div>
          <button type="button" className="ai-callout-button" onClick={onOpenDelay}>
            지연 탐지 보기 →
          </button>
        </div>
      )}

      <div className="stat-grid">
        {stats.map((stat) => (
          <div className="stat-card" key={stat.label}>
            <span className="stat-card-icon" style={chipStyle(stat.color)}>
              {stat.icon}
            </span>
            <span className="stat-value" style={{ color: `var(--accent-${stat.color})` }}>
              {stat.value}
            </span>
            <span className="stat-label">{stat.label}</span>
          </div>
        ))}
      </div>

      {overdueTasks.length > 0 && (
        <>
          <div className="block-label">마감 초과</div>
          <ul className="simple-list">
            {overdueTasks.map((t) => (
              <li key={t.id}>
                <span className="task-title">{t.title}</span>
                <span className="hint-text"> · {t.assignee?.name ?? '미배정'}</span>
              </li>
            ))}
          </ul>
        </>
      )}

      {upcomingTasks.length > 0 && (
        <>
          <div className="block-label">임박한 마감 (3일 이내)</div>
          <ul className="simple-list">
            {upcomingTasks.map((t) => (
              <li key={t.id}>
                <span className="task-title">{t.title}</span>
                <span className="hint-text"> · {t.assignee?.name ?? '미배정'}</span>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}
