import { createFileRoute, Link } from '@tanstack/react-router'
import { useState, useMemo } from 'react'
import { Search, ChevronLeft, ChevronRight, User, Map, Edit2 } from 'lucide-react'
import { getMembers, updateMember } from '../server/members'
import { useSuspenseQuery, useQueryClient } from '@tanstack/react-query'
import { MemberForm } from '../components/MemberForm'
import { toast } from 'react-hot-toast'

export const Route = createFileRoute('/members')({
  component: MembersListPage
})

function MembersListPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [formOpen, setFormOpen] = useState(false)
  const [editingMember, setEditingMember] = useState<any>(null)
  const itemsPerPage = 8
  const queryClient = useQueryClient()

  const { data: members } = useSuspenseQuery({
    queryKey: ['members'],
    queryFn: () => getMembers()
  })

  const filteredMembers = useMemo(() => {
    return members.filter((m: any) =>
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.role.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [members, searchTerm])

  const totalPages = Math.ceil(filteredMembers.length / itemsPerPage)
  const paginatedMembers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return filteredMembers.slice(start, start + itemsPerPage)
  }, [filteredMembers, currentPage])

  // Reset to page 1 when searching
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
    setCurrentPage(1)
  }

  const handleEdit = (member: any) => {
    setEditingMember(member)
    setFormOpen(true)
  }

  const handleFormSubmit = async (data: any) => {
    await updateMember({ data })
    toast.success('Đã cập nhật thông tin thành công!')
    queryClient.invalidateQueries({ queryKey: ['members'] })
    setFormOpen(false)
  }

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[var(--bg-base)] py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <h1 className="display-title text-4xl font-bold text-[var(--sea-ink)] mb-2">Danh Sách Thành Viên</h1>
            <p className="text-[var(--sea-ink-soft)]">Quản lý và tra cứu thông tin chi tiết của tất cả thành viên trong gia tộc.</p>
          </div>
          
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--sea-ink-soft)]" size={18} />
            <input
              type="text"
              placeholder="Tìm theo tên hoặc vai trò..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-[var(--surface-strong)] border border-[var(--line)] text-[var(--sea-ink)] focus:outline-none focus:ring-2 focus:ring-[var(--lagoon)] transition-all shadow-sm"
            />
          </div>
        </div>

        <div className="island-shell rounded-[2rem] overflow-hidden shadow-xl border border-[var(--line)]">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[var(--lagoon)]/5 border-b border-[var(--line)]">
                  <th className="px-6 py-5 text-xs font-bold uppercase tracking-wider text-[var(--sea-ink-soft)]">Thành viên</th>
                  <th className="px-6 py-5 text-xs font-bold uppercase tracking-wider text-[var(--sea-ink-soft)]">Vai trò</th>
                  <th className="px-6 py-5 text-xs font-bold uppercase tracking-wider text-[var(--sea-ink-soft)]">Giới tính</th>
                  <th className="px-6 py-5 text-xs font-bold uppercase tracking-wider text-[var(--sea-ink-soft)]">Ngày sinh</th>
                  <th className="px-6 py-5 text-xs font-bold uppercase tracking-wider text-[var(--sea-ink-soft)] text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--line)]">
                {paginatedMembers.length > 0 ? (
                  paginatedMembers.map((member: any) => (
                    <tr key={member.id} className="hover:bg-[var(--lagoon)]/[0.02] transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-sm
                            ${member.gender === 'male' ? 'bg-blue-100 text-blue-600' : 'bg-rose-100 text-rose-600'}`}>
                            {member.avatar ? (
                              <img src={member.avatar} alt="" className="w-full h-full rounded-full object-cover" />
                            ) : member.name.charAt(0)}
                          </div>
                          <span className="font-bold text-[var(--sea-ink)] group-hover:text-[var(--lagoon-deep)] transition-colors">{member.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 rounded-full bg-[var(--surface-strong)] border border-[var(--line)] text-[10px] font-bold uppercase text-[var(--sea-ink-soft)]">
                          {member.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-sm ${member.gender === 'male' ? 'text-blue-500' : 'text-rose-500'}`}>
                          {member.gender === 'male' ? 'Nam' : 'Nữ'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-[var(--sea-ink-soft)] font-medium">
                        {member.birthDate ? new Date(member.birthDate).toLocaleDateString('vi-VN') : '--/--/----'}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link 
                            to="/" 
                            search={{ focusId: member.id }}
                            className="p-2 rounded-xl bg-[var(--lagoon)]/10 text-[var(--lagoon-deep)] hover:bg-[var(--lagoon)]/20 transition-all cursor-pointer"
                            title="Xem trên cây"
                          >
                            <Map size={18} />
                          </Link>
                          <button 
                            onClick={() => handleEdit(member)}
                            className="p-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all cursor-pointer"
                            title="Chỉnh sửa"
                          >
                            <Edit2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center gap-3 opacity-40">
                        <User size={48} />
                        <p className="font-bold">Không tìm thấy thành viên nào</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-5 bg-[var(--surface-strong)]/30 border-t border-[var(--line)] flex items-center justify-between">
              <p className="text-xs font-bold text-[var(--sea-ink-soft)] uppercase tracking-wider">
                Trang {currentPage} / {totalPages}
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-xl border border-[var(--line)] hover:bg-white transition-all disabled:opacity-30 cursor-pointer"
                >
                  <ChevronLeft size={18} />
                </button>
                <div className="flex items-center gap-1">
                  {(() => {
                    const pages = []
                    const maxVisible = 5
                    
                    if (totalPages <= maxVisible) {
                      for (let i = 1; i <= totalPages; i++) pages.push(i)
                    } else {
                      pages.push(1)
                      if (currentPage > 3) pages.push('...')
                      
                      const start = Math.max(2, currentPage - 1)
                      const end = Math.min(totalPages - 1, currentPage + 1)
                      
                      for (let i = start; i <= end; i++) {
                        if (!pages.includes(i)) pages.push(i)
                      }
                      
                      if (currentPage < totalPages - 2) pages.push('...')
                      if (!pages.includes(totalPages)) pages.push(totalPages)
                    }

                    return pages.map((p, i) => (
                      <button
                        key={i}
                        onClick={() => typeof p === 'number' && setCurrentPage(p)}
                        disabled={p === '...'}
                        className={`w-9 h-9 rounded-xl font-bold text-xs transition-all
                          ${p === '...' ? 'cursor-default opacity-40' : 'cursor-pointer'}
                          ${currentPage === p 
                            ? 'bg-[var(--lagoon)] text-white shadow-lg' 
                            : p !== '...' ? 'hover:bg-white text-[var(--sea-ink-soft)]' : ''}`}
                      >
                        {p}
                      </button>
                    ))
                  })()}
                </div>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-xl border border-[var(--line)] hover:bg-white transition-all disabled:opacity-30 cursor-pointer"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <MemberForm
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        mode="edit"
        parentMember={editingMember}
      />
    </div>
  )
}
