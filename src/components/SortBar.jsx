const SORTS = [
  { key: 'prix', label: 'Prix' },
  { key: 'puissance', label: 'Puissance' },
  { key: 'consommation', label: 'Consommation' },
  { key: 'co2', label: 'CO₂' },
  { key: 'zero_cent', label: '0-100' },
]

export function SortBar({ sort, onSort }) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Trier par</span>
      {SORTS.map((s) => (
        <button
          key={s.key}
          onClick={() => {
            if (sort.key === s.key) {
              onSort({ key: s.key, dir: sort.dir === 'asc' ? 'desc' : 'asc' })
            } else {
              onSort({ key: s.key, dir: 'asc' })
            }
          }}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
            sort.key === s.key
              ? 'bg-accent-600 border-accent-600 text-white'
              : 'bg-white border-gray-200 text-gray-600 hover:border-accent-400'
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
