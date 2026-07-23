import ErrorBanner from '../../components/ErrorBanner.jsx'
import PageHeader from '../../components/PageHeader.jsx'
import { RISK_LEVEL_LABEL, RISK_STYLES } from '../../constants/ui.js'

export default function DelayView({ description, risks, loading, error, onScan, scanning, canScan }) {
  return (
    <div className="notion-page notion-page-wide">
      <PageHeader icon={'\u{26A0}'} color="amber" title="태스크 지연 탐지" description={description} />

      <ErrorBanner message={error} />

      {canScan && (
        <div className="action-row">
          <button type="button" className="primary-button" onClick={onScan} disabled={scanning}>
            {scanning ? 'AI 스캔 중...' : '✨ AI 위험 재스캔'}
          </button>
          <span className="hint-text">TODO/진행 중 태스크를 대상으로 지연 위험을 평가해요.</span>
        </div>
      )}

      {loading && <p className="hint-text">불러오는 중...</p>}

      {!loading && risks.length === 0 ? (
        <p className="placeholder-text">아직 위험 평가 결과가 없습니다. {canScan ? '위 버튼으로 스캔을 실행하세요.' : ''}</p>
      ) : (
        <div className="delay-table">
          <div className="delay-table-header">
            <span>태스크</span>
            <span>위험도</span>
            <span>{'✨'} AI 분석 근거</span>
          </div>
          {risks.map((risk) => {
            const level = RISK_LEVEL_LABEL[risk.riskLevel] ?? risk.riskLevel
            const style = RISK_STYLES[level] ?? RISK_STYLES.낮음
            const reasons = Array.isArray(risk.reasons) ? risk.reasons : []
            return (
              <div className="delay-row" key={risk.id}>
                <span className="task-title">{risk.task?.title ?? '(삭제된 태스크)'}</span>
                <span className="risk-select" style={{ background: style.bg, color: style.fg }}>
                  {level} · {Math.round((risk.probability ?? 0) * 100)}%
                </span>
                <ul className="reason-list">
                  {reasons.map((r, i) => (
                    <li key={i}>{r.note}</li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
