import { estimatedUsedPrice } from '../utils/depreciation'

const MOTO_COLORS = {
  essence:     'bg-orange-100 text-orange-700',
  diesel:      'bg-gray-100 text-gray-600',
  hybride:     'bg-emerald-100 text-emerald-700',
  électrique:  'bg-blue-100 text-blue-700',
}

const MOTO_ICONS = {
  essence:    '⛽',
  diesel:     '🛢',
  hybride:    '♻️',
  électrique: '⚡',
}

export function CarCard({ car, selected, onToggle, selectionFull, occasionKm }) {
  const disabled = !selected && selectionFull

  return (
    <div
      className={`bg-white rounded-lg border-2 transition-all shadow-sm hover:shadow-md ${
        selected
          ? 'border-accent ring-2 ring-accent/20'
          : disabled
          ? 'border-gray-100 opacity-50'
          : 'border-gray-200 hover:border-accent/40'
      }`}
    >
      <div className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">{car.marque}</p>
            <h3 className="text-sm font-semibold text-gray-900 leading-tight">{car.modele}</h3>
            <p className="text-[10px] text-gray-400 mt-0.5">{car.annee} · {car.segment}</p>
          </div>
          <button
            onClick={() => onToggle(car)}
            disabled={disabled}
            className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
              selected
                ? 'bg-accent border-accent text-white'
                : disabled
                ? 'border-gray-200 cursor-not-allowed'
                : 'border-gray-300 hover:border-accent'
            }`}
          >
            {selected ? (
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-3 h-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            )}
          </button>
        </div>

        <div className="mb-3">
          {occasionKm ? (
            <>
              <div className="text-lg font-bold text-accent">
                ~{estimatedUsedPrice(car.prix, (occasionKm[0] + occasionKm[1]) / 2).toLocaleString('fr-FR')} €
              </div>
              <div className="text-[10px] text-gray-400">estimé occasion · neuf {car.prix.toLocaleString('fr-FR')} €</div>
            </>
          ) : (
            <div className="text-lg font-bold text-gray-900">{car.prix.toLocaleString('fr-FR')} €</div>
          )}
        </div>

        <div className="flex items-center gap-2 mb-3">
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${MOTO_COLORS[car.motorisation]}`}>
            {MOTO_ICONS[car.motorisation]} {car.motorisation}
          </span>
          <span className="text-xs text-gray-500">{car.puissance} ch</span>
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
          <div className="flex justify-between">
            <span className="text-gray-400">0-100</span>
            <span className="font-medium text-gray-700">{car.zero_cent}s</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">CO₂</span>
            <span className="font-medium text-gray-700">{car.co2} g/km</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Coffre</span>
            <span className="font-medium text-gray-700">{car.coffre} L</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">{car.motorisation === 'électrique' ? 'Autonomie' : 'Conso'}</span>
            <span className="font-medium text-gray-700">
              {car.motorisation === 'électrique' ? `${car.autonomie_km} km` : `${car.consommation} L/100`}
            </span>
          </div>
          <div className="flex justify-between col-span-2">
            <span className="text-gray-400">Hauteur</span>
            <span className={`font-medium ${car.hauteur > 1.55 ? 'text-amber-500' : 'text-gray-700'}`}>
              {car.hauteur.toFixed(2)} m{car.hauteur > 1.55 && ' ▲'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
