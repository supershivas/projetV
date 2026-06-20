import { useState } from 'react'

const MOTORISATIONS = ['essence', 'diesel', 'hybride', 'électrique']
const SEGMENTS = ['Citadine', 'Compacte', 'Berline', 'SUV Compact', 'SUV', 'Familiale']

function MultiCheckbox({ label, options, selected, onChange }) {
  return (
    <div>
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const active = selected.includes(opt)
          return (
            <button
              key={opt}
              onClick={() => onChange(active ? selected.filter((s) => s !== opt) : [...selected, opt])}
              className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                active
                  ? 'bg-accent-600 border-accent-600 text-white'
                  : 'bg-white border-gray-300 text-gray-600 hover:border-accent-400'
              }`}
            >
              {opt}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function RangeSlider({ label, min, max, value, onChange, format }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{label}</p>
        <span className="text-xs text-gray-600">{format(value[0])} – {format(value[1])}</span>
      </div>
      <div className="space-y-1">
        <input
          type="range"
          min={min}
          max={max}
          value={value[0]}
          onChange={(e) => {
            const v = Number(e.target.value)
            onChange([Math.min(v, value[1]), value[1]])
          }}
          className="w-full accent-accent-600"
        />
        <input
          type="range"
          min={min}
          max={max}
          value={value[1]}
          onChange={(e) => {
            const v = Number(e.target.value)
            onChange([value[0], Math.max(v, value[0])])
          }}
          className="w-full accent-accent-600"
        />
      </div>
    </div>
  )
}

export function FilterPanel({ filters, onChange, marques, onReset }) {
  const [open, setOpen] = useState(false)

  const activeCount = [
    filters.motorisations.length,
    filters.segments.length,
    filters.marques.length,
    filters.prix[0] > 15000 || filters.prix[1] < 65000 ? 1 : 0,
    filters.puissance[0] > 60 || filters.puissance[1] < 320 ? 1 : 0,
    filters.hauteur[0] > 140 || filters.hauteur[1] < 170 ? 1 : 0,
  ].reduce((a, b) => a + b, 0)

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-gray-700"
      >
        <span className="flex items-center gap-2">
          <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
          </svg>
          Filtres
          {activeCount > 0 && (
            <span className="bg-accent-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{activeCount}</span>
          )}
        </span>
        <svg className={`w-4 h-4 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="px-4 pb-4 border-t border-gray-100 space-y-5 pt-4">
          <MultiCheckbox
            label="Motorisation"
            options={MOTORISATIONS}
            selected={filters.motorisations}
            onChange={(v) => onChange({ ...filters, motorisations: v })}
          />
          <MultiCheckbox
            label="Segment"
            options={SEGMENTS}
            selected={filters.segments}
            onChange={(v) => onChange({ ...filters, segments: v })}
          />
          <MultiCheckbox
            label="Marque"
            options={marques}
            selected={filters.marques}
            onChange={(v) => onChange({ ...filters, marques: v })}
          />
          <RangeSlider
            label="Prix"
            min={15000}
            max={65000}
            value={filters.prix}
            onChange={(v) => onChange({ ...filters, prix: v })}
            format={(v) => `${(v / 1000).toFixed(0)}k€`}
          />
          <RangeSlider
            label="Puissance (ch)"
            min={60}
            max={320}
            value={filters.puissance}
            onChange={(v) => onChange({ ...filters, puissance: v })}
            format={(v) => `${v} ch`}
          />
          <RangeSlider
            label="Hauteur (m)"
            min={140}
            max={170}
            value={filters.hauteur}
            onChange={(v) => onChange({ ...filters, hauteur: v })}
            format={(v) => `${(v / 100).toFixed(2)} m`}
          />
          {activeCount > 0 && (
            <button
              onClick={onReset}
              className="text-xs text-accent-600 hover:text-accent-800 font-medium"
            >
              Réinitialiser les filtres
            </button>
          )}
        </div>
      )}
    </div>
  )
}
