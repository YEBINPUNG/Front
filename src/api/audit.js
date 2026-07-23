import { request, toQueryString } from './client.js'

export const listAuditLogs = (projectId, query = {}) =>
  request(`/projects/${projectId}/audit-logs${toQueryString(query)}`)
