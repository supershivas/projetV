import { useState } from 'react'

function buildTitle(filters, search) {
  const parts = []
  if (search.trim()) parts.push(`"${search.trim()}"`)
  if (filters.annees.length) parts.push(filters.annees.join(', '))
  if (filters.motorisations.length) parts.push(filters.motorisations.join('+'))
  if (filters.segments.length) parts.push(filters.segments.join('+'))
  if (filters.marques.length) parts.push(filters.marques.slice(0, 3).join(', '))
  if (filters.prix[0] > 15000 || filters.prix[1] < 65000)
    parts.push(`${(filters.prix[0]/1000).toFixed(0)}–${(filters.prix[1]/1000).toFixed(0)}k€`)
  if (filters.hauteur[1] < 170)
    parts.push(`≤${(filters.hauteur[1]/100).toFixed(2)}m`)
  return parts.length ? parts.join(' · ') : 'Toutes les voitures'
}

export function SavedSearches({ savedSearches, onLoad, onDelete, onSave, currentFilters, currentSearch }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="px-2 mb-2">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[10px] font-semibold text-sidebar-muted uppercase tracking-wider">
          Recherches sauvegardées
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={onSave}
            title="Sauvegarder la recherche actuelle"
            className="text-sidebar-muted hover:text-sidebar-fg transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
          {savedSearches.length > 0 && (
            <button onClick={() => setOpen(!open)} className="text-sidebar-muted hover:text-sidebar-fg transition-colors">
              <svg className={`w-3.5 h-3.5 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {savedSearches.length === 0 && (
        <p className="text-[10px] text-sidebar-muted px-0 italic">Aucune recherche sauvegardée</p>
      )}

      {(open || savedSearches.length <= 3) && savedSearches.map((s) => (
        <div
          key={s.id}
          className="flex items-center justify-between py-1 px-1 rounded hover:bg-sidebar-hover group cursor-pointer"
          onClick={() => onLoad(s)}
        >
          <span className="text-xs text-sidebar-fg truncate flex-1">{s.title}</span>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(s.id) }}
            className="opacity-0 group-hover:opacity-100 text-sidebar-muted hover:text-accent-fg_soft transition-all ml-1 flex-shrink-0"
          >
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  )
}

export { buildTitle }
