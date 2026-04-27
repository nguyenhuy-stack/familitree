import { useState, useMemo, useRef, useEffect } from 'react'
import { Search, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { getMembers } from '../server/members'
import { useNavigate, useLocation } from '@tanstack/react-router'

export function GlobalSearch() {
  const [searchTerm, setSearchTerm] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const containerRef = useRef<HTMLDivElement>(null)

  const { data: members = [] } = useQuery({
    queryKey: ['members'],
    queryFn: () => getMembers(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })

  const searchResults = useMemo(() => {
    if (!searchTerm.trim()) return []
    return members.filter((m: any) =>
      m.name.toLowerCase().includes(searchTerm.toLowerCase())
    ).slice(0, 5)
  }, [members, searchTerm])

  const handleSelect = (member: any) => {
    setSearchTerm('')
    setIsSearching(false)
    navigate({
      to: '/',
      search: { focusId: member.id },
    })
  }

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsSearching(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative w-full max-w-xs sm:max-w-md mx-4 order-2 sm:order-none flex-grow sm:flex-grow-0" ref={containerRef}>
      <div className={`flex items-center gap-3 px-4 py-1.5 rounded-full bg-[var(--surface-strong)] border border-[var(--line)] transition-all duration-300 ${isSearching ? 'ring-2 ring-[var(--lagoon)]' : ''}`}>
        <Search size={16} className="text-[var(--sea-ink-soft)]" />
        <input
          type="text"
          placeholder="Tìm kiếm thành viên..."
          className="bg-transparent border-none outline-none text-xs w-full text-[var(--sea-ink)]"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setIsSearching(true)}
        />
        {searchTerm && (
          <button onClick={() => setSearchTerm('')} className="p-1 rounded-full hover:bg-[var(--line)] cursor-pointer">
            <X size={12} />
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      <AnimatePresence>
        {isSearching && searchResults.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-full left-0 right-0 mt-2 p-1.5 rounded-2xl bg-[var(--surface-strong)] border border-[var(--line)] shadow-2xl z-[60] overflow-hidden backdrop-blur-xl"
          >
            <div className="px-3 py-1.5 text-[9px] font-bold uppercase tracking-widest text-[var(--sea-ink-soft)] opacity-60 border-b border-[var(--line)] mb-1">Kết quả tìm kiếm</div>
            {searchResults.map((m: any) => (
              <button
                key={m.id}
                onClick={() => handleSelect(m)}
                className="flex items-center gap-3 w-full p-2.5 rounded-xl hover:bg-[var(--lagoon)]/5 transition text-left cursor-pointer"
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold ${m.gender === 'male' ? 'bg-blue-100 text-blue-600' : 'bg-rose-100 text-rose-600'}`}>
                  {m.name.charAt(0)}
                </div>
                <div>
                  <p className="text-xs font-bold text-[var(--sea-ink)]">{m.name}</p>
                  <p className="text-[9px] text-[var(--sea-ink-soft)] uppercase font-medium">{m.role}</p>
                </div>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
