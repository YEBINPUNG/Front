import { useCallback, useEffect, useRef, useState } from 'react'
import { listProjectRisks, scanProjectRisks } from '../../api/risk.js'

export function useRisks(projectId, onAfterScan) {
  const [risks, setRisks] = useState([])
  const [loading, setLoading] = useState(false)
  const [scanning, setScanning] = useState(false)
  const [error, setError] = useState('')
  // 프로젝트 전환 시 이전 프로젝트의 늦은 응답이 현재 상태를 덮어쓰지 않도록 가드한다.
  const activeProject = useRef(projectId)

  const refresh = useCallback(async () => {
    if (!projectId) return
    activeProject.current = projectId
    setLoading(true)
    setError('')
    try {
      const { risks } = await listProjectRisks(projectId)
      if (activeProject.current !== projectId) return
      setRisks(risks)
    } catch (err) {
      if (activeProject.current !== projectId) return
      setError(err.message)
    } finally {
      if (activeProject.current === projectId) setLoading(false)
    }
  }, [projectId])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- 프로젝트 변경 시 위험 평가 목록을 서버와 동기화
    refresh()
  }, [refresh])

  const scan = async () => {
    setScanning(true)
    setError('')
    try {
      await scanProjectRisks(projectId)
      await refresh()
      onAfterScan?.()
    } catch (err) {
      setError(err.message)
    } finally {
      setScanning(false)
    }
  }

  return { risks, loading, scanning, error, refresh, scan }
}
