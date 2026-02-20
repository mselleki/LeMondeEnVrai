import { useEffect, useState } from 'react';
import WorldMap from './components/map/WorldMap';
import CountryPanel from './components/panels/CountryPanel';
import CityPanel from './components/panels/CityPanel';
import DiscoveriesDrawer from './components/discoveries/DiscoveriesDrawer';
import Header from './components/header/Header';
import { useAppStore } from './store/useAppStore';
import { loadGeoJSON } from './utils/loadGeoJSON';
import { getCountryBounds } from './utils/geography';
import type { GeoJSONData, GeoJSONFeature, Country } from './types';
import countriesData from './data/countries.sample.json';

function App() {
  const { selectedCountry, selectedCity, setSelectedCountry, ui } = useAppStore();
  const [geoJsonData, setGeoJsonData] = useState<GeoJSONData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadGeoJSON()
      .then((data) => {
        setGeoJsonData(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error loading GeoJSON:', error);
        setIsLoading(false);
      });
  }, []);

  const handleCountryClick = (feature: GeoJSONFeature) => {
    const countryCode = feature.properties.ISO_A2 || feature.properties.ISO_A2_EH;
    if (countryCode) {
      const country = countriesData.countries.find((c) => c.code === countryCode);
      if (country) {
        // Calculate bounds from feature geometry
        const bounds = getCountryBounds(feature);
        if (bounds) {
          const sw = bounds.getSouthWest();
          const ne = bounds.getNorthEast();
          // Ensure all country properties are preserved including flag
          const countryWithBounds: Country = {
            id: country.id,
            name: country.name,
            nameFr: country.nameFr,
            code: country.code,
            capital: country.capital,
            population: country.population,
            languages: country.languages,
            currency: country.currency,
            flag: country.flag, // Explicitly preserve flag
            fastFacts: country.fastFacts,
            bounds: [[sw.lat, sw.lng], [ne.lat, ne.lng]],
          };
          setSelectedCountry(countryWithBounds);
        } else {
          setSelectedCountry(country);
        }
      }
    }
  };

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="h-screen w-screen overflow-hidden bg-slate-100">
      <Header />
      
      <main className="h-full pt-16 md:pt-20">
        <div className="relative h-full flex">
          {/* Map area with subtle frame */}
          <div className="flex-1 h-full relative min-w-0">
            {isLoading ? (
              <div className="w-full h-full flex items-center justify-center bg-slate-50">
                <div className="text-center px-6">
                  <div className="inline-block animate-spin rounded-full h-10 w-10 border-2 border-primary-500 border-t-transparent mx-auto mb-4" />
                  <p className="text-slate-600 font-medium">Chargement de la carte…</p>
                </div>
              </div>
            ) : (
              <WorldMap geoJsonData={geoJsonData} onCountryClick={handleCountryClick} />
            )}
          </div>

          {/* Panel - Country or City */}
          {ui.panelOpen && (selectedCity || selectedCountry) && (
            <div
              className={`${
                isMobile
                  ? 'fixed bottom-0 left-0 right-0 h-[72vh] rounded-t-2xl border-t border-slate-200 shadow-[0_-4px_24px_rgba(0,0,0,0.08)]'
                  : 'w-[28rem] min-w-[22rem] max-w-[90vw] border-l border-slate-200 shadow-[-4px_0_24px_rgba(0,0,0,0.06)]'
              } bg-white z-20 transition-all duration-300 flex flex-col overflow-hidden`}
            >
              {selectedCity ? (
                <CityPanel city={selectedCity} />
              ) : selectedCountry ? (
                <CountryPanel country={selectedCountry} isLoading={false} />
              ) : null}
            </div>
          )}
        </div>
      </main>

      {/* Discoveries Drawer */}
      <DiscoveriesDrawer />
    </div>
  );
}

export default App;
