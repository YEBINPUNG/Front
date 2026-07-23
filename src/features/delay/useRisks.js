import { useCallback, useEffect, useState } from 'react'
import { listProjectRisks, scanProjectRisks } from '../../api/risk.js'

export function useRisks(projectId, onAfterScan) {
  const [risks, setRisks] = useState([])
  const [loading, setLoading] = useState(false)
  const [scanning, setScanning] = useState(false)
  const [error, setError] = useState('')

  const refresh = useCallback(async () => {
    if (!projectId) return
    setLoading(true)
    setError('')
    try {
      const { risks } = await listProjectRisks(projectId)
      setRisks(risks)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
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
