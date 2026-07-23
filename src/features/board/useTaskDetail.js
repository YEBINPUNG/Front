import { useCallback, useEffect, useState } from 'react'
import { getTask } from '../../api/tasks.js'

export function useTaskDetail(taskId) {
  const [task, setTask] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const refresh = useCallback(async () => {
    if (!taskId) {
      setTask(null)
      return
    }
    setLoading(true)
    setError('')
    try {
      const { task } = await getTask(taskId)
      setTask(task)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [taskId])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- 선택된 태스크가 바뀔 때 상세(이력/위험도)를 불러옴
    refresh()
  }, [refresh])

  return { task, loading, error, refresh }
}
