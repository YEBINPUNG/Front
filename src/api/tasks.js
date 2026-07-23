import { request, toQueryString } from './client.js'

export const listTasks = (projectId, query = {}) => request(`/projects/${projectId}/tasks${toQueryString(query)}`)
export const createTask = (projectId, input) => request(`/projects/${projectId}/tasks`, { method: 'POST', body: input })
export const getTask = (id) => request(`/tasks/${id}`)
export const updateTask = (id, input) => request(`/tasks/${id}`, { method: 'PATCH', body: input })
export const deleteTask = (id) => request(`/tasks/${id}`, { method: 'DELETE' })
