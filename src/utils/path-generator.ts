import { Coordinates } from "../types/coordinates";

function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

function calculateDistance(coord1: Coordinates, coord2: Coordinates): number {
  const R = 6371.0; // Radius of the Earth in kilometers

  const lat1Rad = toRadians(coord1.lat);
  const lon1Rad = toRadians(coord1.lng);
  const lat2Rad = toRadians(coord2.lat);
  const lon2Rad = toRadians(coord2.lng);

  const dLon = lon2Rad - lon1Rad;
  const dLat = lat2Rad - lat1Rad;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = R * c; // Distance in kilometers
  return distance;
}

export function generateRandomizedPath(
  start: Coordinates,
  distance: number,
  speed: number
): Coordinates[] {
  const path: Coordinates[] = [];
  let currentDistance = 0;
  let currentCoord = start;
  path.push({
    lat: start.lat,
    lng: start.lng,
  });

  while (currentDistance < distance) {
    const latOffset = Math.random() * 1 - 0.5; // Adjust the latitude range for randomness
    const lonOffset = Math.random() * 1 - 0.5; // Adjust the longitude range for randomness

    const nextLat = currentCoord.lat + (speed / 111) * latOffset; // Assuming 1 degree of latitude is approximately 111 km
    const nextLon = currentCoord.lng + (speed / 111) * lonOffset; // Assuming 1 degree of longitude is approximately 111 km

    const distToNext = calculateDistance(currentCoord, {
      lat: nextLat,
      lng: nextLon,
    });

    if (currentDistance + distToNext > distance) {
      const remainingDistance = distance - currentDistance;
      const ratio = remainingDistance / distToNext;
      const finalLat = currentCoord.lat + ratio * (nextLat - currentCoord.lat);
      const finalLon = currentCoord.lng + ratio * (nextLon - currentCoord.lng);
      path.push({
        lat: finalLat,
        lng: finalLon,
      });
      break;
    }

    path.push({
      lat: nextLat,
      lng: nextLon,
    });
    currentDistance += distToNext;
    currentCoord = {
      lat: nextLat,
      lng: nextLon,
    };
  }

  return path;
}
