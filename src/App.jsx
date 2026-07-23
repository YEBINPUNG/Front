import { useAuth } from './auth/useAuth.js'
import LoginView from './auth/LoginView.jsx'
import Workspace from './layout/Workspace.jsx'
import './styles/app.css'

function App() {
  const { user, initializing } = useAuth()

  if (initializing) {
    return (
      <div className="auth-shell">
        <p className="hint-text">불러오는 중...</p>
      </div>
    )
  }

  if (!user) {
    return <LoginView />
  }

  return <Workspace />
}

export default App
