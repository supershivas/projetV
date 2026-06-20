import { useState, useMemo, useRef } from 'react'
import carsData from './data/cars.json'
import { useLocalStorage } from './hooks/useLocalStorage'
import { estimatedUsedPrice } from './utils/depreciation'
import { Header } from './components/Header'
import { FilterPanel } from './components/FilterPanel'
import { SortBar } from './components/SortBar'
import { CarCard } from './components/CarCard'
import { ComparisonTable } from './components/ComparisonTable'
import { SavedSearches, buildTitle } from './components/SavedSearches'
import { FilterTags } from './components/FilterTags'

const DEFAULT_FILTERS = {
  annees: [],
  motorisations: [],
  segments: [],
  marques: [],
  prix: [15000, 65000],
  puissance: [60, 320],
  hauteur: [140, 155],
  occasion: { actif: false, km: [0, 100000], prix: [5000, 60000] },
}

const marques = [...new Set(carsData.map((c) => c.marque))].sort()

export default function App() {
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState(DEFAULT_FILTERS)
  const [sort, setSort] = useState({ key: 'prix', dir: 'asc' })
  const [selection, setSelection] = useLocalStorage('comparison-selection', [])
  const [savedSearches, setSavedSearches] = useLocalStorage('saved-searches', [])
  const [showComparison, setShowComparison] = useState(false)
  const comparisonRef = useRef(null)

  function saveSearch() {
    const title = buildTitle(filters, search)
    setSavedSearches((prev) => [
      { id: Date.now(), title, filters, search },
      ...prev.filter((s) => s.title !== title),
    ])
  }

  function loadSearch(s) {
    setFilters(s.filters)
    setSearch(s.search)
  }

  function deleteSearch(id) {
    setSavedSearches((prev) => prev.filter((s) => s.id !== id))
  }

  const filtered = useMemo(() => {
    let cars = carsData
    if (search.trim()) {
      const q = search.toLowerCase()
      cars = cars.filter(
        (c) => c.marque.toLowerCase().includes(q) || c.modele.toLowerCase().includes(q)
      )
    }
    if (filters.annees.length) {
      cars = cars.filter((c) => filters.annees.includes(String(c.annee)))
    }
    if (filters.motorisations.length) {
      cars = cars.filter((c) => filters.motorisations.includes(c.motorisation))
    }
    if (filters.segments.length) {
      cars = cars.filter((c) => filters.segments.includes(c.segment))
    }
    if (filters.marques.length) {
      cars = cars.filter((c) => filters.marques.includes(c.marque))
    }
    cars = cars.filter(
      (c) => c.prix >= filters.prix[0] && c.prix <= filters.prix[1]
    )
    cars = cars.filter(
      (c) => c.puissance >= filters.puissance[0] && c.puissance <= filters.puissance[1]
    )
    cars = cars.filter(
      (c) => c.hauteur * 100 >= filters.hauteur[0] && c.hauteur * 100 <= filters.hauteur[1]
    )
    if (filters.occasion.actif) {
      const [kmMin, kmMax] = filters.occasion.km
      const [prixMin, prixMax] = filters.occasion.prix
      cars = cars.filter((c) => {
        const midKm = (kmMin + kmMax) / 2
        const estimated = estimatedUsedPrice(c.prix, midKm)
        return estimated >= prixMin && estimated <= prixMax
      })
    }
    return [...cars].sort((a, b) => {
      const v = sort.dir === 'asc' ? 1 : -1
      return (a[sort.key] - b[sort.key]) * v
    })
  }, [search, filters, sort])

  const selectedCars = useMemo(
    () => selection.map((id) => carsData.find((c) => c.id === id)).filter(Boolean),
    [selection]
  )

  function toggleSelection(car) {
    setSelection((prev) => {
      if (prev.includes(car.id)) return prev.filter((id) => id !== car.id)
      if (prev.length >= 4) return prev
      return [...prev, car.id]
    })
  }

  function removeFromSelection(id) {
    setSelection((prev) => prev.filter((i) => i !== id))
    if (selectedCars.length <= 1) setShowComparison(false)
  }

  function handleViewComparison() {
    setShowComparison(true)
    setTimeout(() => comparisonRef.current?.scrollIntoView({ behavior: 'smooth' }), 50)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header selectionCount={selection.length} onViewComparison={handleViewComparison} />

      <div className="flex flex-1 min-h-0">
        {/* Sidebar sombre */}
        <aside className="hidden lg:flex flex-col w-64 flex-shrink-0 bg-sidebar-bg border-r border-sidebar-border min-h-screen">
          {/* Branding */}
          <div className="flex items-center gap-2.5 px-3 border-b border-sidebar-border" style={{ minHeight: '52px' }}>
            <div className="w-6 h-6 rounded-md bg-accent flex items-center justify-center flex-shrink-0">
              <svg className="w-3.5 h-3.5" fill="white" viewBox="0 0 32 32">
                <path d="M6 20a2 2 0 1 0 4 0 2 2 0 0 0-4 0zm16 0a2 2 0 1 0 4 0 2 2 0 0 0-4 0z" />
                <path d="M28 18l-2-6a1 1 0 0 0-.9-.6H7.5l-1.8 4.4A2 2 0 0 0 4 18v3h2a3 3 0 0 1 6 0h8a3 3 0 0 1 6 0h2v-3z" opacity="0.95" />
                <path d="M9 14l1.2-3h11.6l1.2 3H9z" fill="#C0392B" />
              </svg>
            </div>
            <span className="font-semibold text-sidebar-fg text-sm">AutoCompare</span>
          </div>

          {/* Search */}
          <div className="px-2 py-2 border-b border-sidebar-border">
            <div className="relative">
              <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-sidebar-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Rechercher…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-8 pr-3 text-sm bg-white/10 border border-white/10 rounded-md text-sidebar-fg placeholder-sidebar-muted focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent"
                style={{ height: '36px' }}
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex-1 overflow-y-auto p-2">
            <FilterPanel
              filters={filters}
              onChange={setFilters}
              marques={marques}
              onReset={() => setFilters(DEFAULT_FILTERS)}
            />

            {/* Saved searches */}
            <div className="my-1 border-t border-sidebar-border" />
            <div className="mt-2">
              <SavedSearches
                savedSearches={savedSearches}
                onLoad={loadSearch}
                onDelete={deleteSearch}
                onSave={saveSearch}
                currentFilters={filters}
                currentSearch={search}
              />
            </div>

            {/* Divider */}
            <div className="my-1 border-t border-sidebar-border" />

            {/* Selection */}
            {selection.length > 0 && (
              <div className="mt-2 px-1">
                <p className="text-xs font-semibold text-sidebar-muted uppercase tracking-wider px-2 mb-2">
                  Sélection ({selection.length}/4)
                </p>
                <ul className="space-y-0.5">
                  {selectedCars.map((car) => (
                    <li key={car.id} className="flex items-center justify-between px-2 py-1.5 rounded-sm hover:bg-sidebar-hover group">
                      <span className="text-xs text-sidebar-fg truncate">{car.marque} {car.modele}</span>
                      <button
                        onClick={() => removeFromSelection(car.id)}
                        className="text-sidebar-muted hover:text-accent-fg_soft ml-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                      >
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </li>
                  ))}
                </ul>
                {selection.length >= 2 && (
                  <button
                    onClick={handleViewComparison}
                    className="mt-3 w-full bg-accent hover:bg-accent-hover text-white text-xs font-medium py-2 rounded-lg transition-colors"
                  >
                    Voir la comparaison
                  </button>
                )}
              </div>
            )}
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0 overflow-auto">
          {/* Hero */}
          <div className="border-b border-gray-200 bg-white px-6 py-5">
            <h1 className="font-title text-2xl font-semibold text-gray-900 mb-1">
              Comparez les voitures
            </h1>
            <p className="text-gray-500 text-sm mb-3">
              Sélectionnez 2 à 4 voitures pour les comparer côte à côte
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                { icon: '🚗', label: `${carsData.length} modèles` },
                { icon: '👥', label: '5 places' },
                { icon: '🗺️', label: 'Marché européen' },
                { icon: '⛽', label: 'Essence · Hybride · Électrique' },
                { icon: '📐', label: '6 segments' },
                { icon: '📅', label: '2021 – 2025' },
              ].map(({ icon, label }) => (
                <span key={label} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-gray-100 text-xs text-gray-600">
                  <span>{icon}</span>
                  {label}
                </span>
              ))}
            </div>
          </div>

          {/* Mobile search */}
          <div className="lg:hidden px-4 pt-4">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Rechercher par marque ou modèle…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent shadow-sm"
              />
            </div>
          </div>

          <div className="p-4 lg:p-6">
            <FilterTags
              filters={filters}
              search={search}
              onChange={setFilters}
              onSearchChange={setSearch}
            />

            {/* Sort + count */}
            <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center mb-5">
              <p className="text-sm text-gray-500">{filtered.length} voiture{filtered.length > 1 ? 's' : ''}</p>
              <SortBar sort={sort} onSort={setSort} />
            </div>

            {/* Grid */}
            {filtered.length === 0 ? (
              <div className="text-center py-20 text-gray-400">
                <svg className="w-12 h-12 mx-auto mb-3 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="font-medium text-gray-500">Aucune voiture trouvée</p>
                <p className="text-sm mt-1">Modifiez vos filtres ou votre recherche</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {filtered.map((car) => (
                  <CarCard
                    key={car.id}
                    car={car}
                    selected={selection.includes(car.id)}
                    onToggle={toggleSelection}
                    selectionFull={selection.length >= 4}
                    occasionKm={filters.occasion.actif ? filters.occasion.km : null}
                  />
                ))}
              </div>
            )}

            {/* Comparison section */}
            {showComparison && selectedCars.length >= 2 && (
              <div ref={comparisonRef} className="mt-12 pt-8 border-t border-gray-200">
                <ComparisonTable cars={selectedCars} onRemove={removeFromSelection} />
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
