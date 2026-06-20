/**
 * Estimation du prix occasion selon le kilométrage.
 * Modèle simplifié basé sur les taux de dépréciation moyens du marché européen.
 */
export function estimatedUsedPrice(newPrice, km) {
  let ratio
  if (km <= 10000)       ratio = 0.88
  else if (km <= 30000)  ratio = 0.80
  else if (km <= 60000)  ratio = 0.70
  else if (km <= 100000) ratio = 0.58
  else if (km <= 150000) ratio = 0.46
  else                   ratio = 0.34
  return Math.round(newPrice * ratio / 100) * 100
}
