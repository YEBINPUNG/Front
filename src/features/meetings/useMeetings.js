import { useCallback, useEffect, useState } from 'react'
import {
  approveExtractedTask,
  createMeeting,
  deleteMeeting,
  extractTasks as extractTasksApi,
  getMeeting,
  listMeetings,
  rejectExtractedTask,
  summarizeMeeting,
  updateMeeting,
} from '../../api/meetings.js'
import { toDateInputValue, todayInputValue } from '../../lib/date.js'

export function useMeetings(projectId, members, onTaskApproved) {
  const [meetingsList, setMeetingsList] = useState([])
  const [activeMeetingId, setActiveMeetingId] = useState(null)
  const [title, setTitle] = useState('')
  const [meetingDate, setMeetingDate] = useState(todayInputValue())
  const [blocks, setBlocks] = useState([''])
  const [summary, setSummary] = useState('')
  const [saving, setSaving] = useState(false)
  const [summarizing, setSummarizing] = useState(false)
  const [extracting, setExtracting] = useState(false)
  const [error, setError] = useState('')
  const [extractedTasks, setExtractedTasks] = useState([])
  const [extractedDrafts, setExtractedDrafts] = useState({})

  const resetDraft = useCallback(() => {
    setActiveMeetingId(null)
    setTitle('')
    setMeetingDate(todayInputValue())
    setBlocks([''])
    setSummary('')
    setExtractedTasks([])
    setExtractedDrafts({})
    setError('')
  }, [])

  const refreshList = useCallback(async () => {
    if (!projectId) return
    try {
      const { meetings } = await listMeetings(projectId)
      setMeetingsList(meetings)
    } catch (err) {
      setError(err.message)
    }
  }, [projectId])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- 프로젝트 변경 시 회의록 작성 폼 초기화 + 목록 동기화
    resetDraft()
    refreshList()
  }, [projectId, resetDraft, refreshList])

  const changeBlock = (index, value) =>
    setBlocks((prev) => {
      const next = [...prev]
      next[index] = value
      return next
    })

  const addBlock = () => setBlocks((prev) => [...prev, ''])

  const load = async (id) => {
    setError('')
    try {
      const { meeting } = await getMeeting(id)
      setActiveMeetingId(meeting.id)
      setTitle(meeting.title)
      setMeetingDate(toDateInputValue(meeting.meetingDate))
      setBlocks([meeting.rawContent])
      setSummary(meeting.summary ?? '')
      setExtractedTasks((meeting.extracted ?? []).filter((t) => t.status === 'PENDING'))
    } catch (err) {
      setError(err.message)
    }
  }

  const save = async () => {
    const rawContent = blocks.join('\n\n').trim()
    if (!title.trim() || !rawContent) {
      setError('제목과 내용을 입력해주세요.')
      return
    }
    setSaving(true)
    setError('')
    try {
      if (activeMeetingId) {
        await updateMeeting(activeMeetingId, { title, rawContent, meetingDate })
      } else {
        const { meeting } = await createMeeting(projectId, { title, rawContent, meetingDate })
        setActiveMeetingId(meeting.id)
      }
      await refreshList()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const remove = async (id) => {
    setError('')
    try {
      await deleteMeeting(id)
      if (id === activeMeetingId) resetDraft()
      await refreshList()
    } catch (err) {
      setError(err.message)
    }
  }

  const summarize = async () => {
    if (!activeMeetingId) return
    setSummarizing(true)
    setError('')
    try {
      const { meeting } = await summarizeMeeting(activeMeetingId)
      setSummary(meeting.summary ?? '')
    } catch (err) {
      setError(err.message)
    } finally {
      setSummarizing(false)
    }
  }

  const extract = async () => {
    if (!activeMeetingId) return
    setExtracting(true)
    setError('')
    try {
      const { extractedTasks } = await extractTasksApi(activeMeetingId)
      const pending = extractedTasks.filter((t) => t.status === 'PENDING')
      setExtractedTasks(pending)
      setExtractedDrafts(
        Object.fromEntries(
          pending.map((t) => [
            t.id,
            {
              title: t.title,
              assigneeId: members.find((m) => m.user.name === t.assigneeGuess)?.user.id ?? '',
              dueDate: toDateInputValue(t.dueDateGuess),
            },
          ])
        )
      )
    } catch (err) {
      setError(err.message)
    } finally {
      setExtracting(false)
    }
  }

  const updateDraft = (id, field, value) =>
    setExtractedDrafts((prev) => ({ ...prev, [id]: { ...prev[id], [field]: value } }))

  const approve = async (item) => {
    const draft = extractedDrafts[item.id] ?? {}
    setError('')
    try {
      await approveExtractedTask(item.id, {
        title: draft.title?.trim() || undefined,
        assigneeId: draft.assigneeId || null,
        dueDate: draft.dueDate || null,
      })
      setExtractedTasks((prev) => prev.filter((t) => t.id !== item.id))
      onTaskApproved?.()
    } catch (err) {
      setError(err.message)
    }
  }

  const reject = async (item) => {
    setError('')
    try {
      await rejectExtractedTask(item.id)
      setExtractedTasks((prev) => prev.filter((t) => t.id !== item.id))
    } catch (err) {
      setError(err.message)
    }
  }

  return {
    meetingsList,
    activeMeetingId,
    title,
    setTitle,
    meetingDate,
    setMeetingDate,
    blocks,
    changeBlock,
    addBlock,
    save,
    saving,
    startNew: resetDraft,
    load,
    remove,
    summary,
    summarize,
    summarizing,
    extractedTasks,
    extractedDrafts,
    updateDraft,
    extract,
    extracting,
    approve,
    reject,
    error,
  }
}
