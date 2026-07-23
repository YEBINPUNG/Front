import { useCallback, useEffect, useRef, useState } from 'react'
import { listAuditLogs } from '../../api/audit.js'

export function useAuditLogs(projectId, enabled) {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  // 프로젝트 전환 시 이전 프로젝트의 늦은 응답이 현재 상태를 덮어쓰지 않도록 가드한다.
  const activeProject = useRef(projectId)

  const refresh = useCallback(async () => {
    if (!projectId || !enabled) return
    activeProject.current = projectId
    setLoading(true)
    setError('')
    try {
      const { logs } = await listAuditLogs(projectId, { limit: 50 })
      if (activeProject.current !== projectId) return
      setLogs(logs)
    } catch (err) {
      if (activeProject.current !== projectId) return
      setError(err.message)
    } finally {
      if (activeProject.current === projectId) setLoading(false)
    }
  }, [projectId, enabled])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- 프로젝트 변경 시 감사 로그를 서버와 동기화 (OWNER 전용)
    refresh()
  }, [refresh])

  return { logs, loading, error, refresh }
}
