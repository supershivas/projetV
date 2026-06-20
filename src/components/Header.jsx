import { useState } from 'react'
import carsData from '../data/cars.json'

function buildUpdatePrompt() {
  const count = carsData.length
  const maxId = Math.max(...carsData.map((c) => c.id))
  const years = [...new Set(carsData.map((c) => c.annee))].sort()
  const marques = [...new Set(carsData.map((c) => c.marque))].sort()
  const today = new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })

  return `Tu es en train de mettre à jour le dataset du projet AutoCompare (repo : supershivas/projetV, fichier : src/data/cars.json).

État actuel du dataset (${today}) :
- ${count} modèles, IDs de 1 à ${maxId}
- Années couvertes : ${years.join(', ')}
- Marques présentes : ${marques.join(', ')}

Contraintes du dataset :
- 5 places obligatoires (pas de 2+2 ni de 7 places)
- Marché européen uniquement
- Motorisations : essence, diesel, hybride, électrique
- Segments : Citadine, Compacte, Berline, SUV Compact, SUV, Familiale
- Chaque entrée doit avoir : id, marque, modele, annee, segment, prix, motorisation, puissance, consommation, autonomie_km (null si non électrique), co2, zero_cent, coffre, transmission, places, hauteur

Format JSON d'une entrée :
{
  "id": ${maxId + 1},
  "marque": "...",
  "modele": "...",
  "annee": 2025,
  "segment": "...",
  "prix": 00000,
  "motorisation": "électrique",
  "puissance": 000,
  "consommation": 00.0,
  "autonomie_km": 000,
  "co2": 0,
  "zero_cent": 0.0,
  "coffre": 000,
  "transmission": "automatique",
  "places": 5,
  "hauteur": 0.00
}

Ta mission : ajoute tous les nouveaux modèles 2025 et 2026 disponibles qui ne sont pas encore dans le dataset (vérifie par marque+modèle+année). Utilise uniquement des specs homologuées (WLTP) ou officiellement annoncées. Ne duplique pas d'entrée existante. Puis commite et pousse sur main.`
}

export function Header({ selectionCount, onViewComparison }) {
  const [copied, setCopied] = useState(false)

  async function handleCopyPrompt() {
    await navigator.clipboard.writeText(buildUpdatePrompt())
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-accent-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l2 2h10zM13 16l2-2h3l1 1v1h-6z" />
              </svg>
            </div>
            <span className="font-semibold text-gray-900 text-lg">AutoCompare</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleCopyPrompt}
              title="Copier le prompt de mise à jour pour Claude Code"
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                copied
                  ? 'bg-green-50 border-green-300 text-green-700'
                  : 'bg-gray-50 border-gray-200 text-gray-600 hover:border-accent-400 hover:text-accent-700'
              }`}
            >
              {copied ? (
                <>
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Prompt copié !
                </>
              ) : (
                <>
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Mettre à jour
                </>
              )}
            </button>

            {selectionCount > 0 && (
              <button
                onClick={onViewComparison}
                className="flex items-center gap-2 bg-accent-600 hover:bg-accent-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                <span>Comparer ({selectionCount})</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
