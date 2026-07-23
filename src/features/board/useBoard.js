import { useCallback, useEffect, useRef, useState } from 'react'
import { createTask, deleteTask, listTasks, updateTask } from '../../api/tasks.js'
import { BOARD_COLUMNS_META } from '../../constants/ui.js'

export function useBoard(projectId) {
  const [tasks, setTasks] = useState([])
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
      const { tasks } = await listTasks(projectId)
      if (activeProject.current !== projectId) return
      setTasks(tasks)
    } catch (err) {
      if (activeProject.current !== projectId) return
      setError(err.message)
    } finally {
      if (activeProject.current === projectId) setLoading(false)
    }
  }, [projectId])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- 프로젝트 변경 시 태스크 목록을 서버와 동기화
    refresh()
  }, [refresh])

  const columns = BOARD_COLUMNS_META.map((meta) => ({
    ...meta,
    tasks: tasks.filter((t) => t.status === meta.status),
  }))

  const addTask = async (status) => {
    setError('')
    try {
      await createTask(projectId, { title: '새 태스크', status })
      refresh()
    } catch (err) {
      setError(err.message)
    }
  }

  const patchTask = async (taskId, patch) => {
    setError('')
    try {
      await updateTask(taskId, patch)
      refresh()
    } catch (err) {
      setError(err.message)
    }
  }

  const removeTask = async (taskId) => {
    setError('')
    try {
      await deleteTask(taskId)
      refresh()
    } catch (err) {
      setError(err.message)
    }
  }

  return { tasks, columns, loading, error, refresh, addTask, patchTask, removeTask }
}
