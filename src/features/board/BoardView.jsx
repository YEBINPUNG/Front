import ErrorBanner from '../../components/ErrorBanner.jsx'
import PageHeader from '../../components/PageHeader.jsx'
import { toDateInputValue } from '../../lib/date.js'
import { BOARD_COLUMNS_META } from '../../constants/ui.js'

export default function BoardView({
  description,
  columns,
  members,
  myRole,
  currentUserId,
  loading,
  error,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
  onOpenDetail,
}) {
  const canWrite = myRole === 'OWNER' || myRole === 'MEMBER'
  const canDelete = (task) => myRole === 'OWNER' || (myRole === 'MEMBER' && task.assigneeId === currentUserId)

  return (
    <div className="notion-page notion-page-wide">
      <PageHeader
        icon={'\u{1F4CB}'}
        color="mint"
        title="업무 보드"
        description={description}
      />

      <ErrorBanner message={error} />
      {loading && <p className="hint-text">불러오는 중...</p>}
      {!canWrite && <p className="hint-text">뷰어 권한이라 조회만 가능해요.</p>}

      <div className="board-columns">
        {columns.map((column) => (
          <div className="board-column" key={column.id}>
            <h3>
              <span className="column-dot" style={{ background: `var(--accent-${column.color})` }} />
              {column.title} <span className="count-badge">{column.tasks.length}</span>
            </h3>
            <div className="task-list">
              {column.tasks.map((task) => (
                <div className="task-card" key={task.id}>
                  <div className="task-card-body">
                    <div className="task-title-row">
                      {canWrite ? (
                        <input
                          className="task-title-input"
                          defaultValue={task.title}
                          onBlur={(e) => {
                            if (e.target.value.trim() && e.target.value !== task.title) {
                              onUpdateTask(task.id, { title: e.target.value.trim() })
                            }
                          }}
                          placeholder="태스크 이름"
                        />
                      ) : (
                        <span className="task-title-readonly">{task.title || '(제목 없음)'}</span>
                      )}
                      <button
                        type="button"
                        className="task-detail-button"
                        onClick={() => onOpenDetail(task.id)}
                        title="상세 보기 (이력/위험도)"
                      >
                        {'\u{2139}'}
                      </button>
                    </div>
                    <div className="task-meta">
                      <select
                        className="task-meta-input"
                        value={task.assigneeId ?? ''}
                        disabled={!canWrite}
                        onChange={(e) => onUpdateTask(task.id, { assigneeId: e.target.value || null })}
                      >
                        <option value="">{'\u{1F464} 미배정'}</option>
                        {members.map((m) => (
                          <option key={m.user.id} value={m.user.id}>
                            {m.user.name}
                          </option>
                        ))}
                      </select>
                      <input
                        type="date"
                        className="task-meta-input"
                        value={toDateInputValue(task.dueDate)}
                        disabled={!canWrite}
                        onChange={(e) => onUpdateTask(task.id, { dueDate: e.target.value || null })}
                      />
                      <select
                        className="task-meta-input"
                        value={task.status}
                        disabled={!canWrite}
                        onChange={(e) => onUpdateTask(task.id, { status: e.target.value })}
                      >
                        {BOARD_COLUMNS_META.map((c) => (
                          <option key={c.status} value={c.status}>
                            {c.title}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  {canDelete(task) && (
                    <button type="button" className="task-delete-button" onClick={() => onDeleteTask(task.id)}>
                      {'✕'}
                    </button>
                  )}
                </div>
              ))}
            </div>
            {canWrite && (
              <button type="button" className="add-block-button" onClick={() => onAddTask(column.status)}>
                + 새 태스크
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
