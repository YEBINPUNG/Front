import { useState } from 'react'
import { useAuth } from './useAuth.js'

const DEMO_ACCOUNTS = [
  { email: 'owner@demo.com', role: 'OWNER' },
  { email: 'member@demo.com', role: 'MEMBER' },
  { email: 'viewer@demo.com', role: 'VIEWER' },
]

export default function LoginView() {
  const { login, signup } = useAuth()
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({ email: '', password: '', name: '' })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const updateField = (field, value) => setForm((prev) => ({ ...prev, [field]: value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      if (mode === 'login') {
        await login({ email: form.email, password: form.password })
      } else {
        await signup({ email: form.email, password: form.password, name: form.name })
      }
    } catch (err) {
      setError(err.message ?? '요청 처리 중 오류가 발생했습니다.')
    } finally {
      setSubmitting(false)
    }
  }

  const fillDemo = (email) => {
    setMode('login')
    setForm({ email, password: 'Demo1234!', name: '' })
    setError('')
  }

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <div className="auth-logo">{'\u{1F5C2}\u{FE0F}'} 회고록쨩</div>
        <h1 className="auth-title">{mode === 'login' ? '로그인' : '회원가입'}</h1>

        <form className="auth-form" onSubmit={handleSubmit}>
          {mode === 'signup' && (
            <label className="auth-field">
              <span>이름</span>
              <input
                type="text"
                value={form.name}
                onChange={(e) => updateField('name', e.target.value)}
                required
                autoComplete="name"
              />
            </label>
          )}
          <label className="auth-field">
            <span>이메일</span>
            <input
              type="email"
              value={form.email}
              onChange={(e) => updateField('email', e.target.value)}
              required
              autoComplete="email"
            />
          </label>
          <label className="auth-field">
            <span>비밀번호</span>
            <input
              type="password"
              value={form.password}
              onChange={(e) => updateField('password', e.target.value)}
              required
              minLength={8}
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            />
          </label>

          {error && <p className="auth-error">{error}</p>}

          <button type="submit" className="primary-button auth-submit" disabled={submitting}>
            {submitting ? '처리 중...' : mode === 'login' ? '로그인' : '회원가입'}
          </button>
        </form>

        <button
          type="button"
          className="auth-switch"
          onClick={() => {
            setMode((m) => (m === 'login' ? 'signup' : 'login'))
            setError('')
          }}
        >
          {mode === 'login' ? '계정이 없으신가요? 회원가입' : '이미 계정이 있으신가요? 로그인'}
        </button>

        <div className="auth-demo">
          <div className="auth-demo-label">데모 계정으로 빠르게 둘러보기</div>
          <div className="auth-demo-buttons">
            {DEMO_ACCOUNTS.map((acc) => (
              <button type="button" key={acc.email} onClick={() => fillDemo(acc.email)}>
                {acc.role}
              </button>
            ))}
          </div>
          <p className="hint-text">공통 비밀번호: Demo1234!</p>
        </div>
      </div>
    </div>
  )
}
