import { useState } from 'react'
import { useAuth } from '../auth/useAuth.js'
import { NAV_ITEMS } from '../constants/ui.js'
import { useProjects } from '../features/projects/useProjects.js'
import CreateProjectPrompt from '../features/projects/CreateProjectPrompt.jsx'
import { useDashboard } from '../features/dashboard/useDashboard.js'
import DashboardView from '../features/dashboard/DashboardView.jsx'
import { useMeetings } from '../features/meetings/useMeetings.js'
import MeetingView from '../features/meetings/MeetingView.jsx'
import { useBoard } from '../features/board/useBoard.js'
import { useTaskDetail } from '../features/board/useTaskDetail.js'
import BoardView from '../features/board/BoardView.jsx'
import TaskDetailPanel from '../features/board/TaskDetailPanel.jsx'
import { useRisks } from '../features/delay/useRisks.js'
import DelayView from '../features/delay/DelayView.jsx'
import { useMembers } from '../features/settings/useMembers.js'
import { useAuditLogs } from '../features/settings/useAuditLogs.js'
import SettingsView from '../features/settings/SettingsView.jsx'
import { useUploads } from '../features/uploads/useUploads.js'
import Sidebar from './Sidebar.jsx'
import Topbar from './Topbar.jsx'

const DESCRIPTIONS = {
  dashboard: '팀 프로젝트의 진행 상황을 한눈에 확인하세요.',
  meeting: '회의록을 붙여넣으면 AI가 할 일 · 마감일 · 담당자를 정리해줘요.',
  board: '태스크별 담당자, 마감일, 진행 상태를 관리하는 보드예요.',
  delay: 'AI가 진척 패턴을 분석해 지연 위험과 근거를 알려줘요.',
  settings: '멤버, 감사 로그, 파일 업로드를 관리해요.',
}

