import { createFileRoute } from '@tanstack/react-router'
import { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Maximize2, Minimize2, RefreshCcw, Search, X, Users } from 'lucide-react'
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
  const [searchTerm, setSearchTerm] = useState('')
  const [isSearching, setIsSearching] = useState(false)

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

  const searchResults = useMemo(() => {
    if (!searchTerm.trim()) return []
    return members.filter((m: any) =>
      m.name.toLowerCase().includes(searchTerm.toLowerCase())
    ).slice(0, 5)
  }, [members, searchTerm])

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

      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-4 w-full max-w-xs sm:max-w-md">
        <div className="relative w-full">
          <div className={`flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-[var(--surface-strong)] border border-[var(--line)] shadow-xl transition-all duration-300 ${isSearching ? 'ring-2 ring-[var(--lagoon)]' : ''}`}>
            <Search size={18} className="text-[var(--sea-ink-soft)]" />
            <input
              type="text"
              placeholder="Tìm kiếm thành viên..."
              className="bg-transparent border-none outline-none text-sm w-full text-[var(--sea-ink)]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setIsSearching(true)}
              onBlur={() => setTimeout(() => setIsSearching(false), 200)}
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm('')} className="p-1 rounded-full hover:bg-[var(--line)] cursor-pointer">
                <X size={14} />
              </button>
            )}
          </div>

          {/* Search Results Dropdown */}
          <AnimatePresence>
            {isSearching && searchResults.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full left-0 right-0 mt-3 p-2 rounded-3xl bg-[var(--surface-strong)] border border-[var(--line)] shadow-[0_20px_50px_rgba(0,0,0,0.2)] z-50 overflow-hidden backdrop-blur-xl"
              >
                <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-[var(--sea-ink-soft)] opacity-60">Kết quả tìm kiếm</div>
                {searchResults.map((m: any) => (
                  <button
                    key={m.id}
                    onClick={() => {
                      setSelectedMember(m)
                      setSearchTerm('')
                      setIsSearching(false)
                    }}
                    className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-[var(--lagoon)]/5 transition text-left cursor-pointer"
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${m.gender === 'male' ? 'bg-blue-100 text-blue-600' : 'bg-rose-100 text-rose-600'}`}>
                      {m.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[var(--sea-ink)]">{m.name}</p>
                      <p className="text-[10px] text-[var(--sea-ink-soft)] uppercase">{m.role}</p>
                    </div>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="px-4 py-2 rounded-xl bg-[var(--surface-strong)]/80 backdrop-blur-md border border-[var(--line)] text-[10px] sm:text-xs text-[var(--sea-ink-soft)] shadow-sm flex items-center gap-2">
          💡 {focusId ? (
            <>
              Đang xem cây của <b>{members.find((m: any) => m.id === focusId)?.name}</b>
              <button 
                onClick={() => setFocusId(null)}
                className="ml-2 px-2 py-0.5 rounded-md bg-[var(--lagoon)] text-white font-bold hover:opacity-90 transition cursor-pointer"
              >
                Xem toàn bộ
              </button>
            </>
          ) : 'Di chuột vào thành viên để thêm con hoặc ghép đôi'}
        </div>
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
