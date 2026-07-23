import { useCallback, useEffect, useState } from 'react'
import { getDashboard } from '../../api/dashboard.js'

export function useDashboard(projectId) {
  const [dashboard, setDashboard] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const refresh = useCallback(async () => {
    if (!projectId) return
    setLoading(true)
    setError('')
    try {
      const { dashboard } = await getDashboard(projectId)
      setDashboard(dashboard)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [projectId])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- 프로젝트 변경 시 대시보드를 서버와 동기화
    refresh()
  }, [refresh])

  return { dashboard, loading, error, refresh }
}
