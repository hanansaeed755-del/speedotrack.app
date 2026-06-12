import { useState } from 'react';
import { SpeedUnit } from '../utils/speedUtils';
import { useGPS } from '../hooks/useGPS';
import TripHistory from '../components/TripHistory';

interface HistoryProps {
  gps: ReturnType<typeof useGPS>;
}

export default function History({ gps }: HistoryProps) {
  const [unit] = useState<SpeedUnit>('km/h');

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <h1 className="text-white text-2xl font-bold mb-6">Trip History</h1>
      <TripHistory
        trips={gps.trips}
        unit={unit}
        onDelete={gps.deleteTrip}
        onClearAll={gps.clearAllTrips}
      />
    </div>
  );
}
