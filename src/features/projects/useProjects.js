import { useCallback, useEffect, useState } from 'react'
import { createProject as createProjectApi, getProject, listProjects } from '../../api/projects.js'

export function useProjects() {
  const [projects, setProjects] = useState([])
  const [projectsLoading, setProjectsLoading] = useState(true)
  const [projectsError, setProjectsError] = useState('')
  const [currentProjectId, setCurrentProjectId] = useState('')
  const [currentProject, setCurrentProject] = useState(null)
  const [creatingProject, setCreatingProject] = useState(false)

  const refreshProjects = useCallback(async () => {
    setProjectsLoading(true)
    setProjectsError('')
    try {
      const { projects } = await listProjects()
      setProjects(projects)
      setCurrentProjectId((prev) => prev || projects[0]?.id || '')
    } catch (err) {
      setProjectsError(err.message)
    } finally {
      setProjectsLoading(false)
    }
  }, [])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- 마운트 시 프로젝트 목록을 서버와 동기화
    refreshProjects()
  }, [refreshProjects])

  const refreshCurrentProject = useCallback(async () => {
    if (!currentProjectId) {
      setCurrentProject(null)
      return
    }
    try {
      const { project } = await getProject(currentProjectId)
      setCurrentProject(project)
    } catch (err) {
      setProjectsError(err.message)
    }
  }, [currentProjectId])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- 선택된 프로젝트가 바뀌면 상세(멤버 포함)를 다시 불러옴
    refreshCurrentProject()
  }, [refreshCurrentProject])

  const createProject = async (name) => {
    setCreatingProject(true)
    setProjectsError('')
    try {
      const { project } = await createProjectApi({ name })
      setProjects((prev) => [project, ...prev])
      setCurrentProjectId(project.id)
      return project
    } catch (err) {
      setProjectsError(err.message)
      throw err
    } finally {
      setCreatingProject(false)
    }
  }

  return {
    projects,
    projectsLoading,
    projectsError,
    currentProjectId,
    setCurrentProjectId,
    currentProject,
    refreshCurrentProject,
    creatingProject,
    createProject,
  }
}
