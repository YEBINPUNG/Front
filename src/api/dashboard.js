import { request } from './client.js'

export const getDashboard = (projectId) => request(`/projects/${projectId}/dashboard`)
