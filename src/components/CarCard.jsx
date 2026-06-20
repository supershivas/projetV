const MOTO_COLORS = {
  essence: 'bg-orange-100 text-orange-700',
  diesel: 'bg-gray-100 text-gray-700',
  hybride: 'bg-green-100 text-green-700',
  électrique: 'bg-blue-100 text-blue-700',
}

const MOTO_ICONS = {
  essence: '⛽',
  diesel: '🛢',
  hybride: '♻️',
  électrique: '⚡',
}

export function CarCard({ car, selected, onToggle, selectionFull }) {
  const disabled = !selected && selectionFull

  return (
    <div
      className={`bg-white rounded-xl border-2 transition-all shadow-sm hover:shadow-md ${
        selected
          ? 'border-accent-500 ring-2 ring-accent-200'
          : disabled
          ? 'border-gray-100 opacity-60'
          : 'border-gray-200 hover:border-accent-300'
      }`}
    >
      <div className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{car.marque}</p>
            <h3 className="text-base font-semibold text-gray-900 leading-tight">{car.modele}</h3>
            <p className="text-xs text-gray-400">{car.annee} · {car.segment}</p>
          </div>
          <button
            onClick={() => onToggle(car)}
            disabled={disabled}
            className={`flex-shrink-0 w-7 h-7 rounded-full border-2 flex items-center justify-center transition-colors ${
              selected
                ? 'bg-accent-600 border-accent-600 text-white'
                : disabled
                ? 'border-gray-200 cursor-not-allowed'
                : 'border-gray-300 hover:border-accent-500'
            }`}
            title={selected ? 'Retirer de la comparaison' : disabled ? 'Maximum 4 voitures' : 'Ajouter à la comparaison'}
          >
            {selected ? (
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            )}
          </button>
        </div>

        <div className="text-xl font-bold text-gray-900 mb-3">
          {car.prix.toLocaleString('fr-FR')} €
        </div>

        <div className="flex items-center gap-2 mb-3">
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${MOTO_COLORS[car.motorisation]}`}>
            <span>{MOTO_ICONS[car.motorisation]}</span>
            {car.motorisation}
          </span>
          <span className="text-xs text-gray-500">{car.puissance} ch</span>
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-gray-600">
          <div className="flex justify-between">
            <span className="text-gray-400">0-100</span>
            <span className="font-medium">{car.zero_cent}s</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">CO₂</span>
            <span className="font-medium">{car.co2} g/km</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Coffre</span>
            <span className="font-medium">{car.coffre} L</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">
              {car.motorisation === 'électrique' ? 'Autonomie' : 'Conso'}
            </span>
            <span className="font-medium">
              {car.motorisation === 'électrique'
                ? `${car.autonomie_km} km`
                : `${car.consommation} L/100`}
            </span>
          </div>
          <div className="flex justify-between col-span-2">
            <span className="text-gray-400">Hauteur</span>
            <span className={`font-medium ${car.hauteur > 1.55 ? 'text-amber-600' : 'text-gray-600'}`}>
              {car.hauteur.toFixed(2)} m
              {car.hauteur > 1.55 && <span className="ml-1 text-amber-400 text-xs" title="Dépasse 1.55 m">▲</span>}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
