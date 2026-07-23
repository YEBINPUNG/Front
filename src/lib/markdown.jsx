function renderInline(text, keyPrefix) {
  const pattern = /(\*\*.+?\*\*|`.+?`|\*.+?\*)/
  const nodes = []
  let remaining = text
  let key = 0

  while (remaining.length > 0) {
    const match = remaining.match(pattern)
    if (!match) {
      nodes.push(remaining)
      break
    }
    const idx = match.index
    if (idx > 0) nodes.push(remaining.slice(0, idx))
    const token = match[0]
    if (token.startsWith('**')) {
      nodes.push(<strong key={`${keyPrefix}-b-${key++}`}>{token.slice(2, -2)}</strong>)
    } else if (token.startsWith('`')) {
      nodes.push(<code key={`${keyPrefix}-c-${key++}`}>{token.slice(1, -1)}</code>)
    } else {
      nodes.push(<em key={`${keyPrefix}-i-${key++}`}>{token.slice(1, -1)}</em>)
    }
    remaining = remaining.slice(idx + token.length)
  }

  return nodes
}

export function renderMarkdown(text) {
  const lines = text.split('\n')

  return lines.map((line, i) => {
    const key = `l-${i}`

    if (/^###\s+/.test(line)) {
      return (
        <h4 className="md-h3" key={key}>
          {renderInline(line.replace(/^###\s+/, ''), key)}
        </h4>
      )
    }
    if (/^##\s+/.test(line)) {
      return (
        <h3 className="md-h2" key={key}>
          {renderInline(line.replace(/^##\s+/, ''), key)}
        </h3>
      )
    }
    if (/^#\s+/.test(line)) {
      return (
        <h2 className="md-h1" key={key}>
          {renderInline(line.replace(/^#\s+/, ''), key)}
        </h2>
      )
    }
    if (/^\s*---+\s*$/.test(line)) {
      return <hr className="md-hr" key={key} />
    }
    if (/^>\s?/.test(line)) {
      return (
        <blockquote className="md-quote" key={key}>
          {renderInline(line.replace(/^>\s?/, ''), key)}
        </blockquote>
      )
    }
    const checkMatch = line.match(/^\s*[-*]\s+\[( |x|X)\]\s+(.*)/)
    if (checkMatch) {
      const checked = checkMatch[1].toLowerCase() === 'x'
      return (
        <div className="md-checkbox" key={key}>
          <span className={`md-checkbox-box ${checked ? 'checked' : ''}`}>
            {checked ? '✓' : ''}
          </span>
          <span className={checked ? 'md-checked-text' : ''}>
            {renderInline(checkMatch[2], key)}
          </span>
        </div>
      )
    }
    const bulletMatch = line.match(/^\s*[-*]\s+(.*)/)
    if (bulletMatch) {
      return (
        <div className="md-bullet" key={key}>
          <span className="md-bullet-dot">{'•'}</span>
          <span>{renderInline(bulletMatch[1], key)}</span>
        </div>
      )
    }
    if (line.trim() === '') {
      return <div className="md-empty-line" key={key} />
    }
    return (
      <p className="md-p" key={key}>
        {renderInline(line, key)}
      </p>
    )
  })
}
