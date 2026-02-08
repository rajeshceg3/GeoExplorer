// Constants
const R = 6371; // Earth's radius in kilometers
const MAX_DISTANCE_FOR_SCORE = 2000; // km, distance beyond which score is 0
const MAX_SCORE = 5000; // Maximum possible score for a perfect guess

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
  if (distanceKm < 0.25) return MAX_SCORE; // Perfect guess bonus or close enough
  if (distanceKm > MAX_DISTANCE_FOR_SCORE) return 0;

  // Score decreases linearly from MAX_SCORE to 0 as distance increases
  // Ensure score does not go below 0, though the condition above should prevent it.
  let score = MAX_SCORE * (1 - distanceKm / MAX_DISTANCE_FOR_SCORE);

  return Math.round(Math.max(0, score)); // Ensure score is not negative and is rounded
}

/**
 * Converts degrees to radians.
 * @param {number} deg Angle in degrees.
 * @returns {number} Angle in radians.
 */
function toRad(deg) {
  return deg * Math.PI / 180;
}

/**
 * Converts radians to degrees.
 * @param {number} rad Angle in radians.
 * @returns {number} Angle in degrees.
 */
function toDeg(rad) {
  return rad * 180 / Math.PI;
}

/**
 * Calculates a new coordinate given a starting point, bearing, and distance.
 * @param {number} lat Latitude of starting point in degrees.
 * @param {number} lng Longitude of starting point in degrees.
 * @param {number} bearing Bearing in degrees (0-360, 0 is North).
 * @param {number} distanceKm Distance to travel in kilometers.
 * @returns {object} Object containing new lat and lng.
 */
export function getDestinationPoint(lat, lng, bearing, distanceKm) {
  const R = 6371; // Earth's radius in km
  const lat1 = toRad(lat);
  const lon1 = toRad(lng);
  const brng = toRad(bearing);

  let lat2 = Math.asin(Math.sin(lat1) * Math.cos(distanceKm / R) +
                       Math.cos(lat1) * Math.sin(distanceKm / R) * Math.cos(brng));
  let lon2 = lon1 + Math.atan2(Math.sin(brng) * Math.sin(distanceKm / R) * Math.cos(lat1),
                               Math.cos(distanceKm / R) - Math.sin(lat1) * Math.sin(lat2));

  return {
    lat: toDeg(lat2),
    lng: toDeg(lon2)
  };
}

/**
 * Generates a random point within a specified radius of a center point.
 * @param {number} lat Latitude of center point.
 * @param {number} lng Longitude of center point.
 * @param {number} radiusKm Maximum radius in kilometers.
 * @returns {object} Object containing lat and lng of the random point.
 */
export function getRandomPointInRadius(lat, lng, radiusKm) {
  // Random distance within radius (uniform distribution in area)
  const r = radiusKm * Math.sqrt(Math.random());
  const theta = Math.random() * 360;

  return getDestinationPoint(lat, lng, theta, r);
}
