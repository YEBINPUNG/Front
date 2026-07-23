export const NAV_ITEMS = [
  { id: 'dashboard', label: '대시보드', icon: '\u{1F4CA}', color: 'sky' },
  { id: 'meeting', label: '회의록 변환', icon: '\u{1F4DD}', color: 'pink' },
  { id: 'board', label: '업무 보드', icon: '\u{1F4CB}', color: 'mint' },
  { id: 'delay', label: '지연 탐지', icon: '\u{26A0}', color: 'amber' },
  { id: 'settings', label: '프로젝트 설정', icon: '\u{2699}\u{FE0F}', color: 'violet' },
]

export const BOARD_COLUMNS_META = [
  { id: 'todo', status: 'TODO', title: '할 일', color: 'sky' },
  { id: 'in-progress', status: 'IN_PROGRESS', title: '진행 중', color: 'amber' },
  { id: 'done', status: 'DONE', title: '완료', color: 'mint' },
]

export const RISK_LEVEL_LABEL = { HIGH: '높음', MEDIUM: '보통', LOW: '낮음' }

export const RISK_STYLES = {
  낮음: { bg: 'var(--accent-mint-bg)', fg: 'var(--accent-mint)' },
  보통: { bg: 'var(--accent-amber-bg)', fg: 'var(--accent-amber)' },
  높음: { bg: 'var(--accent-pink-bg)', fg: 'var(--accent-pink)' },
}

export const PROJECT_ROLE_LABEL = { OWNER: '오너', MEMBER: '멤버', VIEWER: '뷰어' }

export const MARKDOWN_HINT = '\u{2728} 마크다운 지원 · # 제목 · **굵게** · - 목록 · - [ ] 체크박스 · > 인용'

export function chipStyle(color) {
  return { background: `var(--accent-${color}-bg)`, color: `var(--accent-${color})` }
}
