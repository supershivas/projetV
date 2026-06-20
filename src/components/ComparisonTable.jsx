function exportCSV(cars) {
  const headers = [
    'Marque', 'Modèle', 'Année', 'Segment', 'Prix (€)', 'Motorisation',
    'Puissance (ch)', 'Consommation', 'Autonomie (km)', 'CO2 (g/km)',
    '0-100 (s)', 'Coffre (L)', 'Transmission', 'Places', 'Hauteur (m)',
  ]
  const rows = cars.map((c) => [
    c.marque, c.modele, c.annee, c.segment, c.prix, c.motorisation,
    c.puissance,
    c.motorisation === 'électrique' ? `${c.consommation} kWh/100` : `${c.consommation} L/100`,
    c.autonomie_km ?? '-',
    c.co2, c.zero_cent, c.coffre, c.transmission, c.places, c.hauteur,
  ])
  const csv = [headers, ...rows].map((r) => r.join(';')).join('\n')
  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'comparaison-voitures.csv'
  a.click()
  URL.revokeObjectURL(url)
}

const ROWS = [
  { key: 'segment', label: 'Segment' },
  { key: 'prix', label: 'Prix', format: (v) => `${v.toLocaleString('fr-FR')} €` },
  { key: 'motorisation', label: 'Motorisation' },
  { key: 'puissance', label: 'Puissance', format: (v) => `${v} ch` },
  {
    key: '_conso',
    label: 'Consommation',
    format: (_, car) =>
      car.motorisation === 'électrique'
        ? `${car.consommation} kWh/100km`
        : `${car.consommation} L/100km`,
    best: 'min',
    getValue: (car) => car.consommation,
  },
  {
    key: 'autonomie_km',
    label: 'Autonomie',
    format: (v, car) => (car.motorisation === 'électrique' ? `${v} km` : '—'),
    best: 'max',
    getValue: (car) => car.autonomie_km ?? null,
  },
  { key: 'co2', label: 'CO₂', format: (v) => `${v} g/km`, best: 'min', getValue: (car) => car.co2 },
  { key: 'zero_cent', label: '0-100 km/h', format: (v) => `${v} s`, best: 'min', getValue: (car) => car.zero_cent },
  { key: 'coffre', label: 'Coffre', format: (v) => `${v} L`, best: 'max', getValue: (car) => car.coffre },
  { key: 'transmission', label: 'Transmission' },
  { key: 'places', label: 'Places' },
  { key: 'hauteur', label: 'Hauteur', format: (v) => `${v} m` },
]

function getBestIdx(cars, row) {
  if (!row.best || !row.getValue) return -1
  const vals = cars.map((c) => row.getValue(c))
  const valid = vals.filter((v) => v !== null)
  if (!valid.length) return -1
  const best = row.best === 'min' ? Math.min(...valid) : Math.max(...valid)
  return vals.indexOf(best)
}

export function ComparisonTable({ cars, onRemove }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Comparaison</h2>
        <button
          onClick={() => exportCSV(cars)}
          className="flex items-center gap-2 text-sm text-accent-600 hover:text-accent-800 font-medium border border-accent-200 hover:border-accent-400 px-3 py-1.5 rounded-lg transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Exporter CSV
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider w-36">
                Caractéristique
              </th>
              {cars.map((car) => (
                <th key={car.id} className="px-4 py-3 text-center min-w-40">
                  <div className="flex flex-col items-center gap-1">
                    <div className="text-xs text-gray-500 font-normal">{car.marque}</div>
                    <div className="font-semibold text-gray-900">{car.modele}</div>
                    <div className="text-xs text-gray-400">{car.annee}</div>
                    <button
                      onClick={() => onRemove(car.id)}
                      className="mt-1 text-gray-300 hover:text-red-400 transition-colors"
                      title="Retirer"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row, i) => {
              const bestIdx = getBestIdx(cars, row)
              return (
                <tr key={row.key} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                  <td className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider border-r border-gray-100">
                    {row.label}
                  </td>
                  {cars.map((car, ci) => {
                    const rawVal = row.getValue ? row.getValue(car) : car[row.key]
                    const display = row.format ? row.format(rawVal, car) : rawVal
                    const isBest = bestIdx === ci
                    return (
                      <td
                        key={car.id}
                        className={`px-4 py-3 text-center font-medium ${
                          isBest ? 'text-green-700 bg-green-50' : 'text-gray-800'
                        }`}
                      >
                        {display ?? '—'}
                        {isBest && <span className="ml-1 text-green-500 text-xs">✓</span>}
                      </td>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-gray-400 mt-2">✓ indique la meilleure valeur parmi les voitures sélectionnées</p>
    </div>
  )
}
