export function toDateInputValue(value) {
  if (!value) return ''
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return ''
  return d.toISOString().slice(0, 10)
}

export function todayInputValue() {
  return new Date().toISOString().slice(0, 10)
}

export function formatDateTime(value) {
  if (!value) return ''
  return new Date(value).toLocaleString('ko-KR')
}
