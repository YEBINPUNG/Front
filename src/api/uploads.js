import { request, toQueryString } from './client.js'

export const presignUpload = (projectId, input) =>
  request(`/projects/${projectId}/uploads/presign`, { method: 'POST', body: input })
export const presignDownload = (projectId, key) =>
  request(`/projects/${projectId}/uploads/download${toQueryString({ key })}`)
