import { createFileRoute } from '@tanstack/react-router'
import { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Maximize2, Minimize2, RefreshCcw, Users } from 'lucide-react'
import { MemberForm } from '../components/MemberForm'
import { FamilyBranch } from '../components/FamilyBranch'
import { MemberDetailPanel } from '../components/MemberDetailPanel'
import { getMembers, addMember, deleteMember, updateMember } from '../server/members'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useZoomPan } from '../hooks/useZoomPan'
import { toast } from 'react-hot-toast'

import { z } from 'zod'

const searchSchema = z.object({
  focusId: z.string().optional(),
  editId: z.string().optional(),
})

export const Route = createFileRoute('/')({
  validateSearch: searchSchema,
  component: FamilyTreePage 
})

type FormMode = 'child' | 'spouse' | 'root' | 'edit'

function FamilyTreePage() {
  const { focusId: searchFocusId, editId: searchEditId } = Route.useSearch()
  const [formOpen, setFormOpen] = useState(false)
  const [formMode, setFormMode] = useState<FormMode>('root')
  const [formParent, setFormParent] = useState<any>(null)
  const [selectedMember, setSelectedMember] = useState<any | null>(null)
  const [focusId, setFocusId] = useState<string | null>(searchFocusId || null)


  const { data: members, refetch } = useSuspenseQuery({
    queryKey: ['members'],
    queryFn: () => getMembers()
  })

  // Sync with search params
  useEffect(() => {
    if (searchFocusId) {
      setFocusId(searchFocusId)
    }
  }, [searchFocusId])

  useEffect(() => {
    if (searchEditId && members) {
      const member = members.find((m: any) => m.id === searchEditId)
      if (member) {
        setFormMode('edit')
        setFormParent(member)
        setFormOpen(true)
      }
    }
  }, [searchEditId, members])

  const zoom = useZoomPan()

  // Members to display as roots
  const displayMembers = useMemo(() => {
    if (focusId) {
      const focused = members.find((m: any) => m.id === focusId)
      return focused ? [focused] : []
    }

    // Default: Find root members (no parent AND not a "spouse-only" member)
    const roots = members.filter((m: any) => {
      if (m.parentId) return false
      const asSpouseOf = members.find((o: any) => o.spouseId === m.id)
      if (asSpouseOf && asSpouseOf.parentId) return false
      if (m.spouseId) {
        const partner = members.find((o: any) => o.id === m.spouseId)
        if (partner && !partner.parentId && partner.createdAt <= m.createdAt) return false
      }
      return true
    })
    return roots
  }, [members, focusId])



  const openForm = (mode: FormMode, member?: any) => {
    setFormMode(mode)
    setFormParent(member || null)
    setFormOpen(true)
  }

  const handleFormSubmit = async (data: any) => {
    if (formMode === 'edit') {
      await updateMember({ data })
      toast.success('Đã cập nhật thông tin thành công!')
      if (selectedMember && selectedMember.id === data.id) {
        setSelectedMember({ ...selectedMember, ...data })
      }
    } else {
      await addMember({ data })
      toast.success('Đã thêm thành viên mới!')
    }
    refetch()
  }

  const handleDelete = async (id: string) => {
    if (confirm('Bạn có chắc muốn xóa thành viên này?')) {
      await deleteMember({ data: id })
      toast.success('Đã xóa thành viên.')
      setSelectedMember(null)
      refetch()
    }
  }

  const handleFocus = (id: string) => {
    setFocusId(id)
    setSelectedMember(null)
    zoom.reset()
  }

  const hasSpouse = (id: string) => {
    const m = members.find((x: any) => x.id === id)
    return m?.spouseId || members.some((x: any) => x.spouseId === id)
  }

  return (
    <main className="relative h-[calc(100vh-80px)] overflow-hidden bg-[var(--bg-base)]">
      {/* Controls */}
      <div className="absolute left-6 bottom-6 z-10 flex flex-col gap-2">
        <button onClick={zoom.zoomIn} className="btn-control cursor-pointer"><Maximize2 size={20}/></button>
        <button onClick={zoom.zoomOut} className="btn-control cursor-pointer"><Minimize2 size={20}/></button>
        <button onClick={zoom.reset} className="btn-control cursor-pointer"><RefreshCcw size={20}/></button>
        {focusId && (
          <button onClick={() => setFocusId(null)} className="btn-control !bg-[var(--lagoon)] !text-white !border-none cursor-pointer" title="Xem toàn bộ cây">
            <Users size={20}/>
          </button>
        )}
      </div>

      <div className="absolute left-6 top-6 z-10 px-3 py-1.5 rounded-lg bg-[var(--surface-strong)] border border-[var(--line)] text-xs font-mono text-[var(--sea-ink-soft)]">
        {Math.round(zoom.view.scale * 100)}%
      </div>

      {/* Canvas */}
      <div
        ref={zoom.containerRef}
        onMouseDown={zoom.handleMouseDown}
        onMouseMove={zoom.handleMouseMove}
        onMouseUp={zoom.handleMouseUp}
        onMouseLeave={zoom.handleMouseUp}
        className="w-full h-full cursor-grab active:cursor-grabbing select-none"
      >
        <div
          style={{
            transform: `translate(${zoom.view.x}px, ${zoom.view.y}px) scale(${zoom.view.scale})`,
            transformOrigin: '0 0',
          }}
          className="absolute top-0 left-0"
        >
          <div className="flex gap-40 items-start p-64 -translate-x-1/2">
            {displayMembers.map((root: any) => (
              <FamilyBranch
                key={root.id}
                member={root}
                allMembers={members}
                onSelect={setSelectedMember}
                onAddChild={(m) => openForm('child', m)}
                onAddSpouse={(m) => openForm('spouse', m)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* FAB */}
      <button onClick={() => openForm('root')} className="fab-plus cursor-pointer">
        <Plus size={20} /> <span className="font-bold">Thêm Gốc</span>
      </button>

      {/* Form */}
      <MemberForm
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        mode={formMode}
        parentMember={formParent}
      />

      {/* Detail panel */}
      <MemberDetailPanel
        member={selectedMember}
        members={members}
        onClose={() => setSelectedMember(null)}
        onSelect={setSelectedMember}
        onOpenForm={openForm}
        onDelete={handleDelete}
        onFocus={handleFocus}
        hasSpouse={hasSpouse}
      />
    </main>
  )
}
