import { useState } from 'react'
import ErrorBanner from '../../components/ErrorBanner.jsx'
import { chipStyle } from '../../constants/ui.js'

export default function CreateProjectPrompt({ onCreate, busy, error }) {
  const [name, setName] = useState('')
  return (
    <div className="notion-page">
      <div className="page-header">
        <div className="page-icon-circle" style={chipStyle('violet')}>
          {'\u{1F5C2}\u{FE0F}'}
        </div>
        <h1 className="page-title">첫 프로젝트를 만들어보세요</h1>
        <p className="page-description">
          아직 소속된 프로젝트가 없어요. 프로젝트를 만들면 회의록/보드/지연 탐지를 바로 사용할 수 있어요.
        </p>
      </div>
      <ErrorBanner message={error} />
      <div className="action-row">
        <input
          className="text-input"
          style={{ minWidth: 260 }}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="프로젝트 이름"
          onKeyDown={(e) => e.key === 'Enter' && name.trim() && onCreate(name.trim())}
        />
        <button
          type="button"
          className="primary-button"
          disabled={busy || !name.trim()}
          onClick={() => onCreate(name.trim())}
        >
          {busy ? '생성 중...' : '프로젝트 만들기'}
        </button>
      </div>
    </div>
  )
}
