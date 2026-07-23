// 로컬 시간대 기준 YYYY-MM-DD (toISOString은 UTC라 KST 자정 근처에서 하루가 밀릴 수 있음)
function toLocalYmd(d) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function toDateInputValue(value) {
  if (!value) return ''
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return ''
  return toLocalYmd(d)
}

export function todayInputValue() {
  return toLocalYmd(new Date())
}

export function formatDateTime(value) {
  if (!value) return ''
  return new Date(value).toLocaleString('ko-KR')
}

export function formatDate(value) {
  if (!value) return ''
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return ''
  return `${d.getMonth() + 1}월 ${d.getDate()}일`
}

// 마감일을 상대 표현 배지로 변환한다. tone은 chipStyle 색상 키(pink/amber/sky).
export function dueBadge(value) {
  if (!value) return null
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return null
  const startOfToday = new Date()
  startOfToday.setHours(0, 0, 0, 0)
  const due = new Date(d)
  due.setHours(0, 0, 0, 0)
  const diff = Math.round((due.getTime() - startOfToday.getTime()) / 86400000)
  if (diff < 0) return { text: `${Math.abs(diff)}일 지남`, tone: 'pink' }
  if (diff === 0) return { text: '오늘 마감', tone: 'amber' }
  if (diff <= 3) return { text: `D-${diff}`, tone: 'amber' }
  return { text: `D-${diff}`, tone: 'sky' }
}
