import { Heart } from 'lucide-react'
import { MemberCard } from './MemberCard'

interface FamilyBranchProps {
  member: any
  allMembers: any[]
  onSelect: (m: any) => void
  onAddChild: (m: any) => void
  onAddSpouse: (m: any) => void
}

export function FamilyBranch({
  member,
  allMembers,
  onSelect,
  onAddChild,
  onAddSpouse,
}: FamilyBranchProps) {
  // Find spouse
  const spouse = member.spouseId
    ? allMembers.find((m: any) => m.id === member.spouseId)
    : allMembers.find((m: any) => m.spouseId === member.id)

  // Find children of this couple
  const children = allMembers.filter((m: any) => {
    if (m.parentId === member.id) return true
    if (spouse && m.parentId === spouse.id) return true
    return false
  })

  const hasSpouse = !!spouse

  return (
    <div className="flex flex-col items-center">
      {/* ── Couple row ── */}
      <div className="flex items-start gap-3 relative">
        <MemberCard
          member={member}
          onClick={() => onSelect(member)}
          onAddChild={() => onAddChild(member)}
          onAddSpouse={() => onAddSpouse(member)}
          hasSpouse={hasSpouse}
        />

        {spouse && (
          <>
            {/* Heart connector */}
            <div className="flex items-center self-center gap-0">
              <div className="w-12 h-[3px] bg-rose-400 rounded-full shadow-[0_0_6px_rgba(251,113,133,0.6)]" />
              <Heart size={18} className="text-rose-400 fill-rose-400 shrink-0 mx-0.5 drop-shadow-[0_0_4px_rgba(251,113,133,0.6)]" />
              <div className="w-12 h-[3px] bg-rose-400 rounded-full shadow-[0_0_6px_rgba(251,113,133,0.6)]" />
            </div>

            <MemberCard
              member={spouse}
              onClick={() => onSelect(spouse)}
              onAddChild={() => onAddChild(member)}
              hasSpouse={true}
            />
          </>
        )}
      </div>

      {/* ── Children ── */}
      {children.length > 0 && (
        <>
          {/* Vertical line down from couple - adjusted to "stick" to the heart/card */}
          <div className="tree-v-line" style={{ marginTop: hasSpouse ? '-46px' : '-24px', zIndex: -1 }} />

          {/* Children section */}
          <div className="flex flex-col items-center">
            {/* Children section */}
            <div className="flex items-start">
              {children.map((child: any, index: number) => {
                // Skip if child is already shown as spouse
                if (spouse && child.id === spouse.id) return null

                const isChildSpouse = allMembers.some((m: any) => m.spouseId === child.id)
                const childHasKids = allMembers.some((m: any) => m.parentId === child.id)
                const shouldRecurse = isChildSpouse || childHasKids

                return (
                  <div key={child.id} className="flex flex-col items-center relative px-8">
                    {/* Horizontal connector pieces */}
                    {children.length > 1 && (
                      <>
                        {/* Left half-line */}
                        {index > 0 && (
                          <div className="absolute top-0 left-0 w-1/2 h-[3px] bg-[var(--lagoon)] shadow-[0_0_8px_rgba(79,184,178,0.5)]" />
                        )}
                        {/* Right half-line */}
                        {index < children.length - 1 && (
                          <div className="absolute top-0 right-0 w-1/2 h-[3px] bg-[var(--lagoon)] shadow-[0_0_8px_rgba(79,184,178,0.5)]" />
                        )}
                      </>
                    )}

                    {/* V-line up from child to connector bar */}
                    <div className="tree-v-line-up" />

                    {shouldRecurse ? (
                      <FamilyBranch
                        member={child}
                        allMembers={allMembers}
                        onSelect={onSelect}
                        onAddChild={onAddChild}
                        onAddSpouse={onAddSpouse}
                      />
                    ) : (
                      <MemberCard
                        member={child}
                        onClick={() => onSelect(child)}
                        onAddChild={() => onAddChild(child)}
                        onAddSpouse={() => onAddSpouse(child)}
                        hasSpouse={false}
                        compact
                      />
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
