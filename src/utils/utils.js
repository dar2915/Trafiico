// utils.js

export function formatDistance(distance) {
  if (distance === null) return "0m";
  if (distance < 1000) return `${Math.round(distance)}m`;
  return `${(distance / 1000).toFixed(1)}km`;
}

export function calculateFare(distance) {
  if (distance === null) return "P0.00";
  const baseFare = 12.0;
  const additionalFarePerKm = 2.0;
  if (distance <= 1000) return `P${baseFare.toFixed(2)}`;
  const additionalKm = Math.floor(distance / 1000) - 1;
  const totalFare = baseFare + additionalKm * additionalFarePerKm;
  return `P${totalFare.toFixed(2)}`;
}