export default function Workspace() {
  const { user, logout } = useAuth()

  const [activeNav, setActiveNav] = useState('dashboard')
  const [showNewProjectInput, setShowNewProjectInput] = useState(false)
  const [newProjectName, setNewProjectName] = useState('')
  const [selectedTaskId, setSelectedTaskId] = useState(null)

  const {
    projects,
    projectsLoading,
    projectsError,
    currentProjectId,
    setCurrentProjectId,
    currentProject,
    refreshCurrentProject,
    creatingProject,
    createProject,
  } = useProjects()

  const members = currentProject?.members ?? []
  const myMembership = members.find((m) => m.user.id === user?.id)
  const myRole = myMembership?.role ?? null

  const dashboard = useDashboard(currentProjectId)
  const board = useBoard(currentProjectId)
  const risks = useRisks(currentProjectId, dashboard.refresh)
  const meetings = useMeetings(currentProjectId, members, () => {
    board.refresh()
    dashboard.refresh()
  })
  const membersActions = useMembers(currentProjectId, refreshCurrentProject)
  const auditLogs = useAuditLogs(currentProjectId, myRole === 'OWNER')
  const uploads = useUploads(currentProjectId)
  const taskDetail = useTaskDetail(selectedTaskId)

  const handleCreateProject = async (name) => {
    try {
      await createProject(name)
      setNewProjectName('')
      setShowNewProjectInput(false)
    } catch {
      // 에러는 useProjects의 projectsError로 이미 노출됨
    }
  }

  const handleDeleteTask = async (taskId) => {
    await board.removeTask(taskId)
    dashboard.refresh()
  }

  const activeNavItem = NAV_ITEMS.find((n) => n.id === activeNav)
  const currentLabel = activeNavItem?.label ?? ''

  return (
    <div className="app-shell">
      <Sidebar
        projects={projects}
        projectsLoading={projectsLoading}
        projectsError={projectsError}
        currentProjectId={currentProjectId}
        onSelectProject={setCurrentProjectId}
        showNewProjectInput={showNewProjectInput}
        onToggleNewProjectInput={() => setShowNewProjectInput(true)}
        newProjectName={newProjectName}
        onNewProjectNameChange={setNewProjectName}
        creatingProject={creatingProject}
        onCreateProject={handleCreateProject}
        activeNav={activeNav}
        onNavChange={setActiveNav}
        user={user}
        onLogout={logout}
      />

      <div className="main-area">
        <Topbar projectName={currentProject?.name} currentLabel={currentLabel} userName={user?.name} myRole={myRole} />
        <main className="content">
          {!projectsLoading && projects.length === 0 ? (
            <CreateProjectPrompt onCreate={handleCreateProject} busy={creatingProject} error={projectsError} />
          ) : (
            <>
              {activeNav === 'dashboard' && (
                <DashboardView
                  description={DESCRIPTIONS.dashboard}
                  dashboard={dashboard.dashboard}
                  loading={dashboard.loading}
                  error={dashboard.error}
                  memberCount={members.length}
                  onOpenDelay={() => setActiveNav('delay')}
                />
              )}
              {activeNav === 'meeting' && (
                <MeetingView
                  description={DESCRIPTIONS.meeting}
                  meetingsList={meetings.meetingsList}
                  activeMeetingId={meetings.activeMeetingId}
                  title={meetings.title}
                  onTitleChange={meetings.setTitle}
                  meetingDate={meetings.meetingDate}
                  onMeetingDateChange={meetings.setMeetingDate}
                  blocks={meetings.blocks}
                  onChangeBlock={meetings.changeBlock}
                  onAddBlock={meetings.addBlock}
                  onSave={meetings.save}
                  onNew={meetings.startNew}
                  onLoadMeeting={meetings.load}
                  onDelete={meetings.remove}
                  saving={meetings.saving}
                  summary={meetings.summary}
                  onSummarize={meetings.summarize}
                  summarizing={meetings.summarizing}
                  extractedTasks={meetings.extractedTasks}
                  extractedDrafts={meetings.extractedDrafts}
                  onDraftChange={meetings.updateDraft}
                  members={members}
                  onExtract={meetings.extract}
                  extracting={meetings.extracting}
                  onApprove={meetings.approve}
                  onReject={meetings.reject}
                  error={meetings.error}
                  canWrite={myRole === 'OWNER' || myRole === 'MEMBER'}
                />
              )}
              {activeNav === 'board' && (
                <BoardView
                  description={DESCRIPTIONS.board}
                  columns={board.columns}
                  members={members}
                  myRole={myRole}
                  currentUserId={user?.id}
                  loading={board.loading}
                  error={board.error}
                  onAddTask={board.addTask}
                  onUpdateTask={board.patchTask}
                  onDeleteTask={handleDeleteTask}
                  onOpenDetail={setSelectedTaskId}
                />
              )}
              {activeNav === 'delay' && (
                <DelayView
                  description={DESCRIPTIONS.delay}
                  risks={risks.risks}
                  loading={risks.loading}
                  error={risks.error}
                  onScan={risks.scan}
                  scanning={risks.scanning}
                  canScan={myRole === 'OWNER' || myRole === 'MEMBER'}
                />
              )}
              {activeNav === 'settings' && (
                <SettingsView
                  description={DESCRIPTIONS.settings}
                  project={currentProject}
                  myRole={myRole}
                  currentUserId={user?.id}
                  members={members}
                  membersBusy={membersActions.busy}
                  membersError={membersActions.error}
                  onInviteMember={membersActions.invite}
                  onChangeMemberRole={membersActions.changeRole}
                  onRemoveMember={membersActions.remove}
                  auditLogs={auditLogs.logs}
                  auditLoading={auditLogs.loading}
                  auditError={auditLogs.error}
                  uploads={uploads}
                />
              )}
            </>
          )}
        </main>
      </div>

      {selectedTaskId && (
        <TaskDetailPanel
          task={taskDetail.task}
          members={members}
          loading={taskDetail.loading}
          error={taskDetail.error}
          onClose={() => setSelectedTaskId(null)}
        />
      )}
    </div>
  )
}
