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

function RangeSlider({ label, min, max, value, onChange, format, step = 1 }) {
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
          step={step}
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
          step={step}
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
  const [open, setOpen] = useState(true)

  const activeCount = [
    filters.motorisations.length,
    filters.segments.length,
    filters.marques.length,
    filters.annee[0] > 2021 || filters.annee[1] < 2024 ? 1 : 0,
    filters.prix[0] > 15000 || filters.prix[1] < 65000 ? 1 : 0,
    filters.puissance[0] > 60 || filters.puissance[1] < 320 ? 1 : 0,
    filters.hauteur[0] > 140 || filters.hauteur[1] < 170 ? 1 : 0,
    filters.occasion.actif ? 1 : 0,
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
            label="Année"
            min={2021}
            max={2024}
            step={1}
            value={filters.annee}
            onChange={(v) => onChange({ ...filters, annee: v })}
            format={(v) => `${v}`}
          />
          <RangeSlider
            label="Prix neuf"
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

          {/* Occasion */}
          <div className="border-t border-gray-100 pt-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Tarif occasion</p>
              <button
                onClick={() => onChange({ ...filters, occasion: { ...filters.occasion, actif: !filters.occasion.actif } })}
                className={`relative inline-flex h-5 w-9 flex-shrink-0 rounded-full border-2 border-transparent transition-colors ${
                  filters.occasion.actif ? 'bg-accent-600' : 'bg-gray-200'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${filters.occasion.actif ? 'translate-x-4' : 'translate-x-0'}`} />
              </button>
            </div>
            {filters.occasion.actif && (
              <div className="space-y-4">
                <RangeSlider
                  label="Kilométrage"
                  min={0}
                  max={200000}
                  step={5000}
                  value={filters.occasion.km}
                  onChange={(v) => onChange({ ...filters, occasion: { ...filters.occasion, km: v } })}
                  format={(v) => v === 0 ? '0 km' : `${(v / 1000).toFixed(0)}k km`}
                />
                <RangeSlider
                  label="Prix estimé occasion"
                  min={5000}
                  max={60000}
                  step={1000}
                  value={filters.occasion.prix}
                  onChange={(v) => onChange({ ...filters, occasion: { ...filters.occasion, prix: v } })}
                  format={(v) => `${(v / 1000).toFixed(0)}k€`}
                />
                <p className="text-xs text-gray-400 leading-relaxed">
                  Prix estimé basé sur la dépréciation moyenne au kilométrage sélectionné.
                </p>
              </div>
            )}
          </div>

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
