# Instructions d'installation

## Installation des dépendances

Exécutez la commande suivante pour installer toutes les dépendances :

```bash
npm install
```

## Dépendances principales

- **React 18** : Bibliothèque UI
- **TypeScript** : Typage statique
- **Vite** : Build tool et serveur de développement
- **TailwindCSS** : Framework CSS utilitaire
- **Leaflet** : Bibliothèque de cartes
- **react-leaflet** : Bindings React pour Leaflet
- **Zustand** : Gestion d'état légère (avec middleware persist)

## Lancement

Une fois les dépendances installées, lancez le serveur de développement :

```bash
npm run dev
```

L'application sera accessible sur `http://localhost:5173` (ou le port indiqué dans le terminal).

## Commandes disponibles

- `npm run dev` : Lance le serveur de développement
- `npm run build` : Construit l'application pour la production
- `npm run preview` : Prévisualise le build de production
- `npm run lint` : Lance le linter ESLint

## Notes

- Les dépendances sont déjà configurées dans `package.json`
- Le middleware `persist` de Zustand est inclus dans zustand v4+
- Tous les types TypeScript sont inclus dans les devDependencies
