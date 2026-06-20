const MOTORISATIONS = ['essence', 'diesel', 'hybride', 'électrique']
const SEGMENTS = ['Citadine', 'Compacte', 'Berline', 'SUV Compact', 'SUV', 'Familiale']
const ANNEES = ['2021', '2022', '2023', '2024', '2025']

function SidebarLabel({ children }) {
  return (
    <p className="text-[10px] font-semibold text-sidebar-muted uppercase tracking-wider px-2 mb-1.5">
      {children}
    </p>
  )
}

function ToggleGroup({ options, selected, onChange }) {
  return (
    <div className="flex flex-wrap gap-1 px-2 mb-3">
      {options.map((opt) => {
        const active = selected.includes(opt)
        return (
          <button
            key={opt}
            onClick={() => onChange(active ? selected.filter((s) => s !== opt) : [...selected, opt])}
            className={`px-2 py-0.5 rounded text-xs font-medium transition-colors ${
              active
                ? 'bg-accent text-white'
                : 'bg-white/5 text-sidebar-muted hover:bg-sidebar-hover hover:text-sidebar-fg border border-white/10'
            }`}
          >
            {opt}
          </button>
        )
      })}
    </div>
  )
}

function RangeSlider({ label, min, max, value, onChange, format, step = 1 }) {
  return (
    <div className="px-2 mb-3">
      <div className="flex justify-between items-center mb-1">
        <span className="text-[10px] font-semibold text-sidebar-muted uppercase tracking-wider">{label}</span>
        <span className="text-[10px] text-sidebar-muted">{format(value[0])} – {format(value[1])}</span>
      </div>
      <div className="space-y-1">
        <input type="range" min={min} max={max} step={step} value={value[0]}
          onChange={(e) => { const v = Number(e.target.value); onChange([Math.min(v, value[1]), value[1]]) }}
          className="w-full accent-accent"
        />
        <input type="range" min={min} max={max} step={step} value={value[1]}
          onChange={(e) => { const v = Number(e.target.value); onChange([value[0], Math.max(v, value[0])]) }}
          className="w-full accent-accent"
        />
      </div>
    </div>
  )
}

function Divider() {
  return <div className="my-1 border-t border-sidebar-border" />
}

export function FilterPanel({ filters, onChange, marques, onReset }) {
  const activeCount = [
    filters.annees.length,
    filters.motorisations.length,
    filters.segments.length,
    filters.marques.length,
    filters.prix[0] > 15000 || filters.prix[1] < 65000 ? 1 : 0,
    filters.puissance[0] > 60 || filters.puissance[1] < 320 ? 1 : 0,
    filters.hauteur[0] > 140 || filters.hauteur[1] < 155 ? 1 : 0,
    filters.occasion.actif ? 1 : 0,
  ].reduce((a, b) => a + b, 0)

  return (
    <div className="py-2">
      <div className="flex items-center justify-between px-2 mb-3">
        <span className="text-[10px] font-semibold text-sidebar-muted uppercase tracking-wider">
          Filtres{activeCount > 0 && ` · ${activeCount} actif${activeCount > 1 ? 's' : ''}`}
        </span>
        {activeCount > 0 && (
          <button onClick={onReset} className="text-[10px] text-accent-fg_soft hover:text-white transition-colors">
            Réinitialiser
          </button>
        )}
      </div>

      <SidebarLabel>Année</SidebarLabel>
      <ToggleGroup
        options={ANNEES}
        selected={filters.annees}
        onChange={(v) => onChange({ ...filters, annees: v })}
      />

      <Divider />

      <SidebarLabel>Motorisation</SidebarLabel>
      <ToggleGroup
        options={MOTORISATIONS}
        selected={filters.motorisations}
        onChange={(v) => onChange({ ...filters, motorisations: v })}
      />

      <Divider />

      <SidebarLabel>Segment</SidebarLabel>
      <ToggleGroup
        options={SEGMENTS}
        selected={filters.segments}
        onChange={(v) => onChange({ ...filters, segments: v })}
      />

      <Divider />

      <SidebarLabel>Marque</SidebarLabel>
      <ToggleGroup
        options={marques}
        selected={filters.marques}
        onChange={(v) => onChange({ ...filters, marques: v })}
      />

      <Divider />

      <RangeSlider
        label="Prix neuf"
        min={15000} max={65000}
        value={filters.prix}
        onChange={(v) => onChange({ ...filters, prix: v })}
        format={(v) => `${(v / 1000).toFixed(0)}k€`}
      />

      <RangeSlider
        label="Puissance (ch)"
        min={60} max={320}
        value={filters.puissance}
        onChange={(v) => onChange({ ...filters, puissance: v })}
        format={(v) => `${v} ch`}
      />

      <RangeSlider
        label="Hauteur (m)"
        min={140} max={175}
        value={filters.hauteur}
        onChange={(v) => onChange({ ...filters, hauteur: v })}
        format={(v) => `${(v / 100).toFixed(2)} m`}
      />

      <Divider />

      {/* Occasion */}
      <div className="px-2 mb-2">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-semibold text-sidebar-muted uppercase tracking-wider">Tarif occasion</span>
          <button
            onClick={() => onChange({ ...filters, occasion: { ...filters.occasion, actif: !filters.occasion.actif } })}
            className={`relative inline-flex h-4 w-7 flex-shrink-0 rounded-full transition-colors ${
              filters.occasion.actif ? 'bg-accent' : 'bg-white/20'
            }`}
          >
            <span className={`inline-block h-3 w-3 mt-0.5 transform rounded-full bg-white shadow transition-transform ${filters.occasion.actif ? 'translate-x-3.5' : 'translate-x-0.5'}`} />
          </button>
        </div>
        {filters.occasion.actif && (
          <div className="space-y-0">
            <RangeSlider
              label="Kilométrage"
              min={0} max={200000} step={5000}
              value={filters.occasion.km}
              onChange={(v) => onChange({ ...filters, occasion: { ...filters.occasion, km: v } })}
              format={(v) => v === 0 ? '0 km' : `${(v / 1000).toFixed(0)}k km`}
            />
            <RangeSlider
              label="Prix estimé occasion"
              min={5000} max={60000} step={1000}
              value={filters.occasion.prix}
              onChange={(v) => onChange({ ...filters, occasion: { ...filters.occasion, prix: v } })}
              format={(v) => `${(v / 1000).toFixed(0)}k€`}
            />
          </div>
        )}
      </div>
    </div>
  )
}
