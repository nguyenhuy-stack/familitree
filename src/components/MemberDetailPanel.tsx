import { motion, AnimatePresence } from 'framer-motion'
import { Maximize2, Users, Heart, Plus } from 'lucide-react'

interface MemberDetailPanelProps {
  member: any | null
  members: any[]
  onClose: () => void
  onSelect: (m: any) => void
  onOpenForm: (mode: any, member?: any) => void
  onDelete: (id: string) => void
  onFocus: (id: string) => void
  hasSpouse: (id: string) => boolean
}

export function MemberDetailPanel({
  member,
  members,
  onClose,
  onSelect,
  onOpenForm,
  onDelete,
  onFocus,
  hasSpouse
}: MemberDetailPanelProps) {
  if (!member) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="absolute top-0 right-0 h-full w-full max-w-md island-shell z-20 p-6 shadow-2xl overflow-y-auto"
      >
        <button onClick={onClose} className="p-2 rounded-full hover:bg-[var(--line)] mb-6 cursor-pointer">
          <Maximize2 size={24} className="rotate-45 text-[var(--sea-ink-soft)]" />
        </button>
        <div className="flex flex-col items-center">
          <div className={`avatar-large ${member.gender === 'male' ? 'bg-blue-100 text-blue-600' : 'bg-rose-100 text-rose-600'}`}>
            {member.name.charAt(0)}
          </div>
          <h2 className="display-title text-3xl font-bold mb-2 text-[var(--sea-ink)] text-center">{member.name}</h2>
          <span className="role-tag">{member.role}</span>
          
          <div className="w-full mt-8 grid grid-cols-2 gap-3">
            <InfoItem label="Giới tính" value={member.gender === 'male' ? 'Nam' : 'Nữ'} />
            <InfoItem label="Ngày sinh" value={member.birthDate} />
          </div>

          {/* ── Family Relationships ── */}
          <div className="w-full mt-8 space-y-6">
            <h3 className="text-xs font-bold uppercase text-[var(--sea-ink-soft)] tracking-wider flex items-center gap-2">
              <Users size={14} /> Quan hệ gia đình
            </h3>

            {/* Parent */}
            {(() => {
              const parent = members.find((m: any) => m.id === member.parentId)
              return parent ? (
                <RelationSection label="Cha / Mẹ">
                  <RelationChip member={parent} onClick={() => onSelect(parent)} />
                  {/* Parent's spouse */}
                  {(() => {
                    const parentSpouse = parent.spouseId 
                      ? members.find((m: any) => m.id === parent.spouseId)
                      : members.find((m: any) => m.spouseId === parent.id)
                    return parentSpouse ? <RelationChip member={parentSpouse} onClick={() => onSelect(parentSpouse)} /> : null
                  })()}
                </RelationSection>
              ) : null
            })()}

            {/* Spouse */}
            {(() => {
              const spouse = member.spouseId
                ? members.find((m: any) => m.id === member.spouseId)
                : members.find((m: any) => m.spouseId === member.id)
              return spouse ? (
                <RelationSection label="Vợ / Chồng">
                  <RelationChip member={spouse} onClick={() => onSelect(spouse)} highlight="rose" />
                </RelationSection>
              ) : null
            })()}

            {/* Children */}
            {(() => {
              const spouse = member.spouseId
                ? members.find((m: any) => m.id === member.spouseId)
                : members.find((m: any) => m.spouseId === member.id)
              const kids = members.filter((m: any) => 
                m.parentId === member.id || (spouse && m.parentId === spouse.id)
              )
              return kids.length > 0 ? (
                <RelationSection label={`Con cái (${kids.length})`}>
                  {kids.map((kid: any) => (
                    <RelationChip key={kid.id} member={kid} onClick={() => onSelect(kid)} />
                  ))}
                </RelationSection>
              ) : null
            })()}

            {/* Siblings */}
            {(() => {
              if (!member.parentId) return null
              const siblings = members.filter((m: any) => 
                m.parentId === member.parentId && m.id !== member.id
              )
              return siblings.length > 0 ? (
                <RelationSection label={`Anh chị em (${siblings.length})`}>
                  {siblings.map((sib: any) => (
                    <RelationChip key={sib.id} member={sib} onClick={() => onSelect(sib)} />
                  ))}
                </RelationSection>
              ) : null
            })()}
          </div>

          {/* Actions */}
          <div className="w-full mt-10 space-y-4">
            <button 
              onClick={() => onFocus(member.id)}
              className="w-full py-4 px-6 rounded-2xl bg-[var(--lagoon-deep)] text-white font-bold text-base hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_10px_20px_rgba(50,143,151,0.3)] flex items-center justify-center gap-3 cursor-pointer"
            >
              <Users size={20} /> Xem cây của {member.name.split(' ').pop()}
            </button>

            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => onOpenForm('child', member)}
                className="py-3.5 px-4 rounded-2xl bg-[var(--lagoon)]/10 text-[var(--lagoon-deep)] font-bold text-sm hover:bg-[var(--lagoon)]/20 transition-all flex items-center justify-center gap-2 border border-[var(--lagoon)]/20 cursor-pointer">
                <Plus size={16} /> Thêm con
              </button>
              {!hasSpouse(member.id) && (
                <button onClick={() => onOpenForm('spouse', member)}
                  className="py-3.5 px-4 rounded-2xl bg-rose-500/10 text-rose-500 font-bold text-sm hover:bg-rose-500/20 transition-all flex items-center justify-center gap-2 border border-rose-500/20 cursor-pointer">
                  <Heart size={16} /> Ghép đôi
                </button>
              )}
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-[var(--line)] flex gap-4 w-full">
            <button 
              onClick={() => onOpenForm('edit', member)}
              className="flex-1 py-3 rounded-xl border border-[var(--line)] text-[var(--sea-ink-soft)] font-bold text-sm hover:bg-[var(--line)] transition cursor-pointer"
            >
              Sửa
            </button>
            <button onClick={() => onDelete(member.id)} className="flex-1 py-3 rounded-xl text-rose-500 font-bold text-sm hover:bg-rose-50 transition cursor-pointer">Xóa</button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

