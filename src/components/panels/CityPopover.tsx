import { useAppStore } from '../../store/useAppStore';
import type { City } from '../../types';

interface CityPopoverProps {
  city: City;
  onClose: () => void;
}

export default function CityPopover({ city, onClose }: CityPopoverProps) {
  const { addDiscovery, discoveries } = useAppStore();
  
  const isSaved = discoveries.some(
    (d) => d.type === 'city' && d.name === city.name && d.countryCode === city.countryCode
  );

  const handleSaveDiscovery = () => {
    addDiscovery({
      type: 'city',
      name: city.name,
      countryCode: city.countryCode,
      lat: city.lat,
      lng: city.lng,
    });
  };

  return (
    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-[1000] w-80 max-w-[calc(100vw-2rem)] bg-white rounded-xl shadow-2xl border border-gray-200 animate-slide-up">
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">{city.name}</h3>
            {city.population && (
              <p className="text-sm text-gray-600">
                {city.population.toLocaleString()} habitants
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Fermer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Facts */}
        {city.facts && city.facts.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Faits intéressants</h4>
            <ul className="space-y-2">
              {city.facts.map((fact, index) => (
                <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                  <span className="text-primary-500 mt-1">•</span>
                  <span>{fact}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Save Button */}
        <button
          onClick={handleSaveDiscovery}
          disabled={isSaved}
          className={`w-full py-2.5 px-4 rounded-lg font-semibold text-sm transition-all duration-200 ${
            isSaved
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-primary-600 text-white hover:bg-primary-700 active:scale-95'
          }`}
        >
          {isSaved ? '✓ Déjà sauvegardé' : '💾 Sauvegarder à mes découvertes'}
        </button>
      </div>
    </div>
  );
}
