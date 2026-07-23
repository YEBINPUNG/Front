import { useRef, useState } from 'react'
import ErrorBanner from '../../components/ErrorBanner.jsx'

export default function UploadsPanel({ uploading, error, uploadedFiles, onUpload, onGetDownloadLink }) {
  const fileInputRef = useRef(null)
  const [manualKey, setManualKey] = useState('')
  const [downloadLink, setDownloadLink] = useState('')

  return (
    <div className="settings-section">
      <h3>파일 업로드</h3>
      <p className="hint-text">
        S3 presigned URL을 이용한 업로드/다운로드 유틸리티예요. 백엔드에 파일-엔티티 연결 모델이 아직 없어서,
        회의록/태스크에 자동으로 붙지는 않고 key만 발급됩니다.
      </p>

      <ErrorBanner message={error} />

      <div className="action-row">
        <input
          ref={fileInputRef}
          type="file"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) onUpload(file)
            e.target.value = ''
          }}
        />
        {uploading && <span className="hint-text">업로드 중...</span>}
      </div>

      {uploadedFiles.length > 0 && (
        <ul className="simple-list">
          {uploadedFiles.map((f) => (
            <li key={f.key}>
              {f.fileName} — <code>{f.key}</code>
            </li>
          ))}
        </ul>
      )}

      <div className="block-label">키로 다운로드 링크 발급</div>
      <div className="action-row">
        <input
          className="text-input"
          style={{ minWidth: 280 }}
          value={manualKey}
          onChange={(e) => setManualKey(e.target.value)}
          placeholder="uploads/xxxxx-파일명"
        />
        <button
          type="button"
          className="secondary-button"
          disabled={!manualKey.trim()}
          onClick={async () => {
            const url = await onGetDownloadLink(manualKey.trim())
            setDownloadLink(url ?? '')
          }}
        >
          링크 발급
        </button>
      </div>
      {downloadLink && (
        <p className="hint-text">
          <a href={downloadLink} target="_blank" rel="noreferrer">
            {downloadLink}
          </a>{' '}
          (5분간 유효)
        </p>
      )}
    </div>
  )
}
