export type SpeedUnit = 'km/h' | 'mph' | 'm/s' | 'knots';

const unitFactors: Record<SpeedUnit, number> = {
  'km/h': 3.6,
  'mph': 2.23694,
  'm/s': 1,
  'knots': 1.94384,
};

export function convertFromMs(speedMs: number, unit: SpeedUnit): number {
  return speedMs * unitFactors[unit];
}

export function convertToMs(speed: number, unit: SpeedUnit): number {
  return speed / unitFactors[unit];
}

export function convertSpeed(value: number, from: SpeedUnit, to: SpeedUnit): number {
  const ms = convertToMs(value, from);
  return convertFromMs(ms, to);
}

export function formatSpeed(speed: number, unit: SpeedUnit): string {
  const converted = convertFromMs(speed, unit);
  if (converted < 10) return converted.toFixed(1);
  return Math.round(converted).toString();
}

export function formatDistance(meters: number, unit: SpeedUnit): string {
  if (unit === 'mph' || unit === 'knots') {
    const miles = meters / 1609.344;
    if (miles < 0.1) return `${(miles * 5280).toFixed(0)} ft`;
    if (miles < 100) return `${miles.toFixed(2)} mi`;
    return `${miles.toFixed(1)} mi`;
  }
  if (meters < 1000) return `${meters.toFixed(0)} m`;
  return `${(meters / 1000).toFixed(2)} km`;
}

export function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function haversineDistance(
  lat1: number, lon1: number,
  lat2: number, lon2: number
): number {
  const R = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export const unitLabels: Record<SpeedUnit, string> = {
  'km/h': 'km/h',
  'mph': 'mph',
  'm/s': 'm/s',
  'knots': 'knots',
};

export type ConverterUnit = SpeedUnit | 'km/min';

const converterFactorsToMs: Record<ConverterUnit, number> = {
  'km/h': 1 / 3.6,
  'mph': 0.44704,
  'm/s': 1,
  'knots': 0.514444,
  'km/min': 16.6667,
};

export function convertBetween(value: number, from: ConverterUnit, to: ConverterUnit): number {
  const ms = value * converterFactorsToMs[from];
  return ms / converterFactorsToMs[to];
}
