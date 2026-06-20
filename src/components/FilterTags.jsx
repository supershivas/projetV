const DEFAULT_PRIX = [15000, 65000]
const DEFAULT_PUISSANCE = [60, 320]
const DEFAULT_HAUTEUR = [140, 155]

export function FilterTags({ filters, search, onChange, onSearchChange }) {
  const tags = []

  if (search.trim()) {
    tags.push({
      id: 'search',
      label: `"${search.trim()}"`,
      onRemove: () => onSearchChange(''),
    })
  }

  filters.annees.forEach((a) =>
    tags.push({ id: `annee_${a}`, label: a, onRemove: () => onChange({ ...filters, annees: filters.annees.filter((x) => x !== a) }) })
  )

  filters.motorisations.forEach((m) =>
    tags.push({ id: `moto_${m}`, label: m, onRemove: () => onChange({ ...filters, motorisations: filters.motorisations.filter((x) => x !== m) }) })
  )

  filters.segments.forEach((s) =>
    tags.push({ id: `seg_${s}`, label: s, onRemove: () => onChange({ ...filters, segments: filters.segments.filter((x) => x !== s) }) })
  )

  filters.marques.forEach((m) =>
    tags.push({ id: `marque_${m}`, label: m, onRemove: () => onChange({ ...filters, marques: filters.marques.filter((x) => x !== m) }) })
  )

  if (filters.prix[0] !== DEFAULT_PRIX[0] || filters.prix[1] !== DEFAULT_PRIX[1]) {
    tags.push({
      id: 'prix',
      label: `${(filters.prix[0]/1000).toFixed(0)}–${(filters.prix[1]/1000).toFixed(0)}k€`,
      onRemove: () => onChange({ ...filters, prix: DEFAULT_PRIX }),
    })
  }

  if (filters.puissance[0] !== DEFAULT_PUISSANCE[0] || filters.puissance[1] !== DEFAULT_PUISSANCE[1]) {
    tags.push({
      id: 'puissance',
      label: `${filters.puissance[0]}–${filters.puissance[1]} ch`,
      onRemove: () => onChange({ ...filters, puissance: DEFAULT_PUISSANCE }),
    })
  }

  if (filters.hauteur[0] !== DEFAULT_HAUTEUR[0] || filters.hauteur[1] !== DEFAULT_HAUTEUR[1]) {
    tags.push({
      id: 'hauteur',
      label: `hauteur ≤ ${(filters.hauteur[1]/100).toFixed(2)} m`,
      onRemove: () => onChange({ ...filters, hauteur: DEFAULT_HAUTEUR }),
    })
  } else {
    // tag par défaut hauteur max 1.55m — toujours visible, non supprimable
    tags.unshift({
      id: 'hauteur_default',
      label: 'hauteur ≤ 1.55 m',
      onRemove: null,
      isDefault: true,
    })
  }

  if (filters.occasion.actif) {
    const [kmMin, kmMax] = filters.occasion.km
    tags.push({
      id: 'occasion',
      label: `occasion ${(kmMin/1000).toFixed(0)}–${(kmMax/1000).toFixed(0)}k km`,
      onRemove: () => onChange({ ...filters, occasion: { ...filters.occasion, actif: false } }),
    })
  }

  if (tags.length === 0) return null

  return (
    <div className="flex flex-wrap gap-1.5 mb-4">
      {tags.map((tag) => (
        <span
          key={tag.id}
          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
            tag.isDefault
              ? 'bg-gray-100 text-gray-500 border border-gray-200'
              : 'bg-accent/10 text-accent border border-accent/20'
          }`}
        >
          {tag.label}
          {tag.onRemove && (
            <button
              onClick={tag.onRemove}
              className="ml-0.5 hover:text-accent-hover transition-colors"
              aria-label={`Supprimer le filtre ${tag.label}`}
            >
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </span>
      ))}
    </div>
  )
}
