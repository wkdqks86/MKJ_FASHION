import { useCallback, useState } from 'react'
import { deleteUser } from '@/api/users'

export function useDeleteMember({ onSuccess } = {}) {
  const [deletingMemberId, setDeletingMemberId] = useState(null)

  const handleDeleteMember = useCallback(async (member) => {
    if (member._id?.startsWith('mock-')) {
      window.alert('샘플 데이터는 삭제할 수 없습니다.')
      return false
    }

    const confirmed = window.confirm(
      `회원 ${member.name} (${member.email})을(를) 삭제하시겠습니까?\n삭제된 회원 정보는 복구할 수 없습니다.`,
    )

    if (!confirmed) return false

    setDeletingMemberId(member._id)

    try {
      const data = await deleteUser(member._id)

      if (data.success) {
        onSuccess?.(member._id)
        return true
      }

      window.alert('회원을 삭제하지 못했습니다.')
      return false
    } catch (err) {
      window.alert(err.response?.data?.message || '회원을 삭제하지 못했습니다.')
      return false
    } finally {
      setDeletingMemberId(null)
    }
  }, [onSuccess])

  return { handleDeleteMember, deletingMemberId }
}
