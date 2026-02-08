// lib/utils/geoUtils.ts

/**
 * Calculate distance between two coordinates in meters using Haversine formula
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
}

/**
 * Check if a point is within radius of another point
 */
export function isWithinRadius(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
  radiusMeters: number
): boolean {
  return calculateDistance(lat1, lon1, lat2, lon2) <= radiusMeters;
}

/**
 * Find nearby incidents within a given radius
 */
export function findNearbyIncidents(
  incidents: Array<{latitude: number; longitude: number}>,
  centerLat: number,
  centerLng: number,
  radiusMeters: number
): Array<{incident: any; distance: number}> {
  return incidents
    .filter(incident => incident.latitude && incident.longitude)
    .map(incident => ({
      incident,
      distance: calculateDistance(
        centerLat,
        centerLng,
        incident.latitude,
        incident.longitude
      )
    }))
    .filter(({ distance }) => distance <= radiusMeters)
    .sort((a, b) => a.distance - b.distance);
}