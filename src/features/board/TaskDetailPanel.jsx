import { formatDateTime } from '../../lib/date.js'
import { RISK_LEVEL_LABEL, RISK_STYLES } from '../../constants/ui.js'
import ErrorBanner from '../../components/ErrorBanner.jsx'

const FIELD_LABEL = {
  title: '제목',
  description: '설명',
  status: '상태',
  assigneeId: '담당자',
  dueDate: '마감일',
  estimatedHours: '예상 소요시간',
  deletedAt: '삭제',
}

function formatHistoryValue(field, value, members) {
  if (value === null || value === undefined || value === '') return '(없음)'
  if (field === 'assigneeId') return members.find((m) => m.user.id === value)?.user.name ?? value
  if (field === 'dueDate' || field === 'deletedAt') return formatDateTime(value)
  return value
}

export default function TaskDetailPanel({ task, members, loading, error, onClose }) {
  return (
    <div className="detail-overlay" onClick={onClose}>
      <div className="detail-panel" onClick={(e) => e.stopPropagation()}>
        <div className="detail-panel-header">
          <h2>{task?.title ?? '태스크 상세'}</h2>
          <button type="button" className="icon-button" onClick={onClose}>
            {'✕'}
          </button>
        </div>

        <ErrorBanner message={error} />
        {loading && <p className="hint-text">불러오는 중...</p>}

        {task && (
          <>
            {task.risks?.length > 0 && (
              <>
                <div className="block-label">최신 위험 평가</div>
                {task.risks.map((r) => {
                  const level = RISK_LEVEL_LABEL[r.riskLevel] ?? r.riskLevel
                  const style = RISK_STYLES[level] ?? RISK_STYLES.낮음
                  return (
                    <div key={r.id} className="detail-risk">
                      <span className="risk-select" style={{ background: style.bg, color: style.fg }}>
                        {level} · {Math.round((r.probability ?? 0) * 100)}%
                      </span>
                      <ul className="reason-list">
                        {(Array.isArray(r.reasons) ? r.reasons : []).map((reason, i) => (
                          <li key={i}>{reason.note}</li>
                        ))}
                      </ul>
                    </div>
                  )
                })}
              </>
            )}

            <div className="block-label">변경 이력</div>
            {(!task.history || task.history.length === 0) && (
              <p className="placeholder-text">아직 변경 이력이 없습니다.</p>
            )}
            <ul className="history-list">
              {(task.history ?? []).map((h) => (
                <li key={h.id}>
                  <span className="history-field">{FIELD_LABEL[h.field] ?? h.field}</span>
                  <span className="history-change">
                    {formatHistoryValue(h.field, h.oldValue, members)} → {formatHistoryValue(h.field, h.newValue, members)}
                  </span>
                  <span className="history-time hint-text">{formatDateTime(h.createdAt)}</span>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  )
}
