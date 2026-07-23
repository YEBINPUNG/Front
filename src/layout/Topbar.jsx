import { PROJECT_ROLE_LABEL } from '../constants/ui.js'

export default function Topbar({ projectName, currentLabel, userName, myRole }) {
  return (
    <header className="topbar">
      <div className="breadcrumb">
        <span>{projectName ?? '회고록쨩'}</span>
        <span className="breadcrumb-sep">/</span>
        <span>{currentLabel}</span>
      </div>
      <div className="topbar-actions">
        <span className="topbar-meta">
          {userName}님{myRole ? ` · ${PROJECT_ROLE_LABEL[myRole] ?? myRole}` : ''}
        </span>
      </div>
    </header>
  )
}
