import { request } from './client.js'

export const listProjects = () => request('/projects')
export const createProject = (input) => request('/projects', { method: 'POST', body: input })
export const getProject = (id) => request(`/projects/${id}`)
export const updateProject = (id, input) => request(`/projects/${id}`, { method: 'PATCH', body: input })
export const deleteProject = (id) => request(`/projects/${id}`, { method: 'DELETE' })

export const inviteMember = (id, input) => request(`/projects/${id}/members`, { method: 'POST', body: input })
export const updateMemberRole = (id, userId, role) =>
  request(`/projects/${id}/members/${userId}`, { method: 'PATCH', body: { role } })
export const removeMember = (id, userId) => request(`/projects/${id}/members/${userId}`, { method: 'DELETE' })
