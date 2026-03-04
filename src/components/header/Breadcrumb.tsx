import { useAppStore } from '../../store/useAppStore';

export default function Breadcrumb() {
  const { selectedCountry, selectedCity, clearSelection, setSelectedCity } = useAppStore();

  if (!selectedCountry && !selectedCity) {
    return null;
  }

  return (
    <nav className="flex items-center gap-2 text-sm text-gray-600" aria-label="Fil d'Ariane">
      <button
        onClick={clearSelection}
        className="hover:text-gray-900 transition-colors font-medium"
      >
        Monde
      </button>
      {selectedCountry && (
        <>
          <span className="text-gray-400">/</span>
          {selectedCity ? (
            <button
              onClick={() => setSelectedCity(null)}
              className="hover:text-gray-900 transition-colors font-medium"
            >
              {selectedCountry.name}
            </button>
          ) : (
            <span className="text-gray-900 font-semibold">{selectedCountry.name}</span>
          )}
        </>
      )}
      {selectedCity && (
        <>
          <span className="text-gray-400">/</span>
          <span className="text-gray-900 font-semibold">{selectedCity.name}</span>
        </>
      )}
    </nav>
  );
}
