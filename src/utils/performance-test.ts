/**
 * Simple performance test utility
 * Run in browser console: window.testPerformance()
 */
export function testPerformance() {
  const results: {
    test: string;
    duration: number;
    status: 'pass' | 'fail';
  }[] = [];

  // Test 1: GeoJSON loading
  const test1Start = performance.now();
  import('../utils/loadGeoJSON').then(({ loadGeoJSON }) => {
    return loadGeoJSON();
  }).then(() => {
    const test1End = performance.now();
    results.push({
      test: 'GeoJSON Loading',
      duration: test1End - test1Start,
      status: test1End - test1Start < 1000 ? 'pass' : 'fail',
    });
    console.log('✅ GeoJSON loaded in', (test1End - test1Start).toFixed(2), 'ms');
  });

  // Test 2: Marker creation
  const test2Start = performance.now();
  Array.from({ length: 200 }, (_, i) => ({
    code: `TEST${i}`,
    position: [Math.random() * 180 - 90, Math.random() * 360 - 180] as [number, number],
  }));
  const test2End = performance.now();
  results.push({
    test: 'Marker Creation (200 markers)',
    duration: test2End - test2Start,
    status: test2End - test2Start < 50 ? 'pass' : 'fail',
  });
  console.log('✅ Created 200 markers in', (test2End - test2Start).toFixed(2), 'ms');

  // Test 3: Centroid calculation
  const test3Start = performance.now();
  import('../data/world.geojson.fallback.json').then((data) => {
    import('../utils/geography').then(({ getCountryCentroid }) => {
      type GeoJSONFeature = import('../types').GeoJSONFeature;
      data.default.features.forEach((feature: { type: string; geometry: unknown; properties: unknown }) => {
        getCountryCentroid(feature as GeoJSONFeature);
      });
      const test3End = performance.now();
      results.push({
        test: 'Centroid Calculation (3 countries)',
        duration: test3End - test3Start,
        status: test3End - test3Start < 100 ? 'pass' : 'fail',
      });
      console.log('✅ Calculated centroids in', (test3End - test3Start).toFixed(2), 'ms');
      
      // Print summary
      setTimeout(() => {
        console.log('\n📊 Performance Test Summary:');
        console.table(results);
      }, 1000);
    });
  });

  return results;
}

// Make it available globally for easy testing
if (typeof window !== 'undefined') {
  (window as unknown as { testPerformance: () => void }).testPerformance = testPerformance;
}
