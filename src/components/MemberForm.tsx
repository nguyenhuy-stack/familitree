import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, User, Heart } from 'lucide-react'

type FormMode = 'child' | 'spouse' | 'root' | 'edit'

interface MemberFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: any) => Promise<void>
  mode: FormMode
  parentMember?: any  // The member we're adding a child or spouse for
}

export function MemberForm({ isOpen, onClose, onSubmit, mode, parentMember }: MemberFormProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    gender: 'male',
    birthDate: '',
  })

  // Populate form if editing
  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && parentMember) {
        setFormData({
          name: parentMember.name,
          role: parentMember.role,
          gender: parentMember.gender,
          birthDate: parentMember.birthDate || '',
        })
      } else {
        setFormData({
          name: '',
          role: '',
          gender: mode === 'spouse' ? (parentMember?.gender === 'male' ? 'female' : 'male') : 'male',
          birthDate: '',
        })
      }
    }
  }, [isOpen, mode, parentMember])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const submitData: any = { ...formData }

      if (mode === 'edit' && parentMember) {
        submitData.id = parentMember.id
      } else if (mode === 'child' && parentMember) {
        submitData.parentId = parentMember.id
      } else if (mode === 'spouse' && parentMember) {
        submitData.spouseId = parentMember.id
      }

      await onSubmit(submitData)
      onClose()
    } finally {
      setLoading(false)
    }
  }

  const getTitle = () => {
    if (mode === 'edit' && parentMember) return `Sửa thông tin ${parentMember.name}`
    if (mode === 'child' && parentMember) return `Thêm con cho ${parentMember.name}`
    if (mode === 'spouse' && parentMember) return `Thêm vợ/chồng cho ${parentMember.name}`
    return 'Thêm Thành Viên Mới'
  }

  const getIcon = () => {
    if (mode === 'child') return <User size={20} className="text-[var(--lagoon)]" />
    if (mode === 'spouse') return <Heart size={20} className="text-rose-400" fill="currentColor" />
    return <User size={20} className="text-[var(--lagoon)]" />
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-md island-shell rounded-[2rem] p-8 shadow-2xl overflow-hidden"
          >
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-[var(--line)] transition"
            >
              <X size={20} />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[var(--lagoon)]/10 flex items-center justify-center">
                {getIcon()}
              </div>
              <div>
                <h2 className="display-title text-xl font-bold text-[var(--sea-ink)]">{getTitle()}</h2>
                {parentMember && (
                  <p className="text-xs text-[var(--sea-ink-soft)]">
                    {mode === 'child' ? 'Sẽ được thêm làm con' : 'Sẽ được ghép đôi'}
                  </p>
                )}
              </div>
            </div>

            {/* Parent preview */}
            {parentMember && (
              <div className="mb-6 p-3 rounded-xl bg-white/30 border border-[var(--line)] flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold
                  ${parentMember.gender === 'male' ? 'bg-blue-100 text-blue-600' : 'bg-rose-100 text-rose-600'}`}>
                  {parentMember.name.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-sm text-[var(--sea-ink)]">{parentMember.name}</p>
                  <p className="text-[10px] uppercase text-[var(--sea-ink-soft)] font-semibold">{parentMember.role}</p>
                </div>
                <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full bg-[var(--lagoon)]/10 text-[var(--lagoon-deep)] font-bold uppercase">
                  {mode === 'child' ? 'Cha/Mẹ' : 'Đối tác'}
                </span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-[var(--sea-ink-soft)] mb-1.5 ml-1">Họ và Tên</label>
                <input
                  required
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ví dụ: Nguyễn Văn A"
                  className="w-full px-4 py-3 rounded-xl border border-[var(--line)] bg-white/80 text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--lagoon)] transition"
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-[var(--sea-ink-soft)] mb-1.5 ml-1">Vai Trò</label>
                  <input
                    required
                    type="text"
                    value={formData.role}
                    onChange={e => setFormData({ ...formData, role: e.target.value })}
                    placeholder="Con cả, Vợ..."
                    className="w-full px-4 py-3 rounded-xl border border-[var(--line)] bg-white/80 text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--lagoon)] transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-[var(--sea-ink-soft)] mb-1.5 ml-1">Giới Tính</label>
                  <select
                    value={formData.gender}
                    onChange={e => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-[var(--line)] bg-white/80 text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--lagoon)] transition"
                  >
                    <option value="male">Nam</option>
                    <option value="female">Nữ</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-[var(--sea-ink-soft)] mb-1.5 ml-1">Ngày sinh (Tùy chọn)</label>
                <input
                  type="date"
                  value={formData.birthDate}
                  onChange={e => setFormData({ ...formData, birthDate: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-[var(--line)] bg-white/80 text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--lagoon)] transition appearance-none"
                />
              </div>

              <div className="pt-3 flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3 px-6 rounded-xl border border-[var(--line)] text-[var(--sea-ink)] font-bold hover:bg-white/50 transition"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className={`flex-1 py-3 px-6 rounded-xl text-white font-bold shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50
                    ${mode === 'spouse' ? 'bg-rose-500 shadow-rose-200/40' : (mode === 'edit' ? 'bg-slate-700 shadow-slate-200/40' : 'bg-[var(--lagoon-deep)] shadow-[rgba(79,184,178,0.3)]')}`}
                >
                  {loading ? 'Đang lưu...' : (mode === 'edit' ? '💾 Lưu thay đổi' : (mode === 'spouse' ? '💕 Ghép đôi' : '➕ Thêm con'))}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
