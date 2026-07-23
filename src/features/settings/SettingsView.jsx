import { useState } from 'react'
import ErrorBanner from '../../components/ErrorBanner.jsx'
import PageHeader from '../../components/PageHeader.jsx'
import { formatDateTime } from '../../lib/date.js'
import { PROJECT_ROLE_LABEL } from '../../constants/ui.js'
import UploadsPanel from '../uploads/UploadsPanel.jsx'

function InviteForm({ onInvite, busy }) {
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('MEMBER')

  return (
    <div className="action-row">
      <input
        className="text-input"
        style={{ minWidth: 220 }}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="초대할 이메일"
      />
      <select className="select-input" value={role} onChange={(e) => setRole(e.target.value)}>
        <option value="MEMBER">멤버</option>
        <option value="VIEWER">뷰어</option>
      </select>
      <button
        type="button"
        className="primary-button"
        disabled={busy || !email.trim()}
        onClick={async () => {
          await onInvite(email.trim(), role)
          setEmail('')
        }}
      >
        초대
      </button>
    </div>
  )
}

export default function SettingsView({
  description,
  project,
  myRole,
  currentUserId,
  members,
  membersBusy,
  membersError,
  onInviteMember,
  onChangeMemberRole,
  onRemoveMember,
  auditLogs,
  auditLoading,
  auditError,
  uploads,
}) {
  const isOwner = myRole === 'OWNER'
  const canUpload = myRole === 'OWNER' || myRole === 'MEMBER'

  return (
    <div className="notion-page notion-page-wide">
      <PageHeader
        icon={'\u{2699}\u{FE0F}'}
        color="violet"
        title="프로젝트 설정"
        description={description}
      />

      <div className="settings-section">
        <h3>멤버 ({members.length})</h3>
        <ErrorBanner message={membersError} />
        <table className="member-table">
          <thead>
            <tr>
              <th>이름</th>
              <th>이메일</th>
              <th>역할</th>
              {isOwner && <th></th>}
            </tr>
          </thead>
          <tbody>
            {members.map((m) => (
              <tr key={m.user.id}>
                <td>{m.user.name}</td>
                <td>{m.user.email}</td>
                <td>
                  {isOwner ? (
                    <select
                      className="select-input"
                      value={m.role}
                      onChange={(e) => onChangeMemberRole(m.user.id, e.target.value)}
                    >
                      <option value="OWNER">오너</option>
                      <option value="MEMBER">멤버</option>
                      <option value="VIEWER">뷰어</option>
                    </select>
                  ) : (
                    PROJECT_ROLE_LABEL[m.role] ?? m.role
                  )}
                </td>
                {isOwner && (
                  <td>
                    {m.user.id !== currentUserId && (
                      <button type="button" className="reject-button" onClick={() => onRemoveMember(m.user.id)}>
                        제외
                      </button>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
        {isOwner ? (
          <InviteForm onInvite={onInviteMember} busy={membersBusy} />
        ) : (
          <p className="hint-text">멤버 초대/역할 변경은 오너만 가능해요.</p>
        )}
      </div>

      <div className="settings-section">
        {canUpload ? (
          <UploadsPanel
            uploading={uploads.uploading}
            error={uploads.error}
            uploadedFiles={uploads.uploadedFiles}
            onUpload={uploads.upload}
            onGetDownloadLink={uploads.getDownloadLink}
          />
        ) : (
          <p className="hint-text">파일 업로드는 멤버 이상만 가능해요. (다운로드 키 발급은 뷰어도 가능)</p>
        )}
      </div>

      {isOwner && (
        <div className="settings-section">
          <h3>감사 로그</h3>
          <p className="hint-text">이 프로젝트에서 일어난 변경 이력이에요 (오너만 볼 수 있어요).</p>
          <ErrorBanner message={auditError} />
          {auditLoading && <p className="hint-text">불러오는 중...</p>}
          {!auditLoading && auditLogs.length === 0 ? (
            <p className="placeholder-text">아직 기록된 로그가 없습니다.</p>
          ) : (
            <ul className="audit-list">
              {auditLogs.map((log) => (
                <li key={log.id}>
                  <span className="audit-action">{log.action}</span>
                  <span className="audit-actor">{log.actor?.name ?? log.actor?.id}</span>
                  <span className="audit-target hint-text">{log.target}</span>
                  <span className="hint-text">{formatDateTime(log.createdAt)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {project?.dueDate && (
        <p className="hint-text">프로젝트 마감일: {formatDateTime(project.dueDate)}</p>
      )}
    </div>
  )
}
