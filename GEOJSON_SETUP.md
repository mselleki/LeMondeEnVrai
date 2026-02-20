# Instructions pour ajouter le fichier GeoJSON complet

## Option 1 : Télécharger depuis Natural Earth (Recommandé)

1. Visitez [Natural Earth Data - Admin 0 Countries](https://www.naturalearthdata.com/downloads/50m-cultural-vectors/)
2. Téléchargez le fichier "Admin 0 – Countries" (format Shapefile)
3. Convertissez le Shapefile en GeoJSON :
   - **Option A** : Utilisez [mapshaper.org](https://mapshaper.org/)
     - Glissez-déposez le fichier .shp
     - Cliquez sur "Export" et choisissez "GeoJSON"
   - **Option B** : Utilisez ogr2ogr (si installé) :
     ```bash
     ogr2ogr -f GeoJSON world.geojson ne_50m_admin_0_countries.shp
     ```
4. Placez le fichier `world.geojson` dans `/public/data/` (recommandé pour Vite)
   - Créez le dossier `/public/data/` s'il n'existe pas
   - L'application chargera automatiquement le fichier depuis `/public/data/world.geojson`

## Option 2 : Utiliser un GeoJSON en ligne

Modifiez `src/utils/loadGeoJSON.ts` pour charger depuis une URL :

```typescript
const response = await fetch('https://your-url.com/world.geojson');
```

## Format attendu

Le GeoJSON doit avoir cette structure :

```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {
        "NAME": "Country Name",
        "NAME_EN": "Country Name (English)",
        "ISO_A2": "XX"  // Code ISO à 2 lettres (important pour la correspondance)
      },
      "geometry": {
        "type": "Polygon" | "MultiPolygon",
        "coordinates": [...]
      }
    }
  ]
}
```

## Propriétés importantes

- `ISO_A2` : Code ISO 3166-1 alpha-2 (ex: "FR", "US", "JP") - **OBLIGATOIRE** pour la correspondance avec les données de pays
- `NAME` ou `NAME_EN` : Nom du pays (utilisé pour l'affichage)

## Vérification

Une fois le fichier ajouté, l'application devrait :
1. Charger automatiquement le GeoJSON au démarrage
2. Afficher tous les pays sur la carte
3. Permettre de cliquer sur n'importe quel pays pour voir ses détails

Si le fichier n'est pas trouvé, l'application utilisera automatiquement le fallback (3 pays de démonstration).

## Sources alternatives

- [GeoJSON Maps](https://geojson-maps.ash.ms/) - Cartes GeoJSON pré-générées
- [World Atlas TopoJSON](https://github.com/topojson/world-atlas) - Convertir TopoJSON en GeoJSON
- [OpenDataSoft](https://public.opendatasoft.com/explore/dataset/world-administrative-boundaries/export/) - Données administratives mondiales
