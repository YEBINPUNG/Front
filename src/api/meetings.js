import { request } from './client.js'

export const listMeetings = (projectId) => request(`/projects/${projectId}/meetings`)
export const createMeeting = (projectId, input) =>
  request(`/projects/${projectId}/meetings`, { method: 'POST', body: input })
export const getMeeting = (id) => request(`/meetings/${id}`)
export const updateMeeting = (id, input) => request(`/meetings/${id}`, { method: 'PATCH', body: input })
export const deleteMeeting = (id) => request(`/meetings/${id}`, { method: 'DELETE' })
export const summarizeMeeting = (id) => request(`/meetings/${id}/summarize`, { method: 'POST' })
export const extractTasks = (id) => request(`/meetings/${id}/extract-tasks`, { method: 'POST' })

export const approveExtractedTask = (id, input) =>
  request(`/extracted-tasks/${id}/approve`, { method: 'POST', body: input ?? {} })
export const rejectExtractedTask = (id) => request(`/extracted-tasks/${id}/reject`, { method: 'POST' })
