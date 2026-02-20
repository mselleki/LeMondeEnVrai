import type { GeoJSONFeature } from '../types';
import L from 'leaflet';

/**
 * Calculate bounding box for a GeoJSON feature
 */
export function getCountryBounds(feature: GeoJSONFeature): L.LatLngBounds | null {
  if (!feature.geometry || feature.geometry.type !== 'Polygon' && feature.geometry.type !== 'MultiPolygon') {
    return null;
  }

  const coordinates = feature.geometry.coordinates;
  let minLat = Infinity;
  let maxLat = -Infinity;
  let minLng = Infinity;
  let maxLng = -Infinity;

  const processCoordinate = (coord: number[]) => {
    const [lng, lat] = coord;
    minLat = Math.min(minLat, lat);
    maxLat = Math.max(maxLat, lat);
    minLng = Math.min(minLng, lng);
    maxLng = Math.max(maxLng, lng);
  };

  if (feature.geometry.type === 'Polygon') {
    coordinates.forEach((ring: number[][]) => {
      ring.forEach(processCoordinate);
    });
  } else if (feature.geometry.type === 'MultiPolygon') {
    coordinates.forEach((polygon: number[][][]) => {
      polygon.forEach((ring: number[][]) => {
        ring.forEach(processCoordinate);
      });
    });
  }

  if (minLat === Infinity) {
    return null;
  }

  return L.latLngBounds([minLat, minLng], [maxLat, maxLng]);
}

/**
 * Calculate centroid (center point) for a GeoJSON feature using polygon centroid formula
 * This gives the true geometric center, not just the average of vertices
 */
export function getCountryCentroid(feature: GeoJSONFeature): [number, number] | null {
  if (!feature.geometry || (feature.geometry.type !== 'Polygon' && feature.geometry.type !== 'MultiPolygon')) {
    return null;
  }

  const coordinates = feature.geometry.coordinates;
  let totalArea = 0;
  let weightedLat = 0;
  let weightedLng = 0;

  const calculatePolygonCentroid = (ring: number[][]): { area: number; lat: number; lng: number } => {
    if (ring.length < 3) return { area: 0, lat: 0, lng: 0 };

    let area = 0;
    let latSum = 0;
    let lngSum = 0;

    // Calculate signed area and weighted centroid
    for (let i = 0; i < ring.length - 1; i++) {
      const [lng1, lat1] = ring[i];
      const [lng2, lat2] = ring[i + 1];
      
      const cross = lng1 * lat2 - lng2 * lat1;
      area += cross;
      latSum += (lat1 + lat2) * cross;
      lngSum += (lng1 + lng2) * cross;
    }

    area = area / 2;
    
    if (Math.abs(area) < 0.0001) {
      // Fallback to simple average if area is too small
      let latAvg = 0;
      let lngAvg = 0;
      for (let i = 0; i < ring.length - 1; i++) {
        latAvg += ring[i][1];
        lngAvg += ring[i][0];
      }
      return {
        area: Math.abs(area),
        lat: latAvg / (ring.length - 1),
        lng: lngAvg / (ring.length - 1),
      };
    }

    return {
      area: Math.abs(area),
      lat: latSum / (6 * area),
      lng: lngSum / (6 * area),
    };
  };

  if (feature.geometry.type === 'Polygon') {
    // Use only the outer ring (first array)
    const result = calculatePolygonCentroid(coordinates[0]);
    if (result.area > 0) {
      return [result.lat, result.lng];
    }
  } else if (feature.geometry.type === 'MultiPolygon') {
    // Calculate centroid for each polygon and weight by area
    coordinates.forEach((polygon: number[][][]) => {
      const result = calculatePolygonCentroid(polygon[0]);
      if (result.area > 0) {
        totalArea += result.area;
        weightedLat += result.lat * result.area;
        weightedLng += result.lng * result.area;
      }
    });

    if (totalArea > 0) {
      return [weightedLat / totalArea, weightedLng / totalArea];
    }
  }

  return null;
}

/**
 * Fuzzy search countries by name
 */
export function fuzzySearchCountries(
  query: string,
  countries: Array<{ name: string; nameFr?: string; code: string }>
): Array<{ name: string; nameFr?: string; code: string }> {
  if (!query.trim()) {
    return [];
  }

  const lowerQuery = query.toLowerCase().trim();
  
  return countries.filter((country) => {
    const nameMatch = country.name.toLowerCase().includes(lowerQuery);
    const nameFrMatch = country.nameFr?.toLowerCase().includes(lowerQuery);
    const codeMatch = country.code.toLowerCase() === lowerQuery;
    
    return nameMatch || nameFrMatch || codeMatch;
  });
}

/**
 * Compute curiosity score based on interactions
 * This is a simplified version - in a real app, you'd track more interaction types
 */
export function computeCuriosityScore(
  baseScore: number,
  interactions: {
    views?: number;
    citiesVisited?: number;
    discoveriesSaved?: number;
  }
): number {
  let score = baseScore;
  
  if (interactions.views) {
    score += Math.min(20, interactions.views * 2);
  }
  
  if (interactions.citiesVisited) {
    score += Math.min(30, interactions.citiesVisited * 5);
  }
  
  if (interactions.discoveriesSaved) {
    score += Math.min(50, interactions.discoveriesSaved * 10);
  }
  
  return Math.min(100, Math.max(0, score));
}
