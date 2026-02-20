import { useAppStore } from '../../store/useAppStore';
import type { City } from '../../types';
import countriesData from '../../data/countries.sample.json';
import * as Flag from 'country-flag-icons/react/3x2';

interface CityPanelProps {
  city: City;
}

export default function CityPanel({ city }: CityPanelProps) {
  const { addDiscovery, discoveries, setSelectedCity, clearSelection } = useAppStore();
  
  const country = countriesData.countries.find((c) => c.code === city.countryCode);
  const CountryFlagComponent = country?.code ? (Flag[country.code as keyof typeof Flag] as React.ComponentType<{ className?: string; title?: string }>) : null;
  
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

  const handleBackToCountry = () => {
    setSelectedCity(null);
  };

  return (
    <div className="h-full flex flex-col overflow-hidden animate-slide-in-right">
      <div className="shrink-0 flex items-center justify-between px-4 py-2 border-b border-slate-100 bg-white">
        <button
          type="button"
          onClick={handleBackToCountry}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 py-2 pr-2 transition-colors group"
        >
          <svg className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="font-medium">Retour au pays</span>
        </button>
        <button
          type="button"
          onClick={clearSelection}
          className="p-2 rounded-lg text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors"
          aria-label="Fermer le panel"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div className="h-1 bg-gradient-to-r from-primary-500 to-primary-700 shrink-0" aria-hidden />
      <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-gradient-to-b from-gray-50/80 to-white">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            {CountryFlagComponent && (
              <CountryFlagComponent className="w-8 h-6 object-cover rounded shadow-sm" title={country?.name || city.countryCode} />
            )}
            <span className="text-sm text-gray-600">{country?.name || city.countryCode}</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight mb-1">{city.name}</h2>
          {city.population && (
            <p className="text-base text-gray-600">{city.population.toLocaleString('fr-FR')} habitants</p>
          )}
        </div>

        {/* Facts */}
        {city.facts && city.facts.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-bold text-gray-900 mb-3">Anecdotes</h3>
            <div className="space-y-3">
              {city.facts.map((fact, index) => (
                <div key={index} className="bg-white border-l-4 border-primary-500 p-4 rounded-r-xl shadow-sm border border-gray-100">
                  <p className="text-gray-800 leading-relaxed text-[15px]">{fact}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Save Button */}
        <div className="mt-6">
          <button
            onClick={handleSaveDiscovery}
            disabled={isSaved}
            className={`w-full py-3.5 px-4 rounded-xl font-semibold transition-all duration-200 ${
              isSaved ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-primary-600 text-white hover:bg-primary-700 active:scale-[0.99] shadow-md'
            }`}
          >
            {isSaved ? '✓ Déjà dans Mes découvertes' : '💾 Ajouter à Mes découvertes'}
          </button>
        </div>
      </div>
    </div>
  );
}
