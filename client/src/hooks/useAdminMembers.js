import { useCallback, useEffect, useState } from 'react'
import { getUsers } from '@/api/users'
import { MOCK_MEMBERS } from '@/constants/adminData'

export function useAdminMembers() {
  const [members, setMembers] = useState(MOCK_MEMBERS)
  const [isLoading, setIsLoading] = useState(true)

  const loadMembers = useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await getUsers()
      if (data.success && Array.isArray(data.users)) {
        setMembers(data.users)
      }
    } catch {
      setMembers(MOCK_MEMBERS)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadMembers()
  }, [loadMembers])

  return { members, isLoading, reload: loadMembers }
}

export function filterMembers(
  members,
  { types = [], statuses = [], keyword = '' } = {},
) {
  let result = [...members]

  if (types.length > 0) {
    result = result.filter((member) => types.includes(member.user_type))
  }

  if (statuses.length > 0) {
    result = result.filter((member) => {
      const statusKey = member.isActive === false ? 'inactive' : 'active'
      return statuses.includes(statusKey)
    })
  }

  if (keyword.trim()) {
    const q = keyword.trim().toLowerCase()
    result = result.filter(
      (member) =>
        member.name?.toLowerCase().includes(q) ||
        member.email?.toLowerCase().includes(q) ||
        member.phone?.includes(q),
    )
  }

  return result
}
