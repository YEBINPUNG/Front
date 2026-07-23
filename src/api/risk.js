import { request } from './client.js'

export const scanProjectRisks = (projectId) => request(`/projects/${projectId}/risk-scan`, { method: 'POST' })
export const listProjectRisks = (projectId) => request(`/projects/${projectId}/risks`)
export const listTaskRisks = (taskId) => request(`/tasks/${taskId}/risks`)
