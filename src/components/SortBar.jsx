const SORTS = [
  { key: 'prix', label: 'Prix' },
  { key: 'puissance', label: 'Puissance' },
  { key: 'consommation', label: 'Conso' },
  { key: 'co2', label: 'CO₂' },
  { key: 'zero_cent', label: '0-100' },
]

export function SortBar({ sort, onSort }) {
  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      <span className="text-xs text-gray-400 mr-1">Trier par</span>
      {SORTS.map((s) => (
        <button
          key={s.key}
          onClick={() => onSort({ key: s.key, dir: sort.key === s.key && sort.dir === 'asc' ? 'desc' : 'asc' })}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium border transition-colors ${
            sort.key === s.key
              ? 'bg-accent text-white border-accent'
              : 'bg-white border-gray-200 text-gray-600 hover:border-accent'
          }`}
        >
          {s.label}
          {sort.key === s.key && (
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d={sort.dir === 'asc' ? 'M5 15l7-7 7 7' : 'M19 9l-7 7-7-7'} />
            </svg>
          )}
        </button>
      ))}
    </div>
  )
}
