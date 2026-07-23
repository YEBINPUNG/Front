import { useState } from 'react'
import { presignDownload, presignUpload } from '../../api/uploads.js'

const ALLOWED_CONTENT_TYPES = [
  'image/png',
  'image/jpeg',
  'image/gif',
  'image/webp',
  'application/pdf',
  'text/plain',
  'text/markdown',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
]

export function useUploads(projectId) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [uploadedFiles, setUploadedFiles] = useState([])

  const upload = async (file) => {
    setError('')
    if (!ALLOWED_CONTENT_TYPES.includes(file.type)) {
      setError(`허용되지 않는 파일 형식이에요 (${file.type || '알 수 없음'}).`)
      return
    }
    setUploading(true)
    try {
      const { uploadUrl, key } = await presignUpload(projectId, { fileName: file.name, contentType: file.type })
      const putRes = await fetch(uploadUrl, {
        method: 'PUT',
        headers: { 'Content-Type': file.type },
        body: file,
      })
      if (!putRes.ok) {
        throw new Error(`S3 업로드 실패 (HTTP ${putRes.status})`)
      }
      setUploadedFiles((prev) => [{ key, fileName: file.name }, ...prev])
    } catch (err) {
      setError(err.message)
    } finally {
      setUploading(false)
    }
  }

  const getDownloadLink = async (key) => {
    setError('')
    try {
      const { downloadUrl } = await presignDownload(projectId, key)
      return downloadUrl
    } catch (err) {
      setError(err.message)
      return null
    }
  }

  return { uploading, error, uploadedFiles, upload, getDownloadLink }
}
