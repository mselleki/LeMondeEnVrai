import { useAppStore } from '../../store/useAppStore';
import SearchBar from '../search/SearchBar';
import Breadcrumb from './Breadcrumb';
import MapStyleSelector from '../map/MapStyleSelector';
import countriesData from '../../data/countries.sample.json';
import type { Country } from '../../types';

export default function Header() {
  const { toggleDrawer, setSelectedCountry, selectedCountry } = useAppStore();

  const handleRandomCountry = () => {
    const randomIndex = Math.floor(Math.random() * countriesData.countries.length);
    const randomCountry = countriesData.countries[randomIndex] as Country;
    setSelectedCountry(randomCountry);
  };

  return (
    <header className="absolute top-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Left: Logo and Breadcrumb */}
          <div className="flex items-center gap-6 flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🗺️</span>
              <h1 className="text-xl font-bold text-gray-900 hidden sm:block">Le Monde en Vrai</h1>
            </div>
            <div className="hidden md:block">
              <Breadcrumb />
            </div>
          </div>

          {/* Center: Search */}
          <div className="flex-1 max-w-md hidden lg:block">
            <SearchBar />
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-3">
            <MapStyleSelector />
            <button
              onClick={handleRandomCountry}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors hidden sm:block"
              title="Pays aléatoire"
            >
              🎲 Aléatoire
            </button>
            <button
              onClick={toggleDrawer}
              className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors flex items-center gap-2"
              aria-label="Ouvrir Mes découvertes : pays et villes sauvegardés"
              title="Pays et villes que vous avez sauvegardés pour y revenir facilement"
            >
              <span>💾</span>
              <span className="hidden sm:inline">Découvertes</span>
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="mt-4 lg:hidden">
          <SearchBar />
        </div>
      </div>
    </header>
  );
}
