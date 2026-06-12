import { TripData } from '../hooks/useGPS';
import { SpeedUnit, convertFromMs, formatDistance, formatDuration } from '../utils/speedUtils';
import { Trash2, Clock, MapPin, TrendingUp, BarChart3 } from 'lucide-react';

interface TripHistoryProps {
  trips: TripData[];
  unit: SpeedUnit;
  onDelete: (id: string) => void;
  onClearAll: () => void;
}

export default function TripHistory({ trips, unit, onDelete, onClearAll }: TripHistoryProps) {
  if (trips.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-20 h-20 bg-[#111111] rounded-full flex items-center justify-center mx-auto mb-4">
          <Clock size={36} className="text-gray-600" />
        </div>
        <h3 className="text-white text-lg font-bold mb-2">No Trips Yet</h3>
        <p className="text-gray-500 text-sm">Start tracking to record your first trip.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-white font-bold text-lg">{trips.length} Trip{trips.length !== 1 ? 's' : ''}</h2>
        <button
          onClick={onClearAll}
          className="text-xs text-red-500 hover:text-red-400 font-semibold px-3 py-1.5 rounded-lg hover:bg-red-900/20 transition-colors"
        >
          Clear All
        </button>
      </div>
      <div className="space-y-3">
        {trips.map((trip) => (
          <TripCard key={trip.id} trip={trip} unit={unit} onDelete={onDelete} />
        ))}
      </div>
    </div>
  );
}

function TripCard({ trip, unit, onDelete }: { trip: TripData; unit: SpeedUnit; onDelete: (id: string) => void }) {
  const startDate = new Date(trip.startTime);
  const maxSpeed = convertFromMs(trip.maxSpeed, unit);
  const avgSpeed = convertFromMs(trip.avgSpeed, unit);

  return (
    <div className="bg-[#111111] rounded-xl p-4 border border-[#1a1a1a] group">
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-white font-semibold text-sm">
            {startDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
          </p>
          <p className="text-gray-500 text-xs">
            {startDate.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
        <button
          onClick={() => onDelete(trip.id)}
          className="text-gray-600 hover:text-red-500 transition-colors p-1"
        >
          <Trash2 size={16} />
        </button>
      </div>
      <div className="grid grid-cols-4 gap-2">
        <div className="text-center">
          <Clock size={14} className="text-gray-500 mx-auto mb-1" />
          <p className="text-white text-sm font-bold">{formatDuration(trip.duration)}</p>
          <p className="text-gray-600 text-[10px] uppercase tracking-wider">Time</p>
        </div>
        <div className="text-center">
          <MapPin size={14} className="text-blue-400 mx-auto mb-1" />
          <p className="text-white text-sm font-bold">{formatDistance(trip.distance, unit)}</p>
          <p className="text-gray-600 text-[10px] uppercase tracking-wider">Dist</p>
        </div>
        <div className="text-center">
          <TrendingUp size={14} className="text-orange-400 mx-auto mb-1" />
          <p className="text-white text-sm font-bold">
            {maxSpeed < 10 ? maxSpeed.toFixed(1) : Math.round(maxSpeed)}
          </p>
          <p className="text-gray-600 text-[10px] uppercase tracking-wider">Max</p>
        </div>
        <div className="text-center">
          <BarChart3 size={14} className="text-[#00FF88] mx-auto mb-1" />
          <p className="text-white text-sm font-bold">
            {avgSpeed < 10 ? avgSpeed.toFixed(1) : Math.round(avgSpeed)}
          </p>
          <p className="text-gray-600 text-[10px] uppercase tracking-wider">Avg</p>
        </div>
      </div>
    </div>
  );
}
