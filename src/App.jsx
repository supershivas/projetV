import { useState, useMemo, useRef } from 'react'
import carsData from './data/cars.json'
import { useLocalStorage } from './hooks/useLocalStorage'
import { Header } from './components/Header'
import { FilterPanel } from './components/FilterPanel'
import { SortBar } from './components/SortBar'
import { CarCard } from './components/CarCard'
import { ComparisonTable } from './components/ComparisonTable'

const DEFAULT_FILTERS = {
  motorisations: [],
  segments: [],
  marques: [],
  prix: [15000, 65000],
  puissance: [60, 320],
}

const marques = [...new Set(carsData.map((c) => c.marque))].sort()

export default function App() {
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState(DEFAULT_FILTERS)
  const [sort, setSort] = useState({ key: 'prix', dir: 'asc' })
  const [selection, setSelection] = useLocalStorage('comparison-selection', [])
  const [showComparison, setShowComparison] = useState(false)
  const comparisonRef = useRef(null)

  const filtered = useMemo(() => {
    let cars = carsData
    if (search.trim()) {
      const q = search.toLowerCase()
      cars = cars.filter(
        (c) => c.marque.toLowerCase().includes(q) || c.modele.toLowerCase().includes(q)
      )
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
    <div className="min-h-screen bg-gray-50">
      <Header selectionCount={selection.length} onViewComparison={handleViewComparison} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Comparez les voitures</h1>
          <p className="text-gray-500 text-sm">
            {carsData.length} modèles · Sélectionnez 2 à 4 voitures pour les comparer côte à côte
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Rechercher par marque ou modèle…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent shadow-sm"
          />
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <aside className="lg:w-64 flex-shrink-0 space-y-4">
            <FilterPanel
              filters={filters}
              onChange={setFilters}
              marques={marques}
              onReset={() => setFilters(DEFAULT_FILTERS)}
            />

            {/* Selection summary */}
            {selection.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  Sélection ({selection.length}/4)
                </p>
                <ul className="space-y-2">
                  {selectedCars.map((car) => (
                    <li key={car.id} className="flex items-center justify-between text-sm">
                      <span className="text-gray-700">{car.marque} {car.modele}</span>
                      <button
                        onClick={() => removeFromSelection(car.id)}
                        className="text-gray-300 hover:text-red-400 transition-colors ml-2"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </li>
                  ))}
                </ul>
                {selection.length >= 2 && (
                  <button
                    onClick={handleViewComparison}
                    className="mt-3 w-full bg-accent-600 hover:bg-accent-700 text-white text-xs font-medium py-2 rounded-lg transition-colors"
                  >
                    Voir la comparaison
                  </button>
                )}
              </div>
            )}
          </aside>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Sort + count */}
            <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center mb-4">
              <p className="text-sm text-gray-500">{filtered.length} voiture{filtered.length > 1 ? 's' : ''}</p>
              <SortBar sort={sort} onSort={setSort} />
            </div>

            {/* Grid */}
            {filtered.length === 0 ? (
              <div className="text-center py-20 text-gray-400">
                <svg className="w-12 h-12 mx-auto mb-3 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="font-medium">Aucune voiture trouvée</p>
                <p className="text-sm">Modifiez vos filtres ou votre recherche</p>
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
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Comparison section */}
        {showComparison && selectedCars.length >= 2 && (
          <div ref={comparisonRef} className="mt-12 pt-8 border-t border-gray-200">
            <ComparisonTable cars={selectedCars} onRemove={removeFromSelection} />
          </div>
        )}
      </main>
    </div>
  )
}
