import { useState } from 'react'
import { inviteMember, removeMember, updateMemberRole } from '../../api/projects.js'

export function useMembers(projectId, onChanged) {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const invite = async (email, role) => {
    setBusy(true)
    setError('')
    try {
      await inviteMember(projectId, { email, role })
      await onChanged?.()
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setBusy(false)
    }
  }

  const changeRole = async (userId, role) => {
    setError('')
    try {
      await updateMemberRole(projectId, userId, role)
      await onChanged?.()
    } catch (err) {
      setError(err.message)
    }
  }

  const remove = async (userId) => {
    setError('')
    try {
      await removeMember(projectId, userId)
      await onChanged?.()
    } catch (err) {
      setError(err.message)
    }
  }

  return { busy, error, invite, changeRole, remove }
}
