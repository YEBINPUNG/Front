import { useCallback, useEffect, useState } from 'react'
import { listAuditLogs } from '../../api/audit.js'

export function useAuditLogs(projectId, enabled) {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const refresh = useCallback(async () => {
    if (!projectId || !enabled) return
    setLoading(true)
    setError('')
    try {
      const { logs } = await listAuditLogs(projectId, { limit: 50 })
      setLogs(logs)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [projectId, enabled])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- 프로젝트 변경 시 감사 로그를 서버와 동기화 (OWNER 전용)
    refresh()
  }, [refresh])

  return { logs, loading, error, refresh }
}
