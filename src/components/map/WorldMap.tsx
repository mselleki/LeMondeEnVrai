import { useEffect, useRef, useState, useMemo } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useAppStore } from '../../store/useAppStore';
import { getCountryCentroid } from '../../utils/geography';
import type { GeoJSONData, GeoJSONFeature, Country, City } from '../../types';
import citiesData from '../../data/cities.sample.json';
import countriesData from '../../data/countries.sample.json';

// Fix for default marker icons in React-Leaflet
delete (L.Icon.Default.prototype as unknown as { _getIconUrl: unknown })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom marker icon for cities (normal point)
const createCityIcon = (color: string = '#10b981') => {
  return L.divIcon({
    className: 'custom-marker city-marker',
    html: `<div style="
      width: 12px;
      height: 12px;
      background-color: ${color};
      border: 2px solid white;
      border-radius: 50%;
      box-shadow: 0 2px 6px rgba(0,0,0,0.3);
    "></div>`,
    iconSize: [12, 12],
    iconAnchor: [6, 6],
  });
};

// Custom pin marker icon for countries - modern, clean design
const createCountryPinIcon = (isSelected: boolean = false, countryCode?: string) => {
  const size = isSelected ? 36 : 28;
  const color = isSelected ? '#0ea5e9' : '#6b7280';
  const shadowColor = isSelected ? 'rgba(14, 165, 233, 0.4)' : 'rgba(0, 0, 0, 0.25)';
  
  // Modern pin design with gradient and shadow - no transform for stable hover
  return L.divIcon({
    className: 'custom-marker country-pin',
    html: `<div style="
      width: ${size}px;
      height: ${size}px;
      cursor: pointer;
      filter: drop-shadow(0 3px 6px ${shadowColor});
      opacity: 1 !important;
      pointer-events: auto !important;
      z-index: ${isSelected ? 10000 : 5000} !important;
    " title="${countryCode || ''}">
      <svg width="${size}" height="${size}" viewBox="0 0 24 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <!-- Shadow -->
        <ellipse cx="12" cy="30" rx="4" ry="2" fill="rgba(0,0,0,0.2)"/>
        <!-- Pin body with gradient -->
        <defs>
          <linearGradient id="pinGradient-${countryCode || 'default'}" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style="stop-color:${color};stop-opacity:1" />
            <stop offset="100%" style="stop-color:${isSelected ? '#0284c7' : '#4b5563'};stop-opacity:1" />
          </linearGradient>
        </defs>
        <path d="M12 2C7.58 2 4 5.58 4 10c0 6 8 18 8 18s8-12 8-18c0-4.42-3.58-8-8-8z" 
              fill="url(#pinGradient-${countryCode || 'default'})" 
              stroke="white" 
              stroke-width="1.5"/>
        <!-- Inner highlight circle -->
        <circle cx="12" cy="10" r="4" fill="white" opacity="0.3"/>
        <circle cx="12" cy="10" r="2.5" fill="white" opacity="0.6"/>
      </svg>
    </div>`,
    iconSize: [size, size + 8], // Extra height for pin point
    iconAnchor: [size / 2, size + 8], // Anchor at bottom point of pin
  });
};

interface MapControllerProps {
  selectedCountry: Country | null;
}

function MapController({ selectedCountry }: MapControllerProps) {
  const map = useMap();
  const { setMapZoom } = useAppStore();
  const previousCountryRef = useRef<string | null>(null);

  useEffect(() => {
    const handleZoom = () => {
      setMapZoom(map.getZoom());
    };

    map.on('zoom', handleZoom);
    return () => {
      map.off('zoom', handleZoom);
    };
  }, [map, setMapZoom]);

  useEffect(() => {
    if (selectedCountry?.bounds) {
      const bounds = L.latLngBounds(selectedCountry.bounds);
      // Zoom to country with padding, but keep it subtle
      map.flyToBounds(bounds, {
        duration: 1.0,
        padding: [80, 80],
        maxZoom: 6, // Don't zoom too close
      });
      previousCountryRef.current = selectedCountry.id;
    } else if (previousCountryRef.current && !selectedCountry) {
      map.setView([20, 0], 2, { animate: true, duration: 1 });
      previousCountryRef.current = null;
    }
  }, [selectedCountry, map]);

  return null;
}

interface WorldMapProps {
  geoJsonData: GeoJSONData | null;
  onCountryClick: (feature: GeoJSONFeature) => void;
}

interface CountryMarker {
  code: string;
  name: string;
  flag: string; // Kept for compatibility but not used
  position: [number, number];
  feature: GeoJSONFeature;
}

