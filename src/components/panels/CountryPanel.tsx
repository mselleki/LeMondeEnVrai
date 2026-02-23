import { useEffect, useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import type { Country, City } from '../../types';
import * as Flag from 'country-flag-icons/react/3x2';
import citiesData from '../../data/cities.sample.json';

interface CountryPanelProps {
  country: Country | null;
  isLoading?: boolean;
}

function SkeletonCard() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-8 bg-gray-200 rounded w-3/4"></div>
      <div className="h-6 bg-gray-200 rounded w-1/2"></div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        <div className="h-4 bg-gray-200 rounded w-4/6"></div>
      </div>
      <div className="h-32 bg-gray-200 rounded"></div>
    </div>
  );
}

export default function CountryPanel({ country, isLoading }: CountryPanelProps) {
  const { curiosityScores, addDiscovery, discoveries, setSelectedCity, clearSelection } = useAppStore();
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (country) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 500);
      return () => clearTimeout(timer);
    }
  }, [country?.id]);
  
  // Get Flag component dynamically based on country code
  const FlagComponent = country?.code ? (Flag[country.code as keyof typeof Flag] as React.ComponentType<{ className?: string; title?: string }>) : null;
  
  // Get cities for this country
  const countryCities = country 
    ? citiesData.cities.filter((city) => city.countryCode === country.code)
    : [];
  
  const handleCityClick = (city: City) => {
    setSelectedCity(city);
  };


  const curiosityScore = country ? curiosityScores[country.id] || 0 : 0;
  const isSaved = country
    ? discoveries.some((d) => d.type === 'country' && d.countryCode === country.code)
    : false;

  const handleSaveDiscovery = () => {
    if (country) {
      addDiscovery({
        type: 'country',
        name: country.name,
        countryCode: country.code,
      });
    }
  };

  if (isLoading || !country) {
    return (
      <div className="h-full p-6 bg-white rounded-l-2xl shadow-xl border-l border-gray-200 overflow-y-auto">
        <SkeletonCard />
      </div>
    );
  }

  return (
    <div
      className={`h-full flex flex-col overflow-hidden animate-slide-in-right ${
        isAnimating ? 'animate-bounce-subtle' : ''
      }`}
    >
      {/* Top bar with close */}
      <div className="shrink-0 flex items-center justify-end px-4 py-2 border-b border-slate-100 bg-white">
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
        <div className="flex items-center gap-5 mb-8">
          <div
            className="flex items-center justify-center shrink-0 overflow-hidden rounded-xl shadow-md ring-1 ring-black/5"
            style={{ width: '5rem', height: '5rem', minWidth: '5rem', minHeight: '5rem' }}
            role="img"
            aria-label={`Drapeau de ${country.name}`}
          >
            {FlagComponent ? (
              <FlagComponent className="w-full h-full object-cover" title={country.name} />
            ) : (
              <span className="text-gray-600 text-sm font-bold uppercase tracking-wider">{country.code}</span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight mb-0.5">{country.name}</h2>
            {country.nameFr && country.name !== country.nameFr && (
              <p className="text-base text-gray-600">{country.nameFr}</p>
            )}
            {country.rating != null && (
              <div className="flex items-center gap-2 mt-2">
                <span className="text-sm font-semibold text-amber-600">{country.rating.toFixed(1).replace('.', ',')}/10</span>
                <span className="text-xs text-gray-500">note moyenne</span>
              </div>
            )}
          </div>
        </div>

        {/* Images */}
        {country.images && country.images.length > 0 && (
          <div className="mb-6">
            <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 scrollbar-thin" style={{ scrollbarWidth: 'thin' }}>
              {country.images.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt={`${country.name} ${i + 1}`}
                  className="h-36 w-auto min-w-[200px] object-cover rounded-xl border border-gray-100 shadow-sm shrink-0"
                />
              ))}
            </div>
          </div>
        )}

        {/* Best season & Prices (destination info) */}
        {(country.bestSeason || country.prices) && (
          <div className="mb-6 space-y-3">
            {country.bestSeason && (
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Meilleure saison</div>
                <p className="text-gray-900 font-medium">{country.bestSeason}</p>
              </div>
            )}
            {country.prices && (country.prices.flight || country.prices.hotel || country.prices.localCost) && (
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Prix moyens (indicatifs)</div>
                <ul className="space-y-1.5 text-sm text-gray-800">
                  {country.prices.flight && <li><span className="text-gray-500">Avion :</span> {country.prices.flight}</li>}
                  {country.prices.hotel && <li><span className="text-gray-500">Hôtel :</span> {country.prices.hotel}</li>}
                  {country.prices.localCost && <li><span className="text-gray-500">Sur place :</span> {country.prices.localCost}</li>}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Quick Stats - card style */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Capitale</div>
            <div className="text-lg font-semibold text-gray-900">{country.capital}</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Population</div>
            <div className="text-lg font-semibold text-gray-900">
              {country.population ? country.population.toLocaleString('fr-FR') : '—'}
            </div>
          </div>
          {country.languages && country.languages.length > 0 && (
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 col-span-2">
              <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Langues</div>
              <div className="text-lg font-semibold text-gray-900">{country.languages.join(', ')}</div>
            </div>
          )}
          {country.currency && (
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 col-span-2">
              <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Monnaie</div>
              <div className="text-lg font-semibold text-gray-900">{country.currency}</div>
            </div>
          )}
        </div>

        {/* Curiosity Meter */}
        <div className="mb-8 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Niveau de curiosité</span>
            <span className="text-sm font-bold text-primary-600">{curiosityScore}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary-400 to-primary-600 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${curiosityScore}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Explorez les villes et sauvegardez des lieux dans « Découvertes » pour augmenter votre score.
          </p>
        </div>

        {/* Fast Facts */}
        {country.fastFacts && country.fastFacts.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-bold text-gray-900 mb-3">Anecdotes</h3>
            <div className="space-y-3">
              {country.fastFacts.map((fact, index) => (
                <div
                  key={index}
                  className="bg-white border-l-4 border-primary-500 p-4 rounded-r-xl shadow-sm border border-gray-100 animate-fade-in"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <p className="text-gray-800 leading-relaxed text-[15px]">{fact}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Cities List */}
        {countryCities.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-bold text-gray-900 mb-3">Villes à explorer</h3>
            <div className="space-y-2">
              {countryCities.map((city) => (
                <button
                  key={city.id}
                  onClick={() => handleCityClick(city)}
                  className="w-full text-left p-4 bg-white hover:bg-primary-50/50 rounded-xl transition-colors border border-gray-100 hover:border-primary-200 shadow-sm group"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-gray-900 group-hover:text-primary-700 transition-colors">
                        {city.name}
                      </div>
                      {city.population && (
                        <div className="text-sm text-gray-500">
                          {city.population.toLocaleString('fr-FR')} habitants
                        </div>
                      )}
                    </div>
                    <svg className="w-5 h-5 text-gray-400 group-hover:text-primary-600 transition-colors shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={handleSaveDiscovery}
            disabled={isSaved}
            className={`w-full py-3.5 px-4 rounded-xl font-semibold transition-all duration-200 ${
              isSaved
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-primary-600 text-white hover:bg-primary-700 active:scale-[0.99] shadow-md'
            }`}
          >
            {isSaved ? '✓ Déjà dans Mes découvertes' : '💾 Ajouter à Mes découvertes'}
          </button>
          <button
            disabled
            className="w-full py-3 px-4 rounded-xl font-medium bg-gray-100 text-gray-400 cursor-not-allowed text-sm"
          >
            🎯 Quiz (bientôt)
          </button>
        </div>
      </div>
    </div>
  );
}
