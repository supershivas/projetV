# AutoCompare — Comparateur de voitures

Application web de comparaison de voitures, entièrement statique (React + Vite + Tailwind CSS). Les données sont versionnées en JSON dans le dépôt.

## Installation et développement local

```bash
npm install
npm run dev
```

L'application est accessible sur `http://localhost:5173`.

## Ajouter ou modifier une voiture

Éditez le fichier `src/data/cars.json`. Chaque entrée suit ce schéma :

```json
{
  "id": 49,
  "marque": "Toyota",
  "modele": "Yaris Cross",
  "annee": 2024,
  "segment": "SUV Compact",
  "prix": 27900,
  "motorisation": "hybride",
  "puissance": 116,
  "consommation": 4.7,
  "autonomie_km": null,
  "co2": 107,
  "zero_cent": 11.2,
  "coffre": 397,
  "transmission": "automatique",
  "places": 5,
  "hauteur": 1.55
}
```

**Notes :**
- `id` : entier unique, incrémental
- `motorisation` : `"essence"` | `"diesel"` | `"hybride"` | `"électrique"`
- `segment` : `"Citadine"` | `"Compacte"` | `"Berline"` | `"SUV Compact"` | `"SUV"` | `"Familiale"`
- `consommation` : en L/100km pour thermique/hybride, en kWh/100km pour électrique
- `autonomie_km` : km WLTP pour les électriques, `null` pour les autres
- `co2` : 0 pour les électriques (émissions directes)
- `transmission` : `"manuelle"` | `"automatique"`

Après modification, commiter et pousser sur `main` : le déploiement se fait automatiquement.

## Déploiement sur GitHub Pages

### 1. Activer GitHub Pages

Dans les paramètres du dépôt (`Settings > Pages`) :
- **Source** : `GitHub Actions`

### 2. Pousser sur main

Le workflow `.github/workflows/deploy.yml` se déclenche automatiquement à chaque push sur `main` et publie le site.

### 3. URL du site

Une fois déployé : `https://<votre-utilisateur>.github.io/projetV/`

> **Note :** Si le nom du dépôt est différent de `projetV`, modifiez la propriété `base` dans `vite.config.js` en conséquence.

## Build de production

```bash
npm run build
npm run preview
```

Le dossier `dist/` contient le site statique prêt à déployer.

## Fonctionnalités

- **Liste de voitures** avec cartes compactes (prix, motorisation, performances)
- **Recherche** par marque ou modèle
- **Filtres** : motorisation, segment, marque, fourchette de prix, fourchette de puissance
- **Tri** : prix, puissance, consommation, CO₂, 0-100 km/h
- **Comparaison** côte à côte de 2 à 4 voitures, avec mise en évidence de la meilleure valeur
- **Export CSV** de la comparaison en cours
- **Persistance** de la sélection via `localStorage`
- **Responsive** mobile et desktop