export default function WorldMap({ geoJsonData, onCountryClick }: WorldMapProps) {
  const { selectedCountry, setSelectedCity } = useAppStore();
  const geoJsonRef = useRef<L.GeoJSON>(null);
  const [cities, setCities] = useState<City[]>([]);
  const mapZoom = useAppStore((state) => state.ui.mapZoom);
  const mapStyle = useAppStore((state) => state.ui.mapStyle);
  
  // Map style configurations
  // Note: OpenStreetMap displays city names in local languages
  // Positron and Voyager use English names
  const mapStyles = {
    openstreetmap: {
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      // OpenStreetMap doesn't support language parameter for labels
      // Labels are in local language by design
    },
    positron: {
      url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    },
    voyager: {
      url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    },
  };
  
  // Remove selection highlight - only show hover effects
  // No need to update styles on selection change anymore

  // Calculate country markers (pins) - placed on capitals
  // Create pins for ALL countries in our data, not just those in GeoJSON
  const countryMarkers = useMemo(() => {
    const markers: CountryMarker[] = [];
    const processedCodes = new Set<string>();
    
    // First, process countries from GeoJSON (if available)
    if (geoJsonData) {
      geoJsonData.features.forEach((feature) => {
        const countryCode = (feature.properties?.ISO_A2 ?? feature.properties?.ISO_A2_EH) as string | undefined;
        if (!countryCode || typeof countryCode !== 'string') return;
        
        // Find country data
        const country = countriesData.countries.find((c) => c.code === countryCode);
        if (!country) return;
        
        processedCodes.add(countryCode);
        
        // Find capital city coordinates
        const capitalCity = citiesData.cities.find((city) => {
          if (city.countryCode !== countryCode) return false;
          if (city.name === country.capital) return true;
          const capitalMainName = country.capital.split(',')[0].trim().toLowerCase();
          const cityMainName = city.name.split(',')[0].trim().toLowerCase();
          return cityMainName === capitalMainName;
        });
        
        if (capitalCity) {
          markers.push({
            code: countryCode,
            name: country.name,
            flag: '',
            position: [capitalCity.lat, capitalCity.lng],
            feature,
          });
        } else {
          // Fallback to centroid if capital not found
          const centroid = getCountryCentroid(feature);
          if (centroid) {
            markers.push({
              code: countryCode,
              name: country.name,
              flag: '',
              position: centroid,
              feature,
            });
          }
        }
      });
    }
    
    // Then, add pins for countries NOT in GeoJSON but in our data
    countriesData.countries.forEach((country) => {
      if (processedCodes.has(country.code)) return; // Already processed
      
      // Find capital city coordinates
      const capitalCity = citiesData.cities.find((city) => {
        if (city.countryCode !== country.code) return false;
        if (city.name === country.capital) return true;
        const capitalMainName = country.capital.split(',')[0].trim().toLowerCase();
        const cityMainName = city.name.split(',')[0].trim().toLowerCase();
        return cityMainName === capitalMainName;
      });
      
      if (capitalCity) {
        // Create a minimal feature for countries not in GeoJSON
        const minimalFeature: GeoJSONFeature = {
          type: 'Feature',
          properties: {
            ISO_A2: country.code,
            NAME: country.name,
          },
          geometry: {
            type: 'Point',
            coordinates: [capitalCity.lng, capitalCity.lat],
          },
        };
        
        markers.push({
          code: country.code,
          name: country.name,
          flag: '',
          position: [capitalCity.lat, capitalCity.lng],
          feature: minimalFeature,
        });
      }
    });
    
    return markers;
  }, [geoJsonData]);

  // Filter cities based on selected country and zoom level
  useEffect(() => {
    if (selectedCountry && mapZoom >= 5) {
      const filtered = citiesData.cities.filter(
        (city) => city.countryCode === selectedCountry.code
      );
      setCities(filtered);
    } else {
      setCities([]);
    }
  }, [selectedCountry, mapZoom]);

  const onEachFeature = (_feature: GeoJSONFeature, layer: L.Layer) => {
    // Make polygons very subtle - no hover, no selection, just borders (GeoJSON layers are Path in Leaflet)
    const path = layer as unknown as L.Path;
    if (path.setStyle) {
      path.setStyle({
        fillColor: '#e5e7eb',
        fillOpacity: 0.05,
        color: '#d1d5db',
        weight: 0.5,
        opacity: 0.3,
      });
    }
    const layerOpts = layer as unknown as { options?: Record<string, unknown> };
    if (layerOpts.options) {
      layerOpts.options.interactive = false;
    }
    layer.off();
    const layerWithTooltip = layer as unknown as { unbindTooltip?: () => void };
    if (layerWithTooltip.unbindTooltip) {
      layerWithTooltip.unbindTooltip();
    }
  };

  if (!geoJsonData) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <div className="text-gray-500">Chargement de la carte...</div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <MapContainer
        center={[20, 0]}
        zoom={2}
        minZoom={2}
        maxZoom={10}
        className="w-full h-full z-0"
        zoomControl={true}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution={mapStyles[mapStyle].attribution}
          url={mapStyles[mapStyle].url}
          key={mapStyle} // Force re-render when style changes
        />
        <GeoJSON
          ref={geoJsonRef}
          data={geoJsonData}
          onEachFeature={(f, layer) => onEachFeature(f as GeoJSONFeature, layer)}
        />
        <MapController selectedCountry={selectedCountry} />
        
        {/* Country pin markers */}
        {countryMarkers.map((marker) => {
          const isSelected = selectedCountry?.code === marker.code;
          return (
            <Marker
              key={`country-${marker.code}`}
              position={marker.position}
              icon={createCountryPinIcon(isSelected, marker.code)}
              eventHandlers={{
                click: () => {
                  onCountryClick(marker.feature);
                },
              }}
              zIndexOffset={isSelected ? 1000 : 500}
              interactive={true}
              keyboard={true}
            />
          );
        })}
        
        {/* City markers - only show when zoomed in */}
        {cities.map((city) => (
          <Marker
            key={city.id}
            position={[city.lat, city.lng]}
            icon={createCityIcon('#10b981')}
            eventHandlers={{
              click: () => {
                setSelectedCity(city);
                // Ensure panel is open when city is selected
                useAppStore.getState().setPanelOpen(true);
              },
            }}
            zIndexOffset={100}
          />
        ))}
      </MapContainer>
    </div>
  );
}
