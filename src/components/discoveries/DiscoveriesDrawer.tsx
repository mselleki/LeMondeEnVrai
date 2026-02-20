import { useEffect, useRef } from 'react';
import { useAppStore } from '../../store/useAppStore';
import type { Discovery } from '../../types';
import countriesData from '../../data/countries.sample.json';
import Flag from 'country-flag-icons/react/3x2';

export default function DiscoveriesDrawer() {
  const { drawerOpen, toggleDrawer, discoveries, setSelectedCountry, clearSelection, removeDiscovery } = useAppStore();
  const drawerRef = useRef<HTMLDivElement>(null);

  // Close drawer on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && drawerOpen) {
        toggleDrawer();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [drawerOpen, toggleDrawer]);

  // Focus trap for accessibility
  useEffect(() => {
    if (drawerOpen && drawerRef.current) {
      const firstFocusable = drawerRef.current.querySelector(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      ) as HTMLElement;
      firstFocusable?.focus();
    }
  }, [drawerOpen]);

  const handleDiscoveryClick = (discovery: Discovery) => {
    if (discovery.type === 'country') {
      const country = countriesData.countries.find((c) => c.code === discovery.countryCode);
      if (country) {
        setSelectedCountry(country);
        toggleDrawer();
      }
    } else {
      // For cities, we could zoom to the location
      // For now, just close the drawer
      toggleDrawer();
    }
  };

  const sortedDiscoveries = [...discoveries].sort((a, b) => b.savedAt - a.savedAt);

  return (
    <>
      {/* Backdrop */}
      {drawerOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity animate-fade-in"
          onClick={toggleDrawer}
          aria-hidden="true"
        />
      )}

      {/* Drawer */}
      <div
        ref={drawerRef}
        className={`fixed right-0 top-0 h-full w-96 max-w-[85vw] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-out ${
          drawerOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Mes découvertes"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Mes découvertes</h2>
              <p className="text-sm text-gray-500 mt-0.5">Pays et villes que vous avez sauvegardés pour y revenir facilement.</p>
            </div>
            <button
              onClick={toggleDrawer}
              className="text-gray-400 hover:text-gray-600 transition-colors p-2 -mr-2"
              aria-label="Fermer"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {sortedDiscoveries.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-12 px-4">
                <div className="text-6xl mb-4">🗺️</div>
                <p className="text-gray-600 font-medium mb-2">Aucune découverte sauvegardée</p>
                <p className="text-sm text-gray-500 max-w-xs">
                  Cliquez sur « Ajouter à Mes découvertes » dans un pays ou une ville pour le retrouver ici.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {sortedDiscoveries.map((discovery) => {
                  const country = countriesData.countries.find((c) => c.code === discovery.countryCode);
                  const FlagComponent = discovery.countryCode ? (Flag[discovery.countryCode as keyof typeof Flag] as React.ComponentType<{ className?: string; title?: string }>) : null;
                  return (
                    <div
                      key={discovery.id}
                      className="group bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors cursor-pointer border border-gray-200"
                      onClick={() => handleDiscoveryClick(discovery)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handleDiscoveryClick(discovery);
                        }
                      }}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            {discovery.type === 'country' && FlagComponent ? (
                              <FlagComponent className="w-6 h-4 object-cover rounded" title={country?.name || discovery.name} />
                            ) : (
                              <span className="text-lg">
                                {discovery.type === 'country' ? '🌍' : '🏙️'}
                              </span>
                            )}
                            <h3 className="font-semibold text-gray-900 truncate">
                              {discovery.name}
                            </h3>
                          </div>
                          {country && (
                            <p className="text-sm text-gray-600 flex items-center gap-2">
                              {FlagComponent && (
                                <FlagComponent className="w-5 h-3.5 object-cover rounded" title={country.name} />
                              )}
                              <span>{country.name}</span>
                            </p>
                          )}
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(discovery.savedAt).toLocaleDateString('fr-FR', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                            })}
                          </p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeDiscovery(discovery.id);
                          }}
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700 p-1"
                          aria-label="Supprimer"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          {sortedDiscoveries.length > 0 && (
            <div className="p-4 border-t border-gray-200">
              <button
                onClick={clearSelection}
                className="w-full py-2 px-4 text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                Effacer la sélection
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
