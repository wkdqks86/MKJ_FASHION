import { useMemo, useState } from 'react'
import AdminPageHead from '@/components/admin/common/AdminPageHead'
import MemberDetailModal from '@/components/admin/members/MemberDetailModal'
import MemberListTable from '@/components/admin/members/MemberListTable'
import MemberSearchFilter from '@/components/admin/members/MemberSearchFilter'
import { filterMembers, useAdminMembers } from '@/hooks/useAdminMembers'
import { useDeleteMember } from '@/hooks/useDeleteMember'

function AdminMembersPage() {
  const { members, reload } = useAdminMembers()
  const [filters, setFilters] = useState({ types: [], statuses: [], keyword: '' })
  const [selectedMember, setSelectedMember] = useState(null)

  const handleDeleteSuccess = (memberId) => {
    if (selectedMember?._id === memberId) {
      setSelectedMember(null)
    }
    reload()
  }

  const { handleDeleteMember, deletingMemberId } = useDeleteMember({
    onSuccess: handleDeleteSuccess,
  })

  const filteredMembers = useMemo(
    () => filterMembers(members, filters),
    [members, filters],
  )

  return (
    <>
      <AdminPageHead
        title="회원 관리"
        description="등록된 회원 정보를 확인하고 관리합니다."
      />
      <MemberSearchFilter
        onSearch={setFilters}
        onReset={() => setFilters({ types: [], statuses: [], keyword: '' })}
      />
      <MemberListTable
        members={filteredMembers}
        onViewDetail={setSelectedMember}
        onDelete={handleDeleteMember}
        deletingMemberId={deletingMemberId}
      />
      <MemberDetailModal
        member={selectedMember}
        onClose={() => setSelectedMember(null)}
        onUpdated={() => reload()}
        onDeleted={handleDeleteSuccess}
      />
    </>
  )
}

export default AdminMembersPage
