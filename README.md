# Le Monde en Vrai - Interactive World Map

Une application web interactive et moderne pour explorer le monde avec une carte Leaflet, React et TypeScript.

## 🚀 Fonctionnalités

- **Carte interactive** : Explorez le monde avec une carte Leaflet personnalisée
- **Sélection de pays** : Cliquez sur n'importe quel pays pour voir ses détails
- **Panneau d'information** : Affiche les statistiques, faits rapides et niveau de curiosité
- **Marqueurs de villes** : Zoom pour voir les villes avec leurs informations
- **Recherche** : Recherchez des pays par nom
- **Découvertes** : Sauvegardez vos pays et villes préférés
- **Design moderne** : Interface utilisateur soignée avec animations fluides
- **Responsive** : Fonctionne sur mobile et desktop

## 🛠️ Technologies

- **React 18** + **TypeScript**
- **Vite** pour le build
- **TailwindCSS** pour le styling
- **Leaflet** + **react-leaflet** pour la carte
- **Zustand** pour la gestion d'état
- **LocalStorage** pour la persistance

## 📦 Installation

1. Installez les dépendances :
```bash
npm install
```

2. Lancez le serveur de développement :
```bash
npm run dev
```

3. Ouvrez votre navigateur à l'adresse indiquée (généralement `http://localhost:5173`)

## 📁 Structure du projet

```
src/
├── components/
│   ├── map/
│   │   └── WorldMap.tsx          # Composant principal de la carte
│   ├── panels/
│   │   ├── CountryPanel.tsx      # Panneau d'information du pays
│   │   └── CityPopover.tsx       # Popover pour les villes
│   ├── discoveries/
│   │   └── DiscoveriesDrawer.tsx # Tiroir des découvertes sauvegardées
│   ├── search/
│   │   └── SearchBar.tsx         # Barre de recherche
│   └── header/
│       ├── Header.tsx            # En-tête principal
│       └── Breadcrumb.tsx        # Fil d'Ariane
├── data/
│   ├── world.geojson.fallback.json  # GeoJSON de fallback (3 pays)
│   ├── countries.sample.json        # Données des pays
│   └── cities.sample.json           # Données des villes
├── store/
│   └── useAppStore.ts            # Store Zustand
├── types/
│   └── index.ts                  # Types TypeScript
├── utils/
│   ├── geography.ts              # Utilitaires géographiques
│   └── loadGeoJSON.ts            # Chargement du GeoJSON
├── App.tsx                       # Composant principal
├── main.tsx                      # Point d'entrée
└── index.css                     # Styles globaux
```

## 🗺️ Ajouter le fichier GeoJSON complet

Pour utiliser une carte complète du monde au lieu du fallback (3 pays), ajoutez un fichier `world.geojson` dans `/src/data/`.

### Option 1 : Télécharger depuis Natural Earth
1. Visitez [Natural Earth Data](https://www.naturalearthdata.com/downloads/50m-cultural-vectors/)
2. Téléchargez "Admin 0 – Countries"
3. Convertissez le fichier Shapefile en GeoJSON (utilisez [mapshaper.org](https://mapshaper.org/) ou [ogr2ogr](https://gdal.org/programs/ogr2ogr.html))
4. Placez le fichier `world.geojson` dans `/src/data/`

### Option 2 : Utiliser un GeoJSON en ligne
Modifiez `src/utils/loadGeoJSON.ts` pour charger depuis une URL :
```typescript
const response = await fetch('https://your-url.com/world.geojson');
```

### Format attendu
Le GeoJSON doit avoir cette structure :
```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {
        "NAME": "Country Name",
        "ISO_A2": "XX"
      },
      "geometry": { ... }
    }
  ]
}
```

## 🎨 Personnalisation

### Couleurs
Modifiez `tailwind.config.js` pour changer les couleurs du thème.

### Données
- **Pays** : Éditez `/src/data/countries.sample.json`
- **Villes** : Éditez `/src/data/cities.sample.json`

### Seuil de zoom pour les villes
Modifiez la valeur dans `WorldMap.tsx` :
```typescript
if (selectedCountry && mapZoom >= 5) { // Changez 5 selon vos besoins
```

## 📱 Responsive

L'application s'adapte automatiquement :
- **Desktop** : Panneau latéral à droite
- **Mobile** : Panneau en bas (bottom sheet)

## 🔧 Scripts disponibles

- `npm run dev` : Lance le serveur de développement
- `npm run build` : Construit l'application pour la production
- `npm run preview` : Prévisualise le build de production
- `npm run lint` : Lance le linter ESLint

## 📝 Notes

- Les données sont stockées localement dans le navigateur (localStorage)
- Le GeoJSON de fallback contient seulement 3 pays pour la démo
- Les animations sont optimisées pour de bonnes performances
- L'accessibilité (clavier, ARIA) est prise en compte

## 🚧 Fonctionnalités à venir

- Quiz interactif sur les pays
- Plus de données géographiques
- Export des découvertes
- Partage social

## 📄 Licence

Ce projet est fourni à titre éducatif et de démonstration.
