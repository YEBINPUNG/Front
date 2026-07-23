import ErrorBanner from '../../components/ErrorBanner.jsx'
import MarkdownBlock from '../../components/MarkdownBlock.jsx'
import PageHeader from '../../components/PageHeader.jsx'
import { renderMarkdown } from '../../lib/markdown.jsx'
import { MARKDOWN_HINT } from '../../constants/ui.js'

export default function MeetingView({
  description,
  meetingsList,
  activeMeetingId,
  title,
  onTitleChange,
  meetingDate,
  onMeetingDateChange,
  blocks,
  onChangeBlock,
  onAddBlock,
  onSave,
  onNew,
  onLoadMeeting,
  onDelete,
  saving,
  summary,
  onSummarize,
  summarizing,
  extractedTasks,
  extractedDrafts,
  onDraftChange,
  members,
  onExtract,
  extracting,
  onApprove,
  onReject,
  error,
  canWrite,
}) {
  return (
    <div className="notion-page">
      <PageHeader
        icon={'\u{1F4DD}'}
        color="pink"
        title="회의록 변환"
        description={description}
      />

      <ErrorBanner message={error} />
      {!canWrite && <p className="hint-text">뷰어 권한이라 회의록 조회만 가능해요.</p>}

      <div className="meeting-toolbar">
        <select
          className="select-input"
          value={activeMeetingId ?? ''}
          onChange={(e) => (e.target.value ? onLoadMeeting(e.target.value) : onNew())}
        >
          {canWrite && <option value="">+ 새 회의록 작성</option>}
          {meetingsList.map((m) => (
            <option key={m.id} value={m.id}>
              {m.title || '제목 없음'} ({new Date(m.meetingDate).toLocaleDateString('ko-KR')})
            </option>
          ))}
        </select>
        {canWrite && activeMeetingId && (
          <button type="button" className="secondary-button" onClick={() => onDelete(activeMeetingId)}>
            회의록 삭제
          </button>
        )}
      </div>

      <div className="block-label">제목 / 날짜</div>
      <div className="meeting-meta-row">
        <input
          className="text-input meeting-title-input"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="회의 제목"
          disabled={!canWrite}
        />
        <input
          type="date"
          className="text-input"
          value={meetingDate}
          onChange={(e) => onMeetingDateChange(e.target.value)}
          disabled={!canWrite}
        />
      </div>

      <div className="block-label">회의록</div>
      <p className="hint-text">{MARKDOWN_HINT} · 섹션을 자유롭게 나눠서 정리해보세요.</p>
      {blocks.map((block, i) =>
        canWrite ? (
          <MarkdownBlock
            key={`${activeMeetingId ?? 'new'}-${i}`}
            value={block}
            onChange={(e) => onChangeBlock(i, e.target.value)}
            placeholder={'예) ## 안건\n- 논의한 내용을 적어보세요\n- [ ] 결정된 액션 아이템'}
          />
        ) : (
          <div className="markdown-preview" key={`${activeMeetingId ?? 'new'}-${i}`}>
            {renderMarkdown(block)}
          </div>
        )
      )}
      {canWrite && (
        <button type="button" className="add-block-button" onClick={onAddBlock}>
          + 블록 추가
        </button>
      )}

      {canWrite && (
        <div className="action-row">
          <button type="button" className="primary-button" onClick={onSave} disabled={saving}>
            {saving ? '저장 중...' : activeMeetingId ? '회의록 수정 저장' : '회의록 저장'}
          </button>
          <button
            type="button"
            className="secondary-button"
            onClick={onSummarize}
            disabled={!activeMeetingId || summarizing}
          >
            {summarizing ? 'AI 요약 중...' : '✨ AI 요약'}
          </button>
          <button type="button" className="primary-button" onClick={onExtract} disabled={!activeMeetingId || extracting}>
            {extracting ? 'AI 추출 중...' : '✨ AI로 태스크 추출'}
          </button>
          {!activeMeetingId && <span className="hint-text">* 먼저 회의록을 저장해야 AI 기능을 사용할 수 있어요.</span>}
        </div>
      )}

      {summary && (
        <>
          <div className="block-label">AI 요약</div>
          <div className="markdown-preview">{renderMarkdown(summary)}</div>
        </>
      )}

      {canWrite && (
        <>
          <div className="block-label">추출된 태스크</div>
          {extractedTasks.length > 0 && (
            <p className="ai-note">
              {'✨'} AI가 회의록에서 태스크를 정리했어요. 확인 후 승인하면 보드에 추가돼요.
            </p>
          )}
          {extractedTasks.length === 0 ? (
            <p className="placeholder-text">아직 추출된 태스크가 없습니다. 회의록을 저장하고 AI 추출을 실행하세요.</p>
          ) : (
            <div className="extracted-list">
              {extractedTasks.map((item) => {
                const draft = extractedDrafts[item.id] ?? { title: item.title, assigneeId: '', dueDate: '' }
                return (
                  <div className="extracted-item" key={item.id}>
                    <span className="ai-badge">{'✨'} AI</span>
                    <input
                      className="text-input extracted-title-input"
                      value={draft.title}
                      onChange={(e) => onDraftChange(item.id, 'title', e.target.value)}
                    />
                    <select
                      className="select-input"
                      value={draft.assigneeId}
                      onChange={(e) => onDraftChange(item.id, 'assigneeId', e.target.value)}
                    >
                      <option value="">{item.assigneeGuess ? `추정: ${item.assigneeGuess} (미배정)` : '담당자 미배정'}</option>
                      {members.map((m) => (
                        <option key={m.user.id} value={m.user.id}>
                          {m.user.name}
                        </option>
                      ))}
                    </select>
                    <input
                      type="date"
                      className="text-input"
                      value={draft.dueDate}
                      onChange={(e) => onDraftChange(item.id, 'dueDate', e.target.value)}
                    />
                    <div className="extracted-actions">
                      <button type="button" className="approve-button" onClick={() => onApprove(item)}>
                        승인
                      </button>
                      <button type="button" className="reject-button" onClick={() => onReject(item)}>
                        거절
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </>
      )}
    </div>
  )
}
