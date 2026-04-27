import { motion } from 'framer-motion'
import { User, Plus, Heart as HeartIcon } from 'lucide-react'

interface MemberCardProps {
  member: any
  onClick?: () => void
  onAddChild?: () => void
  onAddSpouse?: () => void
  hasSpouse?: boolean
  compact?: boolean
}

export function MemberCard({ member, onClick, onAddChild, onAddSpouse, hasSpouse, compact }: MemberCardProps) {
  const isMale = member.gender === 'male'

  return (
    <div className="relative group/card flex flex-col items-center">
      <motion.div
        whileHover={{ scale: 1.04, y: -2 }}
        onClick={onClick}
        className={`
          relative flex flex-col items-center cursor-pointer
          island-shell rounded-2xl
          ${compact ? 'p-3 min-w-[140px]' : 'p-5 min-w-[180px]'}
          ${isMale ? 'border-blue-300/20' : 'border-rose-300/20'}
        `}
      >
        <div className={`
          rounded-full flex items-center justify-center
          ${compact ? 'w-12 h-12 mb-2' : 'w-14 h-14 mb-3'}
          ${isMale ? 'bg-blue-100 text-blue-600' : 'bg-rose-100 text-rose-600'}
          shadow-inner
        `}>
          {member.avatar ? (
            <img src={member.avatar} alt={member.name} className="w-full h-full rounded-full object-cover" />
          ) : (
            <User size={compact ? 24 : 28} />
          )}
        </div>
        
        <h3 className={`font-bold text-[var(--sea-ink)] text-center ${compact ? 'text-xs' : 'text-sm'}`}>
          {member.name}
        </h3>
        <p className="text-[10px] uppercase tracking-wider font-semibold text-[var(--sea-ink-soft)] mt-0.5">
          {member.role}
        </p>
      </motion.div>

      {/* Action buttons on hover */}
      <div className="flex gap-1 mt-1.5 opacity-0 group-hover/card:opacity-100 transition-opacity z-10">
        {onAddChild && (
          <button
            onClick={(e) => { e.stopPropagation(); onAddChild(); }}
            className="flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[9px] font-bold
              bg-[var(--lagoon-deep)] text-white shadow-md
              hover:scale-110 active:scale-95 transition-all whitespace-nowrap"
          >
            <Plus size={10} /> Con
          </button>
        )}
        {onAddSpouse && !hasSpouse && (
          <button
            onClick={(e) => { e.stopPropagation(); onAddSpouse(); }}
            className="flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[9px] font-bold
              bg-rose-500 text-white shadow-md
              hover:scale-110 active:scale-95 transition-all whitespace-nowrap"
          >
            <HeartIcon size={9} fill="white" /> Đôi
          </button>
        )}
      </div>
    </div>
  )
}
