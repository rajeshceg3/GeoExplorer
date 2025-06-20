// Earth's radius in kilometers
const R = 6371;

/**
 * Calculates the distance between two points on Earth using the Haversine formula.
 * @param {number} lat1 Latitude of the first point in degrees.
 * @param {number} lon1 Longitude of the first point in degrees.
 * @param {number} lat2 Latitude of the second point in degrees.
 * @param {number} lon2 Longitude of the second point in degrees.
 * @returns {number} The distance between the two points in kilometers.
 */
export function calculateDistance(lat1, lon1, lat2, lon2) {
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) *
      Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance;
}

/**
 * Calculates the score based on the distance from the target.
 * @param {number} distanceKm The distance from the target in kilometers.
 * @returns {number} The score, from 0 to 5000.
 */
export function calculateScore(distanceKm) {
  const MAX_DISTANCE_FOR_SCORE = 2000; // km
  const MAX_SCORE = 5000;

  if (distanceKm < 0.25) return MAX_SCORE; // Perfect guess bonus or close enough
  if (distanceKm > MAX_DISTANCE_FOR_SCORE) return 0;

  // Score decreases linearly from MAX_SCORE to 0 as distance increases
  let score = MAX_SCORE * (1 - distanceKm / MAX_DISTANCE_FOR_SCORE);

  return Math.round(Math.max(0, score));
}
