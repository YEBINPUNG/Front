import ErrorBanner from '../components/ErrorBanner.jsx'
import { chipStyle, NAV_ITEMS } from '../constants/ui.js'

export default function Sidebar({
  projects,
  projectsLoading,
  projectsError,
  currentProjectId,
  onSelectProject,
  showNewProjectInput,
  onToggleNewProjectInput,
  newProjectName,
  onNewProjectNameChange,
  creatingProject,
  onCreateProject,
  activeNav,
  onNavChange,
  user,
  onLogout,
}) {
  return (
    <aside className="sidebar">
      <div className="workspace-header">
        <span className="workspace-icon">{'\u{1F5C2}\u{FE0F}'}</span>
        <span className="workspace-name">회고록쨩</span>
      </div>

      <div className="nav-section-label">프로젝트</div>
      {projectsLoading ? (
        <p className="hint-text sidebar-hint">불러오는 중...</p>
      ) : projects.length > 0 ? (
        <select className="select-input project-select" value={currentProjectId} onChange={(e) => onSelectProject(e.target.value)}>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      ) : (
        <p className="hint-text sidebar-hint">프로젝트가 없습니다.</p>
      )}
      {showNewProjectInput ? (
        <div className="sidebar-new-project">
          <input
            className="text-input"
            autoFocus
            value={newProjectName}
            onChange={(e) => onNewProjectNameChange(e.target.value)}
            placeholder="프로젝트 이름"
            onKeyDown={(e) => e.key === 'Enter' && newProjectName.trim() && onCreateProject(newProjectName.trim())}
          />
          <button
            type="button"
            className="add-block-button"
            disabled={creatingProject || !newProjectName.trim()}
            onClick={() => onCreateProject(newProjectName.trim())}
          >
            추가
          </button>
        </div>
      ) : (
        <button type="button" className="add-page-button nav-item" onClick={onToggleNewProjectInput}>
          <span className="nav-icon-chip nav-icon-plus">{'＋'}</span>
          새 프로젝트
        </button>
      )}
      <ErrorBanner message={projectsError} />

      <div className="nav-section-label">워크스페이스</div>
      <nav>
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`nav-item ${activeNav === item.id ? 'active' : ''}`}
            onClick={() => onNavChange(item.id)}
          >
            <span className="nav-icon-chip" style={chipStyle(item.color)}>
              {item.icon}
            </span>
            {item.label}
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user">
          <span className="sidebar-user-name">{user?.name}</span>
          <span className="sidebar-user-email">{user?.email}</span>
        </div>
        <button type="button" className="icon-button" onClick={onLogout} title="로그아웃" aria-label="로그아웃">
          {'⏻'}
        </button>
      </div>
    </aside>
  )
}
