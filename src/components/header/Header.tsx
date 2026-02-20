import { useAppStore } from '../../store/useAppStore';
import SearchBar from '../search/SearchBar';
import Breadcrumb from './Breadcrumb';
import MapStyleSelector from '../map/MapStyleSelector';
import countriesData from '../../data/countries.sample.json';
import type { Country } from '../../types';

export default function Header() {
  const { toggleDrawer, setSelectedCountry } = useAppStore();

  const handleRandomCountry = () => {
    const randomIndex = Math.floor(Math.random() * countriesData.countries.length);
    const randomCountry = countriesData.countries[randomIndex] as Country;
    setSelectedCountry(randomCountry);
  };

  return (
    <header className="absolute top-0 left-0 right-0 z-[1000] bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-sm">
      <div className="container mx-auto px-4 py-3 md:py-3.5">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 md:gap-6 flex-1 min-w-0">
            <div className="flex items-center gap-2.5 shrink-0">
              <span className="text-xl md:text-2xl" aria-hidden>🗺️</span>
              <h1 className="text-lg md:text-xl font-bold text-slate-800 hidden sm:block tracking-tight">Le Monde en Vrai</h1>
            </div>
            <div className="hidden md:block flex-1 min-w-0">
              <Breadcrumb />
            </div>
          </div>

          <div className="flex-1 max-w-sm hidden lg:block justify-center">
            <SearchBar />
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <MapStyleSelector />
            <button
              type="button"
              onClick={handleRandomCountry}
              className="px-3 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors hidden sm:block"
              title="Pays aléatoire"
            >
              🎲 Aléatoire
            </button>
            <button
              type="button"
              onClick={() => toggleDrawer()}
              className="px-3 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-xl transition-colors flex items-center gap-2 touch-manipulation shadow-sm"
              aria-label="Ouvrir Mes découvertes"
              title="Pays et villes sauvegardés"
            >
              <span aria-hidden>💾</span>
              <span className="hidden sm:inline">Découvertes</span>
            </button>
          </div>
        </div>

        <div className="mt-3 lg:hidden">
          <SearchBar />
        </div>
      </div>
    </header>
  );
}
