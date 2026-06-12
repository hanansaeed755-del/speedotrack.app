import { SpeedUnit, convertFromMs, formatDistance, formatDuration } from '../utils/speedUtils';
import { TrendingUp, BarChart3, MapPin, Clock, Crosshair } from 'lucide-react';

interface StatsBarProps {
  maxSpeed: number;
  avgSpeed: number;
  distance: number;
  duration: number;
  accuracy: number;
  unit: SpeedUnit;
}

export default function StatsBar({ maxSpeed, avgSpeed, distance, duration, accuracy, unit }: StatsBarProps) {
  const stats = [
    {
      icon: <TrendingUp size={16} />,
      label: 'Max',
      value: formatStat(maxSpeed),
      color: '#FF6B00',
    },
    {
      icon: <BarChart3 size={16} />,
      label: 'Avg',
      value: formatStat(avgSpeed),
      color: '#00FF88',
    },
    {
      icon: <MapPin size={16} />,
      label: 'Distance',
      value: formatDistance(distance, unit),
      color: '#3B82F6',
    },
    {
      icon: <Clock size={16} />,
      label: 'Duration',
      value: formatDuration(duration),
      color: '#A855F7',
    },
    {
      icon: <Crosshair size={16} />,
      label: 'GPS',
      value: accuracy > 0 ? `${accuracy.toFixed(0)}m` : '--',
      color: accuracy > 0 && accuracy < 20 ? '#00FF88' : accuracy < 50 ? '#FF6B00' : '#FF0000',
    },
  ];

  function formatStat(ms: number): string {
    const v = convertFromMs(ms, unit);
    if (v < 10) return v.toFixed(1);
    return Math.round(v).toString();
  }

  return (
    <div className="grid grid-cols-5 gap-2 sm:gap-3 px-2">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-[#111111] rounded-xl p-3 text-center border border-[#1a1a1a]"
        >
          <div className="flex items-center justify-center gap-1 mb-1">
            <span style={{ color: stat.color }}>{stat.icon}</span>
            <span className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-wider font-semibold">
              {stat.label}
            </span>
          </div>
          <div
            className="text-sm sm:text-lg font-bold tabular-nums"
            style={{ color: stat.color }}
          >
            {stat.value}
          </div>
        </div>
      ))}
    </div>
  );
}
