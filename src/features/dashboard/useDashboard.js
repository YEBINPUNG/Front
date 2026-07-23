import { useCallback, useEffect, useRef, useState } from 'react'
import { getDashboard } from '../../api/dashboard.js'

export function useDashboard(projectId) {
  const [dashboard, setDashboard] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  // 프로젝트 전환 시 이전 프로젝트의 늦은 응답이 현재 상태를 덮어쓰지 않도록 가드한다.
  const activeProject = useRef(projectId)

  const refresh = useCallback(async () => {
    if (!projectId) return
    activeProject.current = projectId
    setLoading(true)
    setError('')
    try {
      const { dashboard } = await getDashboard(projectId)
      if (activeProject.current !== projectId) return
      setDashboard(dashboard)
    } catch (err) {
      if (activeProject.current !== projectId) return
      setError(err.message)
    } finally {
      if (activeProject.current === projectId) setLoading(false)
    }
  }, [projectId])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- 프로젝트 변경 시 대시보드를 서버와 동기화
    refresh()
  }, [refresh])

  return { dashboard, loading, error, refresh }
}
