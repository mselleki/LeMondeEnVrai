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
  const { selectedCountry, selectedCity, setSelectedCountry, setSelectedCity, ui } = useAppStore();
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
    <div className="h-screen w-screen overflow-hidden bg-gray-50">
      <Header />
      
      <main className="h-full pt-20 md:pt-24">
        <div className="relative h-full flex">
          {/* Map */}
          <div className="flex-1 h-full relative">
            {isLoading ? (
              <div className="w-full h-full flex items-center justify-center bg-gray-100">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Chargement de la carte...</p>
                </div>
              </div>
            ) : (
              <WorldMap geoJsonData={geoJsonData} onCountryClick={handleCountryClick} />
            )}
          </div>

          {/* Panel - Country or City (wider on desktop) */}
          {ui.panelOpen && (selectedCity || selectedCountry) && (
            <div
              className={`${
                isMobile
                  ? 'fixed bottom-0 left-0 right-0 h-2/3 rounded-t-2xl border-t'
                  : 'w-[28rem] min-w-[22rem] max-w-[90vw] border-l'
              } bg-white shadow-2xl z-20 transition-all duration-300 flex flex-col`}
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