/* ── Sub-components ── */
function InfoItem({ label, value }: { label: string, value: string }) {
  const displayValue = label === 'Ngày sinh' && value 
    ? new Date(value).toLocaleDateString('vi-VN') 
    : (value || '--')

  return (
    <div className="p-4 rounded-xl bg-[var(--surface-strong)] border border-[var(--line)] shadow-sm">
      <p className="text-[11px] uppercase text-[var(--sea-ink-soft)] font-bold mb-1 opacity-70 tracking-wide">{label}</p>
      <p className="text-lg font-bold text-[var(--sea-ink)]">{displayValue}</p>
    </div>
  )
}

function RelationSection({ label, children }: { label: string, children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <p className="text-[10px] font-bold text-[var(--sea-ink-soft)] ml-1 uppercase tracking-[0.1em] opacity-50">{label}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">{children}</div>
    </div>
  )
}

function RelationChip({ member, onClick, highlight }: { member: any, onClick: () => void, highlight?: string }) {
  const isMale = member.gender === 'male'
  
  const chipStyles = highlight === 'rose'
    ? 'bg-rose-500/10 border-rose-500/20 text-rose-700 dark:text-rose-300 hover:bg-rose-500/20'
    : (isMale 
        ? 'bg-blue-500/10 border-blue-500/20 text-blue-700 dark:text-blue-300 hover:bg-blue-500/20'
        : 'bg-rose-500/10 border-rose-500/20 text-rose-700 dark:text-rose-300 hover:bg-rose-500/20')

  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-2.5 rounded-2xl border transition-all cursor-pointer ${chipStyles} hover:scale-[1.03] active:scale-[0.97]`}
    >
      <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold
        ${isMale ? 'bg-blue-500/20 text-blue-700 dark:text-blue-300' : 'bg-rose-500/20 text-rose-700 dark:text-rose-300'}`}>
        {member.name.charAt(0)}
      </div>
      <div className="text-left">
        <p className="text-sm font-bold leading-tight">{member.name}</p>
        <p className="text-[10px] opacity-70 uppercase font-bold tracking-tight">{member.role}</p>
      </div>
    </button>
  )
}
