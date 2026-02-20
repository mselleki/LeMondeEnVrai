import type { GeoJSONData } from '../types';
import fallbackGeoJSON from '../data/world.geojson.fallback.json';

/**
 * Load GeoJSON data from a file or use fallback
 * 
 * To use a full world map:
 * 1. Add world.geojson to /public/data/world.geojson, OR
 * 2. Import it directly: import worldGeoJSON from './data/world.geojson'
 */
export async function loadGeoJSON(): Promise<GeoJSONData> {
  try {
    // Try to load from public folder first (for production)
    const publicResponse = await fetch('/data/world.geojson');
    if (publicResponse.ok && publicResponse.headers.get('content-type')?.includes('json')) {
      const data = await publicResponse.json();
      if (data.type === 'FeatureCollection' && Array.isArray(data.features)) {
        return data as GeoJSONData;
      }
    }
  } catch (error) {
    // Ignore public folder fetch errors
  }

  try {
    // Try to load from src/data (for development with import)
    // This will only work if the file is imported directly
    const srcResponse = await fetch('/src/data/world.geojson');
    if (srcResponse.ok) {
      const contentType = srcResponse.headers.get('content-type');
      // Check if response is actually JSON (not HTML error page)
      if (contentType && contentType.includes('json')) {
        const data = await srcResponse.json();
        if (data.type === 'FeatureCollection' && Array.isArray(data.features)) {
          return data as GeoJSONData;
        }
      }
    }
  } catch (error) {
    // Ignore src folder fetch errors - fallback will be used
  }

  // Use fallback if main file is not available
  // Uncomment the line below if you want to see this message:
  // console.info('Using fallback GeoJSON data (3 countries). Add world.geojson to /public/data/ for full map.');
  return fallbackGeoJSON as GeoJSONData;
}
