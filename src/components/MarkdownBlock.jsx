import { useEffect, useRef, useState } from 'react'
import { renderMarkdown } from '../lib/markdown.jsx'

export default function MarkdownBlock({ value, onChange, placeholder, className = '' }) {
  const [editing, setEditing] = useState(!value)
  const ref = useRef(null)

  useEffect(() => {
    if (editing && ref.current) {
      ref.current.style.height = 'auto'
      ref.current.style.height = `${ref.current.scrollHeight}px`
    }
  }, [editing, value])

  if (editing) {
    return (
      <textarea
        ref={ref}
        rows={1}
        autoFocus
        className={`auto-textarea markdown-edit ${className}`}
        value={value}
        onChange={onChange}
        onBlur={() => setEditing(false)}
        placeholder={placeholder}
      />
    )
  }

  return (
    <div
      className={`markdown-preview ${className} ${value ? '' : 'is-empty'}`}
      role="textbox"
      tabIndex={0}
      onClick={() => setEditing(true)}
      onFocus={() => setEditing(true)}
    >
      {value ? renderMarkdown(value) : <span className="placeholder-text-inline">{placeholder}</span>}
    </div>
  )
}
